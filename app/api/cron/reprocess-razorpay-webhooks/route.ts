import pool from "@/lib/db";
import {
  triggerOrderConfirmationEmailAsync,
  processRetryNotifications,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max for cron

type PaymentEntity = {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  method?: string;
  status?: string;
};

type WebhookPayload = {
  payload?: {
    payment?: {
      entity?: PaymentEntity;
    };
  };
};

export async function GET(req: Request) {
  console.info("[REPROCESS_RAZORPAY_WEBHOOK] Cron job started");

  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.error("[REPROCESS_RAZORPAY_WEBHOOK] Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  // Get candidate events WITHOUT lock (just to know what to process)
  const candidates = await pool.query<{
    id: number;
    event_id: string;
    event_type: string;
  }>(
    `
    SELECT id, event_id, event_type
    FROM payment_webhook_events
    WHERE processed = false
      AND event_type IN ('payment.captured', 'payment.failed')
    ORDER BY received_at
    LIMIT 10
    `,
  );

  console.info(
    `[REPROCESS_RAZORPAY_WEBHOOK] Found ${candidates.rowCount} candidate events`,
  );

  let processedCount = 0;

  // Process each event individually with proper locking
  for (const candidate of candidates.rows) {
    const { id: webhookEventId, event_id, event_type } = candidate;

    console.info(
      `[REPROCESS_RAZORPAY_WEBHOOK] Attempting to process event '${event_id}'`,
    );

    // Track details for post-commit notification
    let completedOrderId: number | null = null;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Try to lock this specific event (skip if already locked or processed)
      const lockResult = await client.query<{
        id: number;
        payload: WebhookPayload;
      }>(
        `
        SELECT id, payload
        FROM payment_webhook_events
        WHERE id = $1
          AND processed = false
        FOR UPDATE SKIP LOCKED
        `,
        [webhookEventId],
      );

      if (!lockResult.rows[0]) {
        await client.query("ROLLBACK");
        client.release();
        console.info(
          `[REPROCESS_RAZORPAY_WEBHOOK] Event '${event_id}' already locked or processed, skipping`,
        );
        continue;
      }

      const { payload } = lockResult.rows[0];
      const payment = payload?.payload?.payment?.entity;

      if (!payment) {
        // Mark as processed since it's invalid
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [webhookEventId],
        );
        await client.query("COMMIT");
        client.release();
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] No payment entity found in payload",
          { event_id },
        );
        continue;
      }

      const gatewayOrderId = payment.order_id;
      const gatewayPaymentId = payment.id;

      if (!gatewayOrderId || !gatewayPaymentId) {
        // Mark as processed since it's invalid
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [webhookEventId],
        );
        await client.query("COMMIT");
        client.release();
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] Missing gatewayOrderId or gatewayPaymentId",
          { event_id, gatewayOrderId, gatewayPaymentId },
        );
        continue;
      }

      // Skip payment.failed events - just mark as processed
      if (event_type === "payment.failed") {
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [webhookEventId],
        );
        await client.query("COMMIT");
        client.release();
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Marked payment.failed event as processed",
          { event_id },
        );
        processedCount++;
        continue;
      }

      // Process payment.captured
      const poRes = await client.query<{
        id: number;
        order_id: number;
        user_id: number;
      }>(
        `
        SELECT id, order_id, user_id
        FROM payment_orders
        WHERE gateway = 'RAZORPAY'
          AND gateway_order_id = $1
        LIMIT 1
        `,
        [gatewayOrderId],
      );

      if (!poRes.rows[0]) {
        await client.query("ROLLBACK");
        client.release();
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] No payment order found for gatewayOrderId",
          { event_id, gatewayOrderId },
        );
        continue;
      }

      const paymentOrder = poRes.rows[0];

      // Check if order is already PAID (idempotency)
      const orderStatus = await client.query<{ status: string }>(
        `SELECT status FROM orders WHERE id = $1`,
        [paymentOrder.order_id],
      );

      if (orderStatus.rows[0]?.status === "PAID") {
        // Already paid - just mark webhook as processed
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [webhookEventId],
        );
        await client.query("COMMIT");
        client.release();
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Order already PAID, marking event as processed",
          { event_id, orderId: paymentOrder.order_id },
        );

        // Still trigger email in case it wasn't sent
        completedOrderId = paymentOrder.order_id;
        processedCount++;

        // Trigger email after commit (outside transaction)
        if (completedOrderId) {
          triggerOrderConfirmationEmailAsync(completedOrderId);
        }
        continue;
      }

      console.info("[REPROCESS_RAZORPAY_WEBHOOK] Inserting payment record", {
        event_id,
        gatewayPaymentId,
      });

      await client.query(
        `
        INSERT INTO payments (
          order_id,
          payment_order_id,
          gateway,
          gateway_payment_id,
          amount,
          currency,
          method,
          status,
          captured
        )
        VALUES ($1, $2, 'RAZORPAY', $3, $4, $5, $6, $7, true)
        ON CONFLICT (gateway, gateway_payment_id) DO NOTHING
        `,
        [
          paymentOrder.order_id,
          paymentOrder.id,
          gatewayPaymentId,
          payment.amount,
          payment.currency,
          payment.method,
          payment.status,
        ],
      );

      console.info(
        "[REPROCESS_RAZORPAY_WEBHOOK] Updating payment_orders status to PAID",
        { event_id, gatewayOrderId },
      );

      await client.query(
        `UPDATE payment_orders SET status = 'PAID', updated_at = NOW() WHERE id = $1`,
        [paymentOrder.id],
      );

      console.info(
        "[REPROCESS_RAZORPAY_WEBHOOK] Updating orders status to PAID",
        { event_id, orderId: paymentOrder.order_id },
      );

      await client.query(
        `UPDATE orders SET status = 'PAID', updated_at = NOW() WHERE id = $1`,
        [paymentOrder.order_id],
      );

      // Mark webhook event as processed
      await client.query(
        `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
        [webhookEventId],
      );

      // Store order ID for post-commit notification
      completedOrderId = paymentOrder.order_id;

      await client.query("COMMIT");
      console.info(
        "[REPROCESS_RAZORPAY_WEBHOOK] Transaction committed successfully",
        { event_id, orderId: completedOrderId },
      );

      processedCount++;
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch {
        console.error(
          "[REPROCESS_RAZORPAY_WEBHOOK] Failed to rollback transaction",
          { event_id, error: err },
        );
        // Ignore rollback error
      }
      console.error(
        "[REPROCESS_RAZORPAY_WEBHOOK] Error processing event, transaction rolled back",
        { event_id, error: err },
      );
    } finally {
      client.release();
    }

    // Post-commit: Trigger async email (sendOrderConfirmationEmail handles idempotency)
    if (completedOrderId) {
      try {
        console.info("[REPROCESS_RAZORPAY_WEBHOOK] Triggering async email", {
          event_id,
          orderId: completedOrderId,
        });
        triggerOrderConfirmationEmailAsync(completedOrderId);
      } catch (notificationError) {
        console.error(
          "[REPROCESS_RAZORPAY_WEBHOOK] Failed to trigger email notification",
          { event_id, orderId: completedOrderId, error: notificationError },
        );
      }
    }
  }

  console.info("[REPROCESS_RAZORPAY_WEBHOOK] Webhook reprocessing completed", {
    processedCount,
  });

  // Also retry any pending/failed email notifications
  console.info("[REPROCESS_RAZORPAY_WEBHOOK] Starting notification retries");
  let notificationResult = { processed: 0, successful: 0, failed: 0 };
  try {
    notificationResult = await processRetryNotifications();
    console.info(
      "[REPROCESS_RAZORPAY_WEBHOOK] Notification retries completed",
      {
        processed: notificationResult.processed,
        successful: notificationResult.successful,
        failed: notificationResult.failed,
      },
    );
  } catch (err) {
    console.error("[REPROCESS_RAZORPAY_WEBHOOK] Notification retries failed", {
      error: err,
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      webhooksProcessed: processedCount,
      notificationsRetried: notificationResult.processed,
      notificationsSuccessful: notificationResult.successful,
      notificationsFailed: notificationResult.failed,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}

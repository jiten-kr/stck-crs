import pool from "@/lib/db";
import {
  triggerOrderConfirmationEmailAsync,
  processRetryNotifications,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max for cron

const MAX_WEBHOOK_PROCESSING_ATTEMPTS = 50;

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
    received_at: Date;
  }>(
    `
    SELECT id, event_id, event_type, received_at
    FROM payment_webhook_events
    WHERE processed = false
      AND gateway = 'RAZORPAY'
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
    const { id: eventRowId, event_id, event_type, received_at } = candidate;
    const eventAgeSeconds = received_at
      ? Math.round((Date.now() - new Date(received_at).getTime()) / 1000)
      : null;

    console.info(
      `[REPROCESS_RAZORPAY_WEBHOOK] Attempting to process event '${event_id}'`,
      { eventRowId, eventAgeSeconds },
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
          AND gateway = 'RAZORPAY'
          AND processed = false
        FOR UPDATE SKIP LOCKED
        `,
        [eventRowId],
      );

      if (!lockResult.rows[0]) {
        await client.query("ROLLBACK");
        console.info(
          `[REPROCESS_RAZORPAY_WEBHOOK] Event '${event_id}' already locked or processed, skipping`,
          { outcome: "skipped_locked_or_processed" },
        );
        continue;
      }

      const { payload } = lockResult.rows[0];
      const payment = payload?.payload?.payment?.entity;

      if (!payment) {
        // Mark as processed since it's invalid
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [eventRowId],
        );
        await client.query("COMMIT");
        processedCount++;
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] No payment entity found in payload",
          { event_id, outcome: "invalid_payload" },
        );
        continue;
      }

      const gatewayOrderId = payment.order_id;
      const gatewayPaymentId = payment.id;

      if (!gatewayOrderId || !gatewayPaymentId) {
        // Mark as processed since it's invalid
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [eventRowId],
        );
        await client.query("COMMIT");
        processedCount++;
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] Missing gatewayOrderId or gatewayPaymentId",
          { event_id, outcome: "invalid_payload" },
        );
        continue;
      }

      // Skip payment.failed events - just mark as processed
      if (event_type === "payment.failed") {
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [eventRowId],
        );
        await client.query("COMMIT");
        processedCount++;
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Marked payment.failed event as processed",
          { event_id, outcome: "payment_failed" },
        );
        continue;
      }

      // Process payment.captured
      const poRes = await client.query<{
        id: number;
        order_id: number;
        user_id: number;
        amount: number;
        currency: string;
      }>(
        `
        SELECT id, order_id, user_id, amount, currency
        FROM payment_orders
        WHERE gateway = 'RAZORPAY'
          AND gateway_order_id = $1
        LIMIT 1
        `,
        [gatewayOrderId],
      );

      if (!poRes.rows[0]) {
        await client.query("ROLLBACK");
        await client.query("BEGIN");
        const attemptResult = await client.query<{ processing_attempts: number }>(
          `UPDATE payment_webhook_events
           SET processing_attempts = COALESCE(processing_attempts, 0) + 1
           WHERE id = $1
           RETURNING processing_attempts`,
          [eventRowId],
        );
        const attempts = attemptResult.rows[0]?.processing_attempts ?? 1;
        if (attempts >= MAX_WEBHOOK_PROCESSING_ATTEMPTS) {
          await client.query(
            `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
            [eventRowId],
          );
          console.warn(
            "[REPROCESS_RAZORPAY_WEBHOOK] No payment order found, max attempts reached - marked as processed (dead letter)",
            { event_id, gatewayOrderId, attempts, outcome: "dead_letter" },
          );
        } else {
          console.warn(
            "[REPROCESS_RAZORPAY_WEBHOOK] No payment order found for gatewayOrderId",
            { event_id, gatewayOrderId, attempts, outcome: "no_payment_order" },
          );
        }
        await client.query("COMMIT");
        continue;
      }

      const paymentOrder = poRes.rows[0];

      // Validate amount and currency match order (full payments only)
      const paymentAmount = payment.amount ?? 0;
      const paymentCurrency = (payment.currency ?? "").toUpperCase();
      const orderCurrency = (paymentOrder.currency ?? "").toUpperCase();
      if (
        paymentAmount !== paymentOrder.amount ||
        paymentCurrency !== orderCurrency
      ) {
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [eventRowId],
        );
        await client.query("COMMIT");
        processedCount++;
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] Amount or currency mismatch, marking event processed",
          {
            event_id,
            orderId: paymentOrder.order_id,
            paymentAmount,
            orderAmount: paymentOrder.amount,
            paymentCurrency,
            orderCurrency,
            outcome: "amount_currency_mismatch",
          },
        );
        continue;
      }

      // Check if order is already PAID (idempotency)
      const orderStatus = await client.query<{ status: string }>(
        `SELECT status FROM orders WHERE id = $1`,
        [paymentOrder.order_id],
      );

      if (orderStatus.rows[0]?.status === "PAID") {
        // Already paid - just mark webhook as processed
        await client.query(
          `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
          [eventRowId],
        );
        await client.query("COMMIT");
        processedCount++;
        completedOrderId = paymentOrder.order_id;
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Order already PAID, marking event as processed",
          { event_id, orderId: paymentOrder.order_id, outcome: "idempotent_skip" },
        );
        // Trigger email so notification is created/sent if missing; no-op if already SENT
      } else {
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
          [eventRowId],
        );

        // Store order ID for post-commit notification
        completedOrderId = paymentOrder.order_id;

        await client.query("COMMIT");
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Transaction committed successfully",
          { event_id, orderId: completedOrderId, outcome: "success" },
        );

        processedCount++;
      }
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
      // Increment processing attempts; dead-letter after max to avoid infinite retries (explicit BEGIN/COMMIT)
      try {
        await client.query("BEGIN");
        const attemptResult = await client.query<{
          processing_attempts: number;
        }>(
          `UPDATE payment_webhook_events
           SET processing_attempts = COALESCE(processing_attempts, 0) + 1
           WHERE id = $1
           RETURNING processing_attempts`,
          [eventRowId],
        );
        const attempts = attemptResult.rows[0]?.processing_attempts ?? 1;
        if (attempts >= MAX_WEBHOOK_PROCESSING_ATTEMPTS) {
          await client.query(
            `UPDATE payment_webhook_events SET processed = true WHERE id = $1`,
            [eventRowId],
          );
          console.warn(
            "[REPROCESS_RAZORPAY_WEBHOOK] Max processing attempts reached - marked as processed (dead letter)",
            { event_id, attempts, outcome: "dead_letter", error: err },
          );
        } else {
          console.error(
            "[REPROCESS_RAZORPAY_WEBHOOK] Error processing event, transaction rolled back",
            { event_id, attempts, outcome: "error", error: err },
          );
        }
        await client.query("COMMIT");
      } catch (attemptErr) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // ignore
        }
        console.error(
          "[REPROCESS_RAZORPAY_WEBHOOK] Error processing event; failed to increment attempts",
          { event_id, error: err, attemptError: attemptErr },
        );
      }
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

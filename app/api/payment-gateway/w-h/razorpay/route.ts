import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import {
  upsertOrderNotification,
  sendOrderConfirmationEmail,
} from "@/lib/notifications";

type RazorpayWebhookPayload = {
  id?: string;
  event?: string;
  created_at?: number;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        method?: string;
        status?: string;
        error_code?: string | null;
        error_description?: string | null;
        error_source?: string | null;
        error_step?: string | null;
        error_reason?: string | null;
      };
    };
  };
};

function verifySignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(signature, "utf8"),
  );
}

export async function POST(request: NextRequest) {
  let eventId: string | undefined;

  console.log("[RAZORPAY_WEBHOOK] Webhook received");

  const signature =
    request.headers.get("x-razorpay-signature") ||
    request.headers.get("X-Razorpay-Signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[RAZORPAY_WEBHOOK] Missing secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!signature) {
    console.error("[RAZORPAY_WEBHOOK] Missing signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody = "";
  try {
    console.log("[RAZORPAY_WEBHOOK] Reading raw body");
    rawBody = await request.text();
    console.log("[RAZORPAY_WEBHOOK] Raw body read successfully", {
      length: rawBody.length,
    });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Failed to read raw body", {
      error,
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const isValid = verifySignature(rawBody, signature, secret);
  if (!isValid) {
    console.error("[RAZORPAY_WEBHOOK] Signature verification failed");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    console.log(
      "[RAZORPAY_WEBHOOK] Verifying signature successful, parsing payload",
    );
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    console.log("[RAZORPAY_WEBHOOK] Parsed JSON payload", {
      payload,
    });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Invalid JSON payload", {
      error,
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventType = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;
  eventId = payload.id
    ? payload.id
    : eventType?.startsWith("payment.") && paymentEntity?.id
      ? `${eventType}:${paymentEntity.id}`
      : undefined;

  if (!eventId || !eventType) {
    console.error("[RAZORPAY_WEBHOOK] Missing event id or type", {
      eventId,
      eventType,
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  console.log("[RAZORPAY_WEBHOOK] Persisting event", { eventId, eventType });
  try {
    const insertEventResult = await pool.query<{ id: number }>(
      `INSERT INTO payment_webhook_events (
        gateway,
        event_id,
        event_type,
        payload
      )
      VALUES ($1, $2, $3, $4::jsonb)
      ON CONFLICT (gateway, event_id) DO NOTHING
      RETURNING id`,
      ["RAZORPAY", eventId, eventType, rawBody],
    );

    if (insertEventResult.rowCount === 0) {
      console.log("[RAZORPAY_WEBHOOK] Duplicate event", { eventId });
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Failed to store event", {
      eventId,
      error,
    });
    return NextResponse.json(
      { error: "Failed to store event" },
      { status: 500 },
    );
  }

  if (eventType !== "payment.captured" && eventType !== "payment.failed") {
    console.log("[RAZORPAY_WEBHOOK] Ignoring event", { eventId, eventType });
    try {
      console.log("[RAZORPAY_WEBHOOK] Marking event processed", { eventId });
      await pool.query(
        `UPDATE payment_webhook_events
         SET processed = true
         WHERE gateway = $1 AND event_id = $2`,
        ["RAZORPAY", eventId],
      );
      console.log("[RAZORPAY_WEBHOOK] Event marked processed", { eventId });
    } catch (error) {
      console.error("[RAZORPAY_WEBHOOK] Failed to mark event processed", {
        eventId,
        error,
      });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!paymentEntity) {
    console.error("[RAZORPAY_WEBHOOK] Missing payment entity", { eventId });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const gatewayOrderId = paymentEntity.order_id || "";
  const gatewayPaymentId = paymentEntity.id || "";
  const amount = paymentEntity.amount ?? 0;
  const currency = paymentEntity.currency || "";
  const method = paymentEntity.method || null;
  const status = paymentEntity.status || "";
  const errorCode = paymentEntity.error_code || null;
  const errorDescription = paymentEntity.error_description || null;
  const errorSource = paymentEntity.error_source || null;
  const errorStep = paymentEntity.error_step || null;
  const errorReason = paymentEntity.error_reason || null;

  if (!gatewayOrderId || !gatewayPaymentId) {
    console.error("[RAZORPAY_WEBHOOK] Missing gateway ids", {
      eventId,
      gatewayOrderId,
      gatewayPaymentId,
    });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (eventType === "payment.captured" && status !== "captured") {
    console.error("[RAZORPAY_WEBHOOK] Status mismatch", { eventId, status });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (eventType === "payment.failed") {
    console.log("[RAZORPAY_WEBHOOK] Payment failed", {
      eventId,
      gatewayOrderId,
      gatewayPaymentId,
      amount,
      currency,
      method,
      status,
      errorCode,
      errorDescription,
      errorSource,
      errorStep,
      errorReason,
    });
    try {
      console.log("[RAZORPAY_WEBHOOK] Marking event processed", { eventId });
      await pool.query(
        `UPDATE payment_webhook_events
         SET processed = true
         WHERE gateway = $1 AND event_id = $2`,
        ["RAZORPAY", eventId],
      );
    } catch (error) {
      console.error("[RAZORPAY_WEBHOOK] Failed to mark event processed", {
        eventId,
        error,
      });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  console.log("[RAZORPAY_WEBHOOK] Processing captured payment", {
    eventId,
    gatewayOrderId,
    gatewayPaymentId,
  });

  // Track order details for post-commit notification
  let completedOrderId: number | null = null;
  let completedUserId: number | null = null;
  let completedUserEmail: string | null = null;

  const client = await pool.connect();
  try {
    console.log("[RAZORPAY_WEBHOOK] Starting transaction", { eventId });
    await client.query("BEGIN");

    console.log("[RAZORPAY_WEBHOOK] Fetching payment order", { eventId });
    const paymentOrderResult = await client.query<{
      id: number;
      order_id: number;
      user_id: number;
    }>(
      `SELECT po.id, po.order_id, po.user_id
			 FROM payment_orders po
			 WHERE po.gateway = $1 AND po.gateway_order_id = $2
			 LIMIT 1`,
      ["RAZORPAY", gatewayOrderId],
    );

    const paymentOrder = paymentOrderResult.rows[0];
    if (!paymentOrder) {
      console.error("[RAZORPAY_WEBHOOK] Payment order not found", {
        eventId,
        gatewayOrderId,
      });
      await client.query("ROLLBACK");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    console.log("[RAZORPAY_WEBHOOK] Inserting payment record", { eventId });
    await client.query(
      `INSERT INTO payments (
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (gateway, gateway_payment_id) DO NOTHING`,
      [
        paymentOrder.order_id,
        paymentOrder.id,
        "RAZORPAY",
        gatewayPaymentId,
        amount,
        currency,
        method,
        status,
        true,
      ],
    );

    console.log("[RAZORPAY_WEBHOOK] Updating payment_orders status", {
      eventId,
    });
    await client.query(
      `UPDATE payment_orders
			 SET status = $1, updated_at = NOW()
			 WHERE id = $2`,
      ["PAID", paymentOrder.id],
    );

    console.log("[RAZORPAY_WEBHOOK] Updating orders status", { eventId });
    await client.query(
      `UPDATE orders
			 SET status = $1, updated_at = NOW()
			 WHERE id = $2`,
      ["PAID", paymentOrder.order_id],
    );

    console.log("[RAZORPAY_WEBHOOK] Marking event processed", { eventId });
    await client.query(
      `UPDATE payment_webhook_events
       SET processed = true
       WHERE gateway = 'RAZORPAY' AND event_id = $1`,
      [eventId],
    );
    console.log("[RAZORPAY_WEBHOOK] Payment processed successfully", {
      eventId,
    });

    // Fetch user email for notification before commit
    const userResult = await client.query<{ email: string }>(
      `SELECT u.email FROM users u
       JOIN orders o ON o.user_id = u.id
       WHERE o.id = $1`,
      [paymentOrder.order_id],
    );

    await client.query("COMMIT");
    console.log("[RAZORPAY_WEBHOOK] Transaction committed", { eventId });

    // Store order details for post-commit notification
    completedOrderId = paymentOrder.order_id;
    completedUserId = paymentOrder.user_id;
    completedUserEmail = userResult.rows[0]?.email || null;
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK] Transaction failed", { eventId, error });
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }

  // Post-commit: Insert notification and trigger async email
  // This is OUTSIDE the transaction to ensure DB commit happened
  if (completedOrderId && completedUserId && completedUserEmail) {
    try {
      console.log("[RAZORPAY_WEBHOOK] Inserting notification record", {
        eventId,
        orderId: completedOrderId,
      });

      // UPSERT notification record (prevents duplicates)
      await upsertOrderNotification(
        completedOrderId,
        completedUserId,
        completedUserEmail,
      );

      console.log("[RAZORPAY_WEBHOOK] Sending order confirmation email", {
        eventId,
        orderId: completedOrderId,
      });

      // Await email send - required in serverless environment
      // Fire-and-forget doesn't work reliably as Vercel may terminate before completion
      const emailResult = await sendOrderConfirmationEmail(completedOrderId);

      console.log("[RAZORPAY_WEBHOOK] Email send result", {
        eventId,
        orderId: completedOrderId,
        success: emailResult.success,
        error: emailResult.error,
        messageId: emailResult.messageId,
      });
    } catch (notificationError) {
      // Don't fail the webhook response for notification errors
      // Cron will retry failed notifications
      console.error("[RAZORPAY_WEBHOOK] Notification/email failed", {
        eventId,
        orderId: completedOrderId,
        error: notificationError,
      });
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

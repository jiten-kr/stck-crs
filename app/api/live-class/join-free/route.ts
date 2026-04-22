import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { LIVE_TRADING_CLASS_ITEM_ID } from "@/lib/constants";
import { validateRequest } from "@/lib/middleware/verifyJWT";
import type { User } from "@/lib/types";
import type { SendNotificationResult } from "@/lib/notifications";
import {
  upsertOrderNotification,
  sendOrderConfirmationEmail,
  sendOrderConfirmationWhatsAppMessage,
} from "@/lib/notifications";

const FREE_GATEWAY = "FREE";

const NOTIFY_RETRY_MS = 500;

async function sendWithRetry(
  orderId: number,
  label: string,
  send: (id: number) => Promise<SendNotificationResult>,
): Promise<SendNotificationResult> {
  let result = await send(orderId);
  if (!result.success) {
    console.warn("[JOIN_FREE_LIVE_CLASS] Notification retry", {
      orderId,
      label,
      error: result.error,
    });
    await new Promise((r) => setTimeout(r, NOTIFY_RETRY_MS));
    result = await send(orderId);
  }
  return result;
}

/**
 * Free enrollment for the live trading class: each call inserts a new PAID order
 * (₹0), payment_order, and payment row, then sends email + WhatsApp like paid flow.
 */
export async function POST(request: NextRequest) {
  let body: { itemId?: number } = {};
  try {
    body = (await request.json()) as { itemId?: number };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const itemId =
    typeof body.itemId === "number" && Number.isFinite(body.itemId)
      ? body.itemId
      : LIVE_TRADING_CLASS_ITEM_ID;

  if (itemId !== LIVE_TRADING_CLASS_ITEM_ID) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const { decoded: tokenUser, status, send401 } = validateRequest<User>(request);
  if (!status || !tokenUser?.id) {
    return send401!();
  }

  const userId = tokenUser.id;

  const client = await pool.connect();
  let orderId: number;
  let gatewayOrderId: string;
  let gatewayPaymentId: string;

  try {
    await client.query("BEGIN");

    const orderInsert = await client.query<{ id: number }>(
      `INSERT INTO orders (
        user_id,
        total_amount,
        discount_amount,
        payable_amount,
        item_id,
        status
      )
      VALUES ($1, 0, 0, 0, $2, 'PAID')
      RETURNING id`,
      [userId, itemId],
    );
    orderId = orderInsert.rows[0]?.id;
    if (!orderId) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Failed to create enrollment" },
        { status: 500 },
      );
    }

    gatewayOrderId = `free-ord-${randomUUID().replace(/-/g, "").slice(0, 24)}`;
    gatewayPaymentId = `free-pay-${randomUUID().replace(/-/g, "").slice(0, 24)}`;

    const poInsert = await client.query<{ id: number }>(
      `INSERT INTO payment_orders (
        order_id,
        user_id,
        gateway,
        gateway_order_id,
        amount,
        currency,
        status
      )
      VALUES ($1, $2, $3, $4, 0, 'INR', 'PAID')
      RETURNING id`,
      [orderId, userId, FREE_GATEWAY, gatewayOrderId],
    );
    const paymentOrderId = poInsert.rows[0]?.id;
    if (!paymentOrderId) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 500 },
      );
    }

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
      VALUES ($1, $2, $3, $4, 0, 'INR', 'free', 'captured', true)`,
      [orderId, paymentOrderId, FREE_GATEWAY, gatewayPaymentId],
    );

    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    console.error("[JOIN_FREE_LIVE_CLASS] Transaction failed", error);
    return NextResponse.json(
      { error: "Failed to complete enrollment" },
      { status: 500 },
    );
  } finally {
    client.release();
  }

  const userEmailResult = await pool.query<{ email: string }>(
    `SELECT email FROM users WHERE id = $1`,
    [userId],
  );
  const userEmail = userEmailResult.rows[0]?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Same sequence as Razorpay webhook: email queue row, then send email + WhatsApp in parallel.
  let emailResult: SendNotificationResult = {
    success: false,
    error: "not started",
  };
  let whatsappResult: SendNotificationResult = {
    success: false,
    error: "not started",
  };

  try {
    await upsertOrderNotification(orderId, userId, userEmail);
  } catch (upsertErr) {
    console.error("[JOIN_FREE_LIVE_CLASS] upsertOrderNotification failed", {
      orderId,
      error: upsertErr,
    });
  }

  try {
    [emailResult, whatsappResult] = await Promise.all([
      sendWithRetry(orderId, "email", sendOrderConfirmationEmail),
      sendWithRetry(orderId, "whatsapp", sendOrderConfirmationWhatsAppMessage),
    ]);
  } catch (notifyErr) {
    console.error("[JOIN_FREE_LIVE_CLASS] Notification send failed", {
      orderId,
      error: notifyErr,
    });
  }

  console.log("[JOIN_FREE_LIVE_CLASS] Notifications complete", {
    orderId,
    emailOk: emailResult.success,
    emailError: emailResult.error,
    whatsappOk: whatsappResult.success,
    whatsappError: whatsappResult.error,
  });

  return NextResponse.json({
    bookingId: orderId,
    gatewayOrderId,
    gatewayPaymentId,
    notifications: {
      email: {
        sent: emailResult.success,
        error: emailResult.success ? undefined : emailResult.error,
      },
      whatsapp: {
        sent: whatsappResult.success,
        error: whatsappResult.success ? undefined : whatsappResult.error,
      },
    },
  });
}

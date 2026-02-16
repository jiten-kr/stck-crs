/**
 * Order Confirmation Email Service
 *
 * Handles sending order confirmation emails and managing notification status.
 * Designed to be called from webhooks (async) and cron jobs (retry).
 */

import { Resend } from "resend";
import pool from "@/lib/db";
import {
  PLATFORM_NAME,
  LIVE_TRADING_CLASS_NAME,
  LIVE_TRADING_CLASS_ITEM_ID,
} from "@/lib/constants";
import type {
  OrderConfirmationData,
  SendNotificationResult,
  NotificationStatus,
} from "./types";
import {
  buildOrderConfirmationEmailHtml,
  buildOrderConfirmationEmailText,
  buildOrderConfirmationEmailSubject,
  getNextLiveClassSchedule,
} from "./contentBuilder";

// Lazy-initialized Resend client singleton
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const token = process.env.RESEND_TOKEN;
    if (!token) {
      throw new Error("RESEND_TOKEN environment variable is not set");
    }
    resendClient = new Resend(token);
  }
  return resendClient;
}

/**
 * Database row types for queries
 */
type OrderQueryRow = {
  order_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  total_amount: number;
  currency: string;
  item_id: number;
  order_status: string;
  paid_at: Date;
  gateway_payment_id: string;
  gateway_order_id: string;
};

type NotificationRow = {
  id: number;
  order_id: number;
  user_id: number;
  type: string;
  channel: string;
  recipient: string;
  status: string;
  attempt_count: number;
};

/**
 * Fetch order details with user and payment information
 */
async function fetchOrderDetails(
  orderId: number,
): Promise<OrderConfirmationData | null> {
  const result = await pool.query<OrderQueryRow>(
    `
    SELECT 
      o.id AS order_id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,
      o.total_amount,
      o.currency,
      o.item_id,
      o.status AS order_status,
      o.updated_at AS paid_at,
      p.gateway_payment_id,
      po.gateway_order_id
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN payment_orders po ON po.order_id = o.id AND po.status = 'PAID'
    LEFT JOIN payments p ON p.order_id = o.id AND p.captured = true
    WHERE o.id = $1 AND o.status = 'PAID'
    LIMIT 1
    `,
    [orderId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  // Determine item name based on item_id
  const itemName =
    row.item_id === LIVE_TRADING_CLASS_ITEM_ID
      ? LIVE_TRADING_CLASS_NAME
      : `Course #${row.item_id}`;

  // Calculate next live class schedule
  const schedule = getNextLiveClassSchedule(row.paid_at);

  return {
    userId: row.user_id,
    userName: row.user_name,
    email: row.user_email,
    phone: row.user_phone || "",
    orderId: row.order_id,
    bookingId: row.order_id.toString(),
    paymentId: row.gateway_payment_id || "",
    gatewayOrderId: row.gateway_order_id || "",
    amount: row.total_amount,
    currency: row.currency,
    itemName,
    itemId: row.item_id,
    nextLiveClassDate: schedule.nextLiveClassDate,
    nextLiveClassTime: schedule.nextLiveClassTime,
    paidAt: row.paid_at,
  };
}

/**
 * Insert or update notification record (UPSERT)
 * Returns the notification ID
 */
export async function upsertOrderNotification(
  orderId: number,
  userId: number,
  recipient: string,
): Promise<number> {
  const result = await pool.query<{ id: number }>(
    `
    INSERT INTO order_notifications (
      order_id,
      user_id,
      type,
      channel,
      recipient,
      subject,
      status
    )
    VALUES ($1, $2, 'ORDER_CONFIRMATION', 'EMAIL', $3, $4, 'PENDING')
    ON CONFLICT (order_id, type, channel) 
    DO UPDATE SET
      updated_at = NOW()
    RETURNING id
    `,
    [orderId, userId, recipient, `${PLATFORM_NAME}: Order Confirmation`],
  );

  return result.rows[0].id;
}

/**
 * Update notification status after send attempt
 */
async function updateNotificationStatus(
  notificationId: number,
  status: NotificationStatus,
  errorMessage?: string,
): Promise<void> {
  if (status === "SENT") {
    await pool.query(
      `
      UPDATE order_notifications
      SET 
        status = $1,
        sent_at = NOW(),
        last_attempt_at = NOW(),
        attempt_count = attempt_count + 1,
        error_message = NULL,
        updated_at = NOW()
      WHERE id = $2
      `,
      [status, notificationId],
    );
  } else {
    await pool.query(
      `
      UPDATE order_notifications
      SET 
        status = $1,
        last_attempt_at = NOW(),
        attempt_count = attempt_count + 1,
        error_message = $2,
        updated_at = NOW()
      WHERE id = $3
      `,
      [status, errorMessage || null, notificationId],
    );
  }
}

/**
 * Send order confirmation email for a given order
 *
 * This function:
 * 1. Fetches order details from database
 * 2. Generates email content using the content builder
 * 3. Sends email via Resend
 * 4. Updates notification status (SENT or FAILED)
 *
 * @param orderId - The order ID to send confirmation for
 * @returns SendNotificationResult with success status and any error
 */
export async function sendOrderConfirmationEmail(
  orderId: number,
): Promise<SendNotificationResult> {
  console.log("[ORDER_CONFIRMATION_EMAIL] Starting send", { orderId });

  // 1. Fetch order details
  const orderData = await fetchOrderDetails(orderId);
  if (!orderData) {
    console.error("[ORDER_CONFIRMATION_EMAIL] Order not found or not paid", {
      orderId,
    });
    return {
      success: false,
      error: "Order not found or not in PAID status",
    };
  }

  // 2. Ensure notification record exists
  const notificationId = await upsertOrderNotification(
    orderId,
    orderData.userId,
    orderData.email,
  );

  try {
    // 3. Generate email content
    const subject = buildOrderConfirmationEmailSubject(orderData);
    const html = buildOrderConfirmationEmailHtml(orderData);
    const text = buildOrderConfirmationEmailText(orderData);

    console.log("[ORDER_CONFIRMATION_EMAIL] Sending email", {
      orderId,
      notificationId,
      email: orderData.email,
    });

    // 4. Send via Resend
    const { data, error } = await getResend().emails.send({
      from: `${PLATFORM_NAME} <security@mayankfin.com>`,
      to: orderData.email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[ORDER_CONFIRMATION_EMAIL] Resend error", {
        orderId,
        notificationId,
        error,
      });

      // Update notification as FAILED
      await updateNotificationStatus(
        notificationId,
        "FAILED",
        error.message || "Unknown Resend error",
      );

      return {
        success: false,
        error: error.message || "Email send failed",
      };
    }

    console.log("[ORDER_CONFIRMATION_EMAIL] Email sent successfully", {
      orderId,
      notificationId,
      messageId: data?.id,
    });

    // Update notification as SENT
    await updateNotificationStatus(notificationId, "SENT");

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    console.error("[ORDER_CONFIRMATION_EMAIL] Unexpected error", {
      orderId,
      notificationId,
      error: err,
    });

    // Update notification as FAILED
    await updateNotificationStatus(notificationId, "FAILED", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Trigger order confirmation email asynchronously (non-blocking)
 *
 * This function fires and forgets the email send.
 * Used by webhooks to not block the response.
 *
 * @param orderId - The order ID to send confirmation for
 */
export function triggerOrderConfirmationEmailAsync(orderId: number): void {
  console.log("[ORDER_CONFIRMATION_EMAIL] Triggering async send", { orderId });

  // Fire and forget - don't await
  sendOrderConfirmationEmail(orderId).catch((err) => {
    console.error("[ORDER_CONFIRMATION_EMAIL] Async send failed", {
      orderId,
      error: err,
    });
  });
}

/**
 * Fetch pending/failed notifications for retry
 * Uses FOR UPDATE SKIP LOCKED to prevent duplicate processing
 *
 * @param limit - Maximum number of notifications to fetch
 * @returns Array of notification records
 */
export async function fetchPendingNotificationsForRetry(
  limit: number = 10,
): Promise<NotificationRow[]> {
  const result = await pool.query<NotificationRow>(
    `
    SELECT 
      id,
      order_id,
      user_id,
      type,
      channel,
      recipient,
      status,
      attempt_count
    FROM order_notifications
    WHERE 
      status IN ('PENDING', 'FAILED')
      AND attempt_count < 5
      AND type = 'ORDER_CONFIRMATION'
      AND channel = 'EMAIL'
    ORDER BY 
      CASE WHEN status = 'PENDING' THEN 0 ELSE 1 END,
      created_at ASC
    LIMIT $1
    FOR UPDATE SKIP LOCKED
    `,
    [limit],
  );

  return result.rows;
}

/**
 * Process pending notifications (for cron job)
 * Fetches pending/failed notifications and retries sending
 *
 * @returns Object with processed count and results
 */
export async function processRetryNotifications(): Promise<{
  processed: number;
  successful: number;
  failed: number;
  results: Array<{ orderId: number; success: boolean; error?: string }>;
}> {
  console.log("[NOTIFICATION_RETRY] Starting retry process");

  // Use a client to maintain transaction and lock
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Fetch with lock
    const notifications = await client.query<NotificationRow>(
      `
      SELECT 
        id,
        order_id,
        user_id,
        type,
        channel,
        recipient,
        status,
        attempt_count
      FROM order_notifications
      WHERE 
        status IN ('PENDING', 'FAILED')
        AND attempt_count < 10
        AND type = 'ORDER_CONFIRMATION'
        AND channel = 'EMAIL'
      ORDER BY 
        CASE WHEN status = 'PENDING' THEN 0 ELSE 1 END,
        created_at ASC
      LIMIT 10
      FOR UPDATE SKIP LOCKED
      `,
    );

    await client.query("COMMIT");
    client.release();

    console.log("[NOTIFICATION_RETRY] Found notifications to process", {
      count: notifications.rowCount,
    });

    const results: Array<{
      orderId: number;
      success: boolean;
      error?: string;
    }> = [];
    let successful = 0;
    let failed = 0;

    // Process each notification (sequentially to avoid overwhelming email provider)
    for (const notification of notifications.rows) {
      console.log("[NOTIFICATION_RETRY] Processing notification", {
        id: notification.id,
        orderId: notification.order_id,
        attemptCount: notification.attempt_count,
      });

      const result = await sendOrderConfirmationEmail(notification.order_id);

      results.push({
        orderId: notification.order_id,
        success: result.success,
        error: result.error,
      });

      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    console.log("[NOTIFICATION_RETRY] Retry process completed", {
      processed: notifications.rowCount,
      successful,
      failed,
    });

    return {
      processed: notifications.rowCount || 0,
      successful,
      failed,
      results,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    client.release();
    throw err;
  }
}

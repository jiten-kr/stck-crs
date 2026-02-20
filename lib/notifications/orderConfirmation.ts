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

/** Max send attempts for order confirmation email (retries via cron) */
const MAX_NOTIFICATION_ATTEMPTS = 10;

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
 * Returns the notification ID and current status
 */
export async function upsertOrderNotification(
  orderId: number,
  userId: number,
  recipient: string,
): Promise<{ id: number; status: string; alreadySent: boolean }> {
  const result = await pool.query<{ id: number; status: string }>(
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
    RETURNING id, status
    `,
    [orderId, userId, recipient, `${PLATFORM_NAME}: Order Confirmation`],
  );

  const row = result.rows[0];
  return {
    id: row.id,
    status: row.status,
    alreadySent: row.status === "SENT",
  };
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
 * 1. Atomically claims the notification (PENDING/FAILED → PROCESSING)
 * 2. Fetches order details from database
 * 3. Generates email content using the content builder
 * 4. Sends email via Resend
 * 5. Updates notification status (SENT or FAILED)
 *
 * Uses atomic UPDATE to prevent duplicate sends under concurrent execution.
 *
 * @param orderId - The order ID to send confirmation for
 * @returns SendNotificationResult with success status and any error
 */
export async function sendOrderConfirmationEmail(
  orderId: number,
): Promise<SendNotificationResult> {
  console.log("[ORDER_CONFIRMATION_EMAIL] Starting send", { orderId });

  // 1. Fetch order details first to get user info
  console.log("[ORDER_CONFIRMATION_EMAIL] Step 1: Fetching order details", {
    orderId,
  });
  const orderData = await fetchOrderDetails(orderId);
  if (!orderData) {
    console.error(
      "[ORDER_CONFIRMATION_EMAIL] Step 1 FAILED: Order not found or not paid",
      {
        orderId,
      },
    );
    return {
      success: false,
      error: "Order not found or not in PAID status",
    };
  }
  console.log(
    "[ORDER_CONFIRMATION_EMAIL] Step 1 SUCCESS: Order details fetched",
    {
      orderId,
      userId: orderData.userId,
      email: orderData.email,
      itemName: orderData.itemName,
    },
  );

  // 2. Atomically claim the notification (prevents duplicate sends)
  // This UPDATE only succeeds if notification is in PENDING or FAILED state
  console.log(
    "[ORDER_CONFIRMATION_EMAIL] Step 2: Attempting to claim notification",
    { orderId },
  );
  const claimResult = await pool.query<{ id: number }>(
    `
    UPDATE order_notifications
    SET 
      status = 'PENDING',
      attempt_count = attempt_count + 1,
      last_attempt_at = NOW(),
      updated_at = NOW()
    WHERE order_id = $1
      AND type = 'ORDER_CONFIRMATION'
      AND channel = 'EMAIL'
      AND status IN ('PENDING', 'FAILED')
      AND attempt_count < ${MAX_NOTIFICATION_ATTEMPTS}
    RETURNING id
    `,
    [orderId],
  );

  // If no rows updated, check why
  if (!claimResult.rows[0]) {
    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 2: Claim failed, checking existing status",
      { orderId },
    );
    // Check current status
    const statusCheck = await pool.query<{
      status: string;
      attempt_count: number;
    }>(
      `
      SELECT status, attempt_count 
      FROM order_notifications 
      WHERE order_id = $1 
        AND type = 'ORDER_CONFIRMATION' 
        AND channel = 'EMAIL'
      `,
      [orderId],
    );

    const existing = statusCheck.rows[0];

    if (!existing) {
      // Notification doesn't exist - create it
      console.log(
        "[ORDER_CONFIRMATION_EMAIL] Step 2: No existing notification, creating new one",
        { orderId },
      );
      const insertResult = await pool.query<{ id: number }>(
        `
        INSERT INTO order_notifications (
          order_id, user_id, type, channel, recipient, subject, status, attempt_count, last_attempt_at
        )
        VALUES ($1, $2, 'ORDER_CONFIRMATION', 'EMAIL', $3, $4, 'PENDING', 1, NOW())
        ON CONFLICT (order_id, type, channel) DO NOTHING
        RETURNING id
        `,
        [
          orderId,
          orderData.userId,
          orderData.email,
          `${PLATFORM_NAME}: Order Confirmation`,
        ],
      );

      if (!insertResult.rows[0]) {
        // Race: another process inserted it - recursive retry once
        console.log(
          "[ORDER_CONFIRMATION_EMAIL] Race on insert, retrying claim",
          { orderId },
        );
        return sendOrderConfirmationEmail(orderId);
      }
    } else if (existing.status === "SENT") {
      console.log("[ORDER_CONFIRMATION_EMAIL] Already sent, skipping", {
        orderId,
      });
      return { success: true, messageId: undefined };
    } else if (existing.attempt_count >= MAX_NOTIFICATION_ATTEMPTS) {
      console.log("[ORDER_CONFIRMATION_EMAIL] Max attempts reached", {
        orderId,
      });
      return { success: false, error: "Max retry attempts exceeded" };
    } else {
      // Status is PENDING but claim failed - another process is handling it
      console.log("[ORDER_CONFIRMATION_EMAIL] Already being processed", {
        orderId,
      });
      return {
        success: false,
        error: "Notification is being processed by another worker",
      };
    }
  }

  const notificationId = claimResult.rows[0]?.id;
  console.log(
    "[ORDER_CONFIRMATION_EMAIL] Step 2 SUCCESS: Notification claimed",
    {
      orderId,
      notificationId,
    },
  );

  if (!notificationId) {
    // Fallback: get the ID
    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 2: No ID from claim, fetching ID",
      { orderId },
    );
    const idResult = await pool.query<{ id: number }>(
      `SELECT id FROM order_notifications 
       WHERE order_id = $1 AND type = 'ORDER_CONFIRMATION' AND channel = 'EMAIL'`,
      [orderId],
    );
    if (!idResult.rows[0]) {
      return { success: false, error: "Failed to get notification ID" };
    }
  }

  const finalNotificationId =
    notificationId ||
    (
      await pool.query<{ id: number }>(
        `SELECT id FROM order_notifications 
     WHERE order_id = $1 AND type = 'ORDER_CONFIRMATION' AND channel = 'EMAIL'`,
        [orderId],
      )
    ).rows[0]?.id;

  if (!finalNotificationId) {
    console.error(
      "[ORDER_CONFIRMATION_EMAIL] Step 2 FAILED: Notification record not found",
      { orderId },
    );
    return { success: false, error: "Notification record not found" };
  }

  try {
    // 3. Generate email content
    console.log("[ORDER_CONFIRMATION_EMAIL] Step 3: Generating email content", {
      orderId,
      notificationId: finalNotificationId,
    });
    const subject = buildOrderConfirmationEmailSubject(orderData);
    const html = buildOrderConfirmationEmailHtml(orderData);
    const text = buildOrderConfirmationEmailText(orderData);
    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 3 SUCCESS: Email content generated",
      {
        orderId,
        notificationId: finalNotificationId,
        subject,
      },
    );

    // 4. Send via Resend
    console.log("[ORDER_CONFIRMATION_EMAIL] Step 4: Sending email via Resend", {
      orderId,
      notificationId: finalNotificationId,
      to: orderData.email,
    });

    const { data, error } = await getResend().emails.send({
      from: `${PLATFORM_NAME} <orders@mayankfin.com>`,
      to: orderData.email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[ORDER_CONFIRMATION_EMAIL] Step 4 FAILED: Resend error", {
        orderId,
        notificationId: finalNotificationId,
        error: error.message,
      });

      // 5. Update notification as FAILED
      console.log(
        "[ORDER_CONFIRMATION_EMAIL] Step 5: Updating notification status to FAILED",
        {
          orderId,
          notificationId: finalNotificationId,
        },
      );
      await updateNotificationStatus(
        finalNotificationId,
        "FAILED",
        error.message || "Unknown Resend error",
      );

      return {
        success: false,
        error: error.message || "Email send failed",
      };
    }

    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 4 SUCCESS: Email sent successfully",
      {
        orderId,
        notificationId: finalNotificationId,
        messageId: data?.id,
      },
    );

    // 5. Update notification as SENT
    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 5: Updating notification status to SENT",
      {
        orderId,
        notificationId: finalNotificationId,
      },
    );
    await updateNotificationStatus(finalNotificationId, "SENT");
    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 5 SUCCESS: Notification status updated to SENT",
      {
        orderId,
        notificationId: finalNotificationId,
      },
    );

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    console.error(
      "[ORDER_CONFIRMATION_EMAIL] EXCEPTION: Unexpected error caught",
      {
        orderId,
        notificationId: finalNotificationId,
        errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      },
    );

    // Update notification as FAILED
    console.log(
      "[ORDER_CONFIRMATION_EMAIL] Step 5: Updating notification status to FAILED after exception",
      {
        orderId,
        notificationId: finalNotificationId,
      },
    );
    await updateNotificationStatus(finalNotificationId, "FAILED", errorMessage);

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
      AND attempt_count < ${MAX_NOTIFICATION_ATTEMPTS}
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
 * Since sendOrderConfirmationEmail uses atomic claim (UPDATE ... WHERE status IN),
 * this function can simply fetch candidates and let the send function handle
 * concurrent execution safety.
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

  // Fetch notification order_ids to retry
  // Note: sendOrderConfirmationEmail handles its own idempotency via atomic UPDATE
  const notificationsToProcess = await pool.query<{ order_id: number }>(
    `
    SELECT DISTINCT order_id
    FROM order_notifications
    WHERE 
      status IN ('PENDING', 'FAILED')
      AND attempt_count < ${MAX_NOTIFICATION_ATTEMPTS}
      AND type = 'ORDER_CONFIRMATION'
      AND channel = 'EMAIL'
    ORDER BY order_id ASC
    LIMIT 10
    `,
  );

  console.log("[NOTIFICATION_RETRY] Found notifications to process", {
    count: notificationsToProcess.rowCount,
  });

  if (!notificationsToProcess.rowCount) {
    return {
      processed: 0,
      successful: 0,
      failed: 0,
      results: [],
    };
  }

  const results: Array<{
    orderId: number;
    success: boolean;
    error?: string;
  }> = [];
  let successful = 0;
  let failed = 0;

  // Process each notification sequentially
  // sendOrderConfirmationEmail handles atomic claim to prevent duplicate sends
  for (const row of notificationsToProcess.rows) {
    console.log("[NOTIFICATION_RETRY] Processing order", {
      orderId: row.order_id,
    });

    try {
      const result = await sendOrderConfirmationEmail(row.order_id);

      results.push({
        orderId: row.order_id,
        success: result.success,
        error: result.error,
      });

      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error("[NOTIFICATION_RETRY] Error processing notification", {
        orderId: row.order_id,
        error: err,
      });

      results.push({
        orderId: row.order_id,
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      failed++;
    }
  }

  console.log("[NOTIFICATION_RETRY] Retry process completed", {
    processed: results.length,
    successful,
    failed,
  });

  return {
    processed: results.length,
    successful,
    failed,
    results,
  };
}

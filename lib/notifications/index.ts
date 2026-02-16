/**
 * Notifications module exports
 */

// Types
export type {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  OrderConfirmationData,
  OrderNotification,
  SendNotificationResult,
} from "./types";

// Content builder functions
export {
  formatAmount,
  formatClassDate,
  formatDateTime,
  getNextLiveClassSchedule,
  buildOrderConfirmationContent,
  buildOrderConfirmationEmailHtml,
  buildOrderConfirmationEmailText,
  buildOrderConfirmationEmailSubject,
} from "./contentBuilder";

export type { OrderConfirmationContent } from "./contentBuilder";

// Email service functions
export {
  sendOrderConfirmationEmail,
  triggerOrderConfirmationEmailAsync,
  upsertOrderNotification,
  fetchPendingNotificationsForRetry,
  processRetryNotifications,
} from "./orderConfirmation";

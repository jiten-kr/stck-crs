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

// Email & WhatsApp notification service functions
export {
  sendOrderConfirmationEmail,
  sendOrderConfirmationWhatsAppMessage,
  triggerOrderConfirmationEmailAsync,
  upsertOrderNotification,
  fetchPendingNotificationsForRetry,
  processRetryNotifications,
} from "./orderConfirmation";

// WhatsApp service functions
export {
  sendWhatsAppMessage,
  sendOrderConfirmationWhatsApp,
  sendPaymentSuccessWhatsApp,
  sendCustomWhatsApp,
  WHATSAPP_TEMPLATES,
} from "./whatsapp";

export type {
  WhatsAppTemplateData,
  SendWhatsAppResult,
  WhatsAppMessageOptions,
} from "./whatsapp";

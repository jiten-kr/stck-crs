/**
 * Types for order notification system
 */

export type NotificationType = "ORDER_CONFIRMATION" | "PAYMENT_RECEIPT";
export type NotificationChannel = "EMAIL" | "WHATSAPP";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED";

/**
 * Data structure for order confirmation content
 * This is the canonical shape used by both UI components and email templates
 */
export type OrderConfirmationData = {
  // User details
  userId: number;
  userName: string;
  email: string;
  phone: string;

  // Order details
  orderId: number;
  bookingId: string;
  paymentId: string;
  gatewayOrderId: string;

  // Payment details
  amount: number; // in paise
  currency: string;

  // Item details
  itemName: string;
  itemId: number;

  // Class schedule (for live trading class)
  nextLiveClassDate: string; // ISO date string
  nextLiveClassTime: string;

  // Timestamps
  paidAt: Date;
};

/**
 * Notification record from database
 */
export type OrderNotification = {
  id: number;
  order_id: number;
  user_id: number;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  subject: string | null;
  status: NotificationStatus;
  attempt_count: number;
  last_attempt_at: Date | null;
  sent_at: Date | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
};

/**
 * Result of sending a notification
 */
export type SendNotificationResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

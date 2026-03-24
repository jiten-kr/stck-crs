/**
 * WhatsApp Messaging Service using Twilio
 *
 * Handles sending WhatsApp messages using Twilio's WhatsApp API.
 * Supports both template messages and freeform messages.
 *
 * Required environment variables:
 * - TWILIO_ACCOUNT_SID: Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Twilio Auth Token
 * - TWILIO_WHATSAPP_FROM: Twilio WhatsApp sender number (e.g., "whatsapp:+14155238886")
 */

import twilio from "twilio";
import type { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

// Types
export type WhatsAppTemplateData = Record<string, string | number>;

export type SendWhatsAppResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export type WhatsAppMessageOptions = {
  /** Recipient phone number with country code (e.g., "+919876543210") */
  to: string;
  /** Template name/Content SID for approved WhatsApp templates */
  templateName?: string;
  /** Template variables to replace placeholders */
  templateData?: WhatsAppTemplateData;
  /** Plain text body (for sandbox/testing or non-template messages) */
  body?: string;
  /** Optional media URL to attach */
  mediaUrl?: string;
};

// Lazy-initialized Twilio client singleton
let twilioClient: twilio.Twilio | null = null;

/**
 * Get or create Twilio client instance
 */
function getTwilioClient(): twilio.Twilio {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error(
        "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are required",
      );
    }

    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

/**
 * Get the WhatsApp sender number from environment
 */
function getWhatsAppFrom(): string {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!from) {
    throw new Error("TWILIO_WHATSAPP_FROM environment variable is not set");
  }
  // Ensure proper format
  return from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
}

/**
 * Format phone number for WhatsApp
 * Ensures the number has the "whatsapp:" prefix
 */
function formatWhatsAppNumber(phone: string): string {
  // Remove any spaces, dashes, or parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Add + if not present and starts with country code
  if (!cleaned.startsWith("+") && !cleaned.startsWith("whatsapp:")) {
    // Assume Indian number if 10 digits
    if (cleaned.length === 10) {
      cleaned = `+91${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }

  // Add whatsapp: prefix if not present
  if (!cleaned.startsWith("whatsapp:")) {
    cleaned = `whatsapp:${cleaned}`;
  }

  return cleaned;
}

/**
 * Build message body from template and data
 * Replaces {{placeholder}} with actual values
 */
function buildTemplateMessage(
  template: string,
  data: WhatsAppTemplateData,
): string {
  let message = template;

  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{${key}}}`, "g");
    message = message.replace(placeholder, String(value));
  }

  return message;
}

/**
 * Send a WhatsApp message
 *
 * @param options - Message options including recipient, template, and data
 * @returns SendWhatsAppResult with success status and message ID or error
 *
 * @example
 * // Using a template
 * await sendWhatsAppMessage({
 *   to: "+919876543210",
 *   templateName: "order_confirmation",
 *   templateData: {
 *     customerName: "John",
 *     orderId: "12345",
 *     amount: "₹999"
 *   }
 * });
 *
 * @example
 * // Using plain body (for sandbox testing)
 * await sendWhatsAppMessage({
 *   to: "+919876543210",
 *   body: "Hello! Your order #12345 has been confirmed."
 * });
 */
export async function sendWhatsAppMessage(
  options: WhatsAppMessageOptions,
): Promise<SendWhatsAppResult> {
  const { to, templateName, templateData, body, mediaUrl } = options;

  console.log("[WHATSAPP] Starting message send", {
    to,
    templateName,
    hasBody: !!body,
    hasMediaUrl: !!mediaUrl,
  });

  try {
    const client = getTwilioClient();
    const from = getWhatsAppFrom();
    const toFormatted = formatWhatsAppNumber(to);

    // Build message options
    const messageOptions: {
      from: string;
      to: string;
      body?: string;
      contentSid?: string;
      contentVariables?: string;
      mediaUrl?: string[];
    } = {
      from,
      to: toFormatted,
    };

    // If using Twilio Content Templates (recommended for production)
    if (templateName && templateName.startsWith("HX")) {
      // Content SID format: HXxxxxx
      messageOptions.contentSid = templateName;
      if (templateData) {
        messageOptions.contentVariables = JSON.stringify(templateData);
      }
    }
    // If using body with template replacement
    else if (templateName && templateData) {
      // Get template from predefined templates
      const template = WHATSAPP_TEMPLATES[templateName];
      if (!template) {
        return {
          success: false,
          error: `Template "${templateName}" not found`,
        };
      }
      messageOptions.body = buildTemplateMessage(template, templateData);
    }
    // Plain body message
    else if (body) {
      messageOptions.body = body;
    } else {
      return {
        success: false,
        error: "Either templateName with templateData or body is required",
      };
    }

    // Add media URL if provided
    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    console.log("[WHATSAPP] Sending message via Twilio", {
      from,
      to: toFormatted,
      hasContentSid: !!messageOptions.contentSid,
      hasBody: !!messageOptions.body,
    });

    // Send the message
    const message: MessageInstance = await client.messages.create(
      messageOptions as Parameters<typeof client.messages.create>[0],
    );

    console.log("[WHATSAPP] Message sent successfully", {
      messageId: message.sid,
      status: message.status,
    });

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    console.error("[WHATSAPP] Failed to send message", {
      to,
      templateName,
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Predefined WhatsApp message templates
 * Use {{placeholder}} syntax for variables
 *
 * Note: For production, use Twilio Content Templates (Content SID)
 * which are pre-approved by WhatsApp. These templates below are
 * for sandbox testing or reference.
 */
export const WHATSAPP_TEMPLATES: Record<string, string> = {
  // Order confirmation template
  order_confirmation: `🎉 *Order Confirmed!*

Hi {{customerName}},

Your order has been successfully placed!

📦 *Order Details:*
• Order ID: {{orderId}}
• Item: {{itemName}}
• Amount: {{amount}}

Thank you for choosing MayankFin! We'll send you further updates soon.

For any queries, reply to this message or email us at support@mayankfin.com`,

  // Payment success template
  payment_success: `✅ *Payment Successful*

Hi {{customerName}},

We've received your payment of {{amount}} for Order #{{orderId}}.

Transaction ID: {{transactionId}}

Thank you for your purchase!`,

  // Welcome template
  welcome: `👋 *Welcome to MayankFin!*

Hi {{customerName}},

Thank you for joining us! You're now part of a community learning stock market and crypto trading the right way.

🎓 What's next?
• Check your email for login details
• Explore your dashboard
• Start your first lesson

Need help? Just reply to this message!`,

  // Class reminder template
  class_reminder: `⏰ *Class Reminder*

Hi {{customerName}},

Your live trading class is starting soon!

📅 Date: {{classDate}}
🕐 Time: {{classTime}}
📍 Topic: {{classTopic}}

Join link: {{joinLink}}

See you there!`,

  // Custom/generic template
  generic: `{{message}}`,
};

/**
 * Send order confirmation via WhatsApp
 * Convenience wrapper for order confirmation use case
 */
export async function sendOrderConfirmationWhatsApp(
  to: string,
  data: {
    customerName: string;
    orderId: string | number;
    itemName: string;
    amount: string;
  },
): Promise<SendWhatsAppResult> {
  return sendWhatsAppMessage({
    to,
    templateName: "order_confirmation",
    templateData: {
      customerName: data.customerName,
      orderId: String(data.orderId),
      itemName: data.itemName,
      amount: data.amount,
    },
  });
}

/**
 * Send payment success notification via WhatsApp
 */
export async function sendPaymentSuccessWhatsApp(
  to: string,
  data: {
    customerName: string;
    orderId: string | number;
    amount: string;
    transactionId: string;
  },
): Promise<SendWhatsAppResult> {
  return sendWhatsAppMessage({
    to,
    templateName: "payment_success",
    templateData: {
      customerName: data.customerName,
      orderId: String(data.orderId),
      amount: data.amount,
      transactionId: data.transactionId,
    },
  });
}

/**
 * Send a custom WhatsApp message
 * Use this for one-off messages or testing
 */
export async function sendCustomWhatsApp(
  to: string,
  message: string,
): Promise<SendWhatsAppResult> {
  return sendWhatsAppMessage({
    to,
    templateName: "generic",
    templateData: { message },
  });
}

/**
 * Content builder for order confirmation
 *
 * Pure functions that generate structured content for order confirmations.
 * Used by both React UI components and email templates.
 */

import type { OrderConfirmationData } from "./types";
import {
  PLATFORM_NAME,
  PLATFORM_SUPPORT_EMAIL,
  PLATFORM_SUPPORT_PHONE,
  LIVE_TRADING_CLASS_NAME,
} from "@/lib/constants";

/**
 * Format amount in INR with proper locale formatting
 */
export function formatAmount(amountInPaise: number, currency: string): string {
  const amountInRupees = amountInPaise / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amountInRupees);
  } catch {
    return `${amountInRupees.toFixed(2)} ${currency}`.trim();
  }
}

/**
 * Format date for display (IST timezone)
 */
export function formatClassDate(isoDateString: string): string {
  const parsed = new Date(isoDateString);
  if (Number.isNaN(parsed.getTime())) {
    return isoDateString;
  }
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(parsed);
}

/**
 * Format timestamp for receipt
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Calculate next Sunday 8 PM IST from a given date
 */
export function getNextLiveClassSchedule(fromDate: Date = new Date()): {
  nextLiveClassDate: string;
  nextLiveClassTime: string;
} {
  const istOffsetMinutes = 330;
  const istNow = new Date(fromDate.getTime() + istOffsetMinutes * 60000);
  const dayOfWeek = istNow.getDay();
  let daysUntilSunday = (7 - dayOfWeek) % 7;

  const targetIst = new Date(istNow);
  targetIst.setDate(istNow.getDate() + daysUntilSunday);
  targetIst.setHours(20, 0, 0, 0);

  if (daysUntilSunday === 0 && istNow.getTime() >= targetIst.getTime()) {
    targetIst.setDate(targetIst.getDate() + 7);
  }

  const targetUtc = new Date(targetIst.getTime() - istOffsetMinutes * 60000);
  return {
    nextLiveClassDate: targetUtc.toISOString(),
    nextLiveClassTime: "8 PM IST",
  };
}

/**
 * Build structured order confirmation content sections
 * This can be consumed by React components or converted to HTML
 */
export type OrderConfirmationContent = {
  heading: string;
  subheading: string;
  classDetails: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  bookingDetails: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  enrollmentDetails: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  supportInfo: {
    email: string;
    phone: string;
    message: string;
  };
  footer: {
    joiningLinkNote: string;
    confirmationNote: string;
  };
};

export function buildOrderConfirmationContent(
  data: OrderConfirmationData,
): OrderConfirmationContent {
  const classDateFormatted = formatClassDate(data.nextLiveClassDate);
  const formattedAmount = formatAmount(data.amount, data.currency);

  return {
    heading: "Enrollment Successful!",
    subheading: "Your seat is confirmed. We are excited to see you in class.",

    classDetails: {
      title: "Class Details",
      items: [
        {
          label: "Class",
          value: data.itemName,
        },
        {
          label: "Live Class Timing",
          value: `${classDateFormatted} at ${data.nextLiveClassTime}`,
        },
        {
          label: "Email",
          value: data.email,
        },
        {
          label: "Phone",
          value: data.phone,
        },
      ],
    },

    bookingDetails: {
      title: "Booking Details",
      items: [
        {
          label: "Booking ID",
          value: data.bookingId,
        },
        {
          label: "Payment ID",
          value: data.paymentId,
        },
        {
          label: "Order ID",
          value: data.gatewayOrderId,
        },
        {
          label: "Amount Paid",
          value: formattedAmount,
        },
      ],
    },

    enrollmentDetails: {
      title: "Enrollment Details",
      items: [
        {
          label: "Course",
          value: data.itemName,
        },
        {
          label: "Attendee",
          value: data.userName,
        },
      ],
    },

    supportInfo: {
      email: PLATFORM_SUPPORT_EMAIL,
      phone: PLATFORM_SUPPORT_PHONE,
      message: "Need help? We are here for you.",
    },

    footer: {
      joiningLinkNote:
        "The joining link will be shared 2 hours before the class on this email and phone.",
      confirmationNote:
        "Confirmation will be sent to the above email and phone.",
    },
  };
}

/**
 * Generate HTML email content from order confirmation data
 */
export function buildOrderConfirmationEmailHtml(
  data: OrderConfirmationData,
): string {
  const content = buildOrderConfirmationContent(data);
  const classDateFormatted = formatClassDate(data.nextLiveClassDate);
  const formattedAmount = formatAmount(data.amount, data.currency);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${PLATFORM_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; max-width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 40px; text-align: center;">
              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; color: white;">✓</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">${content.heading}</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${content.subheading}</p>
            </td>
          </tr>

          <!-- Class Details -->
          <tr>
            <td style="padding: 32px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px; color: #166534; font-size: 18px; font-weight: 600;">${content.classDetails.title}</h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #166534;">
                          <strong>Class:</strong> ${data.itemName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #166534;">
                          <strong>Live Class Timing:</strong> ${classDateFormatted} at ${data.nextLiveClassTime}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #166534;">
                          <strong>Attendee:</strong> ${data.userName}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Booking Details -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">${content.bookingDetails.title}</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Booking ID</span>
                    <div style="color: #1e293b; font-size: 15px; font-weight: 500; margin-top: 4px;">${data.bookingId}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment ID</span>
                    <div style="color: #1e293b; font-size: 15px; font-weight: 500; margin-top: 4px;">${data.paymentId}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</span>
                    <div style="color: #1e293b; font-size: 15px; font-weight: 500; margin-top: 4px;">${data.gatewayOrderId}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Amount Paid</span>
                    <div style="color: #10b981; font-size: 20px; font-weight: 600; margin-top: 4px;">${formattedAmount}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Note -->
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px; color: #1e40af; font-size: 14px; font-weight: 500;">
                      📌 Important
                    </p>
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                      ${content.footer.joiningLinkNote}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 12px; color: #64748b; font-size: 14px;">${content.supportInfo.message}</p>
                    <p style="margin: 0; color: #1e293b; font-size: 14px;">
                      <a href="mailto:${content.supportInfo.email}" style="color: #3b82f6; text-decoration: none;">${content.supportInfo.email}</a>
                      <span style="color: #cbd5e1; margin: 0 8px;">|</span>
                      <a href="tel:${content.supportInfo.phone.replace(/\s/g, "")}" style="color: #3b82f6; text-decoration: none;">${content.supportInfo.phone}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                © ${new Date().getFullYear()} ${PLATFORM_NAME}. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
                This is an automated confirmation email. Please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

/**
 * Generate plain text email content for fallback
 */
export function buildOrderConfirmationEmailText(
  data: OrderConfirmationData,
): string {
  const classDateFormatted = formatClassDate(data.nextLiveClassDate);
  const formattedAmount = formatAmount(data.amount, data.currency);

  return `
${PLATFORM_NAME} - Order Confirmation
=====================================

Enrollment Successful!

Your seat is confirmed for ${data.itemName}. We are excited to see you in class.

CLASS DETAILS
-------------
Class: ${data.itemName}
Live Class Timing: ${classDateFormatted} at ${data.nextLiveClassTime}
Attendee: ${data.userName}
Email: ${data.email}
Phone: ${data.phone}

BOOKING DETAILS
---------------
Booking ID: ${data.bookingId}
Payment ID: ${data.paymentId}
Order ID: ${data.gatewayOrderId}
Amount Paid: ${formattedAmount}

IMPORTANT
---------
The joining link will be shared 2 hours before the class on this email and phone.

NEED HELP?
----------
Email: ${PLATFORM_SUPPORT_EMAIL}
Phone: ${PLATFORM_SUPPORT_PHONE}

---
© ${new Date().getFullYear()} ${PLATFORM_NAME}. All rights reserved.
This is an automated confirmation email.
`.trim();
}

/**
 * Generate email subject line
 */
export function buildOrderConfirmationEmailSubject(
  data: OrderConfirmationData,
): string {
  return `${PLATFORM_NAME}: Your ${data.itemName} enrollment is confirmed! 🎉`;
}

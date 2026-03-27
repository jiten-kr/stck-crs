import { NextRequest, NextResponse } from "next/server";
import { sendLiveClassConfirmationWhatsApp } from "@/lib/notifications/whatsapp";

/**
 * POST /api/test-whatsapp
 *
 * Test endpoint to send a live class confirmation WhatsApp message via Twilio.
 * Body: { to: string, customerName?: string, orderId?: string, itemName?: string, amount?: string, classDate?: string, classTime?: string, classUrl?: string }
 *
 * Example:
 * curl -X POST http://localhost:3000/api/test-whatsapp \
 *   -H "Content-Type: application/json" \
 *   -d '{"to": "+917042752172"}'
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[TEST_WHATSAPP] Request received");

    const body = await request.json();
    const to = body?.to;

    // Live class confirmation data with defaults for testing
    const orderData = {
      customerName: body?.customerName || "Test User",
      orderId: body?.orderId || "TEST-12345",
      itemName: body?.itemName || "Live Trading Class",
      amount: body?.amount || "₹999",
      classDate: body?.classDate || "Every Saturday & Sunday",
      classTime: body?.classTime || "7:00 PM - 8:30 PM IST",
      classUrl: body?.classUrl || "https://meet.google.com/abc-defg-hij",
    };

    if (!to) {
      return NextResponse.json(
        { error: "Missing 'to' phone number in request body" },
        { status: 400 },
      );
    }

    console.log("[TEST_WHATSAPP] Sending live class confirmation", {
      to,
      orderData,
    });

    const result = await sendLiveClassConfirmationWhatsApp(to, orderData);

    console.log("[TEST_WHATSAPP] Result:", result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: "Live class confirmation WhatsApp sent successfully!",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("[TEST_WHATSAPP] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

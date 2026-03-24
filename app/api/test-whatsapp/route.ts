import { NextRequest, NextResponse } from "next/server";
import { sendCustomWhatsApp } from "@/lib/notifications/whatsapp";
import { PLATFORM_NAME } from "@/lib/constants";

/**
 * POST /api/test-whatsapp
 *
 * Test endpoint to send a WhatsApp message via Twilio.
 * Body: { to: string, message?: string }
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
    const message =
      body?.message ||
      `Hello from ${PLATFORM_NAME}! This is a test message to verify WhatsApp integration.`;

    if (!to) {
      return NextResponse.json(
        { error: "Missing 'to' phone number in request body" },
        { status: 400 },
      );
    }

    console.log("[TEST_WHATSAPP] Sending message", {
      to,
      messageLength: message.length,
    });

    const result = await sendCustomWhatsApp(to, message);

    console.log("[TEST_WHATSAPP] Result:", result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: "WhatsApp message sent successfully!",
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

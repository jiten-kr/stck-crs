/**
 * Cron endpoint for retrying failed/pending order notification emails
 *
 * This endpoint:
 * 1. Fetches notifications with status PENDING or FAILED (attempt_count < 5)
 * 2. Uses FOR UPDATE SKIP LOCKED to prevent duplicate processing
 * 3. Calls sendOrderConfirmationEmail for each notification
 * 4. Returns summary of processed notifications
 *
 * Authentication: Requires CRON_SECRET bearer token
 *
 * Usage:
 * - Call from Vercel Cron or external scheduler
 * - Recommended frequency: Every 5-15 minutes
 */

import { NextResponse } from "next/server";
import { processRetryNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max for cron

export async function GET(request: Request) {
  console.info("[RETRY_NOTIFICATIONS_CRON] Cron job started");

  // Verify authorization
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("[RETRY_NOTIFICATIONS_CRON] CRON_SECRET not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error("[RETRY_NOTIFICATIONS_CRON] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processRetryNotifications();

    console.info("[RETRY_NOTIFICATIONS_CRON] Cron job completed", {
      processed: result.processed,
      successful: result.successful,
      failed: result.failed,
    });

    return NextResponse.json({
      ok: true,
      processed: result.processed,
      successful: result.successful,
      failed: result.failed,
      results: result.results,
    });
  } catch (error) {
    console.error("[RETRY_NOTIFICATIONS_CRON] Error processing notifications", {
      error,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to process notifications",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

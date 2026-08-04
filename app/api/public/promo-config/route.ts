import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * Public endpoint to fetch promo/countdown configuration.
 * Returns countdown settings only if enabled AND end time is in the future.
 *
 * Query params:
 * - courseId (optional): Get course-specific promo, falls back to site-wide
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawCourseId = searchParams.get("courseId");
  const courseId = rawCourseId ? Number(rawCourseId) : null;

  try {
    // Try course-specific config first, then fall back to site-wide (course_id IS NULL)
    const result = await pool.query<{
      countdown_enabled: boolean;
      countdown_end_at: string | null;
      promo_text: string | null;
    }>(
      `
      SELECT 
        countdown_enabled,
        countdown_end_at,
        promo_text
      FROM promo_config
      WHERE 
        (course_id = $1 OR course_id IS NULL)
        AND countdown_enabled = TRUE
        AND countdown_end_at > NOW()
      ORDER BY course_id NULLS LAST
      LIMIT 1
      `,
      [courseId],
    );

    const row = result.rows[0];

    // If no active promo found, return disabled state
    if (!row) {
      return NextResponse.json(
        {
          countdownEnabled: false,
          countdownEndAt: null,
          promoText: null,
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, max-age=0" },
        },
      );
    }

    return NextResponse.json(
      {
        countdownEnabled: row.countdown_enabled,
        countdownEndAt: row.countdown_end_at,
        promoText: row.promo_text,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  } catch (error) {
    console.error("[PUBLIC_PROMO_CONFIG] GET failed", error);

    // On error, fail safe by returning disabled countdown
    return NextResponse.json(
      {
        countdownEnabled: false,
        countdownEndAt: null,
        promoText: null,
        error: "Unable to load promo config",
      },
      {
        status: 200, // Return 200 to not break the page
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

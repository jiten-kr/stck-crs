import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * Public read-only URLs for a live course (meeting + WhatsApp group).
 * Used after checkout so the payment-success page can show links without auth.
 * Join URLs are intentionally shareable; do not put secrets in query params.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("courseId");
  const courseId = Number(rawId);

  if (!rawId || !Number.isFinite(courseId) || courseId <= 0) {
    return NextResponse.json(
      { error: "courseId is required and must be a positive number" },
      { status: 400 },
    );
  }

  try {
    const result = await pool.query<{
      live_class_url: string | null;
      whatsapp_group_url: string | null;
    }>(
      `
      SELECT l.live_class_url, l.whatsapp_group_url
      FROM stock_market_courses c
      LEFT JOIN live_class_links l ON l.course_id = c.course_id
      WHERE c.course_id = $1 AND c.is_live = true
      LIMIT 1
      `,
      [courseId],
    );

    const row = result.rows[0];
    if (!row) {
      return NextResponse.json(
        { liveClassUrl: null, whatsappGroupUrl: null },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        liveClassUrl: row.live_class_url,
        whatsappGroupUrl: row.whatsapp_group_url,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("[PUBLIC_LIVE_CLASS_LINKS] GET failed", error);
    return NextResponse.json(
      { error: "Unable to load links" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminSessionUser } from "@/lib/auth/admin";

type LiveCourseLinkRow = {
  course_id: number;
  title: string;
  link_id: number | null;
  live_class_url: string | null;
  whatsapp_group_url: string | null;
  updated_at: string | null;
};

function normalizeUrl(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length === 0 ? null : s;
}

async function adminGuard() {
  const session = await getAdminSessionUser();
  if (session.state === "unauthenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.state === "forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

async function assertLiveCourse(courseId: number): Promise<boolean> {
  const r = await pool.query<{ ok: number }>(
    `SELECT 1 AS ok FROM stock_market_courses WHERE course_id = $1 AND is_live = true`,
    [courseId],
  );
  return r.rows.length > 0;
}

/**
 * List all live courses with optional link row (GET).
 */
export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const result = await pool.query<LiveCourseLinkRow>(
      `
      SELECT
        smc.course_id,
        smc.title,
        lcl.id AS link_id,
        lcl.live_class_url,
        lcl.whatsapp_group_url,
        lcl.updated_at::text AS updated_at
      FROM stock_market_courses smc
      LEFT JOIN live_class_links lcl ON lcl.course_id = smc.course_id
      WHERE smc.is_live = true
      ORDER BY smc.course_id ASC
      `,
    );

    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error("[ADMIN_LIVE_CLASS_LINKS] GET failed", error);
    return NextResponse.json(
      { error: "Failed to load live class links" },
      { status: 500 },
    );
  }
}

/**
 * Create link row for a live course (POST). 409 if a row already exists.
 */
export async function POST(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      courseId?: number;
      liveClassUrl?: string | null;
      whatsappGroupUrl?: string | null;
    };

    const courseId = Number(body.courseId);
    if (!Number.isFinite(courseId)) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    if (!(await assertLiveCourse(courseId))) {
      return NextResponse.json(
        { error: "Course not found or not a live class" },
        { status: 400 },
      );
    }

    const liveClassUrl = normalizeUrl(body.liveClassUrl);
    const whatsappGroupUrl = normalizeUrl(body.whatsappGroupUrl);

    const insert = await pool.query(
      `
      INSERT INTO live_class_links (course_id, live_class_url, whatsapp_group_url, updated_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, course_id, live_class_url, whatsapp_group_url, updated_at::text AS updated_at
      `,
      [courseId, liveClassUrl, whatsappGroupUrl],
    );

    return NextResponse.json({ link: insert.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "Link already exists for this course; use PUT to update" },
        { status: 409 },
      );
    }
    console.error("[ADMIN_LIVE_CLASS_LINKS] POST failed", error);
    return NextResponse.json(
      { error: "Failed to create live class link" },
      { status: 500 },
    );
  }
}

/**
 * Update link row for a live course (PUT). 404 if no row exists (use POST to create).
 */
export async function PUT(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      courseId?: number;
      liveClassUrl?: string | null;
      whatsappGroupUrl?: string | null;
    };

    const courseId = Number(body.courseId);
    if (!Number.isFinite(courseId)) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    if (!(await assertLiveCourse(courseId))) {
      return NextResponse.json(
        { error: "Course not found or not a live class" },
        { status: 400 },
      );
    }

    const liveClassUrl = normalizeUrl(body.liveClassUrl);
    const whatsappGroupUrl = normalizeUrl(body.whatsappGroupUrl);

    const updated = await pool.query(
      `
      UPDATE live_class_links
      SET
        live_class_url = $2,
        whatsapp_group_url = $3,
        updated_at = NOW()
      WHERE course_id = $1
      RETURNING id, course_id, live_class_url, whatsapp_group_url, updated_at::text AS updated_at
      `,
      [courseId, liveClassUrl, whatsappGroupUrl],
    );

    if (!updated.rows[0]) {
      return NextResponse.json(
        { error: "No link record for this course; use POST to create" },
        { status: 404 },
      );
    }

    return NextResponse.json({ link: updated.rows[0] });
  } catch (error) {
    console.error("[ADMIN_LIVE_CLASS_LINKS] PUT failed", error);
    return NextResponse.json(
      { error: "Failed to update live class link" },
      { status: 500 },
    );
  }
}

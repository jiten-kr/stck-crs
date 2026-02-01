import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Strongly typed course detail
interface StockMarketCourseDetail {
  course_id: number;
  title: string;
  description: string | null;
  instructor_id: number;
  price: string; // NUMERIC from pg
  created_at: string; // ISO
  is_active: boolean;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    console.log("[COURSE_DETAIL] Request received", { id: params.id });
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      console.warn("[COURSE_DETAIL] Invalid course_id", { id: params.id });
      return NextResponse.json({ error: "Invalid course_id" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT course_id, title, description, instructor_id, price, created_at, is_active
       FROM stock_market_courses
       WHERE course_id = $1`,
      [id],
    );

    let course: StockMarketCourseDetail;
    if (result.rows.length === 0) {
      console.warn("[COURSE_DETAIL] Course not found, returning mock", { id });
      course = {
        course_id: id,
        title: "Sample Course",
        description: "This is a mock course used for development.",
        instructor_id: 1,
        price: "0.00",
        created_at: new Date().toISOString(),
        is_active: true,
      };
    } else {
      course = result.rows[0] as StockMarketCourseDetail;
    }
    console.log("[COURSE_DETAIL] Course fetched", { id: course.course_id });
    return NextResponse.json({ course });
  } catch (error) {
    console.error("[COURSE_DETAIL] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

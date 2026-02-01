import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Concrete TypeScript type for a course row
interface StockMarketCourse {
  course_id: number;
  title: string;
  description: string | null;
  instructor_id: number;
  price: string; // NUMERIC comes back as string in node-postgres
  created_at: string; // ISO string
  is_active: boolean;
}

export async function GET() {
  try {
    console.log("[COURSE_LIST] Request received");
    const result = await pool.query(
      `SELECT course_id, title, description, instructor_id, price, created_at, is_active
       FROM stock_market_courses
       WHERE is_active = TRUE
       ORDER BY course_id DESC`,
    );

    const courses: StockMarketCourse[] = result.rows as StockMarketCourse[];
    console.log("[COURSE_LIST] Courses fetched", { count: courses.length });
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[COURSE_LIST] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

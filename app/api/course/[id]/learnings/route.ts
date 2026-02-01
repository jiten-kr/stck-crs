import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Strongly typed learning pointer
interface CourseLearning {
  learning_id: number;
  course_id: number;
  pointer_text: string;
  display_order: number;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    console.log("[COURSE_LEARNINGS] Request received", { id: params.id });
    const courseId = parseInt(params.id, 10);
    if (Number.isNaN(courseId)) {
      console.warn("[COURSE_LEARNINGS] Invalid course_id", { id: params.id });
      return NextResponse.json({ error: "Invalid course_id" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT learning_id, course_id, pointer_text, display_order, created_at, updated_at
       FROM course_learnings
       WHERE course_id = $1
       ORDER BY display_order ASC, learning_id ASC`,
      [courseId],
    );

    const learnings: CourseLearning[] = result.rows as CourseLearning[];
    console.log("[COURSE_LEARNINGS] Learnings fetched", {
      courseId,
      count: learnings.length,
    });
    return NextResponse.json({ learnings });
  } catch (error) {
    console.error("[COURSE_LEARNINGS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course learnings" },
      { status: 500 },
    );
  }
}

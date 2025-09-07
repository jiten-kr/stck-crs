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
  { params }: { params: { id: string } }
) {
  try {
    const courseId = parseInt(params.id, 10);
    if (Number.isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course_id" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT learning_id, course_id, pointer_text, display_order, created_at, updated_at
       FROM course_learnings
       WHERE course_id = $1
       ORDER BY display_order ASC, learning_id ASC`,
      [courseId]
    );

    const learnings: CourseLearning[] = result.rows as CourseLearning[];
    return NextResponse.json({ learnings });
  } catch (error) {
    console.error("Fetch course learnings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course learnings" },
      { status: 500 }
    );
  }
}

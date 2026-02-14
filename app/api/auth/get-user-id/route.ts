import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { generateJWT } from "@/lib/api/jwt";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  console.log("[GET_USER_ID] Request received");

  let body: { email?: string; phone?: string } | null = null;

  try {
    body = await req.json();
    const { email, phone } = body || {};
    console.log("[GET_USER_ID] Parsed request body", {
      email,
      phone,
    });

    const missingFields: string[] = [];
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE email = $1 AND phone = $2",
      [email, phone],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0] as User;

    const purchasedCoursesResult = await pool.query(
      "SELECT course_id FROM user_enrollments WHERE user_id = $1",
      [user.id],
    );

    const purchasedCourseIds: number[] = purchasedCoursesResult.rows.map(
      (row) => row.course_id,
    );

    const responseUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      hasPaidFor: {
        courseIds: purchasedCourseIds,
      },
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as User;

    const token = generateJWT<User>(responseUser);

    return NextResponse.json({
      message: "User found",
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("[GET_USER_ID] Error:", error, {
      received: {
        email: body?.email,
        phone: body?.phone,
      },
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

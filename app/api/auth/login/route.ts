import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateJWT } from "@/lib/api/jwt";
import { User, LoginResponse } from "@/lib/types";

export async function POST(req: Request) {
  console.log("[LOGIN] Request received");

  try {
    const { emailOrPhone, password } = await req.json();
    console.log("[LOGIN] Parsed request body", {
      emailOrPhone,
      hasPassword: Boolean(password),
    });

    if (!emailOrPhone || !password) {
      console.warn("[LOGIN] Validation failed - missing credentials", {
        hasEmailOrPhone: Boolean(emailOrPhone),
        hasPassword: Boolean(password),
      });
      return NextResponse.json(
        { error: "Email/Phone and password are required" },
        { status: 400 },
      );
    }

    // ✅ Find user by email or phone
    console.log("[LOGIN] Looking up user", { emailOrPhone });
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [emailOrPhone],
    );

    if (result.rows.length === 0) {
      console.warn("[LOGIN] User not found", { emailOrPhone });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user: User = result.rows[0];
    console.log("[LOGIN] User found", { userId: user.id, email: user.email });

    // ✅ Compare password
    console.log("[LOGIN] Validating password", { userId: user.id });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.warn("[LOGIN] Invalid password", {
        userId: user.id,
        email: user.email,
      });
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    console.log("[LOGIN] Password validated successfully", { userId: user.id });

    // ✅ Generate JWT
    console.log("[LOGIN] Generating JWT", { userId: user.id });
    const token = generateJWT<User>(user);

    // ✅ Fetch purchased course IDs
    console.log("[LOGIN] Fetching purchased courses", { userId: user.id });
    const purchasedCoursesResult = await pool.query(
      "SELECT course_id FROM user_enrollments WHERE user_id = $1",
      [user.id],
    );

    const purchasedCourseIds: number[] = purchasedCoursesResult.rows.map(
      (row) => row.course_id,
    );
    console.log("[LOGIN] Purchased courses fetched", {
      userId: user.id,
      courseCount: purchasedCourseIds.length,
    });

    const resp: LoginResponse = {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        hasPaidFor: {
          courseIds: purchasedCourseIds,
        },
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.role,
      },
    };

    console.log("[LOGIN] Login successful", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return NextResponse.json(resp);
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

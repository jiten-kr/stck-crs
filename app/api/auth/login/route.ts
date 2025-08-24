import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { emailOrPhone, password } = await req.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: "Email/Phone and password are required" }, { status: 400 });
    }

    // ✅ Find user by email or phone
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [emailOrPhone]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    // ✅ Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone,         hasPaidFor: {
          courseIds: ["course-1"],
        }, },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

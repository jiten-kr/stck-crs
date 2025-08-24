import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // ✅ Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $2",
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email or phone already exists" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, created_at`,
      [name, email, phone, hashedPassword]
    );

    return NextResponse.json(
      { message: "User registered successfully", user: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

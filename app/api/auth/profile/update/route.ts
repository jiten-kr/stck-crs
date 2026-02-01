// app/api/profile/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateRequest } from "@/lib/middleware/verifyJWT";
import { User } from "@/lib/types";

export async function PUT(req: NextRequest) {
  try {
    console.log("[PROFILE_UPDATE] Request received");
    // Verify token
    let { decoded: user, status, send401 } = validateRequest<User>(req);

    // Handle validation failure
    if (!status || !user) {
      console.warn("[PROFILE_UPDATE] Unauthorized request");
      return send401();
    }

    const body = await req.json();
    const { name, email, phone } = body;
    console.log("[PROFILE_UPDATE] Parsed body", {
      userId: user.id,
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      hasPhone: Boolean(phone),
    });

    if (!name || !email || !phone) {
      console.warn("[PROFILE_UPDATE] Validation failed - missing fields", {
        userId: user.id,
      });
      return NextResponse.json(
        { error: "All fields (name, email, phone) are required" },
        { status: 400 },
      );
    }

    const userId = user.id;

    console.log("[PROFILE_UPDATE] Updating profile", { userId });

    // 3. Check if email already exists for another user
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, userId],
    );
    if (emailCheck.rows.length > 0) {
      console.warn("[PROFILE_UPDATE] Email already in use", { userId, email });
      return NextResponse.json(
        { error: "Email already in use by another account" },
        { status: 400 },
      );
    }

    // 4. Check if phone already exists for another user
    const phoneCheck = await pool.query(
      "SELECT id FROM users WHERE phone = $1 AND id != $2",
      [phone, userId],
    );
    if (phoneCheck.rows.length > 0) {
      console.warn("[PROFILE_UPDATE] Phone already in use", { userId, phone });
      return NextResponse.json(
        { error: "Phone number already in use by another account" },
        { status: 400 },
      );
    }

    // 5. Update user
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING id, name, email, phone`,
      [name, email, phone, userId],
    );

    if (result.rows.length === 0) {
      console.warn("[PROFILE_UPDATE] User not found", { userId });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[PROFILE_UPDATE] Profile updated", { userId });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

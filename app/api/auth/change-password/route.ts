import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { validateRequest } from "@/lib/middleware/verifyJWT";
import { User } from "@/lib/types";

// 2. Load environment variables

export async function PUT(req: NextRequest) {
  try {
    // Verify token
    let { decoded, status, send401 } = validateRequest<User>(req);

    // Handle validation failure
    if (!status || !decoded) {
      return send401();
    }

    const userId = decoded.id;

    // 3. Parse body
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both oldPassword and newPassword are required" },
        { status: 400 }
      );
    }

    // 4. Get existing user
    const userResult = await pool.query(
      "SELECT id, password FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // 5. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // 6. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7. Update password
    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, userId]
    );

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

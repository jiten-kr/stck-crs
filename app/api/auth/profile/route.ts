import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // PostgreSQL connection
import { validateRequest } from "@/lib/middleware/verifyJWT";
import { User } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    // Verify token
    let { decoded: user, status, send401 } = validateRequest<User>(req);

    // Handle validation failure
    if (!status || !user) {
      return send401();
    }

    // Fetch user details from DB
    const result = await pool.query(
      "SELECT name, email, phone FROM users WHERE id = $1",
      [user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user = result.rows[0];

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

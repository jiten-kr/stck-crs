import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: Request) {
  let email = "";
  let code = "";

  try {
    const body = await request.json();
    email = (body?.email || "").trim();
    code = (body?.code || "").trim();
    const password = body?.password || "";
    const confirmPassword = body?.confirmPassword || "";

    if (!email || !code || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Email, code, and password are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    const client = await pool.connect();

    try {
      console.log("Reset Password: checking user", { email });
      await client.query("BEGIN");

      const userResult = await client.query<{ id: number }>(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );

      if (userResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 404 },
        );
      }

      const userId = userResult.rows[0].id;

      console.log("Reset Password: verifying code", { email, userId });
      const codeResult = await client.query<{
        id: number;
        used: boolean;
        expires_at: string;
      }>(
        `SELECT id, used, expires_at
         FROM password_reset_codes
         WHERE user_id = $1 AND code = $2
         FOR UPDATE`,
        [userId, code],
      );

      if (codeResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Invalid or expired code" },
          { status: 400 },
        );
      }

      const resetRow = codeResult.rows[0];
      if (resetRow.used) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Code already used" },
          { status: 400 },
        );
      }

      if (new Date(resetRow.expires_at) <= new Date()) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Code expired" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Reset Password: updating password", { email, userId });

      await client.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        userId,
      ]);

      await client.query(
        "UPDATE password_reset_codes SET used = TRUE WHERE id = $1",
        [resetRow.id],
      );

      await client.query("COMMIT");
      console.log("Reset Password: success", { email, userId });

      return NextResponse.json({ message: "Password updated" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Reset Password Error:", error, { email });
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 500 },
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Reset Password Error:", error, { email, code });
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}

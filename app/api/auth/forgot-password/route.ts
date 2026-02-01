import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import pool from "@/lib/db";

// Lazy-initialized singleton to avoid build-time env access
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_TOKEN);
  }
  return resend;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("[FORGOT_PASSWORD] Request received", { email });

    if (!email) {
      console.warn("[FORGOT_PASSWORD] Missing email");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("[FORGOT_PASSWORD] Checking user existence", { email });
    const userResult = await pool.query<{ id: number }>(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      console.warn("[FORGOT_PASSWORD] Email not found", { email });
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 },
      );
    }

    const userId = userResult.rows[0].id;
    console.log("[FORGOT_PASSWORD] User found", { email, userId });

    const resetCode = crypto
      .randomInt(0, 1_000_000)
      .toString()
      .padStart(6, "0");
    console.log("[FORGOT_PASSWORD] Generated reset code", { email, userId });

    console.log("[FORGOT_PASSWORD] Storing reset code", { email, userId });
    await pool.query(
      `INSERT INTO password_reset_codes (user_id, code)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET
         code = EXCLUDED.code,
         expires_at = NOW() + INTERVAL '15 minutes',
         used = FALSE,
         created_at = CURRENT_TIMESTAMP`,
      [userId, resetCode],
    );
    console.log("[FORGOT_PASSWORD] Reset code stored", { email, userId });

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2 style="margin-bottom: 12px;">Reset your password</h2>
        <p style="margin: 0 0 12px;">We received a request to reset your password. Use the code below to continue:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background: #f3f4f6; padding: 12px 16px; display: inline-block; border-radius: 6px;">
          ${resetCode}
        </div>
        <p style="margin: 12px 0 0;">If you didn’t request this, you can ignore this email.</p>
        <p style="margin: 12px 0 0; color: #6b7280; font-size: 12px;">This code expires in 15 minutes for your security.</p>
      </div>
    `;

    console.log("[FORGOT_PASSWORD] Sending email", { email, userId });
    const { data, error } = await getResend().emails.send({
      from: "MayankFin <security@mayankfin.com>",
      to: email,
      subject: "Your password reset code",
      html,
    });

    if (error) {
      console.error("[FORGOT_PASSWORD] Email failed:", error, {
        email,
        userId,
      });
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 },
      );
    }

    console.log("[FORGOT_PASSWORD] Email sent", {
      email,
      userId,
      id: data?.id,
    });

    return NextResponse.json({
      message: "Reset password email sent",
      id: data?.id,
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD] Error:", error);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_TOKEN);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "MayankFin <security@mayankfin.com>",
      to: email,
      subject: "Reset your password",
      html: "Use this link to reset your password.",
    });

    if (error) {
      console.error("Forgot Password Email Failed:", error, { email });
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 },
      );
    }

    console.log("Forgot Password Email Sent:", {
      email,
      id: data?.id,
    });

    return NextResponse.json({
      message: "Reset password email sent",
      id: data?.id,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 },
    );
  }
}

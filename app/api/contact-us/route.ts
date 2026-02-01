import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    console.log("[CONTACT_US] Request received");
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;
    console.log("[CONTACT_US] Parsed body", {
      hasFirstName: Boolean(firstName),
      hasLastName: Boolean(lastName),
      hasEmail: Boolean(email),
      hasSubject: Boolean(subject),
      hasMessage: Boolean(message),
    });

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      console.warn("[CONTACT_US] Validation failed - missing required fields", {
        firstName: !!firstName,
        lastName: !!lastName,
        email: !!email,
        subject: !!subject,
        message: !!message,
      });
      // Still return 200 as per requirement
      return NextResponse.json(
        { message: "Message received successfully" },
        { status: 200 },
      );
    }

    // Insert into database
    await pool.query(
      `INSERT INTO contact_us (first_name, last_name, email, subject, message) 
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, subject, message],
    );

    console.log("[CONTACT_US] Message stored", { email });

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CONTACT_US] Error:", error);
    // Always return 200 OK as per requirement
    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 },
    );
  }
}

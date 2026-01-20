import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      console.error("Contact form validation error: Missing required fields", {
        firstName: !!firstName,
        lastName: !!lastName,
        email: !!email,
        subject: !!subject,
        message: !!message,
      });
      // Still return 200 as per requirement
      return NextResponse.json(
        { message: "Message received successfully" },
        { status: 200 }
      );
    }

    // Insert into database
    await pool.query(
      `INSERT INTO contact_us (first_name, last_name, email, subject, message) 
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, subject, message]
    );

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    // Always return 200 OK as per requirement
    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  }
}

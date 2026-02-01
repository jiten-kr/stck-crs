import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateJWT } from "@/lib/api/jwt";

export async function POST(req: Request) {
  console.log("[REGISTER] Request received");

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  } | null = null;

  try {
    body = await req.json();
    const { name, email, phone, password } = body || {};
    console.log("[REGISTER] Parsed request body", {
      name,
      email,
      phone,
      hasPassword: Boolean(password),
    });

    // ✅ Validate input
    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      const fieldLabel = missingFields
        .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
        .join(", ");

      console.warn("[REGISTER] Validation failed - missing fields", {
        missingFields,
        received: {
          name,
          email,
          phone,
          hasPassword: Boolean(password),
        },
      });

      return NextResponse.json(
        {
          error: "Missing required fields",
          message:
            missingFields.length === 1
              ? `${fieldLabel} is required.`
              : `${fieldLabel} are required.`,
          missingFields,
        },
        { status: 400 },
      );
    }

    // ✅ Check if user already exists
    console.log("[REGISTER] Checking for existing user", { email, phone });
    const existingUser = await pool.query<{
      email: string | null;
      phone: string | null;
    }>("SELECT email, phone FROM users WHERE email = $1 OR phone = $2", [
      email,
      phone,
    ]);

    if (existingUser.rows.length > 0) {
      console.warn("[REGISTER] User already exists", {
        email,
        phone,
        matchCount: existingUser.rows.length,
      });
      const emailExists = existingUser.rows.some((row) => row.email === email);
      const phoneExists = existingUser.rows.some((row) => row.phone === phone);

      const errorMessage =
        emailExists && phoneExists
          ? "User with this email and phone number already exists"
          : emailExists
            ? "User with this email already exists"
            : "User with this phone number already exists";

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    console.log(
      "[REGISTER] No existing user found, proceeding with registration",
    );

    // ✅ Hash password
    console.log("[REGISTER] Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    console.log("[REGISTER] Inserting new user", { name, email, phone });
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, created_at`,
      [name, email, phone, hashedPassword],
    );
    console.log("[REGISTER] User inserted successfully", {
      userId: result.rows[0].id,
    });

    // ✅ Generate JWT
    console.log("[REGISTER] Generating JWT", { userId: result.rows[0].id });
    const token = generateJWT<any>({ id: result.rows[0].id, email });

    console.log("[REGISTER] Registration successful", {
      userId: result.rows[0].id,
      email,
    });
    return NextResponse.json(
      { message: "User registered successfully", user: result.rows[0], token },
      { status: 201 },
    );
  } catch (error) {
    console.error("[REGISTER] Error:", error, {
      received: {
        name: body?.name,
        email: body?.email,
        phone: body?.phone,
        hasPassword: Boolean(body?.password),
      },
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

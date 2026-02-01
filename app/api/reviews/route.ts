import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * Database row type for reviews table
 */
interface ReviewRow {
  id: number;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
  date: string;
}

/**
 * GET /api/reviews
 *
 * Fetches reviews from the database with pagination support.
 *
 * Query Parameters:
 * - limit: number of reviews to fetch (default: 8, max: 50)
 * - offset: number of reviews to skip (default: 0)
 *
 * Response:
 * - reviews: array of review objects
 * - total: total count of reviews in database
 * - hasMore: boolean indicating if more reviews exist
 */
export async function GET(request: NextRequest) {
  try {
    console.log("[REVIEWS] Request received", { url: request.url });
    const { searchParams } = new URL(request.url);

    // Parse pagination params with defaults and limits
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "8", 10), 1),
      50,
    );
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);
    console.log("[REVIEWS] Pagination", { limit, offset });

    // Fetch reviews ordered by date DESC
    const reviewsResult = await pool.query<ReviewRow>(
      `SELECT id, name, rating, text, verified, date::text
       FROM reviews
       ORDER BY date DESC, id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    // Get total count for pagination
    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM reviews`,
    );
    const total = parseInt(countResult.rows[0]?.count || "0", 10);

    // Map database rows to API response format
    const reviews = reviewsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      text: row.text,
      verified: row.verified,
      date: row.date,
    }));

    console.log("[REVIEWS] Reviews fetched", {
      returned: reviews.length,
      total,
      hasMore: offset + reviews.length < total,
    });

    return NextResponse.json({
      reviews,
      total,
      hasMore: offset + reviews.length < total,
    });
  } catch (error) {
    console.error("[REVIEWS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/reviews
 *
 * Creates a new review entry.
 * Body: { name: string, rating: number, text: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[CREATE_REVIEW] Request received", { url: request.url });
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const rating = Number(body?.rating);
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    console.log("[CREATE_REVIEW] Payload", {
      nameLength: name.length,
      rating,
      textLength: text.length,
    });

    if (!name || name.length < 2 || name.length > 100) {
      console.log("[CREATE_REVIEW] Validation failed", { field: "name" });
      return NextResponse.json(
        { error: "Name is required and must be between 2 and 100 characters." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      console.log("[CREATE_REVIEW] Validation failed", { field: "rating" });
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5." },
        { status: 400 },
      );
    }

    if (!text || text.length < 10 || text.length > 2000) {
      console.log("[CREATE_REVIEW] Validation failed", { field: "text" });
      return NextResponse.json(
        { error: "Review text must be between 10 and 2000 characters." },
        { status: 400 },
      );
    }

    const insertResult = await pool.query<ReviewRow>(
      `INSERT INTO reviews (name, rating, text, verified, date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)
       RETURNING id, name, rating, text, verified, date::text`,
      [name, rating, text, false],
    );

    const review = insertResult.rows[0];

    console.log("[CREATE_REVIEW] Review created", { id: review?.id });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[CREATE_REVIEW] Error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}

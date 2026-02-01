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

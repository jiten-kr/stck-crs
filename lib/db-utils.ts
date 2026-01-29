/**
 * Server-only database utilities
 * WARNING: This file should ONLY be imported in Server Components or API routes
 * Importing this in client components will cause build errors
 */
import type { Review, ReviewsResponse } from "@/lib/types";

/**
 * Fetches reviews directly from the database (server-side only).
 * Returns empty result if database is unavailable.
 *
 * @param limit - Number of reviews to fetch (default: 8)
 * @param offset - Number of reviews to skip (default: 0)
 * @returns Promise<ReviewsResponse> - Reviews array with pagination info
 */
export async function fetchReviewsFromDb(
  limit: number = 8,
  offset: number = 0,
): Promise<ReviewsResponse> {
  // Return empty if DATABASE_URL is not configured
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not configured, skipping reviews fetch");
    return { reviews: [], total: 0, hasMore: false };
  }

  try {
    // Dynamic import to avoid issues if db module fails to load
    const { default: pool } = await import("@/lib/db");

    // Fetch reviews ordered by date DESC
    const reviewsResult = await pool.query(
      `SELECT id, name, rating, text, verified, date::text
       FROM reviews
       ORDER BY date DESC, id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    // Get total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM reviews`,
    );
    const total = parseInt(countResult.rows[0]?.count || "0", 10);

    // Map database rows to response format
    const reviews: Review[] = reviewsResult.rows.map(
      (row: {
        id: number;
        name: string;
        rating: number;
        text: string;
        verified: boolean;
        date: string;
      }) => ({
        id: row.id,
        name: row.name,
        rating: row.rating,
        text: row.text,
        verified: row.verified,
        date: row.date,
      }),
    );

    return {
      reviews,
      total,
      hasMore: offset + reviews.length < total,
    };
  } catch (error) {
    // Log detailed error for debugging
    console.error(
      "Error fetching reviews from DB:",
      error instanceof Error ? error.message : error,
    );
    return { reviews: [], total: 0, hasMore: false };
  }
}

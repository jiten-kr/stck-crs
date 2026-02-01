import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/reviews/stats
 *
 * Fetches review statistics: total count and average rating.
 *
 * Response:
 * - totalReviews: total number of reviews
 * - averageRating: average rating (1-5), rounded to 1 decimal place
 */
export async function GET() {
  try {
    console.log("[REVIEW_STATS] Request received");
    const result = await pool.query<{
      total_reviews: string;
      average_rating: string | null;
    }>(
      `SELECT 
         COUNT(*) as total_reviews,
         ROUND(AVG(rating)::numeric, 1) as average_rating
       FROM reviews`,
    );

    const row = result.rows[0];
    const totalReviews = parseInt(row?.total_reviews || "0", 10);
    const averageRating = row?.average_rating
      ? parseFloat(row.average_rating)
      : 0;

    console.log("[REVIEW_STATS] Stats fetched", {
      totalReviews,
      averageRating,
    });

    return NextResponse.json({
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.error("[REVIEW_STATS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review statistics" },
      { status: 500 },
    );
  }
}

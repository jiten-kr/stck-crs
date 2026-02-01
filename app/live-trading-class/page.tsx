import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { PLATFORM_NAME } from "@/lib/constants";
import type { Review } from "@/lib/types";
import pool from "@/lib/db";
import LiveTradingClass from "@/components/pages/LiveTradingClass";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Live Stock Market & Crypto Trading Class | Learn & Trade Confidently",
  description:
    "Join our live online stock market and crypto trading classes. Learn real-world trading strategies, risk management, and market psychology. Beginner-friendly. Limited seats.",

  keywords: [
    "live stock market class",
    "crypto trading class",
    "online trading course",
    "learn stock trading",
    "learn crypto trading",
    "live trading workshop",
    "stock market for beginners",
    "crypto trading for beginners",
    "online trading class india",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Live Stock Market & Crypto Trading Class",
    description:
      "Learn stock market & crypto trading live with practical strategies, real examples, and expert guidance. Join now – limited seats available.",
    url: "https://mayankfin.com",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png", // 1200x630 recommended
        width: 1200,
        height: 630,
        alt: "Live Stock Market & Crypto Trading Class",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Live Stock Market & Crypto Trading Class",
    description:
      "Join live stock market & crypto trading classes. Learn practical trading, risk management & real strategies.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "education",
};

type ReviewRow = {
  id: number;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
  date: string;
};

type ReviewStatsRow = {
  total_reviews: string;
  average_rating: string | null;
};

export default async function LiveTradingClassPage() {
  noStore();

  const reviewsResult = await pool.query<ReviewRow>(
    `SELECT id, name, rating, text, verified, date::text
     FROM reviews
     ORDER BY date DESC, id DESC
     LIMIT $1 OFFSET $2`,
    [8, 0]
  );

  const statsResult = await pool.query<ReviewStatsRow>(
    `SELECT 
       COUNT(*) as total_reviews,
       ROUND(AVG(rating)::numeric, 1) as average_rating
     FROM reviews`
  );

  const reviews: Review[] = reviewsResult.rows.map((row) => ({
    id: row.id,
    name: row.name,
    rating: row.rating,
    text: row.text,
    verified: row.verified,
    date: row.date,
  }));

  const totalReviews = parseInt(statsResult.rows[0]?.total_reviews || "0", 10);
  const averageRating = statsResult.rows[0]?.average_rating
    ? parseFloat(statsResult.rows[0].average_rating)
    : 0;

  const initialReviewStats =
    totalReviews > 0 ? { totalReviews, averageRating } : null;

  return (
    <LiveTradingClass
      initialReviews={reviews}
      initialTotalReviews={totalReviews}
      initialReviewStats={initialReviewStats}
    />
  );
}

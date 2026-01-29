import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";
import { fetchReviewsFromDb } from "@/lib/db-utils";
import LiveTradingClass from "@/components/pages/LiveTradingClass";
import type { Review } from "@/lib/types";

/**
 * Fallback reviews used when the database is empty or unavailable
 * Remove this once the database has real reviews
 */
const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    name: "Rahul S.",
    rating: 5,
    text: "Stop loss ka concept pehle bhi suna tha but kab kaise lagana hai samajh nahi aata tha. Is class ke baad clarity aa gayi.",
    verified: true,
    date: "2025-01-18",
  },
  {
    id: "fallback-2",
    name: "Priya M.",
    rating: 5,
    text: "I am beginner and honestly scared of trading earlier. Mayank sir explains in very simple way. Entry and SL now clear.",
    verified: true,
    date: "2025-01-20",
  },
  {
    id: "fallback-3",
    name: "Amit K.",
    rating: 4,
    text: "Good session. No gyaan, only practical rules. Especially risk reward part was eye opening.",
    verified: false,
    date: "2025-01-22",
  },
  {
    id: "fallback-4",
    name: "Sneha R.",
    rating: 5,
    text: "Earlier I used to hold loss and book profit jaldi. Ab exactly ulta kar rahi hu. This class helped a lot.",
    verified: true,
    date: "2025-01-24",
  },
  {
    id: "fallback-5",
    name: "Vikram D.",
    rating: 5,
    text: "₹49 ke hisaab se value bohot zyada hai. Stop loss placement alone worth it.",
    verified: false,
    date: "2025-01-26",
  },
  {
    id: "fallback-6",
    name: "Ananya P.",
    rating: 4,
    text: "Stocks aur crypto dono me same rules apply hote hain ye pehli baar samajh aaya.",
    verified: true,
    date: "2025-01-28",
  },
  {
    id: "fallback-7",
    name: "Karthik N.",
    rating: 5,
    text: "Psychology part hit hard. Galti market ki nahi, meri hi thi mostly.",
    verified: false,
    date: "2025-01-28",
  },
  {
    id: "fallback-8",
    name: "Meera J.",
    rating: 5,
    text: "Small batch hone ki wajah se question puch paaye. Live interaction was very helpful.",
    verified: true,
    date: "2025-01-29",
  },
];

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

export default async function LiveTradingClassPage() {
  let initialReviews: Review[] = FALLBACK_REVIEWS;
  let totalReviews = FALLBACK_REVIEWS.length;

  try {
    // Fetch initial reviews directly from database (server-side for SEO)
    const { reviews: dbReviews, total: dbTotal } = await fetchReviewsFromDb(8, 0);

    // Use database data if available
    if (dbReviews.length > 0) {
      initialReviews = dbReviews;
      totalReviews = dbTotal;
    }
  } catch (error) {
    // Log error but continue with fallback data
    console.error("Failed to fetch reviews, using fallback:", error);
  }

  return (
    <LiveTradingClass
      initialReviews={initialReviews}
      totalReviews={totalReviews}
    />
  );
}

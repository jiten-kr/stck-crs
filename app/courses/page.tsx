import CoursesTabs from "./courses-tabs";
import type { Course } from "@/lib/types";
import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    PLATFORM_NAME +
    " - Stock Market & Crypto Trading Courses | Learn at Your Own Pace",
  description:
    "Explore beginner-friendly stock market and crypto trading courses by MayankFin. Self-paced, structured lessons covering fundamentals, strategies, and risk management.",

  keywords: [
    "stock market courses",
    "crypto trading courses",
    "online trading courses",
    "learn stock market",
    "learn crypto trading",
    "self paced trading course",
    "trading courses for beginners",
    "online trading education india",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/courses",
  },

  openGraph: {
    title:
      PLATFORM_NAME +
      " - Stock Market & Crypto Trading Courses",
    description:
      "Self-paced stock market and crypto trading courses designed for beginners. Learn fundamentals, strategies, and risk management at your own speed.",
    url: "https://mayankfin.com/courses",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin - Stock Market & Crypto Trading Courses",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      PLATFORM_NAME +
      " - Stock Market & Crypto Trading Courses",
    description:
      "Learn stock market and crypto trading with self-paced courses designed for beginners.",
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

const liveStockMarketCourse: Course[] = [
  {
    id: 1,
    title: "Complete Masterclass 2026: For Indian Stocks Market, Crypto and Commodities ke liye Ultimate Trading Strategies",
    description:
      "Join our live stock market trading course and learn from real-time market analysis, interactive sessions, and practical trading strategies.",
    price: 2499,
    duration: "15 Days",
    level: "All Levels",
    category: "Stock Market",
    tags: ["live", "stock market", "trading"],
    image: "/courses/live-stock-masterclass-cover.svg",
    instructor: {
      id: 9,
      name: "Mayank Kumar",
      bio: "",
      image: "/placeholder.svg",
      title: "",
      courses: 4,
      students: 1200,
      rating: 4.8,
    },
    rating: 4.5,
    reviewCount: 29,
    students: 0,
    updatedAt: "",
    curriculum: [],
    enrollmentHref: "/enroll-live-stock-crypto-class",
  },
];


const upcomingCourses: Course[] = [
  {
    id: 4,
    title: "Options Trading Mastery",
    description:
      "Learn advanced options strategies with real-world risk management.",
    price: 2499,
    duration: "15 Days",
    level: "Beginner to Advanced",
    category: "Options",
    tags: [],
    image: "/placeholder.svg",
    instructor: {
      id: 9,
      name: "Mayank Kumar",
      bio: "",
      image: "/placeholder.svg",
      title: "",
      courses: 4,
      students: 1200,
      rating: 4.8,
    },
    rating: 0,
    reviewCount: 0,
    students: 0,
    updatedAt: "",
    curriculum: [],
  },
  {
    id: 1002,
    title: "Swing Trading Blueprint",
    description:
      "Build repeatable swing trading setups with clear entry and exit rules.",
    price: 0,
    duration: "4 weeks",
    level: "Beginner",
    category: "Swing Trading",
    tags: ["swing", "setups", "basics"],
    image: "/placeholder.svg",
    instructor: {
      id: 502,
      name: "Ayesha Khan",
      bio: "Mentor focused on simple, structured swing trading frameworks.",
      image: "/placeholder.svg",
      title: "Trading Coach",
      courses: 3,
      students: 900,
      rating: 4.7,
    },
    rating: 0,
    reviewCount: 0,
    students: 0,
    updatedAt: "2026-03-15",
    curriculum: [],
  },
  {
    id: 1003,
    title: "Algorithmic Trading Foundations",
    description:
      "Design rule-based systems and backtest strategies for consistency.",
    price: 0,
    duration: "8 weeks",
    level: "Advanced",
    category: "Algo Trading",
    tags: ["algorithmic", "backtesting", "systems"],
    image: "/placeholder.svg",
    instructor: {
      id: 503,
      name: "Rohan Malhotra",
      bio: "Quant-focused instructor with a systems-first approach.",
      image: "/placeholder.svg",
      title: "Quant Research Lead",
      courses: 2,
      students: 650,
      rating: 4.9,
    },
    rating: 0,
    reviewCount: 0,
    students: 0,
    updatedAt: "2026-04-10",
    curriculum: [],
  },
];

export default function CoursesPage() {
  return (
    <div className="flex min-h-full w-full flex-col bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Live &amp; pre-recorded courses
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Use the tabs below to switch between{" "}
            <span className="font-medium text-blue-600">live</span> classes and{" "}
            <span className="font-medium text-purple-700">pre-recorded</span>{" "}
            courses you can take anytime.
          </p>
        </div>

        <CoursesTabs
          liveCourses={liveStockMarketCourse}
          prerecordedCourses={upcomingCourses}
        />
      </div>
    </div>
  );
}

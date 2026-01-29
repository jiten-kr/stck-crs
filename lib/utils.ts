import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Server-only helper to build an absolute URL for internal API calls
export async function buildBaseUrl(): Promise<string> {
  const { headers } = await import("next/headers");
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const protocol = hdrs.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

import type { Course, ReviewsResponse } from "./types";

type ApiCourse = {
  course_id: number;
  title: string;
  description: string | null;
  instructor_id: number;
  price: string;
  created_at: string;
  is_active: boolean;
};

export async function fetchCoursesFromApi(): Promise<Course[]> {
  const baseUrl = await buildBaseUrl();
  const res = await fetch(`${baseUrl}/api/course/list`, { cache: "no-store" });
  if (!res.ok) return [];
  const data: { courses: ApiCourse[] } = await res.json();

  return data.courses.map((c) => ({
    id: c.course_id,
    title: c.title,
    description: c.description || "",
    price: Number(c.price),
    discountedPrice: undefined,
    duration: "",
    level: "All Levels",
    category: "",
    tags: [],
    image: "/placeholder.svg",
    instructor: {
      id: c.instructor_id,
      name: "Instructor",
      bio: "",
      image: "/placeholder-user.jpg",
      title: "",
      courses: 0,
      students: 0,
      rating: 0,
    },
    rating: 0,
    reviewCount: 0,
    students: 0,
    updatedAt: c.created_at,
    curriculum: [
      {
        title: "Introduction to Stock Market",
        lessons: [
          { title: "What is the Stock Market?", duration: "15 min" },
          { title: "How Stocks Work", duration: "20 min" },
          { title: "Understanding Stock Exchanges", duration: "25 min" },
        ],
      },
      {
        title: "Investing Strategies",
        lessons: [
          { title: "Value vs Growth Investing", duration: "40 min" },
          { title: "Technical vs Fundamental Analysis", duration: "45 min" },
          { title: "Building a Diversified Portfolio", duration: "50 min" },
        ],
      },
      {
        title: "Risk Management",
        lessons: [
          { title: "Managing Market Volatility", duration: "35 min" },
          { title: "Stop Loss and Take Profit Strategies", duration: "40 min" },
          { title: "Psychology of Trading", duration: "50 min" },
        ],
      },
    ],
  }));
}

/**
 * Client-side function to fetch more reviews.
 * Uses relative URL so it works in browser context.
 *
 * @param limit - Number of reviews to fetch
 * @param offset - Number of reviews to skip
 * @returns Promise<ReviewsResponse> - Reviews array with pagination info
 */
export async function fetchMoreReviews(
  limit: number,
  offset: number,
): Promise<ReviewsResponse> {
  const res = await fetch(`/api/reviews?limit=${limit}&offset=${offset}`);

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return res.json();
}

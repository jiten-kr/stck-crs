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

import type { Course } from "./types";

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
      id: String(c.instructor_id),
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
    curriculum: [],
  }));
}

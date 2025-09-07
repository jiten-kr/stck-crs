import { notFound } from "next/navigation";
import type { Course } from "@/lib/types";
import { buildBaseUrl } from "@/lib/utils";
import CoursePageClient from "./CoursePageClient";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const idNum = Number.parseInt(rawId ?? "", 10);
  if (!rawId || Number.isNaN(idNum)) {
    return notFound();
  }

  const baseUrl = await buildBaseUrl();

  const [courseRes, learningsRes] = await Promise.all([
    fetch(`${baseUrl}/api/course/${idNum}`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/course/${idNum}/learnings`, { cache: "no-store" }),
  ]);
  if (!courseRes.ok) {
    return notFound();
  }
  const data: {
    course: {
      course_id: number;
      title: string;
      description: string | null;
      instructor_id: number;
      price: string;
      created_at: string;
      is_active: boolean;
    };
  } = await courseRes.json();

  const row = data.course;
  const course: Course = {
    id: row.course_id,
    title: row.title,
    description: row.description || "",
    price: Number(row.price),
    discountedPrice: undefined,
    duration: "",
    level: "All Levels",
    category: "",
    tags: [],
    image: "/placeholder.svg",
    instructor: {
      id: row.instructor_id,
      name: "Instructor",
      bio: " Bio",
      image: "/placeholder-user.jpg",
      title: "Title",
      courses: 0,
      students: 0,
      rating: 0,
    },
    rating: 0,
    reviewCount: 0,
    students: 0,
    updatedAt: row.created_at,
    curriculum: [
      {
        title: "Introduction to Stock Market",
        lessons: [
          { title: "What is the Stock Market?", duration: "15 min" },
          { title: "How Stocks Work", duration: "20 min" },
          { title: "Understanding Stock Exchanges", duration: "25 min" },
        ],
      },
    ],
  };
  const learningsData: {
    learnings: {
      learning_id: number;
      course_id: number;
      pointer_text: string;
      display_order: number;
      created_at: string;
      updated_at: string;
    }[];
  } = learningsRes.ok ? await learningsRes.json() : { learnings: [] };

  const learningOutcomes = learningsData.learnings.map((l) => ({
    id: String(l.learning_id),
    outcome: l.pointer_text,
  }));

  return (
    <CoursePageClient course={course} learningOutcomes={learningOutcomes} />
  );
}

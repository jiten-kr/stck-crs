import { notFound } from "next/navigation";
import type { Course } from "@/lib/types";
import { fetchCoursesFromApi } from "@/lib/utils";
import CoursePageClient from "./CoursePageClient";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const idNum = parseInt(
    Array.isArray(params.id) ? params.id[0] : params.id,
    10
  );
  const all = await fetchCoursesFromApi();
  const course = all.find((c: Course) => c.id === idNum);
  if (!course) {
    notFound();
  }
  return <CoursePageClient course={course as Course} />;
}

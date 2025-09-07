import RenderCourseList from "./renderCourseList";
import { fetchCoursesFromApi } from "@/lib/utils";

export default async function CoursesPage() {
  const courses = await fetchCoursesFromApi();
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <RenderCourseList courses={courses} />
          </div>
        </div>
      </div>
    </div>
  );
}

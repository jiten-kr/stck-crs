"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/lib/types";
import { PlayCircle, Radio } from "lucide-react";
import RenderCourseList from "./renderCourseList";

type CoursesTabsProps = {
  liveCourses: Course[];
  prerecordedCourses: Course[];
};

export default function CoursesTabs({
  liveCourses,
  prerecordedCourses,
}: CoursesTabsProps) {
  return (
    <Tabs defaultValue="live" className="w-full">
      <TabsList
        className="mx-auto grid h-12 w-full max-w-lg grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-gray-600 shadow-inner sm:h-14 sm:max-w-xl"
        aria-label="Course format"
      >
        <TabsTrigger
          value="live"
          className="flex items-center justify-center rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 sm:text-base"
        >
          <Radio className="mr-2 hidden h-4 w-4 sm:inline" aria-hidden />
          Live
        </TabsTrigger>
        <TabsTrigger
          value="prerecorded"
          className="flex items-center justify-center rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-purple-800 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 sm:text-base"
        >
          <PlayCircle className="mr-2 hidden h-4 w-4 sm:inline" aria-hidden />
          Pre-recorded
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="live"
        className="mt-8 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <RenderCourseList
          embedded
          format="live"
          courses={liveCourses}
          title="Live courses"
          description="Join scheduled sessions, ask questions live, and learn alongside others — shown below with the blue Live label."
        />
      </TabsContent>

      <TabsContent
        value="prerecorded"
        className="mt-8 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <RenderCourseList
          embedded
          format="prerecorded"
          courses={prerecordedCourses}
          title="Pre-recorded courses"
          description="Structured lessons you watch on your schedule — marked with the purple Pre-recorded label. New titles open for enrollment soon."
          disableCta
          badgeText="Coming Soon"
        />
      </TabsContent>
    </Tabs>
  );
}

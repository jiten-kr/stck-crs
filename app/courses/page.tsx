import RenderCourseList from "./renderCourseList";
import { fetchCoursesFromApi } from "@/lib/utils";
import { Course } from "@/lib/types";

const upcomingCourses: Course[] = [
  {
    id: 1001,
    title: "Options Trading Mastery",
    description:
      "Learn advanced options strategies with real-world risk management.",
    price: 0,
    duration: "6 weeks",
    level: "Intermediate",
    category: "Options",
    tags: ["options", "strategies", "risk"],
    image: "/placeholder.svg",
    instructor: {
      id: 501,
      name: "Vikram Desai",
      bio: "Options specialist focused on risk-adjusted strategies.",
      image: "/placeholder.svg",
      title: "Senior Options Strategist",
      courses: 4,
      students: 1200,
      rating: 4.8,
    },
    rating: 0,
    reviewCount: 0,
    students: 0,
    updatedAt: "2026-02-01",
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

export default async function CoursesPage() {
  const courses = await fetchCoursesFromApi();
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {/* <RenderCourseList courses={courses} /> */}
            <RenderCourseList
              courses={upcomingCourses}
              title="Upcoming Courses"
              description="A sneak peek at what is coming next in our course pipeline."
              disableCta
              badgeText="Coming Soon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

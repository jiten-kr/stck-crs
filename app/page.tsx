import FeatureCarousel from "@/components/feature-carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { courses, categories } from "@/lib/data";
import RenderCourseList from "./courses/renderCourseList";

export default function HomePage() {
  // Get featured courses (first 3)
  const featuredCourses = courses.slice(0, 3);
  const studentReviews = [
    {
      id: "s1a2b3",
      name: "Rahul Sharma",
      rating: 5,
      review:
        "An excellent course for beginners! The concepts were explained clearly, and the real-life examples helped a lot.",
      date: "2024-03-10",
    },
    {
      id: "t4c5d6",
      name: "Priya Mehta",
      rating: 4,
      review:
        "Good content and well-structured. However, I would have liked more advanced trading strategies.",
      date: "2024-03-12",
    },
    {
      id: "u7e8f9",
      name: "Amit Verma",
      rating: 5,
      review:
        "This course gave me the confidence to start trading. The risk management section was particularly useful!",
      date: "2024-03-15",
    },
    {
      id: "v1g2h3",
      name: "Sneha Roy",
      rating: 4.5,
      review:
        "Very informative! I appreciated the section on technical analysis, but I wish there were more case studies.",
      date: "2024-03-18",
    },
    {
      id: "w4i5j6",
      name: "Deepak Singh",
      rating: 3.5,
      review:
        "The course is good, but the pace was a bit fast for me. More practice exercises would be helpful.",
      date: "2024-03-20",
    },
    {
      id: "x7k8l9",
      name: "Anjali Gupta",
      rating: 5,
      review:
        "Loved the course! The instructor explained everything in a simple manner. Highly recommended!",
      date: "2024-03-22",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Master the Markets with Confidence
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Our expert-led video courses teach you proven strategies to
                succeed in the stock market. Start your journey to financial
                freedom today.
              </p>
            </div>
            <div className="w-full">
              <FeatureCarousel className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}

      <RenderCourseList courses={featuredCourses} />

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                What Our Students Say
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our community of learners
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
            {studentReviews.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-base">
                        {student.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {student.review}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

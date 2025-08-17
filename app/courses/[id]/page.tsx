"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"

import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { courses } from "@/lib/data";
import { useCart } from "@/components/cart-provider";
import {
  Star,
  Users,
  Clock,
  CheckCircle,
  Award,
  BarChart,
  ShoppingCart,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function CoursePage() {
  const { user, isAuthenticated, } = useSelector((state: RootState) => state.auth)
  const courseId = useParams()?.id;
  const purchasedCourses = user?.hasPaidFor?.courseIds || [];

  // const isPurchased = purchasedCourses.some((course) => course === courseId);
  const isPurchased = true;
  console.log("courseId", courseId, "purchasedCourses", purchasedCourses);
  console.log("isPurchased", isPurchased);

  const params = useParams();
    const router = useRouter()
  
  const course = courses.find((c) => c.id === params?.id);
  const { addItem, isInCart, clearCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  if (!course) {
    notFound();
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem(course);
      setIsAdding(false);
    }, 500);
  };

  const buyNow = () => {
    clearCart()
    addItem(course);
    setTimeout(() => {
      router.push("/checkout");
    }
    , 2000);
  };

  const playNow = () => {
    router.push(`/courses/${courseId}/play`);
  }

  const isAlreadyInCart = isInCart(course.id);
  const learningOutcomes = [
    { id: "a1b2c3", outcome: "Learning outcome 1" },
    { id: "d4e5f6", outcome: "Learning outcome 2" },
    { id: "g7h8i9", outcome: "Learning outcome 3" },
    { id: "j1k2l3", outcome: "Learning outcome 4" },
    { id: "m4n5o6", outcome: "Learning outcome 5" },
    { id: "p7q8r9", outcome: "Learning outcome 6" },
    { id: "s1t2u3", outcome: "Learning outcome 7" },
  ];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground">
                  ({course.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-5 w-5" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-5 w-5" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-5 w-5" />
                <span>Last updated {course.updatedAt}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  What You'll Learn
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {learningOutcomes.map((o) => (
                    <li key={o.id} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>{o.outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Course Description
                </h3>
                <div className="space-y-4">
                  <p>{course.description}</p>
                  <p>
                    This comprehensive course is designed for anyone who wants
                    to learn {course.category.toLowerCase()}. Whether you're a
                    beginner or looking to refresh your skills, this course
                    provides all the tools and knowledge you need to succeed.
                  </p>
                  <p>
                    By the end of this course, you'll have a solid understanding
                    of {course.category.toLowerCase()} concepts and be able to
                    apply them in real-world scenarios.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    No prior knowledge required - we'll start from the basics
                  </li>
                  <li>A computer with internet access</li>
                  <li>Willingness to learn and practice</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  {course.curriculum.reduce(
                    (total, section) => total + section.lessons.length,
                    0
                  )}{" "}
                  lessons • {course.duration} total length
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {course.curriculum.map((section, i) => (
                    <AccordionItem key={i} value={`section-${i}`}>
                      <AccordionTrigger className="text-base">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {section.lessons.map((lesson, j) => (
                            <li
                              key={j}
                              className="flex items-center justify-between py-2 border-b"
                            >
                              <div className="flex items-center gap-2">
                                <span>{j + 1}.</span>
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6 mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden">
                    <Image
                      src={course.instructor.image || "/placeholder.svg"}
                      alt={course.instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold">
                    {course.instructor.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {course.instructor.title}
                  </p>

                  <div className="flex flex-wrap gap-4 my-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span>{course.instructor.rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5" />
                      <span>
                        {course.instructor.students.toLocaleString()} Students
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-5 w-5" />
                      <span>{course.instructor.courses} Courses</span>
                    </div>
                  </div>

                  <p className="mt-4">{course.instructor.bio}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <div className="relative h-48">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="flex items-center justify-between">
                  {course.discountedPrice ? (
                    <>
                      <span className="text-2xl">
                        ${course.discountedPrice}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        ${course.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl">${course.price}</span>
                  )}
                </CardTitle>
                {course.discountedPrice && (
                  <CardDescription>
                    {Math.round(
                      (1 - course.discountedPrice / course.price) * 100
                    )}
                    % off
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            {!isPurchased && <CardContent className="space-y-4">
              {isAlreadyInCart ? (
                <Button className="w-full" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Go to Cart
                  </Link>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    "Adding to Cart..."
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}

              <Button variant="outline" onClick={buyNow} className="w-full">
                Buy Now
              </Button>

              <div className="text-sm text-muted-foreground text-center">
                30-Day Money-Back Guarantee
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{course?.duration} of on-demand video</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Access on mobile and TV</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </CardContent>}
            {isPurchased && <CardContent className="space-y-4">


              <Button variant="outline" onClick={playNow} className="w-full">
                Play
              </Button>


            </CardContent>}
          </Card>
        </div>
      </div>
    </div>
  );
}

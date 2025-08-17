import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Clock } from "lucide-react"
import { Course } from "@/lib/types"

export default function RenderCourseList({ courses }: { courses: Course[] }) {
  return (
    <section className="w-full py-12 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Explore Our Courses</h1>
          {/* <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Courses</h2> */}

          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover our most popular courses chosen by thousands of students
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">

            {courses.map((course) => (              
              <Card key={course.id} className="flex flex-col overflow-hidden" >
                <Link href={`/courses/${course.id}`}>
                <div className="relative h-48" >
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                </div>
                </Link>
                <Link href={`/courses/${course.id}`}>
                <CardHeader className="flex-1">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription>{course.instructor.name}</CardDescription>
                  </div>
                </CardHeader>
                </Link>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span>{course.rating}</span>
                      <span className="text-muted-foreground">({course.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {course.discountedPrice ? (
                      <>
                        <span className="font-bold">${course.discountedPrice}</span>
                        <span className="text-sm text-muted-foreground line-through">${course.price}</span>
                      </>
                    ) : (
                      <span className="font-bold">${course.price}</span>
                    )}
                  </div>
                  <Button asChild>
                    <Link href={`/courses/${course.id}`}>View Course</Link>                  
                  </Button>
                </CardFooter>
              </Card>
              
            ))}
          </div>
        </div>
      </section>
  );
}

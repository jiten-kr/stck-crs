import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, BookOpen, Award } from "lucide-react"

export default function CoursePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Stock Market Mastery Course
              </h1>
              <p className="text-muted-foreground md:text-xl">
                A comprehensive program designed to take you from beginner to confident trader with proven strategies
                and expert guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">40+ Hours of Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">12 Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Certificate of Completion</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/pricing">Enroll Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/course/sample">Free Sample Lesson</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=600" alt="Course preview" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Course Overview</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to know to succeed in the stock market
              </p>
            </div>
          </div>

          <Tabs defaultValue="beginner" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="beginner" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Beginner Level</CardTitle>
                  <CardDescription>Perfect for those new to stock market investing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Stock Market Fundamentals",
                        "Understanding Market Terminology",
                        "Setting Up Your Trading Account",
                        "Basic Chart Reading",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="intermediate" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Intermediate Level</CardTitle>
                  <CardDescription>For those with basic knowledge looking to enhance their skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Technical Analysis Strategies",
                        "Fundamental Analysis Deep Dive",
                        "Risk Management Techniques",
                        "Portfolio Diversification",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advanced" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Level</CardTitle>
                  <CardDescription>Advanced strategies for experienced traders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Advanced Chart Patterns",
                        "Options Trading Strategies",
                        "Algorithmic Trading Basics",
                        "Market Psychology Mastery",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Course Curriculum</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A detailed breakdown of what you'll learn
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {[
              {
                module: "Module 1: Introduction to Stock Markets",
                lessons: ["What are Stocks?", "How Stock Markets Work", "Key Market Participants", "Types of Markets"],
              },
              {
                module: "Module 2: Getting Started with Trading",
                lessons: [
                  "Choosing a Broker",
                  "Setting Up Your Trading Account",
                  "Understanding Order Types",
                  "Creating Your First Watchlist",
                ],
              },
              {
                module: "Module 3: Technical Analysis Fundamentals",
                lessons: [
                  "Chart Types and Timeframes",
                  "Support and Resistance",
                  "Trend Lines",
                  "Key Technical Indicators",
                ],
              },
            ].map((module, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{module.module}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Preview Module
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">And 9 more modules covering advanced topics and strategies</p>
            <Button asChild size="lg">
              <Link href="/pricing">Enroll Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


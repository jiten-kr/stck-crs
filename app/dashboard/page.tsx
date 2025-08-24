"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle, Clock, Play, User } from "lucide-react";

export default function DashboardPage() {
  const [progress, setProgress] = useState(35);

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Continue your learning journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Course Progress
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress}%</div>
              <Progress value={progress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                4 of 12 modules completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Learning Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12h 30m</div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Achievements
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-2">
                Badges earned
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Module</TabsTrigger>
            <TabsTrigger value="all">All Modules</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Analysis Fundamentals</CardTitle>
                <CardDescription>
                  Learn to read charts and identify key patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-[200px] rounded-md overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=600"
                    alt="Technical Analysis"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="icon" className="h-12 w-12 rounded-full">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 rounded-md border p-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Lesson 1: Introduction to Charts
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border p-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Lesson 2: Support and Resistance
                      </p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border p-3 bg-muted">
                    <div className="h-5 w-5 rounded-full border-2 border-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Lesson 3: Trend Lines</p>
                      <p className="text-sm text-muted-foreground">
                        In progress
                      </p>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border p-3">
                    <div className="h-5 w-5 rounded-full border-2" />
                    <div className="flex-1">
                      <p className="font-medium">Lesson 4: Chart Patterns</p>
                      <p className="text-sm text-muted-foreground">
                        Not started
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue Learning</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Introduction to Stock Markets",
                  progress: 100,
                  lessons: 4,
                  completed: true,
                },
                {
                  title: "Getting Started with Trading",
                  progress: 100,
                  lessons: 4,
                  completed: true,
                },
                {
                  title: "Technical Analysis Fundamentals",
                  progress: 60,
                  lessons: 5,
                  completed: false,
                },
                {
                  title: "Fundamental Analysis",
                  progress: 0,
                  lessons: 4,
                  completed: false,
                },
                {
                  title: "Risk Management",
                  progress: 0,
                  lessons: 3,
                  completed: false,
                },
                {
                  title: "Trading Psychology",
                  progress: 0,
                  lessons: 4,
                  completed: false,
                },
              ].map((module, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} />
                    <p className="text-xs text-muted-foreground">
                      {module.lessons} lessons
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={module.completed ? "outline" : "default"}
                    >
                      {module.completed
                        ? "Review"
                        : module.progress > 0
                        ? "Continue"
                        : "Start"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Introduction to Stock Markets",
                  progress: 100,
                  lessons: 4,
                  completed: true,
                },
                {
                  title: "Getting Started with Trading",
                  progress: 100,
                  lessons: 4,
                  completed: true,
                },
              ].map((module, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} />
                    <p className="text-xs text-muted-foreground">
                      {module.lessons} lessons
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

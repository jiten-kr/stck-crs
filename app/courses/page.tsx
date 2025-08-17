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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { courses, categories } from "@/lib/data";
import { Star, Users, Clock, Search } from "lucide-react";
import RenderCourseList from "./renderCourseList";

export default function CoursesPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        {/* <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-muted-foreground">Browse our collection of expert-led courses</p>
        </div> */}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          {/* <div className="w-full md:w-64 space-y-6"> */}
          {/* <div className="space-y-4">
              <h3 className="font-medium">Search</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search courses..." className="pl-8" />
              </div>
            </div> */}

          {/* <div className="space-y-4">
              <h3 className="font-medium">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox id={category.id} />
                    <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                      {category.name} ({category.count})
                    </Label>
                  </div>
                ))}
              </div>
            </div> */}

          {/* <div className="space-y-4">
              <h3 className="font-medium">Level</h3>
              <div className="space-y-2">
                {["Beginner", "Intermediate", "Advanced", "All Levels"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox id={`level-${level}`} />
                    <Label htmlFor={`level-${level}`} className="text-sm font-normal cursor-pointer">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div> */}

          {/* <div className="space-y-4">
              <h3 className="font-medium">Price</h3>
              <div className="space-y-2">
                {["Free", "Paid", "Discounted"].map((price) => (
                  <div key={price} className="flex items-center space-x-2">
                    <Checkbox id={`price-${price}`} />
                    <Label htmlFor={`price-${price}`} className="text-sm font-normal cursor-pointer">
                      {price}
                    </Label>
                  </div>
                ))}
              </div>
            </div> */}

          {/* <Button variant="outline" className="w-full">
              Reset Filters
            </Button> */}
          {/* </div> */}

          {/* Course Grid */}
          <div className="flex-1">
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-muted-foreground">{courses.length} courses found</p>
              <Select defaultValue="popular">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

      <RenderCourseList courses={courses} />

          </div>
        </div>
      </div>
    </div>
  );
}

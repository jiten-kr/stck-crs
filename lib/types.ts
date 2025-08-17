export type Course = {
  id: string
  title: string
  description: string
  price: number
  discountedPrice?: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  category: string
  tags: string[]
  image: string
  instructor: Instructor
  rating: number
  reviewCount: number
  students: number
  updatedAt: string
  curriculum: CurriculumSection[]
}

export type Instructor = {
  id: string
  name: string
  bio: string
  image: string
  title: string
  courses: number
  students: number
  rating: number
}

export type CurriculumSection = {
  title: string
  lessons: Lesson[]
}

export type Lesson = {
  title: string
  duration: string
}

export type Order = {
  id: string
  date: string
  courses: Course[]
  total: number
  status: "completed" | "processing" | "refunded"
}

export type User = {
  id: string
  name: string
  email: string
  image?: string
}


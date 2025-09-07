export type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  tags: string[];
  image: string;
  instructor: Instructor;
  rating: number;
  reviewCount: number;
  students: number;
  updatedAt: string;
  curriculum: CurriculumSection[];
};

export type Instructor = {
  id: string;
  name: string;
  bio: string;
  image: string;
  title: string;
  courses: number;
  students: number;
  rating: number;
};

export type CurriculumSection = {
  title: string;
  lessons: Lesson[];
};

export type Lesson = {
  title: string;
  duration: string;
};

export type Order = {
  id: string;
  date: string;
  courses: Course[];
  total: number;
  status: "completed" | "processing" | "refunded";
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "student" | "instructor" | "admin";
  created_at: Date;
  updated_at: Date;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "student" | "instructor" | "admin";
  created_at: Date;
  updated_at: Date;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    hasPaidFor: {
      courseIds: number[];
    };
  };
};

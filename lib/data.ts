import type { Course, Instructor, Order } from "./types";

export const instructors: Instructor[] = [
  {
    id: 1,
    name: "Mr. Mayank Kumar",
    bio: "Experienced Stock Market Trainer with 10+ years of expertise in trading and investment strategies.",
    image: "/placeholder.svg?height=200&width=200&text=SJ",
    title: "Stock Market Expert",
    courses: 1,
    students: 1296,
    rating: 4.8,
  },
];

export const courses: Course[] = [
  {
    id: 1,
    title: "Stock Market Investing for Beginners",
    description:
      "Learn the basics of stock market investing, including how to analyze stocks, manage risks, and build a diversified portfolio.",
    price: 99.99,
    discountedPrice: 79.99,
    duration: "30 hours",
    level: "Beginner",
    category: "Stock Market",
    tags: ["Investing", "Stocks", "Finance"],
    image: "/placeholder.svg?height=400&width=600&text=Investing",
    instructor: instructors[0],
    rating: 4.7,
    reviewCount: 3500,
    students: 10000,
    updatedAt: "2024-02-10",
    curriculum: [
      {
        title: "Introduction to Stock Market",
        lessons: [
          { title: "What is the Stock Market?", duration: "15 min" },
          { title: "How Stocks Work", duration: "20 min" },
          { title: "Understanding Stock Exchanges", duration: "25 min" },
        ],
      },
      {
        title: "Investing Strategies",
        lessons: [
          { title: "Value vs Growth Investing", duration: "40 min" },
          { title: "Technical vs Fundamental Analysis", duration: "45 min" },
          { title: "Building a Diversified Portfolio", duration: "50 min" },
        ],
      },
      {
        title: "Risk Management",
        lessons: [
          { title: "Managing Market Volatility", duration: "35 min" },
          { title: "Stop Loss and Take Profit Strategies", duration: "40 min" },
          { title: "Psychology of Trading", duration: "50 min" },
        ],
      },
    ],
  },
];

export const sampleOrders: Order[] = [
  {
    id: "order-1",
    date: "2023-12-15",
    courses: [courses[0], courses[2]],
    total: 204.98,
    status: "completed",
  },
  {
    id: "order-2",
    date: "2023-11-28",
    courses: [courses[1]],
    total: 109.99,
    status: "completed",
  },
  {
    id: "order-3",
    date: "2023-10-05",
    courses: [courses[4], courses[5]],
    total: 249.98,
    status: "completed",
  },
];

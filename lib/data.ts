import type { Course, Instructor, Order } from "./types";

export const instructors: Instructor[] = [
  {
    id: "inst-1",
    name: "Dr. Sarah Johnson",
    bio: "Dr. Sarah Johnson is a renowned data scientist with over 10 years of experience in machine learning and AI. She has worked with major tech companies and has published numerous research papers.",
    image: "/placeholder.svg?height=200&width=200&text=SJ",
    title: "Data Science Expert",
    courses: 12,
    students: 15000,
    rating: 4.8,
  },
  {
    id: "inst-2",
    name: "Michael Chen",
    bio: "Michael is a full-stack developer with expertise in modern web technologies. He has built numerous web applications and has been teaching programming for over 8 years.",
    image: "/placeholder.svg?height=200&width=200&text=MC",
    title: "Senior Web Developer",
    courses: 8,
    students: 12000,
    rating: 4.7,
  },
  {
    id: "inst-3",
    name: "Emily Rodriguez",
    bio: "Emily is a certified business coach with an MBA from Harvard. She specializes in entrepreneurship and has helped hundreds of startups scale their businesses.",
    image: "/placeholder.svg?height=200&width=200&text=ER",
    title: "Business Strategy Coach",
    courses: 5,
    students: 8000,
    rating: 4.9,
  },
  {
    id: "inst-4",
    name: "James Wilson",
    bio: "James is a digital marketing specialist with experience working at top advertising agencies. He is an expert in SEO, content marketing, and social media strategy.",
    image: "/placeholder.svg?height=200&width=200&text=JW",
    title: "Digital Marketing Specialist",
    courses: 7,
    students: 10000,
    rating: 4.6,
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
  {
    id: 2,
    title: "Advanced Technical Analysis for Trading",
    description:
      "Master the art of technical analysis to make informed trading decisions using chart patterns, indicators, and market trends.",
    price: 119.99,
    discountedPrice: 99.99,
    duration: "35 hours",
    level: "Intermediate",
    category: "Stock Market",
    tags: ["Trading", "Technical Analysis", "Stocks"],
    image: "/placeholder.svg?height=400&width=600&text=TechnicalAnalysis",
    instructor: instructors[1],
    rating: 4.8,
    reviewCount: 4000,
    students: 12000,
    updatedAt: "2024-02-20",
    curriculum: [
      {
        title: "Technical Indicators",
        lessons: [
          { title: "Moving Averages", duration: "30 min" },
          { title: "Relative Strength Index (RSI)", duration: "40 min" },
          { title: "MACD and Bollinger Bands", duration: "50 min" },
        ],
      },
      {
        title: "Chart Patterns",
        lessons: [
          { title: "Head and Shoulders", duration: "35 min" },
          { title: "Triangles and Flags", duration: "40 min" },
          { title: "Support and Resistance Levels", duration: "45 min" },
        ],
      },
      {
        title: "Trading Strategies",
        lessons: [
          { title: "Day Trading vs Swing Trading", duration: "50 min" },
          { title: "Breakout and Reversal Strategies", duration: "55 min" },
          { title: "Risk-Reward Ratio", duration: "60 min" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Options Trading Mastery",
    description:
      "Learn how to trade options like a pro with in-depth strategies covering calls, puts, spreads, and risk management.",
    price: 139.99,
    discountedPrice: 119.99,
    duration: "40 hours",
    level: "Advanced",
    category: "Stock Market",
    tags: ["Options Trading", "Derivatives", "Risk Management"],
    image: "/placeholder.svg?height=400&width=600&text=OptionsTrading",
    instructor: instructors[2],
    rating: 4.9,
    reviewCount: 5000,
    students: 9000,
    updatedAt: "2024-02-25",
    curriculum: [
      {
        title: "Options Basics",
        lessons: [
          { title: "What are Options?", duration: "20 min" },
          { title: "Calls vs Puts", duration: "30 min" },
          { title: "Option Pricing Factors", duration: "40 min" },
        ],
      },
      {
        title: "Options Strategies",
        lessons: [
          { title: "Covered Calls and Protective Puts", duration: "45 min" },
          { title: "Straddles and Strangles", duration: "50 min" },
          { title: "Iron Condors and Butterflies", duration: "60 min" },
        ],
      },
      {
        title: "Risk Management in Options",
        lessons: [
          { title: "Hedging Strategies", duration: "40 min" },
          { title: "Understanding Implied Volatility", duration: "50 min" },
          { title: "Greeks in Options Trading", duration: "55 min" },
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

export const categories = [
  { id: "cat-1", name: "Programming", count: 15 },
  { id: "cat-2", name: "Data Science", count: 12 },
  { id: "cat-3", name: "Business", count: 8 },
  { id: "cat-4", name: "Marketing", count: 10 },
  { id: "cat-5", name: "Design", count: 7 },
  { id: "cat-6", name: "Personal Development", count: 9 },
];

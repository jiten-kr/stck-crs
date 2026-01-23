import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LEARNERS_COUNT } from "@/lib/constants";
import {
  GraduationCap,
  Users,
  Target,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Brain,
  Coins,
  BookOpen,
  MessageCircle,
  Video,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Radio,
  Clock,
  Layers,
} from "lucide-react";

import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Learn Stock Market & Crypto Trading | Live Classes & Courses",
  description:
    "MayankFin helps beginners learn stock market and crypto trading through live instructor-led classes and structured pre-recorded courses. Practical, beginner-friendly, and trusted learning.",

  keywords: [
    "stock market learning",
    "crypto trading education",
    "learn trading online",
    "stock market courses",
    "crypto courses",
    "live trading classes",
    "trading for beginners india",
    "online trading education",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Stock Market & Crypto Trading Education",
    description:
      "Learn stock market and crypto trading with live classes and self-paced courses. Designed for beginners with a practical, structured approach.",
    url: "https://mayankfin.com",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin - Stock Market & Crypto Trading Education",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Learn Stock Market & Crypto Trading",
    description:
      "Beginner-friendly stock market & crypto trading education with live classes and structured courses.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "education",
};


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Learn Stock Market & Crypto Trading{" "}
              <span className="text-blue-600">the Right Way</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Live instructor-led classes and self-paced courses with real
              strategies, structured learning, and a beginner-friendly approach.
              No hype, just practical knowledge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
              >
                <Link href="/live-trading-class">
                  Join Live Trading Class
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold"
              >
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="w-full bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Choose the learning format that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Live Trading Classes Card */}
            <Card className="border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Radio className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      Live
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      Live Trading Classes
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-5">
                  Interactive, instructor-led live trading classes with real
                  market examples, Q&A, and structured guidance.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Live sessions with real-time interaction
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Real market walkthroughs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Beginner-friendly approach
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/live-trading-class">
                    Join Live Class
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pre-Recorded Courses Card */}
            <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                      Self-Paced
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      Pre-Recorded Courses
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-5">
                  Self-paced stock market and crypto courses designed to build
                  strong fundamentals at your own speed.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Lifetime access
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Structured modules
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <GraduationCap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Ideal for beginners
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="w-full bg-slate-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Why Learn With Us?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A structured, practical approach to market education.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Live Sessions
                </h3>
                <p className="text-sm text-gray-600">
                  Learn in real-time with interactive instructor-led classes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Practical Strategies
                </h3>
                <p className="text-sm text-gray-600">
                  Real market techniques you can apply immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Beginner Friendly
                </h3>
                <p className="text-sm text-gray-600">
                  Structured learning from basics to advanced concepts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Small Batches
                </h3>
                <p className="text-sm text-gray-600">
                  Limited seats for focused, personalized attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Will Learn Section */}
      <section className="w-full bg-slate-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              What You Will Learn
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Build a strong foundation in trading and investing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Stock Market Fundamentals
                  </h3>
                  <p className="text-sm text-gray-600">
                    Understand how markets work, key terminology, and market
                    structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Technical Analysis
                  </h3>
                  <p className="text-sm text-gray-600">
                    Read charts, identify patterns, and time your entries
                    effectively.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Risk Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Protect your capital with proper stop-loss and position
                    sizing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Coins className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Crypto Market Basics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Navigate crypto markets with the same disciplined approach.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Trading Psychology
                  </h3>
                  <p className="text-sm text-gray-600">
                    Control emotions, avoid FOMO, and build consistency.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Entry & Exit Strategies
                  </h3>
                  <p className="text-sm text-gray-600">
                    Learn when to enter, when to exit, and how to set targets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="w-full bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Who This Is For
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Our courses are designed for anyone serious about learning to
              trade.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Beginner Traders
                </h3>
                <p className="text-sm text-gray-600">
                  New to trading? Start with the right foundation and avoid
                  costly mistakes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Working Professionals
                </h3>
                <p className="text-sm text-gray-600">
                  Learn practical skills that fit your schedule and help you
                  make informed decisions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Stock & Crypto Enthusiasts
                </h3>
                <p className="text-sm text-gray-600">
                  Turn your interest into structured knowledge with a
                  rules-based approach.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Anyone Seeking Financial Education
                </h3>
                <p className="text-sm text-gray-600">
                  Gain clarity on how markets work and how to participate
                  responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Signals Section */}
      <section className="w-full bg-blue-600 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-blue-200" />
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {LEARNERS_COUNT}
                </span>
              </div>
              <p className="text-blue-100">Learners Trained</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-200" />
                <span className="text-3xl md:text-4xl font-bold text-white">
                  Live
                </span>
              </div>
              <p className="text-blue-100">Q&A in Every Session</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Video className="w-6 h-6 text-blue-200" />
                <span className="text-3xl md:text-4xl font-bold text-white">
                  100%
                </span>
              </div>
              <p className="text-blue-100">Live Instruction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full bg-slate-50 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-gray-600 text-lg">
              Join a live trading class for real-time learning or explore our
              self-paced courses. No fluff, just actionable knowledge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold"
              >
                <Link href="/live-trading-class">
                  Join Live Trading Class
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-10 py-6 text-lg font-semibold"
              >
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart3,
  Hash,
  Laptop,
  Gift,
  GraduationCap,
  Star,
  Users,
  PieChart,
  FileText,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Content */}
            <div className="flex flex-col space-y-6 md:space-y-8 order-2 lg:order-1">
              {/* Main Headline */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
                  Unlock the Secrets of Stock Selection From A{" "}
                  <span className="text-blue-600">Professional</span>{" "}
                  <span className="text-blue-600">Stock Trader</span>
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Unleash the Power of Smart Money Tools to Identify and Catch
                  Big Institutional Moves
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-col space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-base md:text-lg text-blue-600 font-medium">
                    Catch Big Monster Moves Everyday
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-base md:text-lg text-blue-600 font-medium">
                    Enter Before The Breakouts
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-base md:text-lg text-blue-600 font-medium">
                    Beginner Friendly
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  asChild
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-8 py-6 md:py-7 rounded-lg font-semibold"
                >
                  <Link href="/courses">Learn at ₹49</Link>
                </Button>
                <p className="text-sm text-gray-600">
                  (Take only 50 people in one batch)
                </p>
              </div>
            </div>

            {/* Right Section - Instructor */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Background Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-2 border-gray-200 opacity-30"></div>
                  <div className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border-2 border-gray-200 opacity-30"></div>
                </div>

                {/* Instructor Image Placeholder */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl">
                    <Users className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-white" />
                  </div>

                  {/* Social Proof Cards */}
                  <div className="absolute -top-4 -right-4 md:-right-8 lg:-right-12">
                    <Card className="bg-white border-2 border-blue-500 shadow-lg p-2 md:p-3">
                      <CardContent className="p-0 flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <span className="text-xs md:text-sm font-semibold text-gray-800">
                          2L+ Student Enrolled
                        </span>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Name and Title */}
                  <div className="mt-6 md:mt-8 bg-blue-600 rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-xl w-full max-w-xs">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white text-center">
                      Mayank Kumar
                    </h3>
                    {/* <p className="text-xs md:text-sm lg:text-base text-white/90 text-center mt-1">
                      Founder & CEO, Stockwiz Technologies
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What will you Learn Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {/* Section Title */}
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              What will you Learn?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
          </div>

          {/* Learning Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1: Introduction To Institutional Trading Strategies */}
            <Card className="group bg-white border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col h-full hover:shadow-xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                  Introduction To Institutional Trading Strategies
                </h3>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Understand why, how and when stocks make big moves
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Build your foundation with concepts such as liquidity and
                      market structure
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 2: Relative Strength Analysis */}
            <Card className="group bg-white border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col h-full hover:shadow-xl hover:border-green-500 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex justify-center mb-6 relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <PieChart className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-green-600 absolute top-2 right-[30%] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-green-600 transition-colors">
                  Relative Strength Analysis
                </h3>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Learn how trading relatively stronger stocks can optimize
                      your trading strategies
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Use fundamental catalysts and sector rotation tools to
                      skyrocket your performance
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 3: Building A Game Plan */}
            <Card className="group bg-white border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col h-full hover:shadow-xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-purple-600 transition-colors">
                  Building A Game Plan
                </h3>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Understand the three step framework to build a winning
                      watchlist in minutes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Leverage the power of data and artificial intelligence to
                      master trade management
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Card 4: Case Studies & Examples */}
            <Card className="group bg-white border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col h-full hover:shadow-xl hover:border-orange-500 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-orange-600 transition-colors">
                  Case Studies & Examples
                </h3>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Learn hands on with 10+ case studies backed with Verified
                      P&L
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Get access to pre built watchlists, scanners and screeners
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who is this Masterclass for Section */}
      <section className="w-full bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Who is this Masterclass for?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for individuals ready to transform their trading journey
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Card 1: Traders */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
              <Card className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 h-full flex flex-col group-hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Traders
                      </h3>
                      <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed flex-1">
                    Beginner, intermediate and professional traders who are
                    looking to level up their trading game and become a super
                    trader.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Card 2: Investors */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-20"></div>
              <Card className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 h-full flex flex-col group-hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Investors
                      </h3>
                      <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed flex-1">
                    First time or seasoned investors who are looking to
                    outperform their portfolio returns with superior tools and
                    techniques.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Card 3: Learners */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
              <Card className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 h-full flex flex-col group-hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Learners
                      </h3>
                      <div className="w-12 h-1 bg-violet-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed flex-1">
                    Working professionals, home makers or students who are
                    looking to venture into stock trading to create active and
                    passive source of income.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

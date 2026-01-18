"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Hash,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Users,
  PieChart,
  FileText,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";

export default function HomePage() {
  const [showStickyCta, setShowStickyCta] = useState(false);

  const handleClick = () => {
    alert("Button clicked");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setShowStickyCta(progress >= 0.6);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                  Trade With Rules, {" "}
                  <span className="text-blue-600">Not</span>{" "}
                  <span className="text-blue-600">Emotions</span>
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">

                  Most traders don’t lose money because of the market. They lose because they enter without a plan, hesitate to book losses, move stop-loss emotionally, and exit profitable trades too early.
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-col space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-base md:text-lg text-blue-600 font-medium">
                    A Practical Masterclass on Entry, Stop-Loss & 1:5 Risk-Reward
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-base md:text-lg text-blue-600 font-medium">
                    Catch Big Monster Moves with Rules
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
                  onClick={handleClick}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-8 py-6 md:py-7 rounded-lg font-semibold"
                >
                  Join Live Class for ₹49
                </Button>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-gray-600">

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Small-batch focus (21 seats)</span>
                  </div>
                </div>
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
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              This masterclass is built from real market experience, not theory.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Proper Entry Strategy
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    How to identify high-probability entries
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    When not to enter (most important rule)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Avoid chasing and FOMO trades
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Stop-Loss That Actually Works
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Logical stop-loss placement (not random points)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    How to protect capital first, profits second
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Why most stop-losses fail—and how to fix it
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Target Setting Like a Pro
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    How to define targets before entering a trade
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Holding winners instead of exiting early
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Scaling out without destroying risk-reward
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Risk-Reward Ratio: Minimum 1:5
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Why low risk-reward kills accounts
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    How to structure trades for asymmetric returns
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Fewer trades, higher impact results
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Universal Strategy – All Markets
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Same logic for stocks, crypto &amp; commodities
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Market-independent decision making
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Adapt strategy, not emotions
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Trading Psychology &amp; Discipline
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    How to follow rules under pressure
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Eliminate over-trading and revenge trades
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Build consistency, not luck
                  </span>
                </li>
              </ul>
            </div>
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
              Designed for individuals who are ready to trade with structure, discipline, and clarity.
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
                    Beginners, intermediate, and professional traders who want
                    a rules-based system for entries, stop-loss, and targets to
                    trade with confidence.
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
                    First-time or seasoned investors who want a clear framework
                    to time entries, manage risk, and improve overall portfolio
                    performance.
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
                    Working professionals, homemakers, or students who want a
                    simple, repeatable process to build trading skills and
                    create active income.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ease-out ${showStickyCta
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        aria-hidden={!showStickyCta}
      >
        <div className="pointer-events-none">
          <div className="pointer-events-auto px-4 sm:px-6 lg:px-8 pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto w-full max-w-xl md:max-w-2xl">
              <div className="bg-white/95 backdrop-blur border border-gray-200 shadow-lg rounded-xl p-2 md:p-3">
                <Button
                  onClick={handleClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-6 py-5 md:py-6 rounded-lg font-semibold"
                >
                  Join Live Class for ₹49
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

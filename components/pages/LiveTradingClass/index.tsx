"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewsSection, type Review } from "@/components/ui/reviews-section";
import { LEARNERS_COUNT } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    TrendingUp,
    BarChart3,
    Hash,
    ShieldCheck,
    CheckCircle2,
    GraduationCap,
    Users,
} from "lucide-react";

/**
 * Mock reviews data for the live trading class
 * This can be replaced with API data in the future
 */
const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        name: "Rahul S.",
        rating: 5,
        text: "Finally understood how to set proper stop-loss. The 1:5 risk-reward concept changed my trading completely. No more emotional decisions!",
        verified: true,
    },
    {
        id: 2,
        name: "Priya M.",
        rating: 5,
        text: "As a complete beginner, I was worried about keeping up. But Mayank explains everything so clearly. The entry strategies are practical and easy to follow.",
        verified: true,
    },
    {
        id: 3,
        name: "Amit K.",
        rating: 5,
        text: "I've taken many trading courses, but this one stands out. The focus on rules over emotions is exactly what I needed. Highly recommended!",
        verified: true,
    },
    {
        id: 4,
        name: "Sneha R.",
        rating: 4,
        text: "The masterclass helped me understand why my previous trades failed. Now I have a structured approach for every trade I take.",
        verified: true,
    },
    {
        id: 5,
        name: "Vikram D.",
        rating: 5,
        text: "Worth every rupee! The stop-loss placement technique alone has saved me from multiple bad trades. Clear, practical, and actionable.",
        verified: true,
    },
    {
        id: 6,
        name: "Ananya P.",
        rating: 5,
        text: "I love how the strategies work across stocks and crypto. Finally, a system I can apply consistently in any market condition.",
        verified: true,
    },
    {
        id: 7,
        name: "Karthik N.",
        rating: 4,
        text: "The psychology section was eye-opening. I didn't realize how much my emotions were affecting my trading until this class.",
        verified: true,
    },
    {
        id: 8,
        name: "Meera J.",
        rating: 5,
        text: "Small batch size means you actually get your questions answered. Mayank is patient and explains concepts with real examples.",
        verified: true,
    },
    {
        id: 9,
        name: "Arjun T.",
        rating: 5,
        text: "The breakout entry technique is gold. I've already used it successfully in 3 trades this week. This class pays for itself!",
        verified: true,
    },
    {
        id: 10,
        name: "Divya L.",
        rating: 5,
        text: "I was skeptical at first, but Mayank's teaching style is different. He focuses on discipline, not just indicators. Game changer.",
        verified: true,
    },
    {
        id: 11,
        name: "Suresh B.",
        rating: 4,
        text: "Good content for intermediate traders too. The risk management strategies helped me protect my capital during volatile markets.",
        verified: true,
    },
    {
        id: 12,
        name: "Neha G.",
        rating: 5,
        text: "Finally stopped revenge trading after understanding the psychology behind it. The class gave me a clear framework to follow.",
        verified: true,
    },
    {
        id: 13,
        name: "Rajesh P.",
        rating: 5,
        text: "Been trading for 3 years but always struggled with exits. This masterclass fixed that. Now I let my winners run properly.",
        verified: true,
    },
    {
        id: 14,
        name: "Kavitha R.",
        rating: 4,
        text: "Very practical approach. No fancy jargon, just straightforward rules that work. Wish I found this class earlier.",
        verified: true,
    },
    {
        id: 15,
        name: "Manish K.",
        rating: 5,
        text: "The live examples during the class made everything click. Seeing real charts and real decisions being made is invaluable.",
        verified: true,
    },
    {
        id: 16,
        name: "Pooja S.",
        rating: 5,
        text: "As a working professional, I needed a simple system. This class delivered exactly that. Now I trade with confidence in just 30 mins a day.",
        verified: true,
    },
    {
        id: 17,
        name: "Arun V.",
        rating: 5,
        text: "The target-setting module alone is worth the entire fee. I used to exit too early, now I hold for the full move.",
        verified: true,
    },
    {
        id: 18,
        name: "Lakshmi N.",
        rating: 4,
        text: "Good foundation for anyone serious about trading. The emphasis on journaling and reviewing trades is excellent advice.",
        verified: true,
    },
    {
        id: 19,
        name: "Deepak M.",
        rating: 5,
        text: "Mayank's approach to position sizing saved my account. I was risking too much per trade before. Now I sleep peacefully!",
        verified: true,
    },
    {
        id: 20,
        name: "Swati A.",
        rating: 5,
        text: "Best ₹49 I've ever spent. The value you get is incredible. Already recommended this to my friends who trade.",
        verified: true,
    },
    {
        id: 21,
        name: "Nitin H.",
        rating: 4,
        text: "Clear, concise, and no-nonsense teaching. Mayank cuts through the noise and gives you what actually works.",
        verified: true,
    },
    {
        id: 22,
        name: "Rekha D.",
        rating: 5,
        text: "The Q&A session at the end was super helpful. Got all my doubts cleared. Very interactive and engaging class.",
        verified: true,
    },
    {
        id: 23,
        name: "Sanjay C.",
        rating: 5,
        text: "I've blown 2 accounts before finding this class. The risk management rules here would have saved me lakhs. Learn this first!",
        verified: true,
    },
    {
        id: 24,
        name: "Asha W.",
        rating: 5,
        text: "Perfect for housewives like me who want to learn trading. Simple language, practical examples, and supportive community.",
        verified: true,
    },
];

export default function LiveTradingClass() {
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
                        <div className="flex flex-col space-y-6 md:space-y-8 order-1 lg:order-1">
                            {/* Main Headline */}
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
                                    Trade With Rules,{" "}
                                    <span className="text-blue-600">Not</span>{" "}
                                    <span className="text-blue-600">Emotions</span>
                                </h2>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    Most traders don’t lose money because of the market. They lose
                                    because they enter without a plan, hesitate to book losses,
                                    move stop-loss emotionally, and exit profitable trades too
                                    early.
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
                        <div className="relative order-2 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-xl">
                                {/* Background Circles */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] rounded-full border-2 border-gray-200 opacity-30"></div>
                                    <div className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full border-2 border-gray-200 opacity-30"></div>
                                </div>

                                {/* Instructor Photo and Details */}
                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72">
                                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl border-[3px] border-blue-500">
                                            <Image
                                                src="/mayank_feature_img.png"
                                                alt="Mayank Kumar"
                                                fill
                                                priority
                                                sizes="(min-width: 1024px) 18rem, (min-width: 768px) 14rem, 10rem"
                                                className="object-cover object-top"
                                            />
                                        </div>

                                        {/* Social Proof Cards */}
                                        <div className="absolute top-8 left-[85%] z-20 -translate-x-4">
                                            <Card className="bg-white border-2 border-blue-500 shadow-lg p-2 md:p-3 whitespace-nowrap">
                                                <CardContent className="p-0 flex items-center space-x-2">
                                                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                                    <span className="text-xs md:text-sm font-semibold text-gray-800">
                                                        {LEARNERS_COUNT} Students Enrolled
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Name and Title */}
                                    <div className="bg-blue-600 rounded-lg px-6 py-4 shadow-xl text-center">
                                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                                            Mayank Kumar
                                        </h3>
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
                            Designed for individuals who are ready to trade with structure,
                            discipline, and clarity.
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

            {/* Reviews Section */}
            <ReviewsSection
                reviews={MOCK_REVIEWS}
                heading="What Traders Are Saying"
                subheading="Real feedback from students who transformed their trading with our masterclass"
                initialCount={8}
                loadMoreCount={4}
                loadMoreText="Load More Reviews"
                loadingText="Loading reviews..."
            />

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

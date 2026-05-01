"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Script from 'next/script';
import { Card, CardContent } from "@/components/ui/card";
import { ReviewsSection } from "@/components/ui/reviews-section";
import WriteReview from "@/components/reviews/write-review";
import {
    LIVE_TRADING_CLASS_ENROLMENT_COURSE_ID,
    LIVE_TRADING_CLASS_ITEM_ID,
    LIVE_TRADING_CLASS_NAME,
    PLATFORM_NAME,
} from "@/lib/constants";

const ENROLL_CLASS_PRICE_INR = 2;
import { fetchMoreReviews } from "@/lib/utils";
import type { Review, User } from "@/lib/types";
import { ENROLL_CURRICULUM_TOPICS } from "@/lib/courseCurriculum";
import { selectAuthUser, selectIsAuthenticated } from "@/app/auth/authSelector";
import { useRouter } from "next/navigation";
import ContactAuthModal from "@/components/auth/ContactAuthModal";
import InstructorPanel from "@/components/pages/shared/InstructorPanel";
import { setPaymentSuccessData } from "@/lib/paymentSuccessStore";
import { getNextLiveClassSchedule } from "@/lib/notifications/contentBuilder";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import {
    TrendingUp,
    BarChart3,
    Hash,
    ShieldCheck,
    CheckCircle2,
    GraduationCap,
    Users,
    Star,
} from "lucide-react";

type RazorpaySuccessResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

type RazorpayFailureResponse = {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
            order_id: string;
            payment_id: string;
        };
    };
};

type RazorpayOptions = {
    key: string;
    one_click_checkout?: boolean;
    name: string;
    order_id: string;
    show_coupons?: boolean;
    handler: (response: RazorpaySuccessResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: {
        address?: string;
    };
};

type RazorpayInstance = {
    on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
    open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }
}

type ReviewStats = { totalReviews: number; averageRating: number } | null;

type EnrollLiveTradingClassProps = {
    initialReviews: Review[];
    initialTotalReviews: number;
    initialReviewStats: ReviewStats;
};

export default function EnrollLiveTradingClass({
    initialReviews,
    initialTotalReviews,
    initialReviewStats,
}: EnrollLiveTradingClassProps) {
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showStickyCta, setShowStickyCta] = useState(false);
    const heroCtaRef = useRef<HTMLButtonElement>(null);
    const user = useSelector(selectAuthUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const reviews = initialReviews;
    const totalReviews = initialTotalReviews;
    const reviewStats = initialReviewStats;
    const isLoadingReviews = false;
    const classPriceInPaise = ENROLL_CLASS_PRICE_INR * 100;

    const createOrderId = async (userId: number) => {
        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: classPriceInPaise,
                    itemId: LIVE_TRADING_CLASS_ITEM_ID,
                    userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return {
                orderId: data.orderId as string | undefined,
                bookingId: data.bookingId as number | undefined,
            };
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            return null;
        }
    };

    const startCheckout = async (checkoutUser?: User) => {
        const activeUser = checkoutUser ?? user;
        if (!activeUser?.id) {
            console.warn("[ENROLL_LIVE_TRADING_CLASS] Missing user for checkout");
            return;
        }

        const createdOrder = await createOrderId(activeUser.id);
        if (!createdOrder?.orderId) {
            console.error("[ENROLL_LIVE_TRADING_CLASS] Missing order id");
            return;
        }

        if (!window.Razorpay) {
            console.error("[ENROLL_LIVE_TRADING_CLASS] Razorpay script not loaded");
            return;
        }

        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
            console.error("[ENROLL_LIVE_TRADING_CLASS] Missing Razorpay key");
            return;
        }

        const options: RazorpayOptions = {
            key,
            one_click_checkout: true,
            name: PLATFORM_NAME,
            order_id: createdOrder.orderId,
            show_coupons: false,
            handler: function (response) {
                console.log("[ENROLL_LIVE_TRADING_CLASS] Payment successful", response);
                console.log(response.razorpay_payment_id);
                console.log(response.razorpay_order_id);
                console.log(response.razorpay_signature);

                (async () => {
                    try {
                        const { nextLiveClassDate, nextLiveClassTime } =
                            getNextLiveClassSchedule();

                        let liveClassUrl: string | null = null;
                        let whatsappGroupUrl: string | null = null;
                        try {
                            const linksRes = await fetch(
                                `/api/public/live-class-links?courseId=${LIVE_TRADING_CLASS_ENROLMENT_COURSE_ID}`,
                                { cache: "no-store" },
                            );
                            if (linksRes.ok) {
                                const linkJson = (await linksRes.json()) as {
                                    liveClassUrl?: string | null;
                                    whatsappGroupUrl?: string | null;
                                };
                                liveClassUrl = linkJson.liveClassUrl ?? null;
                                whatsappGroupUrl = linkJson.whatsappGroupUrl ?? null;
                            }
                        } catch (linkErr) {
                            console.warn(
                                "[ENROLL_LIVE_TRADING_CLASS] Could not load public live links",
                                linkErr,
                            );
                        }

                        await setPaymentSuccessData({
                            userName: activeUser?.name || "",
                            email: activeUser?.email || "",
                            phone: activeUser?.phone || "",
                            bookingId: createdOrder.bookingId
                                ? createdOrder.bookingId.toString()
                                : response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            amount: ENROLL_CLASS_PRICE_INR,
                            currency: "INR",
                            itemName: LIVE_TRADING_CLASS_NAME,
                            nextLiveClassDate,
                            nextLiveClassTime,
                            courseId: LIVE_TRADING_CLASS_ITEM_ID,
                            liveClassUrl,
                            whatsappGroupUrl,
                        });

                        router.push("/payment-success");
                    } catch (error) {
                        console.error("[ENROLL_LIVE_TRADING_CLASS] Local storage error", error);
                        router.push("/payment-failed");
                    }
                })();
            },
            prefill: {
                name: activeUser?.name || "",
                email: activeUser?.email || "",
                contact: activeUser?.phone || "",
            },
            notes: {
                address: "ABC Office",
            },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
            console.error("[ENROLL_LIVE_TRADING_CLASS] Payment failed", response);
            console.error(response.error.code);
            console.error(response.error.description);
            console.error(response.error.source);
            console.error(response.error.step);
            console.error(response.error.reason);
            console.error(response.error.metadata.order_id);
            console.error(response.error.metadata.payment_id);
        });
        rzp1.open();
    };

    const handleClick = async () => {
        // Track InitiateCheckout event for Meta Pixel
        trackInitiateCheckout({
            value: ENROLL_CLASS_PRICE_INR,
            currency: "INR",
            content_name: LIVE_TRADING_CLASS_NAME,
            content_ids: [LIVE_TRADING_CLASS_ITEM_ID.toString()],
            content_type: "product",
            num_items: 1,
        });

        if (!isAuthenticated || !user?.id) {
            console.warn("[ENROLL_LIVE_TRADING_CLASS] User not authenticated");
            setIsAuthModalOpen(true);
            return;
        }

        await startCheckout(user);
    };

    /**
     * Callback for loading more reviews from the API
     * Used by ReviewsSection when "Load More" is clicked
     */
    const handleLoadMoreReviews = useCallback(async (currentCount: number): Promise<Review[]> => {
        const { reviews: newReviews } = await fetchMoreReviews(4, currentCount);
        return newReviews;
    }, []);

    /**
     * Show sticky CTA when hero button scrolls out of view
     */
    useEffect(() => {
        const heroButton = heroCtaRef.current;
        if (!heroButton) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky CTA when hero button is NOT visible
                setShowStickyCta(!entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0,
            }
        );

        observer.observe(heroButton);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <ContactAuthModal
                open={isAuthModalOpen}
                onOpenChange={setIsAuthModalOpen}
                onUserResolved={async (authenticatedUser) => {
                    setIsAuthModalOpen(false);
                    await startCheckout(authenticatedUser);
                }}
                title="Join to continue"
                description="Enter your details to proceed with Live Trading Class enrollment."
                submitLabel="Continue"
            />
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {/* Hero Section */}
            <section className="relative w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 md:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Section - Content */}
                        <div className="flex flex-col space-y-6 md:space-y-8 order-1 lg:order-1">
                            {/* Main Headline */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            Complete Masterclass 2026:
                                        </span>
                                    </h2>
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight">
                                        For Indian Stocks Market, Crypto and Commodities ke liye Ultimate Trading Strategies
                                    </h3>
                                </div>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    This is not theory-heavy course or shortcut-driven trading program.
                                    This live masterclass is built to help you develop a structured, repeatable trading approach using price action, risk management, and proven market concepts.
                                </p>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    You will learn how to analyze markets, identify high-probability setups, and execute trades with discipline—whether you trade crypto, stocks, options, or other instruments.
                                </p>
                                {reviewStats && reviewStats.totalReviews > 0 && (
                                    <a
                                        href="#reviews-section"
                                        className="inline-flex flex-wrap items-center gap-2 gap-y-1 text-xs md:text-sm text-gray-600 hover:opacity-80 transition-opacity cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document
                                                .getElementById("reviews-section")
                                                ?.scrollIntoView({ behavior: "smooth" });
                                        }}
                                    >
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            {Array.from({ length: 5 }, (_, index) => {
                                                const fillPercentage =
                                                    Math.min(
                                                        Math.max(
                                                            reviewStats.averageRating - index,
                                                            0,
                                                        ),
                                                        1,
                                                    ) * 100;
                                                return (
                                                    <div key={index} className="relative w-4 h-4">
                                                        <Star className="absolute inset-0 w-4 h-4 fill-gray-200 text-gray-200" />
                                                        {fillPercentage > 0 && (
                                                            <div
                                                                className="absolute inset-0 overflow-hidden"
                                                                style={{ width: `${fillPercentage}%` }}
                                                            >
                                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="underline underline-offset-2 leading-tight">
                                            {reviewStats.averageRating} ({reviewStats.totalReviews} reviews)
                                        </span>
                                    </a>
                                )}
                            </div>

                            {/* Key Features */}
                            <div className="flex flex-col space-y-3 md:space-y-4">
                                {ENROLL_CURRICULUM_TOPICS.map((topic) => (
                                    <div key={topic.id} className="flex items-center space-x-3">
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                                        <span className="text-base md:text-lg text-blue-600 font-medium">
                                            {topic.title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button
                                    ref={heroCtaRef}
                                    onClick={handleClick}
                                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-8 py-6 md:py-7 rounded-lg font-semibold"
                                >
                                    Reserve Your Seat - ₹{ENROLL_CLASS_PRICE_INR}
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
                        <InstructorPanel />
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
                        {ENROLL_CURRICULUM_TOPICS.map((topic) => (
                            <div key={topic.id} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                        {topic.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {topic.points.map((point, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                                                {point}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes This Different Section */}
            <section className="w-full bg-white py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                    {/* Section Title */}
                    <div className="text-center mb-10 md:mb-12 lg:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                            What Makes This Different
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                            This isn't just another trading course. Here's why traders choose this masterclass.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    No Unrealistic Profit Claims
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                No "make 100% monthly" promises. We focus on sustainable, real-world returns with proper risk management—not fantasies.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    Process Over Shortcuts
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                Trading is a skill. We teach discipline, consistency, and repeatable processes—not quick fixes or magic systems.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    Logic Over Indicators
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                Every strategy comes with the "why" behind it. We teach you to think, not blindly follow lagging indicators.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    Global Strategies, Indian Markets
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                Designed for Indian markets &amp; crypto, but applicable globally. Master strategies that work everywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Outcome Section */}
            <section className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-white py-12 md:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                    {/* Section Title */}
                    <div className="text-center mb-10 md:mb-12 lg:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                            Outcome
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                            By the end of this class, you will have:
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    A Structured Trading Plan
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                Your personal framework for entering and managing trades with clarity and confidence.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-purple-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    Clear Entry/Exit Frameworks
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                Proven methods to identify when to get in and when to get out of trades profitably.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-blue-400 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                    Better Risk Control &amp; Decision-Making
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                Master the skills to protect your capital and make trades based on logic, not emotions.
                            </p>
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
                                    Enroll in the Masterclass for ₹{ENROLL_CLASS_PRICE_INR}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
            {isLoadingReviews ? (
                <section className="w-full bg-white text-gray-900 py-12 md:py-16 lg:py-20">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-500">Loading reviews...</p>
                    </div>
                </section>
            ) : reviews.length > 0 ? (
                <ReviewsSection
                    id="reviews-section"
                    reviews={reviews}
                    heading="Reviews"
                    subheading="Real feedback from students who transformed their trading with our masterclass"
                    footerContent={
                        <WriteReview
                            onSubmitted={() => router.refresh()}
                            className="mx-auto max-w-4xl"
                        />
                    }
                    initialCount={reviews.length}
                    loadMoreCount={4}
                    loadMoreText="Load More Reviews"
                    loadingText="Loading reviews..."
                    onLoadMore={handleLoadMoreReviews}
                    totalCount={totalReviews}
                />
            ) : null}
        </div>
    );
}

"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewsSection } from "@/components/ui/reviews-section";
import WriteReview from "@/components/reviews/write-review";
import {
    LIVE_TRADING_CLASS_CROSS_OUT_PRICE_INR,
    LIVE_TRADING_CLASS_ITEM_ID,
    LIVE_TRADING_CLASS_NAME,
    LIVE_TRADING_CLASS_PRICE_INR,
    PLATFORM_NAME,
} from "@/lib/constants";
import { fetchMoreReviews } from "@/lib/utils";
import type { Review, User } from "@/lib/types";
import { CURRICULUM_TOPICS } from "@/lib/courseCurriculum";
import { selectAuthUser, selectIsAuthenticated } from "@/app/auth/authSelector";
import { useRouter } from "next/navigation";
import ContactAuthModal from "@/components/auth/ContactAuthModal";
import InstructorPanel from "@/components/pages/shared/InstructorPanel";
import { setPaymentSuccessData } from "@/lib/paymentSuccessStore";
import { getNextLiveClassSchedule } from "@/lib/notifications/contentBuilder";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { useToast } from "@/components/ui/use-toast";
import {
    TrendingUp,
    BarChart3,
    Hash,
    ShieldCheck,
    CheckCircle2,
    GraduationCap,
    Users,
    Star,
    Clock,
} from "lucide-react";

/** 24h repeating window for free-booking urgency (aligned to Unix epoch). */
const FREE_BOOKING_COUNTDOWN_CYCLE_MS = 24 * 60 * 60 * 1000;

function formatHms(remainingMs: number): { h: string; m: string; s: string } {
    const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return {
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
    };
}

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

type LiveTradingClassProps = {
    initialReviews: Review[];
    initialTotalReviews: number;
    initialReviewStats: ReviewStats;
};

export default function LiveTradingClass({
    initialReviews,
    initialTotalReviews,
    initialReviewStats,
}: LiveTradingClassProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showStickyCta, setShowStickyCta] = useState(false);
    const [joinFreeSubmitting, setJoinFreeSubmitting] = useState(false);
    const [freeBookingRemainingMs, setFreeBookingRemainingMs] = useState<number | null>(
        null,
    );
    const heroCtaRef = useRef<HTMLButtonElement>(null);
    const user = useSelector(selectAuthUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const reviews = initialReviews;
    const totalReviews = initialTotalReviews;
    const reviewStats = initialReviewStats;
    const isLoadingReviews = false;
    const classPriceInPaise = LIVE_TRADING_CLASS_PRICE_INR * 100;

    const fetchLiveClassPublicLinks = async () => {
        let liveClassUrl: string | null = null;
        let whatsappGroupUrl: string | null = null;
        try {
            const linksRes = await fetch(
                `/api/public/live-class-links?courseId=${LIVE_TRADING_CLASS_ITEM_ID}`,
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
                "[LIVE_TRADING_CLASS] Could not load public live links",
                linkErr,
            );
        }
        return { liveClassUrl, whatsappGroupUrl };
    };

    const redirectToPaymentSuccess = async (
        activeUser: User,
        details: {
            bookingId: string;
            paymentId: string;
            orderId: string;
            amount: number;
        },
    ) => {
        const { nextLiveClassDate, nextLiveClassTime } =
            getNextLiveClassSchedule();
        const { liveClassUrl, whatsappGroupUrl } =
            await fetchLiveClassPublicLinks();

        await setPaymentSuccessData({
            userName: activeUser?.name || "",
            email: activeUser?.email || "",
            phone: activeUser?.phone || "",
            bookingId: details.bookingId,
            paymentId: details.paymentId,
            orderId: details.orderId,
            amount: details.amount,
            currency: "INR",
            itemName: LIVE_TRADING_CLASS_NAME,
            nextLiveClassDate,
            nextLiveClassTime,
            courseId: LIVE_TRADING_CLASS_ITEM_ID,
            liveClassUrl,
            whatsappGroupUrl,
        });

        router.push("/payment-success");
    };

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
            console.warn("[LIVE_TRADING_CLASS] Missing user for checkout");
            return;
        }

        const createdOrder = await createOrderId(activeUser.id);
        if (!createdOrder?.orderId) {
            console.error("[LIVE_TRADING_CLASS] Missing order id");
            return;
        }

        if (!window.Razorpay) {
            console.error("[LIVE_TRADING_CLASS] Razorpay script not loaded");
            return;
        }

        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
            console.error("[LIVE_TRADING_CLASS] Missing Razorpay key");
            return;
        }

        const options: RazorpayOptions = {
            key,
            one_click_checkout: true,
            name: PLATFORM_NAME,
            order_id: createdOrder.orderId,
            show_coupons: false,
            handler: function (response) {
                console.log("[LIVE_TRADING_CLASS] Payment successful", response);
                console.log(response.razorpay_payment_id);
                console.log(response.razorpay_order_id);
                console.log(response.razorpay_signature);

                (async () => {
                    try {
                        await redirectToPaymentSuccess(activeUser, {
                            bookingId: createdOrder.bookingId
                                ? createdOrder.bookingId.toString()
                                : response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            amount: LIVE_TRADING_CLASS_PRICE_INR,
                        });
                    } catch (error) {
                        console.error("[LIVE_TRADING_CLASS] Local storage error", error);
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
            console.error("[LIVE_TRADING_CLASS] Payment failed", response);
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
            value: LIVE_TRADING_CLASS_PRICE_INR,
            currency: "INR",
            content_name: LIVE_TRADING_CLASS_NAME,
            content_ids: [LIVE_TRADING_CLASS_ITEM_ID.toString()],
            content_type: "product",
            num_items: 1,
        });

        if (!isAuthenticated || !user?.id) {
            console.warn("[LIVE_TRADING_CLASS] User not authenticated");
            setIsAuthModalOpen(true);
            return;
        }

        await startCheckout(user);
    };

    const joinFreeAfterAuth = async (activeUser: User) => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            console.error("[LIVE_TRADING_CLASS] No auth token for join free");
            toast({
                title: "Session missing",
                description: "Please sign in again and try once more.",
                variant: "destructive",
            });
            return;
        }

        setJoinFreeSubmitting(true);
        try {
            const res = await fetch("/api/live-class/join-free", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ itemId: LIVE_TRADING_CLASS_ITEM_ID }),
            });
            const data = (await res.json()) as {
                error?: string;
                bookingId?: number;
                gatewayOrderId?: string;
                gatewayPaymentId?: string;
            };

            if (!res.ok) {
                toast({
                    title: "Could not complete join",
                    description: data.error ?? "Something went wrong. Try again.",
                    variant: "destructive",
                });
                return;
            }

            await redirectToPaymentSuccess(activeUser, {
                bookingId: String(data.bookingId ?? ""),
                paymentId: data.gatewayPaymentId ?? "FREE",
                orderId: data.gatewayOrderId ?? String(data.bookingId ?? ""),
                amount: 0,
            });
        } catch (e) {
            console.error("[LIVE_TRADING_CLASS] Complimentary seat flow failed", e);
            toast({
                title: "Could not complete join",
                description: "Check your connection and try again.",
                variant: "destructive",
            });
        } finally {
            setJoinFreeSubmitting(false);
        }
    };

    const handleJoinFreeClick = async () => {
        if (!isAuthenticated || !user?.id) {
            setIsAuthModalOpen(true);
            return;
        }
        await joinFreeAfterAuth(user);
    };

    /**
     * Callback for loading more reviews from the API
     * Used by ReviewsSection when "Load More" is clicked
     */
    const handleLoadMoreReviews = useCallback(async (currentCount: number): Promise<Review[]> => {
        const { reviews: newReviews } = await fetchMoreReviews(4, currentCount);
        return newReviews;
    }, []);

    const renderFreeCtaButtonContent = () =>
        joinFreeSubmitting ? (
            <span className="text-sm md:text-[0.9375rem]">Reserving your seat…</span>
        ) : (
            <span className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-center max-w-md">
                <span
                    className="inline-flex items-center rounded-lg bg-white/20 px-3 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] ring-1 ring-white/35"
                    title={`Earlier listed at ₹${LIVE_TRADING_CLASS_CROSS_OUT_PRICE_INR}`}
                >
                    <span className="line-through decoration-1 decoration-white/95 text-white font-bold tabular-nums text-2xl md:text-3xl leading-none">
                        ₹&nbsp;{LIVE_TRADING_CLASS_CROSS_OUT_PRICE_INR}
                    </span>
                </span>
                <span className="text-base md:text-lg font-semibold tracking-tight">
                    Book free — reserve your seat
                </span>
            </span>
        );

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

    /**
     * 24-hour countdown that resets every 24 hours (same boundary for all visitors).
     */
    useEffect(() => {
        const tick = () => {
            setFreeBookingRemainingMs(
                FREE_BOOKING_COUNTDOWN_CYCLE_MS -
                (Date.now() % FREE_BOOKING_COUNTDOWN_CYCLE_MS),
            );
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);

    const countdownParts =
        freeBookingRemainingMs != null
            ? formatHms(freeBookingRemainingMs)
            : null;

    return (
        <div className="flex flex-col min-h-screen">
            <div
                className="sticky top-16 z-40 w-full border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-orange-50/95 to-amber-50 text-amber-950 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-amber-50/90"
                role="timer"
                aria-label={
                    countdownParts
                        ? `Time left in this free booking window: ${countdownParts.h} hours, ${countdownParts.m} minutes, ${countdownParts.s} seconds`
                        : "Countdown loading"
                }
            >
                <div className="container mx-auto flex flex-col items-center justify-center gap-1.5 px-4 py-2.5 sm:flex-row sm:gap-4 sm:py-2">
                    <p className="text-center text-xs font-medium text-amber-950/90 sm:text-sm">
                        Limited-time free class offer ends in
                    </p>
                    <div className="flex items-center gap-2 rounded-md bg-white/60 px-3 py-1 font-mono text-base font-bold tabular-nums tracking-tight text-amber-900 shadow-sm ring-1 ring-amber-200/80 sm:text-lg">
                        <Clock
                            className="h-4 w-4 shrink-0 text-amber-700"
                            aria-hidden
                        />
                        {countdownParts ? (
                            <span>
                                {countdownParts.h}:{countdownParts.m}:
                                {countdownParts.s}
                            </span>
                        ) : (
                            <span className="min-w-[7.5ch]">--:--:--</span>
                        )}
                    </div>
                </div>
            </div>
            <ContactAuthModal
                open={isAuthModalOpen}
                onOpenChange={setIsAuthModalOpen}
                onUserResolved={async (authenticatedUser) => {
                    setIsAuthModalOpen(false);
                    await joinFreeAfterAuth(authenticatedUser);
                }}
                title="Get free access"
                description="Enter your details. We’ll send your live class links by email and WhatsApp."
                submitLabel="Continue"
            />
            {/* Paid checkout (Razorpay) — restore when re-enabling paid CTA below
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            */}
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
                                    ref={heroCtaRef}
                                    onClick={handleJoinFreeClick}
                                    disabled={joinFreeSubmitting}
                                    className="w-full md:w-auto h-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-md font-semibold text-sm shadow-sm shadow-blue-900/10 border border-blue-500/30"
                                    aria-label={
                                        joinFreeSubmitting
                                            ? "Reserving your seat"
                                            : `Book free live class seat. Listed value ${LIVE_TRADING_CLASS_CROSS_OUT_PRICE_INR} rupees is waived for this session.`
                                    }
                                >
                                    {renderFreeCtaButtonContent()}
                                </Button>

                                {/* Paid enrollment — keep for future use; pair with Razorpay Script above
                                <Button
                                    onClick={handleClick}
                                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-8 py-6 md:py-7 rounded-lg font-semibold"
                                >
                                    Join Live Class for ₹{LIVE_TRADING_CLASS_PRICE_INR}
                                </Button>
                                */}

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
                        {CURRICULUM_TOPICS.map((topic) => (
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
                            <div className="bg-white/95 backdrop-blur border border-gray-200 shadow-lg rounded-xl p-1.5 md:p-2">
                                <Button
                                    onClick={handleJoinFreeClick}
                                    disabled={joinFreeSubmitting}
                                    className="w-full h-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-md font-semibold text-sm shadow-sm shadow-blue-900/10 border border-blue-500/30"
                                    aria-label={
                                        joinFreeSubmitting
                                            ? "Reserving your seat"
                                            : `Book free live class seat. Listed value ${LIVE_TRADING_CLASS_CROSS_OUT_PRICE_INR} rupees is waived for this session.`
                                    }
                                >
                                    {renderFreeCtaButtonContent()}
                                </Button>

                                {/* Paid sticky CTA — restore with Razorpay Script when needed
                                <Button
                                    onClick={handleClick}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-6 py-5 md:py-6 rounded-lg font-semibold"
                                >
                                    Join Live Class for ₹{LIVE_TRADING_CLASS_PRICE_INR}
                                </Button>
                                */}
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

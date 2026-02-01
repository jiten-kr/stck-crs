"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { selectAuthUser, selectIsAuthenticated } from "@/app/auth/authSelector";

export type WriteReviewProps = {
    className?: string;
    onSubmitted?: () => void;
    heading?: string;
    subheading?: string;
};

export default function WriteReview({
    className = "",
    onSubmitted,
    heading = "Share your review",
    subheading = "Help other traders by sharing your experience.",
}: WriteReviewProps) {
    const { toast } = useToast();
    const user = useSelector(selectAuthUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const userName = useMemo(() => user?.name?.trim() || "", [user]);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = isAuthenticated && rating >= 1 && reviewText.trim().length >= 10;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isAuthenticated) {
            toast({
                title: "Please sign in to continue",
                description: "Log in to submit your review.",
                variant: "destructive",
            });
            return;
        }

        if (rating < 1) {
            toast({
                title: "Select a rating",
                description: "Please select a star rating before submitting.",
                variant: "destructive",
            });
            return;
        }

        if (reviewText.trim().length < 10) {
            toast({
                title: "Review is too short",
                description: "Please write at least 10 characters.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userName,
                    rating,
                    text: reviewText.trim(),
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || "Failed to submit review");
            }

            setRating(0);
            setReviewText("");

            toast({
                title: "Thank you for your review",
                description: "Your feedback has been submitted successfully.",
            });

            onSubmitted?.();
        } catch (error) {
            toast({
                title: "Submission failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Unable to submit your review right now.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <Card className="bg-white text-gray-900 border border-blue-100 shadow-sm">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col gap-2 mb-6 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h3>
                        <p className="text-sm md:text-base text-gray-600">{subheading}</p>
                    </div>

                    {!isAuthenticated ? (
                        <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-5 text-center">
                            <p className="text-sm md:text-base text-gray-700">
                                Please sign in to share your review. We value verified feedback and would love to
                                hear about your experience.
                            </p>
                            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                <Link href="/auth/signin">Sign in to write a review</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <Input
                                        value={userName}
                                        disabled
                                        className="mt-2 bg-white text-black placeholder:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Your rating</label>
                                    <div className="mt-2 flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, index) => {
                                            const starValue = index + 1;
                                            const isActive = starValue <= rating;
                                            return (
                                                <button
                                                    key={starValue}
                                                    type="button"
                                                    onClick={() => setRating(starValue)}
                                                    className="transition-transform hover:scale-105"
                                                    aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                                                >
                                                    <Star
                                                        className={`h-6 w-6 ${isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    />
                                                </button>
                                            );
                                        })}
                                        <span className="ml-2 text-sm text-gray-500">
                                            {rating > 0 ? `${rating} / 5` : "Select a rating"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Your review</label>
                                <Textarea
                                    value={reviewText}
                                    onChange={(event) => setReviewText(event.target.value)}
                                    placeholder="Share what you liked, what you learned, or how it helped your trading."
                                    rows={4}
                                    className="mt-2 bg-white text-black placeholder:text-gray-400"
                                />
                                <p className="mt-2 text-xs text-gray-500">Minimum 10 characters.</p>
                            </div>

                            <div className="flex justify-center md:justify-end">
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                    className="min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit review"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

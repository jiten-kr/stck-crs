"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBrandingGraphic from "@/components/auth/AuthBrandingGraphic";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export default function SignUpForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            localStorage.setItem("token", data.token);

            toast({
                title: "Account created",
                description: "Your account has been created successfully.",
            });

            router.push("/auth/signin");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create account.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="flex min-h-screen">
                {/* Left Section - Branding (hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-72 h-72 rounded-full border-2 border-white"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border-2 border-white"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                        <div className="mb-8">
                            <AuthBrandingGraphic />
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                            Start Your<br />
                            <span className="text-blue-200">Trading Journey</span>
                        </h1>
                        <p className="text-lg text-blue-100 leading-relaxed max-w-md">
                            Join thousands of traders who are mastering the markets with our
                            practical, rules-based approach to trading.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <span className="text-blue-100">Learn entry & exit strategies</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <span className="text-blue-100">Master risk management</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <span className="text-blue-100">Trade with confidence</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">MayankFin</h2>
                            <p className="text-gray-600 mt-1">Create your account</p>
                        </div>

                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
                            <CardHeader className="space-y-1 pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Create an account
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Enter your information to get started
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-700 font-medium">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                required
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                required
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                                            Phone
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                required
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-700 font-medium">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    required
                                                    autoComplete="new-password"
                                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                                Confirm
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm"
                                                    required
                                                    autoComplete="new-password"
                                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        Password must be at least 8 characters long
                                    </p>

                                    <div className="flex items-start space-x-3 pt-2">
                                        <Checkbox id="terms" required className="mt-0.5" />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm text-gray-600 leading-relaxed"
                                        >
                                            I agree to the{" "}
                                            <Link
                                                href="/terms-of-service"
                                                className="text-blue-600 hover:underline underline-offset-4"
                                            >
                                                terms of service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy-policy"
                                                className="text-blue-600 hover:underline underline-offset-4"
                                            >
                                                privacy policy
                                            </Link>
                                        </label>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4 pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            "Creating account..."
                                        ) : (
                                            <>
                                                Create account
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                    <div className="text-center text-sm text-gray-600">
                                        Already have an account?{" "}
                                        <Link
                                            href="/auth/signin"
                                            className="text-blue-600 font-medium hover:text-blue-700 hover:underline underline-offset-4"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

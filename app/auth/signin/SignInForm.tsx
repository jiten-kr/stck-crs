"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
import { User } from "@/lib/types";
import api from "@/lib/api/axios";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function SignInForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await api.post("/auth/login", {
                emailOrPhone: email,
                password,
            });

            const t = data.token;
            localStorage.setItem("token", t);

            // Save user in Redux
            dispatch(login(data.user as User));

            toast({
                title: "Login successful",
                description: `Welcome back, ${data.user.name}!`,
            });

            router.push("/"); // redirect to dashboard after login
        } catch (error: any) {
            console.error("Login error:", error);
            toast({
                title: "Login failed",
                description: error.message,
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
                    <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 h-full">
                        <div className="flex-1 flex flex-col justify-center">
                            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                                Welcome Back to<br />
                                <span className="text-blue-200">MayankFin</span>
                            </h1>
                            <p className="text-lg text-blue-100 leading-relaxed max-w-md">
                                Continue your trading journey with our practical masterclass on entry,
                                stop-loss, and risk-reward strategies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">MayankFin</h2>
                            <p className="text-gray-600 mt-1">Welcome back</p>
                        </div>

                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
                            <CardHeader className="space-y-1 pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Sign in
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Enter your email and password to access your account
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-gray-700 font-medium">
                                                Password
                                            </Label>
                                            <Link
                                                href="/auth/reset-password"
                                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4 pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            "Signing in..."
                                        ) : (
                                            <>
                                                Sign in
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                    <div className="text-center text-sm text-gray-600">
                                        Don&apos;t have an account?{" "}
                                        <Link
                                            href="/auth/signup"
                                            className="text-blue-600 font-medium hover:text-blue-700 hover:underline underline-offset-4"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                </CardFooter>
                            </form>
                        </Card>

                        {/* Footer */}
                        <p className="text-center text-xs text-gray-500 mt-6">
                            By signing in, you agree to our{" "}
                            <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

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

export default function ResetPasswordForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [hasSentCode, setHasSentCode] = useState(false);

    const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send reset link.");
            }

            setHasSentCode(true);
            toast({
                title: "Reset code sent",
                description: "Check your email for the 6-digit code.",
            });
        } catch (error: any) {
            toast({
                title: "Failed to send reset code",
                description: error.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleResetPassword = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please make sure both passwords match.",
                variant: "destructive",
            });
            return;
        }

        setIsResetting(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, password, confirmPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password.");
            }

            toast({
                title: "Password updated",
                description: "You can now sign in with your new password.",
            });
            router.push("/auth/signin");
        } catch (error: any) {
            toast({
                title: "Failed to reset password",
                description: error.message || "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your
                        password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSending}>
                            {isSending ? "Sending code..." : "Send reset code"}
                        </Button>
                    </form>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">6-digit code</Label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter code"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">New password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter new password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isResetting || !hasSentCode}
                        >
                            {isResetting ? "Resetting password..." : "Reset password"}
                        </Button>
                        {!hasSentCode && (
                            <p className="text-xs text-muted-foreground text-center">
                                Send the reset code to your email first.
                            </p>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm">
                        <Link
                            href="/auth/signin"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

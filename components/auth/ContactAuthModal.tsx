"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";

const FALLBACK_PASSWORD = "********";

type ContactAuthModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserResolved?: (user: User) => void;
    title?: string;
    description?: string;
    submitLabel?: string;
};

type AuthResponse = {
    message?: string;
    token?: string;
    user: User;
};

export default function ContactAuthModal({
    open,
    onOpenChange,
    onUserResolved,
    title = "Create your account",
    description = "Enter your details to continue.",
    submitLabel = "Continue",
}: ContactAuthModalProps) {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) return;
        setName("");
        setEmail("");
        setPhone("");
        setIsSubmitting(false);
    }, [open]);

    const normalizeUser = (rawUser: Partial<User>): User => {
        return {
            id: Number(rawUser.id),
            name: rawUser.name || name,
            email: rawUser.email || email,
            phone: rawUser.phone || phone,
            role: rawUser.role || "student",
            hasPaidFor: rawUser.hasPaidFor || { courseIds: [] },
            created_at: rawUser.created_at || new Date(),
            updated_at: rawUser.updated_at || rawUser.created_at || new Date(),
        } as User;
    };

    const lookupUser = async (): Promise<AuthResponse | null> => {
        const response = await fetch("/api/auth/get-user-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, phone }),
        });

        if (response.status === 404) return null;

        const data = await response.json().catch(() => null);
        if (!response.ok) {
            throw new Error(data?.error || "Unable to find your account.");
        }

        return data as AuthResponse;
    };

    const registerUser = async (): Promise<AuthResponse> => {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                phone,
                password: FALLBACK_PASSWORD,
            }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
            throw new Error(data?.error || "Unable to create your account.");
        }

        return data as AuthResponse;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !phone.trim()) {
            toast({
                title: "Missing details",
                description: "Please fill in your name, email, and phone.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            let data = await lookupUser();
            let successTitle = "Welcome back";
            let successDescription = "We found your account. You can continue.";

            if (!data) {
                data = await registerUser();
                successTitle = "Account created";
                successDescription = "We created your account. You can continue.";
            }

            const normalizedUser = normalizeUser(data.user);
            onUserResolved?.(normalizedUser);

            toast({
                title: successTitle,
                description: successDescription,
            });

            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Unable to continue",
                description:
                    error instanceof Error
                        ? error.message
                        : "Please try again in a moment.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="contact-auth-name">Full name</Label>
                        <Input
                            id="contact-auth-name"
                            placeholder="Your name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-auth-email">Email</Label>
                        <Input
                            id="contact-auth-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-auth-phone">Phone</Label>
                        <Input
                            id="contact-auth-phone"
                            type="tel"
                            placeholder="9876543210"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            autoComplete="tel"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Please wait..." : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

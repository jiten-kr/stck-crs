"use client";

import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type PaymentSuccessData = {
    userName: string;
    email: string;
    phone: string;
    bookingId: string;
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    className: string;
    paymentDate: string;
};

type PaymentSuccessPageProps = {
    data?: PaymentSuccessData | null;
    isLoading?: boolean;
    error?: string | null;
};

const formatAmount = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount} ${currency}`.trim();
    }
};

const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

type SectionCardProps = {
    title: string;
    children: ReactNode;
};

const SectionCard = ({ title, children }: SectionCardProps) => (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            {title}
        </h2>
        <div className="mt-4 space-y-3 text-sm text-slate-700 sm:text-base">
            {children}
        </div>
    </section>
);

type InfoRowProps = {
    label: string;
    value: ReactNode;
};

const InfoRow = ({ label, value }: InfoRowProps) => (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 sm:text-sm">
            {label}
        </span>
        <span className="text-sm font-semibold text-slate-900 sm:text-base">
            {value}
        </span>
    </div>
);

export default function PaymentSuccessPage({
    data,
    isLoading = false,
    error,
}: PaymentSuccessPageProps) {
    const hasData = Boolean(data);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                    <p className="text-sm font-medium text-slate-600">Loading payment details...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-lg rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm sm:p-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
                    <h1 className="mt-4 text-xl font-semibold text-slate-900">
                        Payment details unavailable
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">{error}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (!hasData) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
                    <h1 className="mt-4 text-xl font-semibold text-slate-900">
                        We could not find your booking
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Please check your confirmation email or contact support if you need help.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <section className="rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm sm:p-8">
                    <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                    <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
                        Enrollment Successful
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        Your seat is confirmed. We are excited to see you in class.
                    </p>
                </section>

                <SectionCard title="Class Details">
                    <p className="text-sm text-slate-700 sm:text-base">
                        Live Class Timing: <span className="font-semibold">Sunday 8 PM IST</span>
                    </p>
                    <p>
                        <span className="font-medium text-slate-900">Email:</span> {data.email}
                    </p>
                    <p>
                        <span className="font-medium text-slate-900">Phone:</span> {data.phone}
                    </p>
                    <p className="text-sm text-slate-600">
                        Confirmation will be sent to the above email and phone.
                    </p>
                    <p className="text-sm text-slate-600">
                        The joining link will be shared 2 hours before the class on the same email and phone.
                    </p>
                </SectionCard>

                <SectionCard title="Booking Details">
                    <InfoRow label="Booking ID" value={data.bookingId} />
                    <InfoRow label="Payment ID" value={data.paymentId} />
                    <InfoRow label="Order ID" value={data.orderId} />
                    <InfoRow
                        label="Amount Paid"
                        value={formatAmount(data.amount, data.currency)}
                    />
                    <InfoRow label="Payment Date" value={formatDate(data.paymentDate)} />
                </SectionCard>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Booked for</p>
                            <p className="text-lg font-semibold text-slate-900">{data.className}</p>
                            <p className="text-sm text-slate-600">Attendee: {data.userName}</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                            <Button variant="outline" className="w-full sm:w-auto">
                                Download Receipt
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

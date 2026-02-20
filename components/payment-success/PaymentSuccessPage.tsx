"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import {
    PLATFORM_NAME,
    PLATFORM_SUPPORT_EMAIL,
    PLATFORM_SUPPORT_PHONE,
} from "@/lib/constants";
import {
    clearPaymentSuccessData,
    getPaymentSuccessData,
    type PaymentSuccessStoredData,
} from "@/lib/paymentSuccessStore";
import { formatClassDate } from "@/lib/notifications/contentBuilder";

export type PaymentSuccessData = PaymentSuccessStoredData;

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

const formatAmountForPdf = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            currencyDisplay: "code",
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`.trim();
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

const buildReceiptPdf = (data: PaymentSuccessData) => {
    const doc = new jsPDF({
        unit: "pt",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    const lineHeight = 18;
    let cursorY = 72;

    doc.setFillColor(243, 248, 255);
    doc.rect(margin, cursorY - 32, pageWidth - margin * 2, 80, "F");

    doc.setTextColor(13, 40, 76);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Payment Receipt", margin + 16, cursorY);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(PLATFORM_NAME, margin + 16, cursorY + 20);

    cursorY += 80;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 28;

    const leftColX = margin;
    const rightColX = pageWidth / 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Enrollment Details", leftColX, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    cursorY += 20;
    doc.text(`Class: ${data.itemName}`, leftColX, cursorY);
    cursorY += lineHeight;
    doc.text(`Attendee: ${data.userName}`, leftColX, cursorY);
    cursorY += lineHeight;
    doc.text(`Email: ${data.email}`, leftColX, cursorY);
    cursorY += lineHeight;
    doc.text(`Phone: ${data.phone}`, leftColX, cursorY);

    cursorY -= lineHeight * 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Payment Summary", rightColX, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    cursorY += 20;
    doc.text(
        `Amount Paid: ${formatAmountForPdf(data.amount, data.currency)}`,
        rightColX,
        cursorY,
    );
    cursorY += lineHeight;
    doc.text(`Receipt Generated: ${formatDate(new Date().toISOString())}`, rightColX, cursorY);

    cursorY += 36;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 24;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Booking IDs", margin, cursorY);
    cursorY += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(`Booking ID: ${data.bookingId}`, margin, cursorY);
    cursorY += lineHeight;
    doc.text(`Payment ID: ${data.paymentId}`, margin, cursorY);
    cursorY += lineHeight;
    doc.text(`Order ID: ${data.orderId}`, margin, cursorY);

    cursorY += 32;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
        "This receipt confirms your enrollment. A joining link will be shared 2 hours before the class.",
        margin,
        cursorY,
        { maxWidth: pageWidth - margin * 2 },
    );

    return doc;
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
    const [storedData, setStoredData] = useState<PaymentSuccessData | null>(
        data ?? null,
    );
    const [isLoadingData, setIsLoadingData] = useState(!data);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        error ?? null,
    );

    useEffect(() => {
        if (data) return;

        let isMounted = true;

        const load = async () => {
            try {
                const stored = await getPaymentSuccessData();
                if (!stored) {
                    if (isMounted) {
                        setErrorMessage("Payment details not found.");
                    }
                    return;
                }

                const classDate = new Date(stored.nextLiveClassDate);
                if (
                    Number.isNaN(classDate.getTime()) ||
                    Date.now() > classDate.getTime()
                ) {
                    await clearPaymentSuccessData();
                    if (isMounted) {
                        setErrorMessage("Your class session has ended.");
                    }
                    return;
                }

                if (isMounted) {
                    setStoredData(stored);
                }
            } catch (loadError) {
                if (isMounted) {
                    setErrorMessage(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to load payment details.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoadingData(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [data]);

    const hasData = Boolean(storedData);

    const handleDownloadReceipt = () => {
        if (!storedData) return;

        const doc = buildReceiptPdf(storedData);
        doc.save(`receipt-${storedData.bookingId}.pdf`);
    };

    if (isLoading || isLoadingData) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                    <p className="text-sm font-medium text-slate-600">Loading payment details...</p>
                </div>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-lg rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm sm:p-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
                    <h1 className="mt-4 text-xl font-semibold text-slate-900">
                        Payment details unavailable
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-left text-sm text-slate-700">
                        <p className="font-medium text-slate-900">
                            We are here to help.
                        </p>
                        <p className="mt-2">
                            Contact us at {PLATFORM_SUPPORT_EMAIL} or {PLATFORM_SUPPORT_PHONE}.
                        </p>
                        <p className="mt-2 text-slate-600">
                            Your payment is secure. Our team will verify and get you enrolled quickly.
                        </p>
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
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-left text-sm text-slate-700">
                        <p className="font-medium text-slate-900">
                            Your payment is safe.
                        </p>
                        <p className="mt-2">
                            Reach us at {PLATFORM_SUPPORT_EMAIL} or {PLATFORM_SUPPORT_PHONE}.
                        </p>
                        <p className="mt-2 text-slate-600">
                            We will verify your payment and confirm your enrollment shortly.
                        </p>
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
                        Live Class Timing:{" "}
                        <span className="font-semibold">
                            {formatClassDate(storedData?.nextLiveClassDate || "")} at{" "}
                            {storedData?.nextLiveClassTime}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-slate-900">Email:</span> {storedData?.email}
                    </p>
                    <p>
                        <span className="font-medium text-slate-900">Phone:</span> {storedData?.phone}
                    </p>
                    <p className="text-sm text-slate-600">
                        Confirmation will be sent to the above email and phone.
                    </p>
                    <p className="text-sm text-slate-600">
                        The joining link will be shared 2 hours before the class on the same email and phone.
                    </p>
                </SectionCard>

                <SectionCard title="Booking Details">
                    <InfoRow label="Booking ID" value={storedData?.bookingId} />
                    <InfoRow label="Payment ID" value={storedData?.paymentId} />
                    <InfoRow label="Order ID" value={storedData?.orderId} />
                    <InfoRow
                        label="Amount Paid"
                        value={formatAmount(
                            storedData?.amount || 0,
                            storedData?.currency || "INR",
                        )}
                    />
                </SectionCard>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Booked for</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {storedData?.itemName}
                            </p>
                            <p className="text-sm text-slate-600">
                                Attendee: {storedData?.userName}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={handleDownloadReceipt}
                            >
                                Download Receipt
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

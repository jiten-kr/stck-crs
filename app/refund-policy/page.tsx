import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Refund & Cancellation Policy",
  description:
    "Read MayankFin’s Refund & Cancellation Policy to understand eligibility, conditions, and timelines for refunds related to live trading classes and educational services.",

  keywords: [
    "mayankfin refund policy",
    "trading class refund policy",
    "live trading course cancellation",
    "online course refund india",
    "education service refund terms",
    "mayankfin cancellation policy",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/refund-policy",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Refund & Cancellation Policy",
    description:
      "Understand MayankFin’s refund and cancellation rules for live trading classes and educational services.",
    url: "https://mayankfin.com/refund-policy",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin Refund & Cancellation Policy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Refund & Cancellation Policy",
    description:
      "Learn about refund eligibility and cancellation terms for MayankFin live trading classes.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "legal",
};


export default function RefundPolicyPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-muted-foreground">Last updated: March 12, 2025</p>
        </div>

        <Separator />

        <div className="space-y-6 text-sm sm:text-base">
          <p className="text-muted-foreground">
            This policy explains refunds and cancellations for our courses and
            live programs in a simple, transparent way.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Self-paced courses</h2>
            <p className="text-muted-foreground">
              You may request a refund within 30 days of purchase if you have
              completed less than 30% of the course. Any exceptions (such as
              heavily discounted offers) are shown at checkout.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Live programs</h2>
            <p className="text-muted-foreground">
              Live workshops, cohorts, and mentorship sessions are non-refundable
              once booked. Please review schedules and eligibility carefully
              before enrolling.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">How to request</h2>
            <p className="text-muted-foreground">
              To request a refund for eligible courses, contact our support team
              with your order details. We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

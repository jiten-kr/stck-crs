import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Terms of Service",
  description:
    "Read the Terms of Service for MayankFin. Understand the rules, responsibilities, and conditions for accessing our live trading classes, courses, and educational content.",

  keywords: [
    "mayankfin terms of service",
    "trading course terms",
    "live trading class terms",
    "online trading education terms",
    "course usage terms india",
    "mayankfin legal terms",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/terms-of-service",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Terms of Service",
    description:
      "Review the terms and conditions for using MayankFin’s live trading classes and educational services.",
    url: "https://mayankfin.com/terms-of-service",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin Terms of Service",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Terms of Service",
    description:
      "Terms and conditions governing the use of MayankFin live trading classes and educational content.",
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


export default function TermsOfServicePage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 12, 2025</p>
        </div>

        <Separator />

        <div className="space-y-6 text-sm sm:text-base">
          <p className="text-muted-foreground">
            These Terms explain the basic rules for using our platform and courses. By accessing or using the service,
            you agree to these Terms.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Nature of service</h2>
            <p className="text-muted-foreground">
              Our content is educational only and does not provide financial, investment, legal, or tax advice.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No guaranteed profits</h2>
            <p className="text-muted-foreground">
              Trading and investing involve risk. We do not guarantee profits, results, or outcomes. Past performance
              is not indicative of future results.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Account and acceptable use</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Provide accurate information and keep your account secure.</li>
              <li>Do not share credentials or access with others.</li>
              <li>Do not misuse the platform or attempt unauthorized access.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Payments</h2>
            <p className="text-muted-foreground">
              Course prices and payment methods are shown at checkout. Completed purchases are final unless a specific
              refund policy is stated at the time of purchase.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Content and intellectual property</h2>
            <p className="text-muted-foreground">
              Course materials are provided for personal, non-commercial use only. You may not copy, redistribute, or
              resell content without written permission.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising
              from the use of the platform.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Changes</h2>
            <p className="text-muted-foreground">
              We may update these Terms from time to time. Continued use of the service means you accept the updated
              Terms.
            </p>
          </div>

          {/* <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Contact</p>
            <p>Email: legal@marketmastery.com</p>
            <p>Address: 123 Trading Street, Suite 456, Financial District, New York, NY 10001</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

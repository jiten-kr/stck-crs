import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Privacy Policy",
  description:
    "Read MayankFin’s Privacy Policy to understand how we collect, use, and protect your personal information when you access our website, live trading classes, and services.",

  keywords: [
    "mayankfin privacy policy",
    "trading education privacy",
    "online course data protection",
    "user data privacy india",
    "live trading class privacy policy",
    "mayankfin data security",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/privacy-policy",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Privacy Policy",
    description:
      "Learn how MayankFin collects, uses, and safeguards your personal information across our website and live trading classes.",
    url: "https://mayankfin.com/privacy-policy",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin Privacy Policy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Privacy Policy",
    description:
      "Understand how MayankFin handles and protects your personal data.",
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


export default function PrivacyPolicyPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 12, 2025</p>
        </div>

        <Separator />

        <div className="space-y-6 text-sm sm:text-base">
          <p className="text-muted-foreground">
            We respect your privacy. This page explains, in short, what we collect, how we use it, and the choices you
            have. If you have any questions, reach out to our support team.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">What we collect</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Details like name, email, and phone (when you sign up).</li>
              <li>Payment details handled by trusted providers (we do not store full card info).</li>
              <li>Usage data such as pages visited, device, and course progress.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">How we use it</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Deliver and improve courses, dashboards, and support.</li>
              <li>Process payments and send service updates.</li>
              <li>Understand usage to improve performance and content.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Sharing and security</h2>
            <p className="text-muted-foreground">
              We only share data with service providers needed to run the platform or if required by law. We use
              industry-standard safeguards to protect your data.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your choices</h2>
            <p className="text-muted-foreground">
              You can request access, correction, or deletion of your data. You can also opt out of marketing emails at
              any time.
            </p>
          </div>

          {/* <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Contact</p>
            <p>Email: privacy@marketmastery.com</p>
            <p>Address: 123 Trading Street, Suite 456, Financial District, New York, NY 10001</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

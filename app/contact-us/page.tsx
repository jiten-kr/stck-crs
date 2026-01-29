import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PLATFORM_NAME, PLATFORM_SUPPORT_EMAIL } from "@/lib/constants"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Contact Us | Support & Enquiries",
  description:
    "Get in touch with MayankFin for course enquiries, live class support, or general questions. We're here to help you with your trading education journey.",

  keywords: [
    "contact mayankfin",
    "trading course support",
    "stock market course contact",
    "crypto trading class enquiry",
    "live trading class support",
    "trading education help",
    "mayankfin contact",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/contact-us",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Contact Us",
    description:
      "Contact MayankFin for support, course-related questions, or general enquiries about live trading classes and programs.",
    url: "https://mayankfin.com/contact-us",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin Contact Us",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Contact Us",
    description:
      "Reach out to MayankFin for support or enquiries related to live trading classes and courses.",
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

  category: "education",
}

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our courses or need assistance? We're here to help. Reach out to our team using any of the methods below.
          </p>
        </div>

        <ContactForm />

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Before reaching out, you might find answers to common questions in our FAQ section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button asChild>
                  <a href="/faq">Visit FAQ Page</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

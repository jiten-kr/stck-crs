import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PLATFORM_NAME } from "@/lib/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - FAQs | Live Trading Classes & Courses",
  description:
    "Find answers to common questions about MayankFin live trading classes, course access, eligibility, payments, and support. Clear, simple, and transparent.",

  keywords: [
    "mayankfin faq",
    "trading class faqs",
    "live trading course questions",
    "stock market course faq",
    "crypto trading class faq",
    "online trading education help",
    "trading course support india",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/faq",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Frequently Asked Questions",
    description:
      "Get quick answers to frequently asked questions about MayankFin live trading classes, course structure, payments, and support.",
    url: "https://mayankfin.com/faq",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin FAQs - Live Trading Classes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - FAQs",
    description:
      "Answers to common questions about MayankFin live trading classes, payments, and course access.",
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
};




export default function FAQPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our stock market courses, enrollment process, and platform features.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            {/* <TabsTrigger value="courses">Courses</TabsTrigger> */}
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is {PLATFORM_NAME}?</AccordionTrigger>
                <AccordionContent>
                  {PLATFORM_NAME} is an education platform focused on practical, rules-based learning. It helps students
                  at any level build clarity on entries, stop-loss, and risk-reward.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Do I need prior knowledge to take your courses?</AccordionTrigger>
                <AccordionContent>
                  Not at all! We offer courses for all experience levels. Our beginner courses assume no prior knowledge
                  and start with the fundamentals. For those with some experience, our intermediate and advanced courses
                  build upon existing knowledge to develop more sophisticated trading and investment strategies. Each
                  course description clearly indicates the recommended experience level.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How long do I have access to a course after purchase?</AccordionTrigger>
                <AccordionContent>
                  You receive lifetime access to the course materials, including future updates and improvements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Do you offer a money-back guarantee?</AccordionTrigger>
                <AccordionContent>
                  Yes. If you request within 30 days and have completed less than 30% of the course, you’re eligible for
                  a refund. Any exceptions (such as heavily discounted offers) are shown at checkout.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/*
          <TabsContent value="courses" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What topics do your courses cover?</AccordionTrigger>
                <AccordionContent>
                  Our courses cover a wide range of stock market and investment topics, including:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Stock market fundamentals and terminology</li>
                    <li>Technical analysis and chart reading</li>
                    <li>Fundamental analysis and company valuation</li>
                    <li>Day trading and swing trading strategies</li>
                    <li>Options trading and derivatives</li>
                    <li>Risk management and portfolio construction</li>
                    <li>Market psychology and behavioral finance</li>
                    <li>Algorithmic trading basics</li>
                  </ul>
                  New courses are added regularly based on market trends and student requests.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How are the courses structured?</AccordionTrigger>
                <AccordionContent>
                  Each course is divided into modules, with each module containing multiple video lessons. Courses also
                  include:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Downloadable resources and worksheets</li>
                    <li>Interactive quizzes to test your knowledge</li>
                    <li>Practical exercises and assignments</li>
                    <li>Case studies and real-world examples</li>
                    <li>Discussion forums to engage with instructors and peers</li>
                  </ul>
                  You can progress through the material at your own pace, and your progress is automatically saved.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How long does it take to complete a course?</AccordionTrigger>
                <AccordionContent>
                  Course duration varies depending on the complexity and depth of the material. Most courses range from
                  20 to 60 hours of video content, plus additional time for exercises and practice. The actual
                  completion time depends on your learning pace and how much time you dedicate to the course. Each
                  course page provides an estimated completion time, and you can take as long as you need to finish the
                  material.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Do you provide certificates upon completion?</AccordionTrigger>
                <AccordionContent>
                  Yes, you'll receive a certificate of completion after finishing a course. This certificate can be
                  downloaded, printed, or shared on professional networks like LinkedIn. While our certificates
                  demonstrate your commitment to learning and skill development, please note they are not accredited by
                  financial regulatory bodies and do not qualify you as a licensed financial advisor.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I interact with instructors during the course?</AccordionTrigger>
                <AccordionContent>
                  Yes, all courses include access to a discussion forum where you can ask questions and receive feedback
                  from instructors and fellow students. Pro and Premium plans also include monthly live Q&A sessions
                  with instructors. Premium plan members receive direct access to instructors through one-on-one
                  mentorship sessions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          */}

          <TabsContent value="payment" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  You can pay using all major credit/debit cards, UPI, and net banking. Payments are processed securely.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Are there any hidden fees or subscription charges?</AccordionTrigger>
                <AccordionContent>
                  No. You pay once to book your seat. There are no hidden fees or subscriptions.
                </AccordionContent>
              </AccordionItem>

              {/*
              <AccordionItem value="item-5">
                <AccordionTrigger>How do refunds work?</AccordionTrigger>
                <AccordionContent>
                  If you're unsatisfied with a course, you can request a refund within 30 days of purchase, provided
                  you've completed less than 30% of the course. To request a refund:
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Log into your account</li>
                    <li>Go to "My Courses"</li>
                    <li>Select the course you wish to refund</li>
                    <li>Click on "Request Refund"</li>
                    <li>Fill out the refund request form</li>
                  </ol>
                  Our support team will process your request within 3-5 business days, and the refund will be issued to
                  your original payment method within 5-10 business days.
                </AccordionContent>
              </AccordionItem>
              */}
            </Accordion>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What are the technical requirements for accessing courses?</AccordionTrigger>
                <AccordionContent>
                  Our platform is web-based and works on modern browsers (Chrome, Firefox, Safari, Edge). For the best
                  experience, we recommend:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>A stable internet connection (10 Mbps or higher for smooth HD playback)</li>
                    <li>Latest or recent browser version</li>
                    <li>Audio output (speakers/headphones) for video lessons</li>
                    <li>At least 4 GB RAM and an updated OS for best performance</li>
                  </ul>
                  Mobile apps for iOS and Android are also available, and progress syncs across devices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I download course videos for offline viewing?</AccordionTrigger>
                <AccordionContent>
                  Not at this time. To protect instructor content and ensure you always have the latest updates, videos
                  are available for streaming only. You can access your courses anytime with an internet connection on
                  desktop or mobile.
                </AccordionContent>
              </AccordionItem>

              {/*
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I track my progress in a course?</AccordionTrigger>
                <AccordionContent>
                  Our platform automatically tracks your progress as you complete lessons and modules. You can view your
                  progress on your course dashboard, which shows:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Percentage of course completed</li>
                    <li>Modules and lessons completed</li>
                    <li>Quiz scores and assessment results</li>
                    <li>Estimated time to completion</li>
                  </ul>
                  You can resume your course exactly where you left off, even if you switch devices.
                </AccordionContent>
              </AccordionItem>
              */}

              <AccordionItem value="item-4">
                <AccordionTrigger>What should I do if I encounter technical issues?</AccordionTrigger>
                <AccordionContent>
                  If you run into a technical issue, try these quick steps:
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Visit the Help Center and follow the troubleshooting guide</li>
                    <li>Refresh the page and sign out/in again</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Try a different browser or device</li>
                    <li>
                      Contact our technical support team via the "Help" button in your account or email
                      support@{PLATFORM_NAME}.com
                    </li>
                  </ol>
                  Our support team is available Monday through Sunday, 9 AM to 9 PM IST, and typically responds within
                  24 hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Is my personal and payment information secure?</AccordionTrigger>
                <AccordionContent>
                  Yes. We take security seriously and use industry-standard safeguards to protect your information:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>All data is encrypted in transit with SSL/TLS</li>
                    <li>Payments are processed by trusted providers (Stripe, PayPal)</li>
                    <li>We do not store full credit card details</li>
                    <li>Regular security reviews and updates</li>
                    <li>Compliance with applicable data protection regulations</li>
                  </ul>
                  For more details, please refer to our Privacy Policy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="mt-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                If you couldn't find the answer you were looking for, our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact-us">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


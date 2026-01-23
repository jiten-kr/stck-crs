

import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";
import LiveTradingClass from "@/components/pages/LiveTradingClass";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Live Stock Market & Crypto Trading Class | Learn & Trade Confidently",
  description:
    "Join our live online stock market and crypto trading classes. Learn real-world trading strategies, risk management, and market psychology. Beginner-friendly. Limited seats.",

  keywords: [
    "live stock market class",
    "crypto trading class",
    "online trading course",
    "learn stock trading",
    "learn crypto trading",
    "live trading workshop",
    "stock market for beginners",
    "crypto trading for beginners",
    "online trading class india",
  ],

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Live Stock Market & Crypto Trading Class",
    description:
      "Learn stock market & crypto trading live with practical strategies, real examples, and expert guidance. Join now – limited seats available.",
    url: "https://mayankfin.com",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png", // 1200x630 recommended
        width: 1200,
        height: 630,
        alt: "Live Stock Market & Crypto Trading Class",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Live Stock Market & Crypto Trading Class",
    description:
      "Join live stock market & crypto trading classes. Learn practical trading, risk management & real strategies.",
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

export default function LiveTradingClassPage() {
  return <LiveTradingClass />
}

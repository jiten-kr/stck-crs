import type { Metadata } from "next";
import PaymentSuccessPage from "@/components/payment-success/PaymentSuccessPage";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Payment Successful | Order Confirmed",
  description:
    "Your payment has been successfully processed. Thank you for enrolling in MayankFin live trading classes. Check your email for confirmation details.",

  authors: [{ name: "Mayank Kumar" }],
  creator: "Mayank Kumar",
  publisher: "Mayank Kumar",

  metadataBase: new URL("https://mayankfin.com"),

  alternates: {
    canonical: "/payment-success",
  },

  openGraph: {
    title: PLATFORM_NAME + " - Payment Successful",
    description:
      "Your enrollment is confirmed. Welcome to MayankFin live trading classes.",
    url: "https://mayankfin.com/payment-success",
    siteName: "MayankFin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MayankFin Payment Success",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PLATFORM_NAME + " - Payment Successful",
    description:
      "Your enrollment is confirmed. Welcome to MayankFin live trading classes.",
    images: ["/og-image.png"],
  },

  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccess() {
  return <PaymentSuccessPage />;
}

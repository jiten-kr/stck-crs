import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} - Sign In`,
  description: "Sign in to your MayankFin account to access your dashboard.",
  metadataBase: new URL("https://mayankfin.com"),
  alternates: {
    canonical: "/signin",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
  openGraph: {
    title: `${PLATFORM_NAME} - Sign In`,
    description: "Sign in securely to your MayankFin account.",
    url: "https://mayankfin.com/signin",
    siteName: "MayankFin",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PLATFORM_NAME} - Sign In`,
    description: "Sign in securely to your account.",
  },
  category: "account",
};

export default function SignInPage() {
  return <SignInForm />;
}

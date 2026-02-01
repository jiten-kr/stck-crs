import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} - Sign Up`,
  description:
    "Create your MayankFin account to access courses and manage your profile.",
  metadataBase: new URL("https://mayankfin.com"),
  alternates: {
    canonical: "/signup",
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
    title: `${PLATFORM_NAME} - Sign Up`,
    description: "Create your MayankFin account securely.",
    url: "https://mayankfin.com/signup",
    siteName: "MayankFin",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PLATFORM_NAME} - Sign Up`,
    description: "Create your account securely.",
  },
  category: "account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}

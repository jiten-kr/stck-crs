import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} - Reset Password`,
  description:
    "Reset your MayankFin account password securely and regain access to your account.",
  metadataBase: new URL("https://mayankfin.com"),
  alternates: {
    canonical: "/reset-password",
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
    title: `${PLATFORM_NAME} - Reset Password`,
    description: "Securely reset your MayankFin account password.",
    url: "https://mayankfin.com/reset-password",
    siteName: "MayankFin",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PLATFORM_NAME} - Reset Password`,
    description: "Reset your account password securely.",
  },
  category: "account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}


import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - My Account",
  description:
    "Manage your MayankFin account. Update your profile, change your password, and view your purchased courses.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

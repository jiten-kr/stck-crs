import { redirect } from "next/navigation";
import LiveClassBookingsAdminClient from "./LiveClassBookingsAdminClient";
import { getAdminSessionUser } from "@/lib/auth/admin";
import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Live Class Bookings (Admin)",
  description:
    "Admin panel to track customer details, payment state, and delivery status for live class bookings including email and WhatsApp notifications.",
};

export default async function LiveClassBookingsPage() {
  const adminSession = await getAdminSessionUser();
  if (adminSession.state === "unauthenticated") {
    redirect("/auth/signin");
  }

  if (adminSession.state === "forbidden") {
    redirect("/");
  }

  return (
    <div className="container space-y-4 px-4 py-8 md:px-6 md:py-12">
      <div>
        <h1 className="text-2xl font-semibold">Live Class Bookings (Admin)</h1>
        <p className="text-sm text-muted-foreground">
          Track customer details, payment state, and delivery status for email
          and WhatsApp notifications.
        </p>
      </div>
      <LiveClassBookingsAdminClient />
    </div>
  );
}

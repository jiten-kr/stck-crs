import { redirect } from "next/navigation";
import { getAdminSessionUser } from "@/lib/auth/admin";
import ManageLiveClassLinksClient from "./ManageLiveClassLinksClient";
import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: PLATFORM_NAME + " - Manage Live Class Links (Admin)",
  description:
    "Admin panel to set and manage live class meeting URLs and WhatsApp group links for each live course.",
};

export default async function ManageLiveClassLinksPage() {
  const adminSession = await getAdminSessionUser();
  if (adminSession.state === "unauthenticated") {
    redirect("/auth/signin");
  }

  if (adminSession.state === "forbidden") {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto space-y-6 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Manage{" "}
            <span className="text-blue-600">live class links</span>
          </h1>
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            Set the live class meeting URL and WhatsApp group link for each
            live course. Only administrators can view or change these values.
          </p>
        </div>
        <ManageLiveClassLinksClient />
      </div>
    </div>
  );
}

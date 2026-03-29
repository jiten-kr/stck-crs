import { redirect } from "next/navigation";
import { getAdminSessionUser } from "@/lib/auth/admin";
import ManageLiveClassLinksClient from "./ManageLiveClassLinksClient";

export default async function ManageLiveClassLinksPage() {
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
        <h1 className="text-2xl font-semibold">Manage live class links</h1>
        <p className="text-sm text-muted-foreground">
          Set the live class meeting URL and WhatsApp group link for each live
          course. Only administrators can view or change these values.
        </p>
      </div>
      <ManageLiveClassLinksClient />
    </div>
  );
}

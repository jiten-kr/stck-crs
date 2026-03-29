import { verifyJWT } from "@/lib/api/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SessionUser = {
  access_role?: string | null;
};

export default async function LiveClassBookingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/signin");
  }

  const user = verifyJWT<SessionUser>(token);
  if (!user) {
    redirect("/auth/signin");
  }

  if (user.access_role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-semibold">Live Class Bookings (Admin)</h1>
    </div>
  );
}

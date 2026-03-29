import { verifyJWT } from "@/lib/api/jwt";
import { cookies } from "next/headers";

type SessionUser = {
  id: number;
  access_role?: string | null;
};

export type AdminSessionResult =
  | { state: "unauthenticated" }
  | { state: "forbidden" }
  | { state: "authorized"; user: SessionUser };

export async function getAdminSessionUser(): Promise<AdminSessionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return { state: "unauthenticated" };
  }

  const user = verifyJWT<SessionUser>(token);
  if (!user?.id) {
    return { state: "unauthenticated" };
  }

  if (user.access_role !== "admin") {
    return { state: "forbidden" };
  }

  return { state: "authorized", user };
}

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../api/jwt";

export const validateRequest = <T extends object>(request: NextRequest) => {
  // Get token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  // Verify token
  const decoded = verifyJWT(token) as T;

  return decoded;
};

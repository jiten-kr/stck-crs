import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../api/jwt";

type ValidationResult<T> = {
  decoded?: T;
  status: boolean;
  send401?(): NextResponse<{
    error: string;
  }>;
};

export const validateRequest = <T extends object>(
  request: NextRequest
): ValidationResult<T> => {
  // Get token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      status: false,
      send401,
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = verifyJWT(token) as T;
    if (!decoded) {
      return {
        status: false,
        send401,
      };
    }
    return { decoded, status: true };
  } catch (err) {
    console.error("Token validation error:", err);
    return {
      status: false,
      send401,
    };
  }
};

function send401() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

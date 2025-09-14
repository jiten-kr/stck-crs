import { AuthenticatedRequest, withAuth } from "@/lib/middleware/auth";
import { AuthDebugger } from "@/lib/middleware/debug";
import { getUserId, getUserRole, isAdmin } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "../../../debug.config";

/**
 * Debug API route to test authentication and logging
 * This route demonstrates various debugging features
 */

// Public debug route (no authentication required)
export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  logger.info("🔍 Debug route accessed", {
    pathname,
    query: Object.fromEntries(searchParams),
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Debug route is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    debug: {
      enabled: process.env.DEBUG === "1",
      authEnabled: process.env.DEBUG_AUTH === "1",
      apiEnabled: process.env.DEBUG_API === "1",
      middlewareEnabled: process.env.DEBUG_MIDDLEWARE === "1",
    },
    instructions: {
      "To test authentication": "Send a POST request with Authorization header",
      "To test role-based access": "Send a PUT request (admin only)",
      "To test optional auth":
        "Send a PATCH request (works with or without auth)",
    },
  });
}

// Protected debug route (authentication required)
async function protectedDebug(request: AuthenticatedRequest) {
  const userId = getUserId(request);
  const userRole = getUserRole(request);

  AuthDebugger.logApiAccess(
    request,
    userId || undefined,
    userRole || undefined
  );

  logger.success("✅ Protected debug route accessed", {
    userId,
    userRole,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Protected debug route accessed successfully!",
    user: {
      id: userId,
      role: userRole,
    },
    timestamp: new Date().toISOString(),
    debug: {
      isAuthenticated: !!userId,
      isAdmin: isAdmin(request),
      middlewareWorking: true,
    },
  });
}

export const POST = withAuth(protectedDebug);

// Admin-only debug route
async function adminDebug(request: AuthenticatedRequest) {
  const userId = getUserId(request);
  const userRole = getUserRole(request);

  AuthDebugger.logRoleCheck("admin", userRole || "unknown", true);
  AuthDebugger.logApiAccess(
    request,
    userId || undefined,
    userRole || undefined
  );

  logger.success("🔐 Admin debug route accessed", {
    userId,
    userRole,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Admin debug route accessed successfully!",
    user: {
      id: userId,
      role: userRole,
    },
    timestamp: new Date().toISOString(),
    debug: {
      isAdmin: true,
      roleCheckPassed: true,
      middlewareWorking: true,
    },
  });
}

export const PUT = withAuth(adminDebug);

// Optional authentication debug route
async function optionalDebug(request: AuthenticatedRequest) {
  const userId = getUserId(request);
  const userRole = getUserRole(request);
  const isAuthenticated = !!userId;

  logger.info("🔄 Optional auth debug route accessed", {
    isAuthenticated,
    userId,
    userRole,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Optional auth debug route accessed!",
    user: {
      id: userId,
      role: userRole,
      isAuthenticated,
    },
    timestamp: new Date().toISOString(),
    debug: {
      optionalAuthWorking: true,
      middlewareWorking: true,
    },
  });
}

export const PATCH = withAuth(optionalDebug);

// Error testing route
export async function DELETE(request: NextRequest) {
  logger.warn("⚠️ Error testing route accessed");

  try {
    // Simulate an error for testing
    throw new Error("This is a test error for debugging purposes");
  } catch (error) {
    AuthDebugger.logError(error as Error, "Error Testing Route", request);

    return NextResponse.json(
      {
        message: "Error testing route - this is expected!",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

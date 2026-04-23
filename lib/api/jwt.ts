import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/** httpOnly cookie max-age (seconds). JWTs omit `exp`; keep cookie aligned for server-side reads. */
export const AUTH_TOKEN_COOKIE_MAX_AGE_SEC = 10 * 365 * 24 * 60 * 60; // ~10 years

/**
 * Sign a JWT. By default no `expiresIn` is set, so the token does not include `exp` and does not
 * expire until the secret rotates. Pass `options.expiresIn` if you need a shorter-lived token.
 */
export function generateJWT<T extends object>(
  payload: T,
  options: SignOptions = {},
): string {
  return jwt.sign(payload, JWT_SECRET, options);
}

// Return type can be `JwtPayload` or null
export function verifyJWT<T extends object>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

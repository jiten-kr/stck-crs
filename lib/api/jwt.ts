import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generic payload type
export function generateJWT<T extends object>(
  payload: T,
  options: SignOptions = { expiresIn: "1h" }
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

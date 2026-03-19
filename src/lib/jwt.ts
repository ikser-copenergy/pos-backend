import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "pos-jwt-fallback-secret";
const JWT_EXPIRES_IN = "24h";

export interface JwtPayload {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

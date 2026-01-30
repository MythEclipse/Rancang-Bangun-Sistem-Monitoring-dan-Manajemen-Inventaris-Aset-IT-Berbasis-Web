import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

export type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

export interface AuthUser {
  sub: string;
  role: Role;
}

// Elysia plugin that provides auth context
export const authMiddleware = new Elysia({ name: "auth-middleware" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: JWT_ACCESS_SECRET,
    }),
  )
  .derive(async ({ jwtAccess, headers }) => {
    const authHeader = headers["authorization"];
    if (!authHeader) {
      return { user: null as AuthUser | null };
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return { user: null as AuthUser | null };
    }
    try {
      const payload = await jwtAccess.verify(token);
      if (!payload) {
        return { user: null as AuthUser | null };
      }
      return {
        user: payload as AuthUser,
      };
    } catch {
      return { user: null as AuthUser | null };
    }
  });

// Helper function to check if user has required role
export function hasRole(user: AuthUser | null, allowedRoles: Role[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

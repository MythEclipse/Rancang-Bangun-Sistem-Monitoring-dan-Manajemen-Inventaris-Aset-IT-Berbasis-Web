import { Elysia, t } from "elysia";
import { authService } from "../services/auth";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authService)
  .post(
    "/login",
    async ({ auth, body, request }) => {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";
      return await auth.login({ ...body, ip, userAgent });
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  )
  .post(
    "/register",
    async ({ auth, body }) => {
      return await auth.register(body);
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        email: t.String({ format: "email" }),
        fullName: t.String(),
        role: t.Optional(t.String()), // Should validate enum
      }),
    },
  );

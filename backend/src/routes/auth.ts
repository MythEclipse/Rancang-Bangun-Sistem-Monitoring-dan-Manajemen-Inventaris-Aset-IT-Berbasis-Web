import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { users, sessions, loginLogs } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: JWT_ACCESS_SECRET,
      exp: "15m",
    }),
  )
  .use(
    jwt({
      name: "jwtRefresh",
      secret: JWT_REFRESH_SECRET,
      exp: "7d",
    }),
  )
  .post(
    "/login",
    async ({ jwtAccess, jwtRefresh, body, request, set }) => {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, body.username));

      if (!user || !(await bcrypt.compare(body.password, user.password))) {
        await db.insert(loginLogs).values({
          action: "FAILED_ATTEMPT",
          ipAddress: ip,
          userAgent: userAgent,
          success: false,
          failReason: "Invalid credentials",
        });
        set.status = 401;
        return { error: "Invalid credentials" };
      }

      const accessToken = await jwtAccess.sign({
        sub: user.id,
        role: user.role,
      });
      const refreshToken = await jwtRefresh.sign({ sub: user.id });

      await db.insert(sessions).values({
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        ipAddress: ip,
        userAgent: userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await db.insert(loginLogs).values({
        userId: user.id,
        action: "LOGIN",
        ipAddress: ip,
        userAgent: userAgent,
        success: true,
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
        },
      };
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
    async ({ body, set }) => {
      try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const [newUser] = await db
          .insert(users)
          .values({
            username: body.username,
            password: hashedPassword,
            email: body.email,
            fullName: body.fullName,
            role: body.role || "TECHNICIAN",
          })
          .returning();

        return {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        };
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Registration failed" };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        email: t.String({ format: "email" }),
        fullName: t.String(),
        role: t.Optional(t.String()),
      }),
    },
  );

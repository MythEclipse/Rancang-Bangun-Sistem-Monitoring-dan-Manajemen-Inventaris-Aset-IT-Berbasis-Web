import { db } from "../db";
import { users, sessions, loginLogs } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Elysia } from "elysia";
import { jwtAccess, jwtRefresh } from "../utils/jwt";

export const authService = new Elysia({ name: "service.auth" })
  .use(jwtAccess)
  .use(jwtRefresh)
  .derive(({ jwtAccess, jwtRefresh }) => ({
    auth: {
      async login({ username, password, ip, userAgent }: any) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));

        if (!user || !(await bcrypt.compare(password, user.password))) {
          // Log failure
          await db.insert(loginLogs).values({
            action: "FAILED_ATTEMPT",
            ipAddress: ip,
            userAgent: userAgent,
            success: false,
            failReason: "Invalid credentials",
          });
          throw new Error("Invalid credentials");
        }

        const accessToken = await jwtAccess.sign({
          sub: user.id,
          role: user.role,
        });
        const refreshToken = await jwtRefresh.sign({ sub: user.id });

        // Create session
        await db.insert(sessions).values({
          userId: user.id,
          token: accessToken,
          refreshToken: refreshToken,
          ipAddress: ip,
          userAgent: userAgent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Log success
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

      async register({ username, password, email, fullName, role }: any) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await db
          .insert(users)
          .values({
            username,
            password: hashedPassword,
            email,
            fullName,
            role: role || "TECHNICIAN",
          })
          .returning();

        return newUser;
      },
    },
  }));

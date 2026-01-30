import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import bcrypt from "bcrypt";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

export const usersRoutes = new Elysia({ prefix: "/users" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: JWT_ACCESS_SECRET,
    }),
  )
  .derive(async ({ jwtAccess, headers }) => {
    const authHeader = headers["authorization"];
    if (!authHeader) {
      return { user: null as { sub: string; role: Role } | null };
    }
    const token = authHeader.split(" ")[1];
    const payload = await jwtAccess.verify(token);
    return { user: payload as { sub: string; role: Role } | null };
  })
  .get("/", async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    if (user.role !== "ADMIN") {
      set.status = 403;
      return { error: "Admin access required" };
    }
    return await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        fullName: users.fullName,
        phone: users.phone,
        role: users.role,
        departmentId: users.departmentId,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(desc(users.createdAt));
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    if (user.role !== "ADMIN") {
      set.status = 403;
      return { error: "Admin access required" };
    }
    const [foundUser] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        fullName: users.fullName,
        phone: users.phone,
        role: users.role,
        departmentId: users.departmentId,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));
    if (!foundUser) {
      set.status = 404;
      return { error: "User not found" };
    }
    return foundUser;
  })
  .post(
    "/",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      if (user.role !== "ADMIN") {
        set.status = 403;
        return { error: "Admin access required" };
      }
      try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const [newUser] = await db
          .insert(users)
          .values({
            username: body.username,
            password: hashedPassword,
            email: body.email,
            fullName: body.fullName,
            phone: body.phone,
            role: body.role || "TECHNICIAN",
            departmentId: body.departmentId,
          })
          .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            fullName: users.fullName,
            role: users.role,
          });
        return newUser;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to create user" };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        email: t.String({ format: "email" }),
        fullName: t.String(),
        phone: t.Optional(t.String()),
        role: t.Optional(t.String()),
        departmentId: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      if (user.role !== "ADMIN") {
        set.status = 403;
        return { error: "Admin access required" };
      }
      try {
        const updateData: any = { ...body };
        if (body.password) {
          updateData.password = await bcrypt.hash(body.password, 10);
        }
        const [updatedUser] = await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, id))
          .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            fullName: users.fullName,
            role: users.role,
          });
        return updatedUser;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to update user" };
      }
    },
    {
      body: t.Object({
        username: t.Optional(t.String()),
        password: t.Optional(t.String()),
        email: t.Optional(t.String()),
        fullName: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        role: t.Optional(t.String()),
        departmentId: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
    },
  )
  .delete("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    if (user.role !== "ADMIN") {
      set.status = 403;
      return { error: "Admin access required" };
    }
    const [deletedUser] = await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return { success: true, id: deletedUser?.id };
  });

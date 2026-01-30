import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { categories } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

export const categoriesRoutes = new Elysia({ prefix: "/categories" })
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
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(desc(categories.createdAt));
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    if (!category) {
      set.status = 404;
      return { error: "Category not found" };
    }
    return category;
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
        const [newCategory] = await db
          .insert(categories)
          .values(body)
          .returning();
        return newCategory;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to create category" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        parentId: t.Optional(t.String()),
        maintenanceIntervalDays: t.Optional(t.Number()),
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
      const [updated] = await db
        .update(categories)
        .set(body)
        .where(eq(categories.id, id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        code: t.Optional(t.String()),
        description: t.Optional(t.String()),
        icon: t.Optional(t.String()),
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
    const [deleted] = await db
      .update(categories)
      .set({ isActive: false })
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    return { success: true, id: deleted?.id };
  });

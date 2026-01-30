import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { vendors } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

export const vendorsRoutes = new Elysia({ prefix: "/vendors" })
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
      .from(vendors)
      .where(eq(vendors.isActive, true))
      .orderBy(desc(vendors.createdAt));
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    if (!vendor) {
      set.status = 404;
      return { error: "Vendor not found" };
    }
    return vendor;
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
        const [newVendor] = await db.insert(vendors).values(body).returning();
        return newVendor;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to create vendor" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        contactPerson: t.Optional(t.String()),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String()),
        city: t.Optional(t.String()),
        website: t.Optional(t.String()),
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
        .update(vendors)
        .set(body)
        .where(eq(vendors.id, id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        contactPerson: t.Optional(t.String()),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
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
      .update(vendors)
      .set({ isActive: false })
      .where(eq(vendors.id, id))
      .returning({ id: vendors.id });
    return { success: true, id: deleted?.id };
  });

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { locations } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

export const locationsRoutes = new Elysia({ prefix: "/locations" })
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
      .from(locations)
      .where(eq(locations.isActive, true))
      .orderBy(desc(locations.createdAt));
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));
    if (!location) {
      set.status = 404;
      return { error: "Location not found" };
    }
    return location;
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
        const [newLocation] = await db
          .insert(locations)
          .values(body)
          .returning();
        return newLocation;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to create location" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        building: t.Optional(t.String()),
        floor: t.Optional(t.String()),
        room: t.Optional(t.String()),
        address: t.Optional(t.String()),
        city: t.Optional(t.String()),
        description: t.Optional(t.String()),
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
        .update(locations)
        .set(body)
        .where(eq(locations.id, id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        code: t.Optional(t.String()),
        building: t.Optional(t.String()),
        floor: t.Optional(t.String()),
        room: t.Optional(t.String()),
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
      .update(locations)
      .set({ isActive: false })
      .where(eq(locations.id, id))
      .returning({ id: locations.id });
    return { success: true, id: deleted?.id };
  });

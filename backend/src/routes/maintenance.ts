import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { maintenanceLogs } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

function generateMaintenanceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `MNT-${year}${month}-${random}`;
}

export const maintenanceRoutes = new Elysia({ prefix: "/maintenance" })
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
    if (user.role === "TECHNICIAN") {
      return await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.technicianId, user.sub))
        .orderBy(desc(maintenanceLogs.createdAt));
    }
    return await db
      .select()
      .from(maintenanceLogs)
      .orderBy(desc(maintenanceLogs.createdAt));
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    const [log] = await db
      .select()
      .from(maintenanceLogs)
      .where(eq(maintenanceLogs.id, id));
    if (!log) {
      set.status = 404;
      return { error: "Maintenance log not found" };
    }
    return log;
  })
  .post(
    "/",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      if (user.role !== "ADMIN" && user.role !== "TECHNICIAN") {
        set.status = 403;
        return { error: "Admin or Technician access required" };
      }
      try {
        const [newLog] = await db
          .insert(maintenanceLogs)
          .values({
            maintenanceNumber: generateMaintenanceNumber(),
            assetId: body.assetId,
            technicianId: user.sub,
            maintenanceType: body.maintenanceType as any,
            title: body.title,
            description: body.description,
            findings: body.findings,
            actionTaken: body.actionTaken,
            status: "SCHEDULED",
            priority: body.priority as any,
            scheduledDate: body.scheduledDate,
          })
          .returning();
        return newLog;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to create maintenance log" };
      }
    },
    {
      body: t.Object({
        assetId: t.String(),
        maintenanceType: t.String(),
        title: t.String(),
        description: t.Optional(t.String()),
        findings: t.Optional(t.String()),
        actionTaken: t.Optional(t.String()),
        priority: t.Optional(t.String()),
        scheduledDate: t.Optional(t.String()),
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
      if (user.role !== "ADMIN" && user.role !== "TECHNICIAN") {
        set.status = 403;
        return { error: "Admin or Technician access required" };
      }
      const updateData: any = { ...body };
      if (body.status === "COMPLETED") {
        updateData.completedAt = new Date();
      }
      const [updated] = await db
        .update(maintenanceLogs)
        .set(updateData)
        .where(eq(maintenanceLogs.id, id))
        .returning();
      return updated;
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        findings: t.Optional(t.String()),
        actionTaken: t.Optional(t.String()),
        recommendation: t.Optional(t.String()),
        status: t.Optional(t.String()),
        technicianNotes: t.Optional(t.String()),
      }),
    },
  );

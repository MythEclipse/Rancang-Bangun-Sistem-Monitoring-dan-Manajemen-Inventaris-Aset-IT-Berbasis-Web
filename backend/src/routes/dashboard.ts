import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import {
  assets,
  users,
  maintenanceLogs,
  requests,
  categories,
  locations,
} from "../db/schema";
import { eq, sql, isNull, count } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })
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
  .get("/stats", async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const [assetStats] = await db
      .select({
        total: count(),
        active: sql<number>`count(*) filter (where ${assets.status} = 'ACTIVE')`,
        repair: sql<number>`count(*) filter (where ${assets.status} = 'REPAIR')`,
        broken: sql<number>`count(*) filter (where ${assets.status} = 'BROKEN')`,
        disposed: sql<number>`count(*) filter (where ${assets.status} = 'DISPOSED')`,
      })
      .from(assets)
      .where(isNull(assets.deletedAt));

    const [maintenanceStats] = await db
      .select({
        total: count(),
        scheduled: sql<number>`count(*) filter (where ${maintenanceLogs.status} = 'SCHEDULED')`,
        inProgress: sql<number>`count(*) filter (where ${maintenanceLogs.status} = 'IN_PROGRESS')`,
        completed: sql<number>`count(*) filter (where ${maintenanceLogs.status} = 'COMPLETED')`,
      })
      .from(maintenanceLogs);

    const [requestStats] = await db
      .select({
        total: count(),
        pending: sql<number>`count(*) filter (where ${requests.status} in ('SUBMITTED', 'PENDING_APPROVAL'))`,
        approved: sql<number>`count(*) filter (where ${requests.status} = 'APPROVED')`,
        rejected: sql<number>`count(*) filter (where ${requests.status} = 'REJECTED')`,
      })
      .from(requests);

    let roleData = {};

    if (user.role === "TECHNICIAN") {
      const [myMaintenance] = await db
        .select({
          total: count(),
          scheduled: sql<number>`count(*) filter (where ${maintenanceLogs.status} = 'SCHEDULED')`,
          inProgress: sql<number>`count(*) filter (where ${maintenanceLogs.status} = 'IN_PROGRESS')`,
        })
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.technicianId, user.sub));

      const [myRequests] = await db
        .select({
          total: count(),
          pending: sql<number>`count(*) filter (where ${requests.status} in ('SUBMITTED', 'PENDING_APPROVAL'))`,
        })
        .from(requests)
        .where(eq(requests.requesterId, user.sub));

      roleData = { myMaintenance, myRequests };
    }

    if (user.role === "MANAGER") {
      const [pendingApprovals] = await db
        .select({ count: count() })
        .from(requests)
        .where(sql`${requests.status} in ('SUBMITTED', 'PENDING_APPROVAL')`);
      roleData = { pendingApprovals: pendingApprovals.count };
    }

    if (user.role === "ADMIN") {
      const [userStats] = await db
        .select({
          total: count(),
          admins: sql<number>`count(*) filter (where ${users.role} = 'ADMIN')`,
          technicians: sql<number>`count(*) filter (where ${users.role} = 'TECHNICIAN')`,
          managers: sql<number>`count(*) filter (where ${users.role} = 'MANAGER')`,
        })
        .from(users)
        .where(isNull(users.deletedAt));

      const [categoryCount] = await db
        .select({ count: count() })
        .from(categories)
        .where(eq(categories.isActive, true));

      const [locationCount] = await db
        .select({ count: count() })
        .from(locations)
        .where(eq(locations.isActive, true));

      roleData = {
        users: userStats,
        categories: categoryCount.count,
        locations: locationCount.count,
      };
    }

    return {
      assets: assetStats,
      maintenance: maintenanceStats,
      requests: requestStats,
      role: user.role,
      ...roleData,
    };
  })
  .get("/analytics", async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      set.status = 403;
      return { error: "Admin or Manager access required" };
    }

    const assetsByCategory = await db
      .select({
        categoryId: assets.categoryId,
        count: count(),
      })
      .from(assets)
      .where(isNull(assets.deletedAt))
      .groupBy(assets.categoryId);

    const assetsByStatus = await db
      .select({
        status: assets.status,
        count: count(),
      })
      .from(assets)
      .where(isNull(assets.deletedAt))
      .groupBy(assets.status);

    const maintenanceCosts = await db
      .select({
        month: sql<string>`to_char(${maintenanceLogs.completedAt}, 'YYYY-MM')`,
        totalCost: sql<number>`sum(${maintenanceLogs.totalCost})`,
        count: count(),
      })
      .from(maintenanceLogs)
      .where(sql`${maintenanceLogs.completedAt} >= NOW() - INTERVAL '6 months'`)
      .groupBy(sql`to_char(${maintenanceLogs.completedAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${maintenanceLogs.completedAt}, 'YYYY-MM')`);

    const requestsByType = await db
      .select({
        type: requests.requestType,
        count: count(),
      })
      .from(requests)
      .groupBy(requests.requestType);

    return {
      assetsByCategory,
      assetsByStatus,
      maintenanceCosts,
      requestsByType,
    };
  });

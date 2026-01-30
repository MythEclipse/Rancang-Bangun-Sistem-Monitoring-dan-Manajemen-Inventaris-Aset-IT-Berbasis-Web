import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { requests, approvalHistory } from "../db/schema";
import { eq, desc, or } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

type Role = "ADMIN" | "TECHNICIAN" | "MANAGER";

function generateRequestNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `REQ-${year}${month}-${random}`;
}

export const requestsRoutes = new Elysia({ prefix: "/requests" })
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
        .from(requests)
        .where(eq(requests.requesterId, user.sub))
        .orderBy(desc(requests.createdAt));
    }
    if (user.role === "MANAGER") {
      return await db
        .select()
        .from(requests)
        .where(
          or(
            eq(requests.status, "SUBMITTED"),
            eq(requests.status, "PENDING_APPROVAL"),
          ),
        )
        .orderBy(desc(requests.createdAt));
    }
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    const [request] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, id));
    if (!request) {
      set.status = 404;
      return { error: "Request not found" };
    }
    return request;
  })
  .post(
    "/",
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      if (user.role !== "TECHNICIAN") {
        set.status = 403;
        return { error: "Only Technicians can submit requests" };
      }
      try {
        const [newRequest] = await db
          .insert(requests)
          .values({
            requestNumber: generateRequestNumber(),
            assetId: body.assetId,
            requesterId: user.sub,
            requestType: body.requestType as any,
            title: body.title,
            reason: body.reason,
            justification: body.justification,
            priority: body.priority as any,
            status: "SUBMITTED",
            submittedAt: new Date(),
          })
          .returning();

        await db.insert(approvalHistory).values({
          requestId: newRequest.id,
          approverId: user.sub,
          action: "SUBMITTED",
          newStatus: "SUBMITTED",
          comments: "Request submitted",
        });

        return newRequest;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to create request" };
      }
    },
    {
      body: t.Object({
        assetId: t.String(),
        requestType: t.String(),
        title: t.String(),
        reason: t.String(),
        justification: t.Optional(t.String()),
        priority: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id/approve",
    async ({ params: { id }, body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      if (user.role !== "MANAGER") {
        set.status = 403;
        return { error: "Only Managers can approve requests" };
      }

      const [request] = await db
        .select()
        .from(requests)
        .where(eq(requests.id, id));

      if (!request) {
        set.status = 404;
        return { error: "Request not found" };
      }

      const [updated] = await db
        .update(requests)
        .set({
          status: "APPROVED",
          approvedBy: user.sub,
          approvedAt: new Date(),
          approverNotes: body?.notes,
        })
        .where(eq(requests.id, id))
        .returning();

      await db.insert(approvalHistory).values({
        requestId: id,
        approverId: user.sub,
        action: "APPROVED",
        previousStatus: request.status,
        newStatus: "APPROVED",
        comments: body?.notes || "Request approved",
      });

      return updated;
    },
    {
      body: t.Optional(
        t.Object({
          notes: t.Optional(t.String()),
        }),
      ),
    },
  )
  .put(
    "/:id/reject",
    async ({ params: { id }, body, user, set }) => {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
      if (user.role !== "MANAGER") {
        set.status = 403;
        return { error: "Only Managers can reject requests" };
      }

      const [request] = await db
        .select()
        .from(requests)
        .where(eq(requests.id, id));

      if (!request) {
        set.status = 404;
        return { error: "Request not found" };
      }

      const [updated] = await db
        .update(requests)
        .set({
          status: "REJECTED",
          rejectedBy: user.sub,
          rejectedAt: new Date(),
          rejectionReason: body.reason,
        })
        .where(eq(requests.id, id))
        .returning();

      await db.insert(approvalHistory).values({
        requestId: id,
        approverId: user.sub,
        action: "REJECTED",
        previousStatus: request.status,
        newStatus: "REJECTED",
        comments: body.reason,
      });

      return updated;
    },
    {
      body: t.Object({
        reason: t.String(),
      }),
    },
  );

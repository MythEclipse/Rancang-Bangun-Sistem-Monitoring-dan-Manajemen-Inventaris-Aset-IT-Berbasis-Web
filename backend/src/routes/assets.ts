import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { assets } from "../db/schema";
import { eq, desc, isNull } from "drizzle-orm";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

export const assetRoutes = new Elysia({ prefix: "/assets" })
  .use(
    jwt({
      name: "jwtAccess",
      secret: JWT_ACCESS_SECRET,
    }),
  )
  .derive(async ({ jwtAccess, headers, set }) => {
    const authHeader = headers["authorization"];
    if (!authHeader) {
      return { user: null };
    }
    const token = authHeader.split(" ")[1];
    const payload = await jwtAccess.verify(token);
    return { user: payload };
  })
  .guard({
    beforeHandle: ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }
    },
  })
  .get("/", async () => {
    return await db
      .select()
      .from(assets)
      .where(isNull(assets.deletedAt))
      .orderBy(desc(assets.createdAt));
  })
  .get("/:id", async ({ params: { id }, set }) => {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    if (!asset) {
      set.status = 404;
      return { error: "Not Found" };
    }
    return asset;
  })
  .post(
    "/",
    async ({ body, user }) => {
      const userId = (user as any)?.sub as string;
      const [newAsset] = await db.insert(assets).values(body).returning();
      return newAsset;
    },
    {
      body: t.Object({
        assetCode: t.String(),
        name: t.String(),
        categoryId: t.String(),
        status: t.String(),
        serialNumber: t.Optional(t.String()),
        description: t.Optional(t.String()),
        brand: t.Optional(t.String()),
        model: t.Optional(t.String()),
        purchaseDate: t.Optional(t.String()),
        vendorId: t.Optional(t.String()),
        locationId: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, user }) => {
      const userId = (user as any)?.sub as string;
      const [updatedAsset] = await db
        .update(assets)
        .set(body)
        .where(eq(assets.id, id))
        .returning();
      return updatedAsset;
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        status: t.Optional(t.String()),
        description: t.Optional(t.String()),
        locationId: t.Optional(t.String()),
      }),
    },
  )
  .delete("/:id", async ({ params: { id } }) => {
    const [deletedAsset] = await db
      .update(assets)
      .set({ deletedAt: new Date() })
      .where(eq(assets.id, id))
      .returning();
    return deletedAsset;
  });

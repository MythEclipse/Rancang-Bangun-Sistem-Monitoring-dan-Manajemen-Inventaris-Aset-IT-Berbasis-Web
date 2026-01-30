import { Elysia, t } from "elysia";
import { assetService } from "../services/assets";
import { jwtAccess } from "../utils/jwt";

export const assetRoutes = new Elysia({ prefix: "/assets" })
  .use(assetService)
  .use(jwtAccess)
  .guard({
    beforeHandle: async ({ jwtAccess, headers, set }) => {
      const authHeader = headers["authorization"];
      if (!authHeader) {
        set.status = 401;
        return "Unauthorized";
      }
      const token = authHeader.split(" ")[1];
      const payload = await jwtAccess.verify(token);
      if (!payload) {
        set.status = 401;
        return "Unauthorized";
      }
    },
  })
  .get("/", async ({ asset }) => {
    return await asset.getAll();
  })
  .get("/:id", async ({ asset, params: { id }, set }) => {
    const data = await asset.getById(id);
    if (!data) {
      set.status = 404;
      return "Not Found";
    }
    return data;
  })
  .post(
    "/",
    async ({ asset, body, jwtAccess, headers }) => {
      // Get user ID from token
      const token = headers["authorization"]!.split(" ")[1];
      const payload = await jwtAccess.verify(token);
      const userId = payload!.sub as string;

      return await asset.create(body, userId);
    },
    {
      body: t.Object({
        assetCode: t.String(),
        name: t.String(),
        categoryId: t.String(),
        status: t.String(), // Enum validation would be better
        // ... other fields as optional or required
        serialNumber: t.Optional(t.String()),
        description: t.Optional(t.String()),
        brand: t.Optional(t.String()),
        model: t.Optional(t.String()),
        purchaseDate: t.Optional(t.String()), // Date string
        vendorId: t.Optional(t.String()),
        locationId: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id",
    async ({ asset, params: { id }, body, jwtAccess, headers }) => {
      const token = headers["authorization"]!.split(" ")[1];
      const payload = await jwtAccess.verify(token);
      const userId = payload!.sub as string;

      return await asset.update(id, body, userId);
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        status: t.Optional(t.String()),
        // ... allow updates to other fields
        description: t.Optional(t.String()),
        locationId: t.Optional(t.String()),
      }),
    },
  )
  .delete("/:id", async ({ asset, params: { id } }) => {
    return await asset.delete(id);
  });

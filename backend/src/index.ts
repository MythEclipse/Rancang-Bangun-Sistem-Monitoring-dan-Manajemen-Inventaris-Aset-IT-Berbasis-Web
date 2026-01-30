import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { db } from "./db";
import { sql } from "drizzle-orm";

// Routes
import { authRoutes } from "./routes/auth";
import { assetRoutes } from "./routes/assets";
import { usersRoutes } from "./routes/users";
import { categoriesRoutes } from "./routes/categories";
import { locationsRoutes } from "./routes/locations";
import { vendorsRoutes } from "./routes/vendors";
import { maintenanceRoutes } from "./routes/maintenance";
import { requestsRoutes } from "./routes/requests";
import { dashboardRoutes } from "./routes/dashboard";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "IT Asset Management API",
          version: "1.0.0",
          description:
            "API for IT Asset Management System with multi-actor support (Admin, Technician, Manager)",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Assets", description: "Asset management" },
          { name: "Users", description: "User management (Admin only)" },
          { name: "Categories", description: "Asset categories" },
          { name: "Locations", description: "Asset locations" },
          { name: "Vendors", description: "Vendor management" },
          { name: "Maintenance", description: "Maintenance logs" },
          { name: "Requests", description: "Asset requests & approvals" },
          { name: "Dashboard", description: "Statistics & analytics" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  )
  // Register all routes
  .use(authRoutes)
  .use(assetRoutes)
  .use(usersRoutes)
  .use(categoriesRoutes)
  .use(locationsRoutes)
  .use(vendorsRoutes)
  .use(maintenanceRoutes)
  .use(requestsRoutes)
  .use(dashboardRoutes)
  // Health check
  .get("/", () => ({
    name: "IT Asset Management API",
    version: "1.0.0",
    status: "running",
  }))
  .get("/health", async () => {
    try {
      await db.execute(sql`SELECT 1`);
      return { status: "ok", db: "connected" };
    } catch (error) {
      return { status: "error", db: "disconnected", error: String(error) };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

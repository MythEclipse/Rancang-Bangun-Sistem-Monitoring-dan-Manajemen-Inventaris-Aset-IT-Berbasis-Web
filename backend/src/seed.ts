import { db } from "./db";
import { departments, categories, users, userRoleEnum } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Departments
  const deptData = [
    {
      name: "IT Department",
      code: "IT",
      description: "Information Technology",
      isActive: true,
    },
    {
      name: "Finance",
      code: "FIN",
      description: "Finance & Accounting",
      isActive: true,
    },
    { name: "HR", code: "HR", description: "Human Resources", isActive: true },
  ];

  for (const dept of deptData) {
    if (
      (
        await db
          .select()
          .from(departments)
          .where(eq(departments.code, dept.code))
      ).length === 0
    ) {
      await db.insert(departments).values(dept);
    }
  }

  // Seed Categories
  const catData = [
    {
      name: "Laptop",
      code: "LPT",
      maintenanceIntervalDays: 180,
      depreciationRate: "20.00",
    },
    {
      name: "Desktop",
      code: "DSK",
      maintenanceIntervalDays: 365,
      depreciationRate: "20.00",
    },
    {
      name: "Server",
      code: "SRV",
      maintenanceIntervalDays: 90,
      depreciationRate: "15.00",
    },
    {
      name: "Other",
      code: "OTH",
      maintenanceIntervalDays: 365,
      depreciationRate: "20.00",
    },
  ];

  for (const cat of catData) {
    if (
      (await db.select().from(categories).where(eq(categories.code, cat.code)))
        .length === 0
    ) {
      await db.insert(categories).values(cat);
    }
  }

  // Seed Admin User
  const adminUsername = "admin";
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.username, adminUsername));

  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.insert(users).values({
      username: adminUsername,
      email: "admin@example.com",
      password: hashedPassword,
      fullName: "System Administrator",
      role: "ADMIN",
      isActive: true,
    });
    console.log("✅ Admin user created: admin / password123");
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

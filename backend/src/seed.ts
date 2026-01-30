import { db } from "./db";
import {
  users,
  departments,
  categories,
  locations,
  vendors,
  assets,
} from "./db/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seed...");

  // Create departments
  console.log("Creating departments...");
  const [itDept] = await db
    .insert(departments)
    .values([
      {
        name: "IT Department",
        code: "IT",
        description: "Information Technology Department",
      },
      {
        name: "Human Resources",
        code: "HR",
        description: "Human Resources Department",
      },
      {
        name: "Finance",
        code: "FIN",
        description: "Finance Department",
      },
      {
        name: "Operations",
        code: "OPS",
        description: "Operations Department",
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Create sample users for each role
  console.log("Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  await db
    .insert(users)
    .values([
      {
        username: "admin",
        password: hashedPassword,
        email: "admin@company.com",
        fullName: "System Administrator",
        role: "ADMIN",
        departmentId: itDept?.id,
      },
      {
        username: "technician",
        password: hashedPassword,
        email: "technician@company.com",
        fullName: "John Technician",
        role: "TECHNICIAN",
        departmentId: itDept?.id,
      },
      {
        username: "technician2",
        password: hashedPassword,
        email: "technician2@company.com",
        fullName: "Jane Technician",
        role: "TECHNICIAN",
        departmentId: itDept?.id,
      },
      {
        username: "manager",
        password: hashedPassword,
        email: "manager@company.com",
        fullName: "Mike Manager",
        role: "MANAGER",
        departmentId: itDept?.id,
      },
    ])
    .onConflictDoNothing();

  // Create categories
  console.log("Creating categories...");
  const createdCategories = await db
    .insert(categories)
    .values([
      {
        name: "Laptop",
        code: "LPT",
        description: "Laptop computers",
        icon: "laptop",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Desktop",
        code: "DSK",
        description: "Desktop computers",
        icon: "computer",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Server",
        code: "SRV",
        description: "Server machines",
        icon: "server",
        maintenanceIntervalDays: 90,
      },
      {
        name: "Network Equipment",
        code: "NET",
        description: "Routers, switches, access points",
        icon: "router",
        maintenanceIntervalDays: 90,
      },
      {
        name: "Printer",
        code: "PRT",
        description: "Printers and scanners",
        icon: "printer",
        maintenanceIntervalDays: 60,
      },
      {
        name: "Monitor",
        code: "MON",
        description: "Display monitors",
        icon: "monitor",
        maintenanceIntervalDays: 365,
      },
      {
        name: "Peripheral",
        code: "PER",
        description: "Keyboards, mice, webcams",
        icon: "keyboard",
        maintenanceIntervalDays: 365,
      },
      {
        name: "UPS",
        code: "UPS",
        description: "Uninterruptible Power Supply",
        icon: "battery",
        maintenanceIntervalDays: 180,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Create locations
  console.log("Creating locations...");
  const createdLocations = await db
    .insert(locations)
    .values([
      {
        name: "Main Office - Floor 1",
        code: "MO-F1",
        building: "Main Office",
        floor: "1",
        description: "Ground floor, reception and meeting rooms",
      },
      {
        name: "Main Office - Floor 2",
        code: "MO-F2",
        building: "Main Office",
        floor: "2",
        description: "IT Department and Development",
      },
      {
        name: "Main Office - Floor 3",
        code: "MO-F3",
        building: "Main Office",
        floor: "3",
        description: "Management and HR",
      },
      {
        name: "Server Room",
        code: "SRV-RM",
        building: "Main Office",
        floor: "B1",
        description: "Basement server room",
      },
      {
        name: "Warehouse A",
        code: "WH-A",
        building: "Warehouse",
        description: "Storage warehouse A",
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Create vendors
  console.log("Creating vendors...");
  await db
    .insert(vendors)
    .values([
      {
        name: "Dell Technologies",
        code: "DELL",
        contactPerson: "Sales Team",
        email: "sales@dell.com",
        phone: "+1-800-123-4567",
        website: "https://www.dell.com",
      },
      {
        name: "HP Inc.",
        code: "HP",
        contactPerson: "Account Manager",
        email: "sales@hp.com",
        phone: "+1-800-234-5678",
        website: "https://www.hp.com",
      },
      {
        name: "Lenovo",
        code: "LNV",
        contactPerson: "Business Sales",
        email: "business@lenovo.com",
        phone: "+1-800-345-6789",
        website: "https://www.lenovo.com",
      },
      {
        name: "Cisco Systems",
        code: "CSCO",
        contactPerson: "Network Solutions",
        email: "sales@cisco.com",
        phone: "+1-800-456-7890",
        website: "https://www.cisco.com",
      },
      {
        name: "Local IT Supplier",
        code: "LOCAL",
        contactPerson: "Ahmad",
        email: "ahmad@localsupplier.co.id",
        phone: "+62-21-1234567",
        city: "Jakarta",
      },
    ])
    .onConflictDoNothing();

  // Create sample assets
  console.log("Creating sample assets...");
  const laptopCategory = createdCategories.find((c) => c.code === "LPT");
  const desktopCategory = createdCategories.find((c) => c.code === "DSK");
  const serverCategory = createdCategories.find((c) => c.code === "SRV");
  const floor2Location = createdLocations.find((l) => l.code === "MO-F2");
  const serverRoom = createdLocations.find((l) => l.code === "SRV-RM");

  if (laptopCategory && floor2Location) {
    await db
      .insert(assets)
      .values([
        {
          assetCode: "AST-2024-001",
          serialNumber: "DELL-LPT-001",
          name: "Dell Latitude 5540",
          brand: "Dell",
          model: "Latitude 5540",
          description: "Developer laptop",
          categoryId: laptopCategory.id,
          locationId: floor2Location.id,
          status: "ACTIVE",
          condition: "GOOD",
          purchasePrice: "15000000",
          purchaseDate: "2024-01-15",
        },
        {
          assetCode: "AST-2024-002",
          serialNumber: "DELL-LPT-002",
          name: "Dell Latitude 5540",
          brand: "Dell",
          model: "Latitude 5540",
          description: "Developer laptop",
          categoryId: laptopCategory.id,
          locationId: floor2Location.id,
          status: "ACTIVE",
          condition: "GOOD",
          purchasePrice: "15000000",
          purchaseDate: "2024-01-15",
        },
        {
          assetCode: "AST-2024-003",
          serialNumber: "HP-LPT-001",
          name: "HP EliteBook 840",
          brand: "HP",
          model: "EliteBook 840 G10",
          description: "Manager laptop",
          categoryId: laptopCategory.id,
          locationId: floor2Location.id,
          status: "ACTIVE",
          condition: "EXCELLENT",
          purchasePrice: "18000000",
          purchaseDate: "2024-02-01",
        },
      ])
      .onConflictDoNothing();
  }

  if (desktopCategory && floor2Location) {
    await db
      .insert(assets)
      .values([
        {
          assetCode: "AST-2024-010",
          serialNumber: "DELL-DSK-001",
          name: "Dell OptiPlex 7010",
          brand: "Dell",
          model: "OptiPlex 7010",
          description: "Office workstation",
          categoryId: desktopCategory.id,
          locationId: floor2Location.id,
          status: "ACTIVE",
          condition: "GOOD",
          purchasePrice: "12000000",
          purchaseDate: "2024-01-10",
        },
      ])
      .onConflictDoNothing();
  }

  if (serverCategory && serverRoom) {
    await db
      .insert(assets)
      .values([
        {
          assetCode: "AST-2024-100",
          serialNumber: "DELL-SRV-001",
          name: "Dell PowerEdge R750",
          brand: "Dell",
          model: "PowerEdge R750",
          description: "Main application server",
          categoryId: serverCategory.id,
          locationId: serverRoom.id,
          status: "ACTIVE",
          condition: "EXCELLENT",
          purchasePrice: "85000000",
          purchaseDate: "2024-01-01",
        },
        {
          assetCode: "AST-2024-101",
          serialNumber: "HP-SRV-001",
          name: "HP ProLiant DL380",
          brand: "HP",
          model: "ProLiant DL380 Gen10",
          description: "Database server",
          categoryId: serverCategory.id,
          locationId: serverRoom.id,
          status: "ACTIVE",
          condition: "GOOD",
          purchasePrice: "75000000",
          purchaseDate: "2023-06-15",
        },
      ])
      .onConflictDoNothing();
  }

  console.log("✅ Database seeding completed!");
  console.log("\n📋 Sample login credentials:");
  console.log("----------------------------");
  console.log("Admin:      admin / password123");
  console.log("Technician: technician / password123");
  console.log("Manager:    manager / password123");
  console.log("----------------------------");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});

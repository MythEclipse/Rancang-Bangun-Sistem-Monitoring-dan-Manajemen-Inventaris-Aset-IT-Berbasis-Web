import { db } from "./db";
import {
  users,
  departments,
  categories,
  locations,
  vendors,
  assets,
  maintenanceLogs,
  requests,
  approvalHistory,
} from "./db/schema";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await db.execute(sql`TRUNCATE TABLE approval_history CASCADE`);
  await db.execute(sql`TRUNCATE TABLE requests CASCADE`);
  await db.execute(sql`TRUNCATE TABLE maintenance_logs CASCADE`);
  await db.execute(sql`TRUNCATE TABLE assets CASCADE`);
  await db.execute(sql`TRUNCATE TABLE vendors CASCADE`);
  await db.execute(sql`TRUNCATE TABLE locations CASCADE`);
  await db.execute(sql`TRUNCATE TABLE categories CASCADE`);
  await db.execute(sql`TRUNCATE TABLE users CASCADE`);
  await db.execute(sql`TRUNCATE TABLE departments CASCADE`);

  // ============================================
  // DEPARTMENTS
  // ============================================
  console.log("🏢 Creating departments...");
  const createdDepartments = await db
    .insert(departments)
    .values([
      {
        name: "Teknologi Informasi",
        code: "IT",
        description:
          "Departemen Teknologi Informasi - Pengelolaan infrastruktur IT",
        headName: "Budi Santoso",
        headEmail: "budi.santoso@perusahaan.co.id",
      },
      {
        name: "Sumber Daya Manusia",
        code: "HRD",
        description: "Departemen SDM - Pengelolaan karyawan dan rekrutmen",
        headName: "Siti Rahayu",
        headEmail: "siti.rahayu@perusahaan.co.id",
      },
      {
        name: "Keuangan",
        code: "FIN",
        description:
          "Departemen Keuangan - Pengelolaan anggaran dan pembayaran",
        headName: "Ahmad Wijaya",
        headEmail: "ahmad.wijaya@perusahaan.co.id",
      },
      {
        name: "Operasional",
        code: "OPS",
        description: "Departemen Operasional - Pengelolaan operasional harian",
        headName: "Dewi Kusuma",
        headEmail: "dewi.kusuma@perusahaan.co.id",
      },
      {
        name: "Marketing",
        code: "MKT",
        description: "Departemen Marketing - Pemasaran dan promosi",
        headName: "Rudi Hermawan",
        headEmail: "rudi.hermawan@perusahaan.co.id",
      },
    ])
    .returning();

  const itDept = createdDepartments.find((d) => d.code === "IT");
  const hrdDept = createdDepartments.find((d) => d.code === "HRD");
  const finDept = createdDepartments.find((d) => d.code === "FIN");

  // ============================================
  // USERS
  // ============================================
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const createdUsers = await db
    .insert(users)
    .values([
      // ADMIN
      {
        username: "admin",
        password: hashedPassword,
        email: "admin@perusahaan.co.id",
        fullName: "Administrator Sistem",
        phone: "08123456789",
        role: "ADMIN",
        departmentId: itDept?.id,
      },
      {
        username: "budi.it",
        password: hashedPassword,
        email: "budi.it@perusahaan.co.id",
        fullName: "Budi Santoso",
        phone: "08123456790",
        role: "ADMIN",
        departmentId: itDept?.id,
      },
      // TECHNICIAN
      {
        username: "teknisi1",
        password: hashedPassword,
        email: "andi.teknisi@perusahaan.co.id",
        fullName: "Andi Prasetyo",
        phone: "08123456791",
        role: "TECHNICIAN",
        departmentId: itDept?.id,
      },
      {
        username: "teknisi2",
        password: hashedPassword,
        email: "dedi.teknisi@perusahaan.co.id",
        fullName: "Dedi Kurniawan",
        phone: "08123456792",
        role: "TECHNICIAN",
        departmentId: itDept?.id,
      },
      {
        username: "teknisi3",
        password: hashedPassword,
        email: "eko.teknisi@perusahaan.co.id",
        fullName: "Eko Saputra",
        phone: "08123456793",
        role: "TECHNICIAN",
        departmentId: itDept?.id,
      },
      // MANAGER
      {
        username: "manager",
        password: hashedPassword,
        email: "manager@perusahaan.co.id",
        fullName: "Hendro Gunawan",
        phone: "08123456794",
        role: "MANAGER",
        departmentId: itDept?.id,
      },
      {
        username: "manager.hrd",
        password: hashedPassword,
        email: "manager.hrd@perusahaan.co.id",
        fullName: "Siti Aminah",
        phone: "08123456795",
        role: "MANAGER",
        departmentId: hrdDept?.id,
      },
    ])
    .returning();

  const adminUser = createdUsers.find((u) => u.username === "admin");
  const teknisi1 = createdUsers.find((u) => u.username === "teknisi1");
  const teknisi2 = createdUsers.find((u) => u.username === "teknisi2");
  const managerUser = createdUsers.find((u) => u.username === "manager");

  // ============================================
  // CATEGORIES
  // ============================================
  console.log("📁 Creating categories...");
  const createdCategories = await db
    .insert(categories)
    .values([
      {
        name: "Laptop",
        code: "LPT",
        description: "Komputer portabel untuk mobilitas kerja",
        icon: "💻",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Desktop PC",
        code: "DSK",
        description: "Komputer meja standar untuk pekerjaan kantor",
        icon: "🖥️",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Server",
        code: "SRV",
        description: "Server untuk hosting aplikasi dan database",
        icon: "🖧",
        maintenanceIntervalDays: 90,
      },
      {
        name: "Router",
        code: "RTR",
        description: "Perangkat jaringan untuk routing dan firewall",
        icon: "📡",
        maintenanceIntervalDays: 90,
      },
      {
        name: "Switch",
        code: "SWT",
        description: "Perangkat jaringan untuk konektivitas LAN",
        icon: "🔌",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Access Point",
        code: "WAP",
        description: "Wireless Access Point untuk konektivitas WiFi",
        icon: "📶",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Printer",
        code: "PRT",
        description: "Printer untuk mencetak dokumen",
        icon: "🖨️",
        maintenanceIntervalDays: 60,
      },
      {
        name: "Scanner",
        code: "SCN",
        description: "Scanner untuk digitalisasi dokumen",
        icon: "📄",
        maintenanceIntervalDays: 90,
      },
      {
        name: "Monitor",
        code: "MON",
        description: "Layar display untuk komputer",
        icon: "🖥️",
        maintenanceIntervalDays: 365,
      },
      {
        name: "UPS",
        code: "UPS",
        description: "Uninterruptible Power Supply untuk proteksi daya",
        icon: "🔋",
        maintenanceIntervalDays: 180,
      },
      {
        name: "Proyektor",
        code: "PRJ",
        description: "Proyektor untuk presentasi",
        icon: "📽️",
        maintenanceIntervalDays: 180,
      },
      {
        name: "CCTV",
        code: "CTV",
        description: "Kamera pengawas keamanan",
        icon: "📹",
        maintenanceIntervalDays: 90,
      },
    ])
    .returning();

  const laptopCat = createdCategories.find((c) => c.code === "LPT");
  const desktopCat = createdCategories.find((c) => c.code === "DSK");
  const serverCat = createdCategories.find((c) => c.code === "SRV");
  const routerCat = createdCategories.find((c) => c.code === "RTR");
  const switchCat = createdCategories.find((c) => c.code === "SWT");
  const printerCat = createdCategories.find((c) => c.code === "PRT");
  const monitorCat = createdCategories.find((c) => c.code === "MON");
  const upsCat = createdCategories.find((c) => c.code === "UPS");

  // ============================================
  // LOCATIONS
  // ============================================
  console.log("📍 Creating locations...");
  const createdLocations = await db
    .insert(locations)
    .values([
      {
        name: "Gedung A - Lantai 1",
        code: "A-LT1",
        building: "Gedung A",
        floor: "1",
        room: "Lobby & Resepsionis",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta Selatan",
        description: "Lantai dasar, ruang tamu dan resepsionis",
      },
      {
        name: "Gedung A - Lantai 2",
        code: "A-LT2",
        building: "Gedung A",
        floor: "2",
        room: "Ruang IT & Development",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta Selatan",
        description: "Kantor IT dan tim pengembangan",
      },
      {
        name: "Gedung A - Lantai 3",
        code: "A-LT3",
        building: "Gedung A",
        floor: "3",
        room: "Ruang Manajemen",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta Selatan",
        description: "Kantor manajemen dan direksi",
      },
      {
        name: "Gedung A - Lantai 4",
        code: "A-LT4",
        building: "Gedung A",
        floor: "4",
        room: "Ruang Meeting & Training",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta Selatan",
        description: "Ruang rapat dan pelatihan",
      },
      {
        name: "Server Room",
        code: "SRV-RM",
        building: "Gedung A",
        floor: "B1",
        room: "Data Center",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta Selatan",
        description: "Ruang server utama dengan pendingin khusus",
      },
      {
        name: "Gedung B - Lantai 1",
        code: "B-LT1",
        building: "Gedung B",
        floor: "1",
        room: "Ruang HRD",
        address: "Jl. Sudirman No. 125",
        city: "Jakarta Selatan",
        description: "Kantor Sumber Daya Manusia",
      },
      {
        name: "Gedung B - Lantai 2",
        code: "B-LT2",
        building: "Gedung B",
        floor: "2",
        room: "Ruang Keuangan",
        address: "Jl. Sudirman No. 125",
        city: "Jakarta Selatan",
        description: "Kantor departemen Keuangan",
      },
      {
        name: "Gudang IT",
        code: "GDG-IT",
        building: "Gedung C",
        floor: "1",
        room: "Gudang Peralatan IT",
        address: "Jl. Sudirman No. 127",
        city: "Jakarta Selatan",
        description: "Penyimpanan peralatan IT cadangan",
      },
    ])
    .returning();

  const itOffice = createdLocations.find((l) => l.code === "A-LT2");
  const serverRoom = createdLocations.find((l) => l.code === "SRV-RM");
  const managementOffice = createdLocations.find((l) => l.code === "A-LT3");
  const hrdOffice = createdLocations.find((l) => l.code === "B-LT1");
  const financeOffice = createdLocations.find((l) => l.code === "B-LT2");
  const meetingRoom = createdLocations.find((l) => l.code === "A-LT4");
  const warehouse = createdLocations.find((l) => l.code === "GDG-IT");

  // ============================================
  // VENDORS
  // ============================================
  console.log("🏪 Creating vendors...");
  const createdVendors = await db
    .insert(vendors)
    .values([
      {
        name: "Dell Indonesia",
        code: "DELL",
        contactPerson: "Agus Suryanto",
        email: "sales@dell.co.id",
        phone: "021-5678901",
        address: "Gedung Menara BCA Lt. 35",
        city: "Jakarta Pusat",
        website: "https://www.dell.co.id",
      },
      {
        name: "HP Indonesia",
        code: "HP",
        contactPerson: "Rina Marlina",
        email: "enterprise@hp.co.id",
        phone: "021-5678902",
        address: "Wisma 46 Lt. 20",
        city: "Jakarta Pusat",
        website: "https://www.hp.co.id",
      },
      {
        name: "Lenovo Indonesia",
        code: "LNV",
        contactPerson: "Bambang Sutrisno",
        email: "business@lenovo.co.id",
        phone: "021-5678903",
        address: "Plaza Indonesia Lt. 15",
        city: "Jakarta Pusat",
        website: "https://www.lenovo.co.id",
      },
      {
        name: "Cisco Systems Indonesia",
        code: "CSCO",
        contactPerson: "Diana Putri",
        email: "networking@cisco.co.id",
        phone: "021-5678904",
        address: "Gedung Artha Graha Lt. 25",
        city: "Jakarta Selatan",
        website: "https://www.cisco.co.id",
      },
      {
        name: "Epson Indonesia",
        code: "EPSN",
        contactPerson: "Yanto Wijaya",
        email: "sales@epson.co.id",
        phone: "021-5678905",
        address: "Ruko Mangga Dua Square Blok A",
        city: "Jakarta Utara",
        website: "https://www.epson.co.id",
      },
      {
        name: "PT. Solusi Teknologi Nusantara",
        code: "STN",
        contactPerson: "Hendra Kusuma",
        email: "sales@solusiteknologi.co.id",
        phone: "021-5678906",
        address: "Ruko Glodok Plaza Blok B12",
        city: "Jakarta Barat",
        website: "https://www.solusiteknologi.co.id",
      },
      {
        name: "APC by Schneider Electric",
        code: "APC",
        contactPerson: "Tono Hartono",
        email: "power@apc.co.id",
        phone: "021-5678907",
        address: "Menara Karya Lt. 18",
        city: "Jakarta Selatan",
        website: "https://www.apc.com/id",
      },
    ])
    .returning();

  const dellVendor = createdVendors.find((v) => v.code === "DELL");
  const hpVendor = createdVendors.find((v) => v.code === "HP");
  const lenovoVendor = createdVendors.find((v) => v.code === "LNV");
  const ciscoVendor = createdVendors.find((v) => v.code === "CSCO");
  const epsonVendor = createdVendors.find((v) => v.code === "EPSN");
  const apcVendor = createdVendors.find((v) => v.code === "APC");

  // ============================================
  // ASSETS
  // ============================================
  console.log("💼 Creating assets...");
  const createdAssets = await db
    .insert(assets)
    .values([
      // LAPTOPS
      {
        assetCode: "AST-2024-001",
        serialNumber: "DELL-LPT-5540-001",
        name: "Dell Latitude 5540",
        brand: "Dell",
        model: "Latitude 5540",
        description:
          "Laptop developer dengan Intel Core i7, 16GB RAM, 512GB SSD",
        categoryId: laptopCat!.id,
        locationId: itOffice!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "18500000",
        purchaseDate: "2024-01-15",
        warrantyExpiry: "2027-01-15",
        assignedTo: teknisi1?.id,
      },
      {
        assetCode: "AST-2024-002",
        serialNumber: "DELL-LPT-5540-002",
        name: "Dell Latitude 5540",
        brand: "Dell",
        model: "Latitude 5540",
        description:
          "Laptop developer dengan Intel Core i7, 16GB RAM, 512GB SSD",
        categoryId: laptopCat!.id,
        locationId: itOffice!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "18500000",
        purchaseDate: "2024-01-15",
        warrantyExpiry: "2027-01-15",
        assignedTo: teknisi2?.id,
      },
      {
        assetCode: "AST-2024-003",
        serialNumber: "HP-LPT-840G10-001",
        name: "HP EliteBook 840 G10",
        brand: "HP",
        model: "EliteBook 840 G10",
        description:
          "Laptop premium untuk manajemen dengan Intel Core i7, 32GB RAM",
        categoryId: laptopCat!.id,
        locationId: managementOffice!.id,
        vendorId: hpVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "25000000",
        purchaseDate: "2024-02-01",
        warrantyExpiry: "2027-02-01",
        assignedTo: managerUser?.id,
      },
      {
        assetCode: "AST-2023-010",
        serialNumber: "LNV-LPT-T14-001",
        name: "Lenovo ThinkPad T14",
        brand: "Lenovo",
        model: "ThinkPad T14 Gen 3",
        description: "Laptop bisnis standar dengan Intel Core i5, 16GB RAM",
        categoryId: laptopCat!.id,
        locationId: hrdOffice!.id,
        vendorId: lenovoVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "15000000",
        purchaseDate: "2023-06-15",
        warrantyExpiry: "2026-06-15",
      },
      {
        assetCode: "AST-2022-015",
        serialNumber: "HP-LPT-450G8-001",
        name: "HP ProBook 450 G8",
        brand: "HP",
        model: "ProBook 450 G8",
        description: "Laptop untuk keperluan umum kantor",
        categoryId: laptopCat!.id,
        locationId: financeOffice!.id,
        vendorId: hpVendor!.id,
        status: "REPAIR",
        condition: "FAIR",
        purchasePrice: "12000000",
        purchaseDate: "2022-03-20",
        warrantyExpiry: "2025-03-20",
      },
      // DESKTOP PCs
      {
        assetCode: "AST-2024-020",
        serialNumber: "DELL-DSK-7010-001",
        name: "Dell OptiPlex 7010",
        brand: "Dell",
        model: "OptiPlex 7010 SFF",
        description: "Desktop PC untuk workstation kantor",
        categoryId: desktopCat!.id,
        locationId: itOffice!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "14000000",
        purchaseDate: "2024-01-10",
        warrantyExpiry: "2027-01-10",
      },
      {
        assetCode: "AST-2024-021",
        serialNumber: "DELL-DSK-7010-002",
        name: "Dell OptiPlex 7010",
        brand: "Dell",
        model: "OptiPlex 7010 SFF",
        description: "Desktop PC untuk workstation kantor",
        categoryId: desktopCat!.id,
        locationId: itOffice!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "14000000",
        purchaseDate: "2024-01-10",
        warrantyExpiry: "2027-01-10",
      },
      {
        assetCode: "AST-2023-022",
        serialNumber: "HP-DSK-400G7-001",
        name: "HP ProDesk 400 G7",
        brand: "HP",
        model: "ProDesk 400 G7 MT",
        description: "Desktop PC untuk resepsionis",
        categoryId: desktopCat!.id,
        locationId: createdLocations.find((l) => l.code === "A-LT1")!.id,
        vendorId: hpVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "10000000",
        purchaseDate: "2023-08-15",
        warrantyExpiry: "2026-08-15",
      },
      // SERVERS
      {
        assetCode: "AST-2024-100",
        serialNumber: "DELL-SRV-R750-001",
        name: "Dell PowerEdge R750",
        brand: "Dell",
        model: "PowerEdge R750",
        description:
          "Server utama untuk aplikasi bisnis - 2x Xeon Gold, 256GB RAM, 4TB SSD RAID",
        categoryId: serverCat!.id,
        locationId: serverRoom!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "185000000",
        purchaseDate: "2024-01-01",
        warrantyExpiry: "2029-01-01",
      },
      {
        assetCode: "AST-2023-101",
        serialNumber: "HP-SRV-DL380-001",
        name: "HP ProLiant DL380 Gen10",
        brand: "HP",
        model: "ProLiant DL380 Gen10",
        description:
          "Database server - 2x Xeon Silver, 128GB RAM, 8TB SAS RAID",
        categoryId: serverCat!.id,
        locationId: serverRoom!.id,
        vendorId: hpVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "145000000",
        purchaseDate: "2023-06-15",
        warrantyExpiry: "2028-06-15",
      },
      {
        assetCode: "AST-2022-102",
        serialNumber: "DELL-SRV-R640-001",
        name: "Dell PowerEdge R640",
        brand: "Dell",
        model: "PowerEdge R640",
        description: "Backup server untuk disaster recovery",
        categoryId: serverCat!.id,
        locationId: serverRoom!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "95000000",
        purchaseDate: "2022-01-20",
        warrantyExpiry: "2027-01-20",
      },
      // NETWORK EQUIPMENT
      {
        assetCode: "AST-2024-200",
        serialNumber: "CSCO-RTR-4331-001",
        name: "Cisco ISR 4331",
        brand: "Cisco",
        model: "ISR 4331",
        description: "Router utama untuk koneksi internet dan VPN",
        categoryId: routerCat!.id,
        locationId: serverRoom!.id,
        vendorId: ciscoVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "65000000",
        purchaseDate: "2024-02-01",
        warrantyExpiry: "2029-02-01",
      },
      {
        assetCode: "AST-2023-201",
        serialNumber: "CSCO-SWT-3850-001",
        name: "Cisco Catalyst 3850-48T",
        brand: "Cisco",
        model: "Catalyst 3850-48T",
        description: "Core switch 48 port dengan PoE+",
        categoryId: switchCat!.id,
        locationId: serverRoom!.id,
        vendorId: ciscoVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "85000000",
        purchaseDate: "2023-03-10",
        warrantyExpiry: "2028-03-10",
      },
      {
        assetCode: "AST-2023-202",
        serialNumber: "CSCO-SWT-2960-001",
        name: "Cisco Catalyst 2960-L",
        brand: "Cisco",
        model: "Catalyst 2960-L 24-port",
        description: "Access switch lantai 2",
        categoryId: switchCat!.id,
        locationId: itOffice!.id,
        vendorId: ciscoVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "15000000",
        purchaseDate: "2023-03-10",
        warrantyExpiry: "2028-03-10",
      },
      // PRINTERS
      {
        assetCode: "AST-2024-300",
        serialNumber: "EPSN-PRT-L6290-001",
        name: "Epson EcoTank L6290",
        brand: "Epson",
        model: "EcoTank L6290",
        description: "Printer multifungsi dengan WiFi dan ADF",
        categoryId: printerCat!.id,
        locationId: itOffice!.id,
        vendorId: epsonVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "6500000",
        purchaseDate: "2024-03-01",
        warrantyExpiry: "2026-03-01",
      },
      {
        assetCode: "AST-2023-301",
        serialNumber: "HP-PRT-M428-001",
        name: "HP LaserJet Pro M428fdn",
        brand: "HP",
        model: "LaserJet Pro M428fdn",
        description: "Printer laser untuk volume tinggi",
        categoryId: printerCat!.id,
        locationId: financeOffice!.id,
        vendorId: hpVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "8500000",
        purchaseDate: "2023-05-20",
        warrantyExpiry: "2025-05-20",
      },
      {
        assetCode: "AST-2022-302",
        serialNumber: "EPSN-PRT-L3110-001",
        name: "Epson EcoTank L3110",
        brand: "Epson",
        model: "EcoTank L3110",
        description: "Printer multifungsi ekonomis",
        categoryId: printerCat!.id,
        locationId: hrdOffice!.id,
        vendorId: epsonVendor!.id,
        status: "BROKEN",
        condition: "POOR",
        purchasePrice: "2500000",
        purchaseDate: "2022-01-15",
        warrantyExpiry: "2024-01-15",
      },
      // MONITORS
      {
        assetCode: "AST-2024-400",
        serialNumber: "DELL-MON-U2722D-001",
        name: "Dell UltraSharp U2722D",
        brand: "Dell",
        model: 'UltraSharp U2722D 27"',
        description: 'Monitor 27" 4K untuk desain',
        categoryId: monitorCat!.id,
        locationId: itOffice!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "8500000",
        purchaseDate: "2024-01-15",
        warrantyExpiry: "2027-01-15",
      },
      {
        assetCode: "AST-2024-401",
        serialNumber: "DELL-MON-U2722D-002",
        name: "Dell UltraSharp U2722D",
        brand: "Dell",
        model: 'UltraSharp U2722D 27"',
        description: 'Monitor 27" 4K untuk desain',
        categoryId: monitorCat!.id,
        locationId: itOffice!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "8500000",
        purchaseDate: "2024-01-15",
        warrantyExpiry: "2027-01-15",
      },
      // UPS
      {
        assetCode: "AST-2024-500",
        serialNumber: "APC-UPS-SMT3000-001",
        name: "APC Smart-UPS 3000VA",
        brand: "APC",
        model: "Smart-UPS SMT3000I",
        description: "UPS 3000VA untuk server room",
        categoryId: upsCat!.id,
        locationId: serverRoom!.id,
        vendorId: apcVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "18000000",
        purchaseDate: "2024-01-01",
        warrantyExpiry: "2027-01-01",
      },
      {
        assetCode: "AST-2023-501",
        serialNumber: "APC-UPS-BX1100-001",
        name: "APC Back-UPS 1100VA",
        brand: "APC",
        model: "Back-UPS BX1100LI-MS",
        description: "UPS 1100VA untuk workstation",
        categoryId: upsCat!.id,
        locationId: itOffice!.id,
        vendorId: apcVendor!.id,
        status: "ACTIVE",
        condition: "GOOD",
        purchasePrice: "1800000",
        purchaseDate: "2023-06-01",
        warrantyExpiry: "2025-06-01",
      },
      // Spare assets in warehouse
      {
        assetCode: "AST-2024-600",
        serialNumber: "DELL-LPT-5540-SPARE",
        name: "Dell Latitude 5540 (Cadangan)",
        brand: "Dell",
        model: "Latitude 5540",
        description: "Laptop cadangan untuk penggantian darurat",
        categoryId: laptopCat!.id,
        locationId: warehouse!.id,
        vendorId: dellVendor!.id,
        status: "ACTIVE",
        condition: "EXCELLENT",
        purchasePrice: "18500000",
        purchaseDate: "2024-03-01",
        warrantyExpiry: "2027-03-01",
      },
    ])
    .returning();

  const repairLaptop = createdAssets.find((a) => a.status === "REPAIR");
  const brokenPrinter = createdAssets.find((a) => a.status === "BROKEN");
  const serverAsset = createdAssets.find((a) => a.assetCode === "AST-2024-100");
  const laptop1 = createdAssets.find((a) => a.assetCode === "AST-2024-001");

  // ============================================
  // MAINTENANCE LOGS
  // ============================================
  console.log("🔧 Creating maintenance logs...");
  await db.insert(maintenanceLogs).values([
    {
      maintenanceNumber: "MNT-202401-001",
      assetId: serverAsset!.id,
      technicianId: teknisi1!.id,
      maintenanceType: "PREVENTIVE",
      title: "Pembersihan dan Pengecekan Server Quarterly",
      description: "Maintenance rutin 3 bulanan untuk server utama",
      findings:
        "Suhu operasi normal, tidak ada error di log. Kipas bekerja normal.",
      actionTaken: "Membersihkan debu, update firmware, cek koneksi kabel",
      recommendation:
        "Lanjutkan pemantauan suhu, pertimbangkan tambah RAM di Q4",
      status: "COMPLETED",
      priority: "MEDIUM",
      scheduledDate: "2024-01-15",
      startedAt: new Date("2024-01-15T09:00:00"),
      completedAt: new Date("2024-01-15T12:00:00"),
      laborCost: "500000",
      partsCost: "0",
      totalCost: "500000",
      technicianNotes:
        "Server dalam kondisi baik, tidak ada pergantian komponen",
    },
    {
      maintenanceNumber: "MNT-202402-001",
      assetId: repairLaptop!.id,
      technicianId: teknisi2!.id,
      maintenanceType: "CORRECTIVE",
      title: "Perbaikan Keyboard Laptop",
      description: "Beberapa tombol keyboard tidak berfungsi",
      findings: "Keyboard rusak karena tumpahan air, perlu diganti",
      actionTaken: "Mengganti keyboard baru",
      status: "IN_PROGRESS",
      priority: "HIGH",
      scheduledDate: "2024-02-20",
      startedAt: new Date("2024-02-20T10:00:00"),
      laborCost: "200000",
      partsCost: "750000",
      totalCost: "950000",
    },
    {
      maintenanceNumber: "MNT-202403-001",
      assetId: brokenPrinter!.id,
      technicianId: teknisi1!.id,
      maintenanceType: "CORRECTIVE",
      title: "Diagnosa Printer Tidak Bisa Print",
      description: "Printer tidak bisa mencetak, lampu error menyala",
      findings: "Printhead rusak, sparepart tidak tersedia",
      actionTaken: "Mencoba cleaning, tapi tetap tidak berhasil",
      recommendation: "Direkomendasikan untuk disposal dan pengadaan baru",
      status: "COMPLETED",
      priority: "LOW",
      scheduledDate: "2024-03-01",
      startedAt: new Date("2024-03-01T14:00:00"),
      completedAt: new Date("2024-03-01T16:00:00"),
      laborCost: "200000",
      partsCost: "0",
      totalCost: "200000",
      technicianNotes:
        "Printer sudah berumur 2+ tahun dan tidak ekonomis untuk diperbaiki",
    },
    {
      maintenanceNumber: "MNT-202404-001",
      assetId: laptop1!.id,
      technicianId: teknisi1!.id,
      maintenanceType: "PREVENTIVE",
      title: "Update Windows dan Driver",
      description: "Update rutin sistem operasi dan driver",
      findings: "OS dan driver outdated",
      actionTaken: "Update Windows, driver chipset, dan antivirus",
      status: "COMPLETED",
      priority: "LOW",
      scheduledDate: "2024-04-01",
      startedAt: new Date("2024-04-01T09:00:00"),
      completedAt: new Date("2024-04-01T10:30:00"),
      laborCost: "150000",
      partsCost: "0",
      totalCost: "150000",
    },
  ]);

  // ============================================
  // REQUESTS
  // ============================================
  console.log("📝 Creating requests...");
  const createdRequests = await db
    .insert(requests)
    .values([
      {
        requestNumber: "REQ-202403-001",
        assetId: brokenPrinter!.id,
        requesterId: teknisi1!.id,
        requestType: "DISPOSAL",
        title: "Permohonan Penghapusan Printer Rusak",
        reason:
          "Printer sudah tidak bisa diperbaiki, printhead rusak dan sparepart tidak tersedia",
        justification:
          "Biaya perbaikan lebih tinggi dari harga unit baru. Printer sudah melewati masa garansi.",
        priority: "MEDIUM",
        status: "PENDING_APPROVAL",
        submittedAt: new Date("2024-03-05"),
      },
      {
        requestNumber: "REQ-202403-002",
        assetId: repairLaptop!.id,
        requesterId: teknisi2!.id,
        requestType: "REPLACEMENT",
        title: "Permohonan Penggantian Laptop",
        reason:
          "Laptop sudah sering bermasalah dan user butuh perangkat yang lebih andal",
        justification:
          "Laptop ini sudah 2x masuk perbaikan dalam 3 bulan terakhir. Produktivitas user terganggu.",
        priority: "HIGH",
        status: "SUBMITTED",
        submittedAt: new Date("2024-03-10"),
      },
      {
        requestNumber: "REQ-202402-001",
        assetId: createdAssets.find((a) => a.assetCode === "AST-2024-020")!.id,
        requesterId: teknisi1!.id,
        requestType: "PROCUREMENT_ADDITIONAL",
        title: "Permohonan Tambahan RAM Desktop",
        reason: "User membutuhkan RAM lebih besar untuk aplikasi desain",
        justification:
          "Aplikasi Adobe sering lag, upgrade dari 8GB ke 16GB diperlukan",
        priority: "LOW",
        status: "APPROVED",
        submittedAt: new Date("2024-02-15"),
        approvedBy: managerUser!.id,
        approvedAt: new Date("2024-02-16"),
        approverNotes:
          "Disetujui, koordinasi dengan procurement untuk pembelian RAM",
      },
      {
        requestNumber: "REQ-202401-001",
        assetId: createdAssets.find((a) => a.assetCode === "AST-2023-301")!.id,
        requesterId: teknisi2!.id,
        requestType: "MAJOR_REPAIR",
        title: "Permohonan Perbaikan Printer",
        reason: "Hasil print bergaris dan tidak jelas",
        justification: "Printer masih bisa diperbaiki dengan penggantian drum",
        priority: "MEDIUM",
        status: "REJECTED",
        submittedAt: new Date("2024-01-20"),
        rejectedBy: managerUser!.id,
        rejectedAt: new Date("2024-01-21"),
        rejectionReason:
          "Printer masih dalam garansi, silakan klaim garansi ke vendor HP",
      },
    ])
    .returning();

  // ============================================
  // APPROVAL HISTORY
  // ============================================
  console.log("📋 Creating approval history...");
  await db.insert(approvalHistory).values([
    {
      requestId: createdRequests[0].id,
      approverId: teknisi1!.id,
      action: "SUBMITTED",
      previousStatus: null,
      newStatus: "SUBMITTED",
      comments: "Permohonan diajukan",
    },
    {
      requestId: createdRequests[0].id,
      approverId: managerUser!.id,
      action: "ESCALATED",
      previousStatus: "SUBMITTED",
      newStatus: "PENDING_APPROVAL",
      comments: "Perlu review tambahan dari finance",
    },
    {
      requestId: createdRequests[2].id,
      approverId: teknisi1!.id,
      action: "SUBMITTED",
      previousStatus: null,
      newStatus: "SUBMITTED",
      comments: "Permohonan upgrade RAM diajukan",
    },
    {
      requestId: createdRequests[2].id,
      approverId: managerUser!.id,
      action: "APPROVED",
      previousStatus: "SUBMITTED",
      newStatus: "APPROVED",
      comments: "Disetujui, koordinasi dengan procurement",
    },
    {
      requestId: createdRequests[3].id,
      approverId: teknisi2!.id,
      action: "SUBMITTED",
      previousStatus: null,
      newStatus: "SUBMITTED",
      comments: "Permohonan perbaikan printer",
    },
    {
      requestId: createdRequests[3].id,
      approverId: managerUser!.id,
      action: "REJECTED",
      previousStatus: "SUBMITTED",
      newStatus: "REJECTED",
      comments: "Printer masih dalam garansi, klaim ke vendor",
    },
  ]);

  console.log("\n✅ Database seeding completed!");
  console.log("\n" + "=".repeat(60));
  console.log("📋 RINGKASAN DATA YANG DIBUAT:");
  console.log("=".repeat(60));
  console.log(
    `   👥 Users:        ${createdUsers.length} (2 Admin, 3 Teknisi, 2 Manager)`,
  );
  console.log(`   🏢 Departments:  ${createdDepartments.length}`);
  console.log(`   📁 Categories:   ${createdCategories.length}`);
  console.log(`   📍 Locations:    ${createdLocations.length}`);
  console.log(`   🏪 Vendors:      ${createdVendors.length}`);
  console.log(`   💼 Assets:       ${createdAssets.length}`);
  console.log(`   🔧 Maintenance:  4`);
  console.log(`   📝 Requests:     ${createdRequests.length}`);
  console.log("=".repeat(60));
  console.log("\n📋 KREDENSIAL LOGIN:");
  console.log("-".repeat(60));
  console.log(
    "| Role       | Username     | Password     | Nama Lengkap        |",
  );
  console.log("-".repeat(60));
  console.log(
    "| ADMIN      | admin        | password123  | Administrator Sistem|",
  );
  console.log(
    "| ADMIN      | budi.it      | password123  | Budi Santoso        |",
  );
  console.log(
    "| TECHNICIAN | teknisi1     | password123  | Andi Prasetyo       |",
  );
  console.log(
    "| TECHNICIAN | teknisi2     | password123  | Dedi Kurniawan      |",
  );
  console.log(
    "| TECHNICIAN | teknisi3     | password123  | Eko Saputra         |",
  );
  console.log(
    "| MANAGER    | manager      | password123  | Hendro Gunawan      |",
  );
  console.log(
    "| MANAGER    | manager.hrd  | password123  | Siti Aminah         |",
  );
  console.log("-".repeat(60));

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});

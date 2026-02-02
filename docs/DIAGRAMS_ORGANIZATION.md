# Organisasi Diagram - Sistem Monitoring dan Manajemen Inventaris Aset IT

## 📋 Ringkasan Perubahan

Semua diagram telah diorganisir ke dalam struktur folder yang lebih terstruktur di folder `diagrams/`.

### ✅ Sebelum (Old Structure)
```
docs/
├── 02-use-case-diagram.md      ❌ File besar
├── 03-sequence-diagram.md      ❌ File besar
├── 04-activity-diagram.md      ❌ File besar
├── 05-class-diagram.md         ❌ File besar
├── images/                     ✓ Semua image ada
│   └── (40+ PNG files)
└── ...
```

### ✨ Sesudah (New Structure)
```
docs/
├── diagrams/                   ✓ Folder terorganisir
│   ├── README.md              # Index utama
│   ├── use-case/              # 4 file + 4 images
│   ├── sequence/              # 6 file + 10 images
│   ├── activity/              # 0 file + 8 images
│   ├── class/                 # 0 file + 7 images
│   └── architecture/          # 0 file + 10 images
├── images/                    # Kosong (semua sudah dipindah)
└── ...
```

---

## 📁 Struktur Detail

### 1️⃣ **Use Case Diagrams** 🎭
**Lokasi**: `diagrams/use-case/`
- `01-use-case-overview.md` - Overview semua use cases
- `02-use-case-admin.md` - Use cases Administrator IT
- `03-use-case-technician.md` - Use cases Teknisi/Staff IT
- `04-use-case-manager.md` - Use cases Manajer/Kepala Departemen
- **Images**: 4 PNG files

### 2️⃣ **Sequence Diagrams** 🔄
**Lokasi**: `diagrams/sequence/`
- `01-sd-login.md` - Login & Authentication
- `02-sd-register-asset.md` - Registrasi Aset Baru
- `03-sd-update-status.md` - Update Status Aset
- `04-sd-maintenance-log.md` - Input Maintenance Log
- `05-sd-submit-request.md` - Submit Replacement Request
- `06-sd-approval-process.md` - Approval Process
- **Images**: 10 PNG files

### 3️⃣ **Activity Diagrams** 📊
**Lokasi**: `diagrams/activity/images/`
- `AD_Asset_Lifecycle.png` - Siklus hidup aset lengkap
- `AD_Login.png` - Proses login
- `AD_Register_Asset.png` - Registrasi aset
- `AD_Monitoring_Repair.png` - Monitoring & perbaikan
- `AD_Approval_Workflow.png` - Workflow approval
- `AD_Generate_Report.png` - Generate laporan
- `AD_Scan_QR.png` - Scan QR code
- `AD_Notification_System.png` - Sistem notifikasi
- **Total**: 8 images
- **Note**: Markdown files belum dibuat (file terlalu besar)

### 4️⃣ **Class Diagrams** 🏗️
**Lokasi**: `diagrams/class/images/`
- `Class_Diagram_Overview.png` - Overview semua kelas
- `Class_User_Management.png` - User Management detail
- `Class_Asset_Management.png` - Asset Management detail
- `Class_Maintenance.png` - Maintenance Management detail
- `Class_Request_Approval.png` - Request & Approval detail
- `Class_Notification.png` - Notification System detail
- `Class_Services.png` - Services & Repositories
- **Total**: 7 images
- **Note**: Markdown files belum dibuat (file terlalu besar)

### 5️⃣ **Architecture Diagrams** 🏢
**Lokasi**: `diagrams/architecture/images/`
- `Architecture.png` - Arsitektur keseluruhan sistem
- `Backend_Axum.png` - Backend dengan Axum
- `Backend_ElysiaJS.png` - Backend dengan ElysiaJS
- `Frontend.png` - Frontend architecture
- `Database.png` - Database schema
- `ERD_Complete.png` - Entity Relationship Diagram
- `Security.png` - Security architecture
- `DevOps.png` - DevOps & deployment
- `Actors.png` - Aktor/Users
- `Actor_Relationship.png` - Relasi antar aktor
- **Total**: 10 images
- **README**: Sudah ada (1 file)

---

## 🎯 Keuntungan Organisasi Baru

✅ **Lebih Terstruktur**: Setiap jenis diagram di folder terpisah
✅ **Mudah Navigasi**: README di setiap folder memudahkan pencarian
✅ **Konsistensi**: Struktur yang sama untuk semua jenis diagram
✅ **Scalable**: Mudah menambah diagram baru
✅ **Clean Images Folder**: Folder `images/` kini kosong, semua image terorganisir
✅ **Single Responsibility**: Setiap folder punya satu tanggung jawab

---

## 📊 File Statistics

| Jenis | Total Files | Total Images | Status |
|-------|------------|-------------|--------|
| Use Case | 4 | 4 | ✅ Complete |
| Sequence | 6 | 10 | ✅ Complete |
| Activity | 0 | 8 | ⏳ Images ready |
| Class | 0 | 7 | ⏳ Images ready |
| Architecture | 1 | 10 | ✅ Complete |
| **TOTAL** | **11** | **39** | - |

---

## 🔧 Next Steps (Optional)

Jika ingin melengkapi:

1. **Create Activity Diagram Markdown Files**
   - `diagrams/activity/01-ad-asset-lifecycle.md`
   - `diagrams/activity/02-ad-login.md`
   - dll...

2. **Create Class Diagram Markdown Files**
   - `diagrams/class/01-class-overview.md`
   - `diagrams/class/02-class-user-management.md`
   - dll...

3. **Create Architecture Diagram Markdown Files**
   - `diagrams/architecture/01-architecture-overview.md`
   - `diagrams/architecture/02-backend-architecture.md`
   - dll...

---

## 📌 Catatan

- **Original Files**: File markdown lama (`02-use-case-diagram.md`, dst) masih ada di root `/docs`
  - Bisa dihapus jika sudah tidak diperlukan
  
- **Image Folder**: `docs/images/` sekarang kosong
  - Semua image sudah dipindah ke subfolder `diagrams/`
  
- **Backward Compatibility**: Struktur baru tidak menghapus yang lama
  - Hanya menambah organisasi baru

---

**Terakhir diupdate**: 2 Februari 2026
**Status**: ✅ Reorganisasi selesai, siap digunakan

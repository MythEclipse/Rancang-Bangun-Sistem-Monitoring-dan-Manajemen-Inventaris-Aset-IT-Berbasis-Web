# Use Case Diagram

Folder ini berisi semua Use Case Diagram untuk Sistem Monitoring dan Manajemen Inventaris Aset IT.

## File-file dalam folder ini:

1. **01-use-case-overview.md** - Use Case Diagram Utama (Overview)
   - Menampilkan semua aktor dan use cases secara keseluruhan
   - Mencakup: Common, Admin, Technician, dan Manager use cases

2. **02-use-case-admin.md** - Use Case Diagram Administrator IT
   - Fokus pada fungsi manajemen pengguna
   - Master data management (Kategori, Lokasi, Vendor)
   - Manajemen aset (Registrasi, Edit, Delete, Assign)
   - Laporan dan konfigurasi

3. **03-use-case-technician.md** - Use Case Diagram Teknisi/Staff IT
   - Monitoring aset (View, Search, Scan QR/Barcode)
   - Update status aset
   - Input maintenance log
   - Pengajuan request (Replacement, Disposal)

4. **04-use-case-manager.md** - Use Case Diagram Manajer/Kepala Departemen
   - Approval Center (View, Approve, Reject requests)
   - Analytics & Reports
   - Export & Download
   - Notifications

## Struktur Folder:

```
use-case/
├── 01-use-case-overview.md
├── 02-use-case-admin.md
├── 03-use-case-technician.md
├── 04-use-case-manager.md
└── images/
    ├── Use_Case_Diagram_Main.png
    ├── Use_Case_Admin.png
    ├── Use_Case_Technician.png
    └── Use_Case_Manager.png
```

## Lihat juga:

- [Sequence Diagrams](../sequence/) - Alur interaksi antar objek
- [Activity Diagrams](../activity/) - Alur proses bisnis
- [Class Diagrams](../class/) - Struktur kelas dan relasi

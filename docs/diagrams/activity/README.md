# Activity Diagram

Folder ini berisi semua Activity Diagram untuk Sistem Monitoring dan Manajemen Inventaris Aset IT.

## File-file dalam folder ini:

1. **01-ad-asset-lifecycle.md** - Activity Diagram: Manajemen Siklus Hidup Aset
   - Alur lengkap dari registrasi hingga disposal
   - Verifikasi dokumen
   - Fase operasional (monitoring, maintenance)
   - Proses approval untuk disposal

2. **02-ad-login.md** - Activity Diagram: Proses Login & Autentikasi
   - Input kredensial
   - Validasi format input
   - Verifikasi user di database
   - Pengecekan akun aktif
   - Redirect berdasarkan role

3. **03-ad-register-asset.md** - Activity Diagram: Proses Registrasi Aset Baru
   - Pemilihan kategori
   - Input data dasar, spesifikasi, pembelian, garansi
   - Validasi duplikasi serial number
   - Generate Asset Code dan QR Code
   - Penempatan lokasi

4. **04-ad-monitoring-repair.md** - Activity Diagram: Proses Monitoring & Perbaikan Aset
   - Scheduler otomatis cron job
   - Pemeriksaan fisik aset
   - Identifikasi masalah
   - Proses perbaikan atau disposal
   - Approval workflow

5. **05-ad-approval-workflow.md** - Activity Diagram: Proses Pengajuan dan Persetujuan
   - Teknisi mengajukan request
   - Manager melakukan review
   - Approval atau rejection dengan alasan
   - Update status aset sesuai keputusan
   - Notifikasi ke semua pihak

6. **06-ad-generate-report.md** - Activity Diagram: Generate & Export Report
   - Pemilihan tipe laporan
   - Setting filter (tanggal, kategori, status, lokasi)
   - Generate data dan charts
   - Export ke PDF/Excel/CSV
   - Print atau schedule report

7. **07-ad-scan-qr.md** - Activity Diagram: Scan QR Code & Quick Action
   - Akses fitur scan pada mobile
   - Arahkan kamera ke QR Code
   - Decode dan identifikasi aset
   - Quick actions (Update Status, Input Maintenance, View History)

8. **08-ad-notification-system.md** - Activity Diagram: Sistem Notifikasi Otomatis
   - Event trigger dari sistem
   - Template matching berdasarkan type
   - Ambil user preferences
   - Multi-channel delivery (In-App, Email, SMS, Push)

## Struktur Folder:

```
activity/
├── 01-ad-asset-lifecycle.md
├── 02-ad-login.md
├── 03-ad-register-asset.md
├── 04-ad-monitoring-repair.md
├── 05-ad-approval-workflow.md
├── 06-ad-generate-report.md
├── 07-ad-scan-qr.md
├── 08-ad-notification-system.md
└── images/
    ├── AD_Asset_Lifecycle.png
    ├── AD_Login.png
    ├── AD_Register_Asset.png
    ├── AD_Monitoring_Repair.png
    ├── AD_Approval_Workflow.png
    ├── AD_Generate_Report.png
    ├── AD_Scan_QR.png
    └── AD_Notification_System.png
```

## Lihat juga:

- [Use Case Diagrams](../use-case/) - Perspektif pengguna sistem
- [Sequence Diagrams](../sequence/) - Alur interaksi antar objek
- [Class Diagrams](../class/) - Struktur kelas dan relasi

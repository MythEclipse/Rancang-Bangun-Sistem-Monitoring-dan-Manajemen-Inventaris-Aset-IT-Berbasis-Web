# Sequence Diagram

Folder ini berisi semua Sequence Diagram untuk Sistem Monitoring dan Manajemen Inventaris Aset IT.

## File-file dalam folder ini:

1. **01-sd-login.md** - Sequence Diagram: Login & Authentication
   - Proses autentikasi pengguna
   - Validasi kredensial
   - Pembuatan session dan JWT token

2. **02-sd-register-asset.md** - Sequence Diagram: Registrasi Aset Baru
   - Input data aset
   - Validasi serial number
   - Generate QR Code
   - Simpan ke database

3. **03-sd-update-status.md** - Sequence Diagram: Update Status Aset
   - Pembaruan status kondisi aset
   - Pencatatan history perubahan
   - Notifikasi jika status kritis

4. **04-sd-maintenance-log.md** - Sequence Diagram: Input Maintenance Log
   - Pencatatan log pemeliharaan
   - Upload dokumentasi (foto, dokumen)
   - Update status aset setelah maintenance
   - Hitung jadwal maintenance berikutnya

5. **05-sd-submit-request.md** - Sequence Diagram: Submit Replacement Request
   - Pengajuan penggantian/penghapusan aset
   - Validasi status aset
   - Notifikasi ke Manager untuk approval

6. **06-sd-approval-process.md** - Sequence Diagram: Approval Process
   - Review pengajuan oleh Manager
   - Proses approval atau rejection
   - Update status aset sesuai keputusan
   - Notifikasi ke semua pihak

## Struktur Folder:

```
sequence/
├── 01-sd-login.md
├── 02-sd-register-asset.md
├── 03-sd-update-status.md
├── 04-sd-maintenance-log.md
├── 05-sd-submit-request.md
├── 06-sd-approval-process.md
└── images/
    ├── SD_Login.png
    ├── SD_Register_Asset.png
    ├── SD_Update_Status.png
    ├── SD_Maintenance_Log.png
    ├── SD_Submit_Request.png
    └── SD_Approval_Process.png
```

## Lihat juga:

- [Use Case Diagrams](../use-case/) - Perspektif pengguna sistem
- [Activity Diagrams](../activity/) - Alur proses bisnis
- [Class Diagrams](../class/) - Struktur kelas dan relasi

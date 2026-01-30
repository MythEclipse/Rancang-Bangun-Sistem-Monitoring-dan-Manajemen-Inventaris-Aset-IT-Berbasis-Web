# Activity Diagram

## 📋 Deskripsi

Activity Diagram menggambarkan alur aktivitas yang terjadi dalam proses bisnis sistem Monitoring dan Manajemen Inventaris Aset IT. Diagram ini menunjukkan langkah-langkah, keputusan, dan percabangan dalam setiap proses.

---

## 1. Activity Diagram: Manajemen Siklus Hidup Aset (Complete Lifecycle)

### Deskripsi

Alur lengkap siklus hidup aset dari pengadaan hingga penghapusan.

```plantuml
@startuml AD_Asset_Lifecycle
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightBlue
    BorderColor DarkBlue
    DiamondBackgroundColor Gold
    DiamondBorderColor DarkOrange
}

title Activity Diagram: Manajemen Siklus Hidup Aset

|#LightBlue|Administrator IT|
|#LightGreen|Teknisi IT|
|#LightCoral|Manajer|
|#LightYellow|Sistem|

|Administrator IT|
start

:Terima aset baru dari vendor;

:Verifikasi kelengkapan dokumen\n(Invoice, Garansi, Spesifikasi);

if (Dokumen lengkap?) then (Ya)
    :Registrasi aset ke sistem;

    :Input data aset:\n- Serial Number\n- Model & Brand\n- Spesifikasi\n- Tanggal Pembelian\n- Masa Garansi;

    |Sistem|
    :Generate kode aset unik;
    :Generate QR Code;
    :Simpan data ke database;
    :Set status = "New";

    |Administrator IT|
    :Cetak label QR Code;
    :Tempel label pada aset fisik;

    :Tentukan lokasi penempatan;

    if (Assign ke user tertentu?) then (Ya)
        :Pilih user penerima;
        :Input data penempatan;

        |Sistem|
        :Update lokasi aset;
        :Catat riwayat penempatan;
        :Kirim notifikasi ke user;
    else (Tidak)
        :Simpan di gudang/storage;

        |Sistem|
        :Set lokasi = Storage;
    endif

    |Sistem|
    :Set status = "Active";
    :Hitung jadwal maintenance berikutnya;

    |Administrator IT|
    :Aset siap digunakan;

    ' ===== FASE OPERASIONAL =====

    |Sistem|
    :Monitoring berkala;

    repeat
        |Sistem|
        :Cek kondisi & jadwal;

        if (Jadwal maintenance tiba?) then (Ya)
            |Sistem|
            :Kirim alert ke Teknisi;

            |Teknisi IT|
            :Terima notifikasi maintenance;
            :Lakukan pemeriksaan fisik;

            if (Ada kerusakan?) then (Ya)
                :Dokumentasi kerusakan;
                :Input detail kerusakan;

                if (Bisa diperbaiki?) then (Ya)
                    |Sistem|
                    :Set status = "Repair";

                    |Teknisi IT|
                    :Lakukan perbaikan;
                    :Input log maintenance:\n- Deskripsi perbaikan\n- Biaya\n- Parts diganti;

                    if (Perbaikan berhasil?) then (Ya)
                        |Sistem|
                        :Set status = "Active";
                        :Update riwayat maintenance;
                        :Hitung jadwal maintenance berikutnya;

                        |Teknisi IT|
                        :Aset kembali beroperasi;
                    else (Tidak)
                        |Sistem|
                        :Set status = "Broken";

                        |Teknisi IT|
                        :Ajukan penggantian/penghapusan;

                        ' ===== ALUR APPROVAL =====
                        |Sistem|
                        :Buat request penggantian;
                        :Kirim notifikasi ke Manajer;

                        |Manajer|
                        :Terima request;
                        :Review detail aset dan kerusakan;

                        if (Setuju penghapusan?) then (Ya)
                            :Approve request;
                            :Input catatan approval;

                            |Sistem|
                            :Update status request = Approved;
                            :Set status aset = "Disposed";
                            :Catat tanggal disposal;
                            :Kirim notifikasi ke Admin & Teknisi;

                            |Administrator IT|
                            :Proses penghapusan fisik aset;
                            :Update inventaris;

                            |Sistem|
                            :Arsipkan data aset;
                        else (Tidak)
                            :Reject request;
                            :Input alasan penolakan;

                            |Sistem|
                            :Kirim notifikasi rejection ke Teknisi;

                            |Teknisi IT|
                            :Evaluasi ulang kondisi aset;
                        endif
                    endif
                else (Tidak - Rusak berat)
                    |Sistem|
                    :Set status = "Broken";

                    |Teknisi IT|
                    :Langsung ajukan penggantian;
                    note right
                        Lanjut ke alur
                        Approval di atas
                    end note
                endif
            else (Tidak - Kondisi OK)
                :Update status = Normal;
                :Input log pemeriksaan;

                |Sistem|
                :Simpan log maintenance;
                :Update tanggal last_maintenance;
                :Hitung jadwal berikutnya;
            endif
        endif

        |Sistem|
        if (Garansi akan habis?) then (Ya)
            :Kirim alert garansi ke Admin;

            |Administrator IT|
            :Review status garansi;
            :Keputusan perpanjangan/tidak;
        endif

    repeat while (Aset masih aktif?)

    |Sistem|
    :Aset tidak aktif;

else (Tidak - Dokumen tidak lengkap)
    :Return ke vendor;
    :Minta kelengkapan dokumen;

    stop
endif

|Sistem|
:End of Asset Lifecycle;
stop

@enduml
```

---

## 2. Activity Diagram: Proses Login & Autentikasi

### Deskripsi

Alur proses login pengguna ke dalam sistem.

```plantuml
@startuml AD_Login
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightBlue
    BorderColor DarkBlue
    DiamondBackgroundColor Gold
}

title Activity Diagram: Proses Login & Autentikasi

|#LightBlue|User|
|#LightYellow|Sistem|

|User|
start

:Akses halaman login;

|Sistem|
:Tampilkan form login;

|User|
:Input username;
:Input password;
:Klik tombol Login;

|Sistem|
:Terima credentials;
:Validasi format input;

if (Format valid?) then (Ya)
    :Cari user di database;

    if (User ditemukan?) then (Ya)
        :Ambil hashed password;
        :Bandingkan password;

        if (Password cocok?) then (Ya)
            :Cek status akun;

            if (Akun aktif?) then (Ya)
                :Generate JWT Token;
                :Buat session;
                :Catat login log;
                :Tentukan redirect based on role;

                if (Role = Admin?) then (Ya)
                    :Redirect ke Admin Dashboard;
                elseif (Role = Teknisi?) then
                    :Redirect ke Technician Dashboard;
                else (Role = Manajer)
                    :Redirect ke Manager Dashboard;
                endif

                |User|
                :Akses dashboard sesuai role;

            else (Tidak - Akun nonaktif)
                |Sistem|
                :Tampilkan error:\n"Akun tidak aktif, hubungi admin";

                |User|
                :Lihat pesan error;
            endif

        else (Tidak - Password salah)
            |Sistem|
            :Increment failed_attempts;

            if (Failed attempts >= 5?) then (Ya)
                :Lock akun sementara (15 menit);
                :Tampilkan pesan locked;

                |User|
                :Tunggu atau hubungi admin;
            else (Tidak)
                :Tampilkan error:\n"Password salah";

                |User|
                :Coba login ulang;
            endif
        endif

    else (Tidak - User tidak ada)
        |Sistem|
        :Tampilkan error:\n"Username tidak ditemukan";

        |User|
        :Cek username atau registrasi;
    endif

else (Tidak - Format tidak valid)
    |Sistem|
    :Tampilkan validation errors;

    |User|
    :Perbaiki input;
endif

stop

@enduml
```

---

## 3. Activity Diagram: Proses Registrasi Aset Baru

### Deskripsi

Alur pendaftaran aset IT baru ke dalam sistem oleh Administrator.

```plantuml
@startuml AD_Register_Asset
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightBlue
    BorderColor DarkBlue
    DiamondBackgroundColor Gold
}

title Activity Diagram: Registrasi Aset Baru

|#LightBlue|Administrator IT|
|#LightYellow|Sistem|

|Administrator IT|
start

:Login ke sistem;
:Akses menu "Registrasi Aset";

|Sistem|
:Load form registrasi;
:Ambil data master:\n- Kategori\n- Lokasi\n- Vendor;
:Tampilkan form dengan dropdown;

|Administrator IT|
:Pilih kategori aset\n(Laptop/Server/Router/etc);

|Sistem|
:Load form fields sesuai kategori;

|Administrator IT|
fork
    :Input data dasar:\n- Serial Number\n- Model\n- Brand;
fork again
    :Input spesifikasi teknis:\n- CPU/RAM/Storage\n- atau specs lainnya;
fork again
    :Input data pembelian:\n- Tanggal Beli\n- Harga\n- Vendor;
fork again
    :Input data garansi:\n- Tanggal Mulai\n- Tanggal Berakhir;
end fork

:Upload dokumen pendukung\n(Invoice, Sertifikat Garansi);
:Klik "Simpan";

|Sistem|
:Validasi semua input;

if (Semua field valid?) then (Ya)
    :Cek duplikasi serial number;

    if (Serial number unik?) then (Ya)
        :Generate Asset Code;
        note right
            Format: AST-[CATEGORY]-[YEAR]-[SEQ]
            Contoh: AST-LPT-2026-0001
        end note

        :Simpan data aset ke database;

        fork
            :Generate QR Code;
            :Simpan QR Code image;
        fork again
            :Generate Barcode;
            :Simpan Barcode image;
        end fork

        :Set initial status = "New";
        :Hitung jadwal maintenance pertama;
        :Catat timestamp created;

        :Tampilkan konfirmasi sukses;
        :Tampilkan preview QR Code;

        |Administrator IT|
        :Review data yang tersimpan;

        if (Langsung assign lokasi?) then (Ya)
            |Sistem|
            :Tampilkan form penempatan;

            |Administrator IT|
            :Pilih lokasi/user tujuan;
            :Konfirmasi penempatan;

            |Sistem|
            :Update lokasi aset;
            :Set status = "Active";
            :Catat riwayat penempatan;
        else (Tidak)
            |Sistem|
            :Set lokasi = "Storage";
        endif

        |Administrator IT|
        :Cetak label QR Code;
        :Tempel pada aset fisik;

    else (Tidak - Duplikat)
        |Sistem|
        :Tampilkan error:\n"Serial Number sudah ada";

        |Administrator IT|
        :Verifikasi serial number;
        :Perbaiki input;
    endif

else (Tidak - Validasi gagal)
    |Sistem|
    :Highlight field yang error;
    :Tampilkan pesan validasi;

    |Administrator IT|
    :Perbaiki input yang salah;
endif

stop

@enduml
```

---

## 4. Activity Diagram: Proses Monitoring & Perbaikan Aset

### Deskripsi

Alur pemantauan kondisi dan perbaikan aset oleh Teknisi IT.

```plantuml
@startuml AD_Monitoring_Repair
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightGreen
    BorderColor DarkGreen
    DiamondBackgroundColor Gold
}

title Activity Diagram: Proses Monitoring & Perbaikan Aset

|#LightYellow|Sistem (Scheduler)|
|#LightGreen|Teknisi IT|
|#LightCoral|Manajer|

|Sistem (Scheduler)|
start

:Jalankan cron job harian\n(00:00 setiap hari);

:Query aset dengan\njadwal maintenance hari ini;

if (Ada aset yang perlu maintenance?) then (Ya)
    :Generate daftar aset;

    while (Untuk setiap aset)
        :Buat task maintenance;
        :Kirim notifikasi ke Teknisi terkait;

        |Teknisi IT|
        :Terima notifikasi;
        :Lihat detail task maintenance;
        :Akses informasi aset via sistem;

        :Pergi ke lokasi aset;

        if (Menggunakan scanner?) then (Ya)
            :Scan QR Code aset;

            |Sistem (Scheduler)|
            :Decode QR Code;
            :Load detail aset;
            :Tampilkan info & history;
        else (Tidak)
            :Cari manual di sistem;
        endif

        |Teknisi IT|
        :Lakukan pemeriksaan fisik:\n- Kondisi hardware\n- Fungsi sistem\n- Kebersihan;

        #LightPink:Dokumentasi kondisi:\n- Foto kondisi saat ini\n- Catatan pemeriksaan;

        if (Ditemukan masalah?) then (Ya)
            :Identifikasi jenis masalah;

            if (Masalah minor?) then (Ya)
                :Lakukan perbaikan langsung:\n- Pembersihan\n- Update software\n- Penggantian part kecil;

                :Input log maintenance:\n- Deskripsi perbaikan\n- Waktu pengerjaan\n- Parts diganti (jika ada);

                |Sistem (Scheduler)|
                :Set status = "Active";
                :Update last_maintenance;
                :Simpan log;

            else (Tidak - Masalah major)
                |Teknisi IT|
                :Evaluasi tingkat kerusakan;

                if (Masih bisa diperbaiki?) then (Ya)
                    |Sistem (Scheduler)|
                    :Set status = "Repair";

                    |Teknisi IT|
                    :Estimasi biaya & waktu;
                    :Siapkan parts yang dibutuhkan;

                    if (Parts tersedia?) then (Ya)
                        :Lakukan perbaikan;
                        :Input log perbaikan detail:\n- Parts\n- Biaya\n- Waktu;

                        |Sistem (Scheduler)|
                        :Update status = "Active";
                        :Catat total biaya maintenance;

                    else (Tidak)
                        :Input kebutuhan parts;
                        :Ajukan procurement parts;

                        |Sistem (Scheduler)|
                        :Buat pending repair task;
                        :Notifikasi Admin untuk procurement;
                    endif

                else (Tidak - Rusak total)
                    |Sistem (Scheduler)|
                    :Set status = "Broken";

                    |Teknisi IT|
                    :Buat laporan kerusakan detail;
                    :Ajukan request disposal/replacement;

                    |Sistem (Scheduler)|
                    :Buat request dengan attachment;
                    :Kirim ke approval queue;
                    :Notifikasi Manajer;

                    |Manajer|
                    :Terima notifikasi;
                    :Review request & evidence;

                    if (Approve?) then (Ya)
                        :Approve request;

                        |Sistem (Scheduler)|
                        :Update request status;
                        :Set aset status = "Disposed";
                        :Notifikasi semua pihak;

                    else (Tidak)
                        :Reject dengan alasan;

                        |Sistem (Scheduler)|
                        :Notifikasi Teknisi;

                        |Teknisi IT|
                        :Evaluasi ulang;
                    endif
                endif
            endif

        else (Tidak - Kondisi OK)
            |Teknisi IT|
            :Input log pemeriksaan:\n- Status: Normal\n- Catatan: OK;

            |Sistem (Scheduler)|
            :Update status = "Active";
            :Update last_maintenance;
            :Hitung next_maintenance;
        endif

    endwhile

else (Tidak)
    :Tidak ada maintenance hari ini;
endif

:Cron job selesai;
stop

@enduml
```

---

## 5. Activity Diagram: Proses Pengajuan dan Persetujuan (Approval Workflow)

### Deskripsi

Alur lengkap pengajuan penggantian/penghapusan aset dan proses approval oleh Manajer.

```plantuml
@startuml AD_Approval_Workflow
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightYellow
    BorderColor DarkOrange
    DiamondBackgroundColor Gold
}

title Activity Diagram: Proses Pengajuan dan Persetujuan

|#LightGreen|Teknisi IT|
|#LightYellow|Sistem|
|#LightCoral|Manajer|
|#LightBlue|Administrator IT|

|Teknisi IT|
start

:Identifikasi aset yang perlu\npenggantian/penghapusan;

:Akses detail aset;
:Klik "Ajukan Request";

|Sistem|
:Validasi status aset;

if (Status = Broken?) then (Ya)
    :Tampilkan form pengajuan;

    |Teknisi IT|
    :Pilih tipe request:\n□ Replacement (Penggantian)\n□ Disposal (Penghapusan);

    :Input justifikasi:\n- Alasan detail\n- Riwayat perbaikan\n- Estimasi biaya replacement;

    :Upload dokumen pendukung:\n- Foto kerusakan\n- Laporan teknisi\n- Quote vendor (jika replacement);

    :Submit request;

    |Sistem|
    :Validasi kelengkapan form;

    if (Form lengkap?) then (Ya)
        :Generate nomor request;
        note right
            Format: REQ-[TYPE]-[YEAR]-[SEQ]
            REQ-RPL-2026-0001 (Replacement)
            REQ-DSP-2026-0001 (Disposal)
        end note

        :Simpan request ke database;
        :Set request status = "Pending";
        :Set asset status = "Pending Approval";

        :Identifikasi approver:\n- Cari Manajer departemen terkait\n- atau Manajer IT;

        fork
            :Kirim email notifikasi ke Manajer;
        fork again
            :Kirim in-app notification;
        fork again
            :Update notification badge;
        end fork

        :Tampilkan konfirmasi pengajuan;
        :Tampilkan nomor tracking;

        |Teknisi IT|
        :Catat nomor request;
        :Menunggu approval;

        ' ===== ALUR APPROVAL MANAJER =====

        |Manajer|
        :Terima notifikasi pending request;
        :Akses Approval Center;

        |Sistem|
        :Tampilkan daftar pending requests;
        :Urutkan by priority & date;

        |Manajer|
        :Pilih request untuk review;

        |Sistem|
        :Load detail request:\n- Info aset\n- Alasan\n- Dokumen\n- Riwayat maintenance\n- Total biaya selama ini;

        |Manajer|
        :Review semua informasi;
        :Analisis cost-benefit;

        if (Perlu informasi tambahan?) then (Ya)
            :Minta klarifikasi;

            |Sistem|
            :Set status = "Needs Clarification";
            :Kirim notifikasi ke Teknisi;

            |Teknisi IT|
            :Terima permintaan klarifikasi;
            :Siapkan informasi tambahan;
            :Submit klarifikasi;

            |Sistem|
            :Update request;
            :Notifikasi Manajer;

            |Manajer|
            :Review klarifikasi;
        endif

        if (Request disetujui?) then (Ya)
            :Klik "Approve";
            :Input catatan approval;

            |Sistem|
            :Set request status = "Approved";
            :Catat approved_by & approved_at;

            if (Tipe = Disposal?) then (Ya)
                :Set asset status = "Disposed";
                :Catat disposal_date;
                :Arsipkan data aset;

                fork
                    :Notifikasi Teknisi: Request Approved;
                fork again
                    :Notifikasi Admin: Proses disposal aset;
                end fork

                |Administrator IT|
                :Terima notifikasi disposal;
                :Proses penghapusan fisik;
                :Update inventaris;
                :Buat berita acara disposal;

            else (Tipe = Replacement)
                |Sistem|
                :Set asset status = "Awaiting Replacement";

                fork
                    :Notifikasi Teknisi: Request Approved;
                fork again
                    :Notifikasi Admin: Proses pengadaan;
                end fork

                |Administrator IT|
                :Terima notifikasi procurement;
                :Mulai proses pengadaan aset baru;

                |Sistem|
                :Buat task procurement;
                :Link ke request asli;
            endif

        else (Tidak - Ditolak)
            |Manajer|
            :Klik "Reject";
            :Input alasan penolakan;

            |Sistem|
            :Set request status = "Rejected";
            :Catat rejection_reason;
            :Set asset status = "Broken";

            :Kirim notifikasi rejection ke Teknisi;

            |Teknisi IT|
            :Terima notifikasi penolakan;
            :Baca alasan penolakan;

            if (Bisa appeal?) then (Ya)
                :Siapkan informasi baru;
                :Submit request baru dengan\ndata yang lebih lengkap;
                note right
                    Kembali ke awal alur
                end note
            else (Tidak)
                :Evaluasi alternatif:\n- Perbaikan lebih lanjut\n- Gunakan dengan kondisi terbatas;
            endif
        endif

    else (Tidak - Form tidak lengkap)
        |Sistem|
        :Tampilkan error validasi;
        :Highlight field yang kurang;

        |Teknisi IT|
        :Lengkapi field yang diminta;
    endif

else (Tidak - Status bukan Broken)
    |Sistem|
    :Tampilkan error:\n"Hanya aset berstatus 'Broken'\nyang dapat diajukan";

    |Teknisi IT|
    :Update status aset ke Broken\nterlebih dahulu jika memang rusak;
endif

stop

@enduml
```

---

## 6. Activity Diagram: Generate & Export Report

### Deskripsi

Alur pembuatan dan ekspor laporan oleh Admin atau Manajer.

```plantuml
@startuml AD_Generate_Report
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightBlue
    BorderColor DarkBlue
    DiamondBackgroundColor Gold
}

title Activity Diagram: Generate & Export Report

|#LightBlue|Admin/Manajer|
|#LightYellow|Sistem|

|Admin/Manajer|
start

:Akses menu "Laporan";

|Sistem|
:Tampilkan halaman laporan;
:Load tipe laporan yang tersedia;

|Admin/Manajer|
:Pilih tipe laporan:\n- Asset Summary\n- Maintenance History\n- Request Analytics\n- Cost Analysis\n- Depreciation Report;

|Sistem|
:Load form filter sesuai tipe;

|Admin/Manajer|
:Set filter:\n- Rentang tanggal\n- Kategori aset\n- Status\n- Lokasi\n- Department;

:Klik "Generate Report";

|Sistem|
:Validasi parameter;

if (Parameter valid?) then (Ya)
    :Cek cache;

    if (Data ada di cache?) then (Ya)
        :Ambil dari cache;
    else (Tidak)
        :Query database sesuai filter;
        :Aggregate data;
        :Hitung statistik;
        :Simpan ke cache (TTL: 5 menit);
    endif

    :Format data untuk tampilan;

    fork
        :Generate tabel data;
    fork again
        :Generate chart/grafik;
    fork again
        :Hitung summary statistics;
    end fork

    :Render preview laporan;

    |Admin/Manajer|
    :Review preview laporan;

    if (Ingin export?) then (Ya)
        :Pilih format export:\n□ PDF\n□ Excel\n□ CSV;

        :Klik "Export";

        |Sistem|
        if (Format = PDF?) then
            :Generate PDF document;
            :Apply header & footer;
            :Insert charts as images;
            :Add page numbers;
        elseif (Format = Excel?) then
            :Create workbook;
            :Add data sheets;
            :Add chart sheets;
            :Apply formatting;
        else (CSV)
            :Convert to CSV format;
            :Handle special characters;
        endif

        :Generate file;
        :Create download link;
        :Trigger download;

        |Admin/Manajer|
        :Download file;
        :File tersimpan di lokal;

    else (Tidak)
        :Lihat di screen saja;
    endif

    if (Ingin print?) then (Ya)
        |Sistem|
        :Generate print-friendly version;
        :Open print dialog;

        |Admin/Manajer|
        :Print dokumen;
    else (Tidak)
        :(skip);
    endif

    if (Ingin schedule report?) then (Ya)
        |Admin/Manajer|
        :Set jadwal:\n- Frekuensi (daily/weekly/monthly)\n- Recipients\n- Format;

        |Sistem|
        :Simpan scheduled report;
        :Akan auto-generate sesuai jadwal;
    endif

else (Tidak - Parameter tidak valid)
    |Sistem|
    :Tampilkan error validasi;

    |Admin/Manajer|
    :Perbaiki parameter;
endif

stop

@enduml
```

---

## 7. Activity Diagram: Scan QR Code & Quick Action

### Deskripsi

Alur penggunaan fitur scan QR untuk identifikasi dan aksi cepat pada aset.

```plantuml
@startuml AD_Scan_QR
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightGreen
    BorderColor DarkGreen
    DiamondBackgroundColor Gold
}

title Activity Diagram: Scan QR Code & Quick Action

|#LightGreen|Teknisi IT|
|#LightYellow|Sistem|
|#Pink|Kamera Device|

|Teknisi IT|
start

:Buka aplikasi/web di mobile device;
:Akses fitur "Scan Aset";

|Sistem|
:Request permission kamera;

|Kamera Device|
if (Permission granted?) then (Ya)
    :Aktifkan kamera;
    :Display viewfinder;

    |Teknisi IT|
    :Arahkan kamera ke QR Code aset;

    |Kamera Device|
    :Capture frame;
    :Detect QR pattern;

    if (QR Code terdeteksi?) then (Ya)
        :Decode QR data;
        :Kirim asset_code ke sistem;
        :Play beep sound;
        :Show visual feedback;

        |Sistem|
        :Terima asset_code;
        :Query database;

        if (Aset ditemukan?) then (Ya)
            :Load detail aset;
            :Load maintenance history;
            :Load current status;

            :Tampilkan info aset:\n━━━━━━━━━━━━━━━━\n📱 AST-LPT-2026-0001\n━━━━━━━━━━━━━━━━\n🏷️ Dell Latitude 5520\n📍 Ruang IT - Lantai 2\n✅ Status: Active\n🔧 Last Maintenance: 15 Jan 2026\n⏰ Next Maintenance: 15 Apr 2026;

            :Tampilkan quick actions:\n[Update Status]\n[Input Maintenance]\n[View History]\n[Report Issue];

            |Teknisi IT|
            :Pilih quick action;

            if (Action = Update Status?) then
                |Sistem|
                :Tampilkan form status;

                |Teknisi IT|
                :Pilih status baru;
                :Input notes;
                :Submit;

                |Sistem|
                :Update status;
                :Simpan history;
                :Tampilkan konfirmasi;

            elseif (Action = Input Maintenance?) then
                |Sistem|
                :Tampilkan form maintenance;

                |Teknisi IT|
                :Input detail maintenance;
                :Upload foto (opsional);
                :Submit;

                |Sistem|
                :Simpan log maintenance;
                :Tampilkan konfirmasi;

            elseif (Action = View History?) then
                |Sistem|
                :Load full history;
                :Tampilkan timeline;

                |Teknisi IT|
                :Review history;

            else (Action = Report Issue)
                |Sistem|
                :Tampilkan form issue;

                |Teknisi IT|
                :Describe issue;
                :Attach photos;
                :Set priority;
                :Submit;

                |Sistem|
                :Create issue ticket;
                :Notify relevant parties;
            endif

        else (Tidak - Aset tidak ada)
            |Sistem|
            :Tampilkan error:\n"Aset tidak ditemukan dalam sistem";

            |Teknisi IT|
            if (Ingin registrasi?) then (Ya)
                :Scan adalah aset baru;
                :Redirect ke form registrasi;
                note right
                    Lanjut ke alur
                    Registrasi Aset
                end note
            else (Tidak)
                :QR mungkin rusak/salah;
                :Cari manual di sistem;
            endif
        endif

    else (Tidak - QR tidak terdeteksi)
        |Kamera Device|
        :Lanjut capture;

        |Teknisi IT|
        :Adjust posisi/jarak;

        if (Timeout 10 detik?) then (Ya)
            |Sistem|
            :Tampilkan tips:\n- Pastikan pencahayaan cukup\n- Bersihkan QR Code\n- Jaga jarak 10-20 cm;

            |Teknisi IT|
            if (Coba lagi?) then (Ya)
                :Reset scanner;
            else (Tidak)
                :Input asset code manual;
            endif
        endif
    endif

else (Tidak - Permission denied)
    |Sistem|
    :Tampilkan pesan:\n"Izin kamera diperlukan";
    :Tampilkan opsi input manual;

    |Teknisi IT|
    :Grant permission atau input manual;
endif

stop

@enduml
```

---

## 8. Activity Diagram: Sistem Notifikasi Otomatis

### Deskripsi

Alur sistem notifikasi otomatis untuk berbagai event.

```plantuml
@startuml AD_Notification_System
skinparam backgroundColor #FEFEFE
skinparam activity {
    BackgroundColor LightYellow
    BorderColor DarkOrange
    DiamondBackgroundColor Gold
}

title Activity Diagram: Sistem Notifikasi Otomatis

|#LightYellow|Notification Engine|
|#LightGreen|Event Trigger|
|#LightBlue|Delivery Service|
|#Pink|User|

|Event Trigger|
start

:Event terjadi di sistem;

|Notification Engine|
:Terima event notification;
:Parse event type & data;

if (Event type?) then (WARRANTY_EXPIRY)
    :Template: Garansi akan habis;
    :Recipients: Admin;
    :Priority: Medium;

elseif (type = MAINTENANCE_DUE) then
    :Template: Jadwal maintenance;
    :Recipients: Teknisi assigned;
    :Priority: Medium;

elseif (type = REQUEST_SUBMITTED) then
    :Template: Request baru;
    :Recipients: Manajer;
    :Priority: High;

elseif (type = REQUEST_APPROVED) then
    :Template: Request disetujui;
    :Recipients: Teknisi pengaju;
    :Priority: High;

elseif (type = REQUEST_REJECTED) then
    :Template: Request ditolak;
    :Recipients: Teknisi pengaju;
    :Priority: High;

elseif (type = ASSET_CRITICAL) then
    :Template: Aset kritis;
    :Recipients: Admin, Manajer;
    :Priority: Critical;

else (OTHER)
    :Template: General notification;
    :Recipients: Based on config;
    :Priority: Low;
endif

:Populate template dengan data;
:Generate notification content;

:Ambil user preferences;

while (Untuk setiap recipient)
    :Cek preference delivery channel;

    fork
        if (In-App enabled?) then (Ya)
            |Delivery Service|
            :Simpan ke notifications table;
            :Update badge count;
            :Trigger real-time push (WebSocket);
        endif
    fork again
        if (Email enabled?) then (Ya)
            |Delivery Service|
            :Format email HTML;
            :Queue ke email service;
            :Send email async;
        endif
    fork again
        if (SMS enabled?) then (Ya)
            |Delivery Service|
            :Format SMS text;
            :Queue ke SMS gateway;
            :Send SMS async;
        endif
    end fork

    |Notification Engine|
    :Log notification sent;

    |Pink|
    :Terima notifikasi;

    if (Channel = In-App?) then
        :Lihat di notification center;
        :Klik untuk detail;
    elseif (Channel = Email?) then
        :Baca email;
        :Klik link untuk aksi;
    else (SMS)
        :Baca SMS;
        :Login untuk aksi lanjut;
    endif

endwhile

|Notification Engine|
:Notification cycle complete;
stop

@enduml
```

---

## Summary Activity Diagrams

| No  | Diagram                     | Deskripsi                                          | Aktor Terlibat                  |
| --- | --------------------------- | -------------------------------------------------- | ------------------------------- |
| 1   | Manajemen Siklus Hidup Aset | Lifecycle lengkap dari registrasi hingga disposal  | Admin, Teknisi, Manajer, Sistem |
| 2   | Proses Login & Autentikasi  | Alur login dengan validasi dan role-based redirect | Semua User, Sistem              |
| 3   | Registrasi Aset Baru        | Pendaftaran aset baru lengkap dengan QR generation | Admin, Sistem                   |
| 4   | Monitoring & Perbaikan      | Pemantauan kondisi dan proses perbaikan            | Teknisi, Sistem, Manajer        |
| 5   | Pengajuan & Persetujuan     | Workflow approval untuk disposal/replacement       | Teknisi, Manajer, Admin         |
| 6   | Generate & Export Report    | Pembuatan laporan dengan berbagai format export    | Admin/Manajer, Sistem           |
| 7   | Scan QR & Quick Action      | Identifikasi aset dan aksi cepat via mobile        | Teknisi, Sistem                 |
| 8   | Sistem Notifikasi Otomatis  | Automatic notification untuk berbagai event        | Sistem, Delivery Service        |

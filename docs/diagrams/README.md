# Diagrams - Sistem Monitoring dan Manajemen Inventaris Aset IT

Folder ini berisi dokumentasi diagram UML lengkap untuk sistem Monitoring dan Manajemen Inventaris Aset IT.

## Struktur Folder:

```
diagrams/
├── use-case/          - Use Case Diagrams (perspektif pengguna)
│   ├── 01-use-case-overview.md
│   ├── 02-use-case-admin.md
│   ├── 03-use-case-technician.md
│   ├── 04-use-case-manager.md
│   ├── README.md
│   └── images/
├── sequence/          - Sequence Diagrams (alur interaksi antar objek)
│   ├── 01-sd-login.md
│   ├── 02-sd-register-asset.md
│   ├── 03-sd-update-status.md
│   ├── 04-sd-maintenance-log.md
│   ├── 05-sd-submit-request.md
│   ├── 06-sd-approval-process.md
│   ├── README.md
│   └── images/
├── activity/          - Activity Diagrams (alur proses bisnis)
│   ├── 01-ad-asset-lifecycle.md
│   ├── 02-ad-login.md
│   ├── 03-ad-register-asset.md
│   ├── 04-ad-monitoring-repair.md
│   ├── 05-ad-approval-workflow.md
│   ├── 06-ad-generate-report.md
│   ├── 07-ad-scan-qr.md
│   ├── 08-ad-notification-system.md
│   ├── README.md
│   └── images/
├── class/             - Class Diagrams (struktur kelas dan relasi)
│   ├── 01-class-overview.md
│   ├── 02-class-user-management.md
│   ├── 03-class-asset-management.md
│   ├── 04-class-maintenance.md
│   ├── 05-class-request-approval.md
│   ├── 06-class-notification.md
│   ├── 07-class-services.md
│   ├── README.md
│   └── images/
├── architecture/      - Architecture Diagrams (sistem & infrastruktur)
│   ├── README.md
│   └── images/
│       ├── Architecture.png
│       ├── Backend_Axum.png
│       ├── Backend_ElysiaJS.png
│       ├── Frontend.png
│       ├── Database.png
│       ├── ERD_Complete.png
│       ├── Security.png
│       ├── DevOps.png
│       ├── Actors.png
│       └── Actor_Relationship.png
└── README.md (file ini)
```

## 📋 Deskripsi Jenis Diagram:

### 1. **Use Case Diagram** 🎭
Menggambarkan interaksi antara aktor dengan sistem dari perspektif pengguna.
- [Lihat folder use-case](./use-case/)

### 2. **Sequence Diagram** 🔄
Menggambarkan alur komunikasi dan interaksi antar objek dalam sistem.
- [Lihat folder sequence](./sequence/)

### 3. **Activity Diagram** 📊
Menggambarkan alur proses bisnis dan langkah-langkah dalam setiap use case.
- [Lihat folder activity](./activity/)

### 4. **Class Diagram** 🏗️
Menggambarkan struktur kelas, atribut, metode, dan relasi antar kelas.
- [Lihat folder class](./class/)

### 5. **Architecture Diagram** 🏢
Menggambarkan arsitektur sistem, infrastruktur, dan teknologi yang digunakan.
- [Lihat folder architecture](./architecture/)

## 🎯 Panduan Penggunaan:

1. **Untuk memahami alur bisnis**: Mulai dari **Activity Diagram**
2. **Untuk memahami interaksi detail**: Lihat **Sequence Diagram**
3. **Untuk memahami struktur data**: Lihat **Class Diagram**
4. **Untuk memahami use cases**: Lihat **Use Case Diagram**
5. **Untuk memahami arsitektur sistem**: Lihat **Architecture Diagram**

## 📌 Catatan:

- Semua diagram dalam format **PlantUML** dan dapat di-render di berbagai platform
- Setiap diagram dilengkapi dengan **gambar PNG** di folder `images/`
- Setiap diagram memiliki **penjelasan detail** dalam format Markdown
- Diagram saling terhubung dan melengkapi

## 🔗 Referensi Cepat:

| Diagram | Tujuan | Lihat |
|---------|--------|-------|
| Use Case | Fungsionalitas dari perspektif pengguna | [use-case/](./use-case/) |
| Sequence | Alur interaksi antar komponen | [sequence/](./sequence/) |
| Activity | Alur proses dan workflow bisnis | [activity/](./activity/) |
| Class | Struktur kelas dan relasi data | [class/](./class/) |
| Architecture | Arsitektur sistem dan infrastruktur | [architecture/](./architecture/) |

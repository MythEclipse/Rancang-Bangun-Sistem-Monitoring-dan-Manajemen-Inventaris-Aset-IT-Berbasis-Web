# Use Case Diagram - Administrator IT

## 📋 Deskripsi

Use Case Diagram khusus untuk Administrator IT yang menunjukkan semua fungsionalitas manajemen yang dapat dilakukan oleh administrator.

---

## Use Cases Administrator IT

```plantuml
@startuml Use_Case_Admin
skinparam backgroundColor #FEFEFE
skinparam usecase {
    BackgroundColor LightBlue
}

left to right direction

actor "Administrator IT" as Admin #LightBlue

rectangle "Modul Administrasi" {
    usecase "Login" as UC01
    usecase "View Dashboard" as UC03

    package "Manajemen Pengguna" {
        usecase "Create User" as UC_CU
        usecase "Edit User" as UC_EU
        usecase "Delete User" as UC_DU
        usecase "Reset Password User" as UC_RP
        usecase "Assign Role" as UC_AR
    }

    package "Manajemen Master Data" {
        usecase "Manage Categories" as UC_MC
        usecase "Manage Locations" as UC_ML
        usecase "Manage Departments" as UC_MD
        usecase "Manage Vendors" as UC_MV
    }

    package "Manajemen Aset" {
        usecase "Register New Asset" as UC_RA
        usecase "Edit Asset Data" as UC_EA
        usecase "Delete Asset" as UC_DA
        usecase "Assign Asset" as UC_AA
        usecase "Transfer Asset" as UC_TA
        usecase "Generate QR Code" as UC_QR
    }

    package "Laporan & Konfigurasi" {
        usecase "Generate Reports" as UC_GR
        usecase "Export Data" as UC_ED
        usecase "Configure Settings" as UC_CS
        usecase "Backup Data" as UC_BD
    }
}

Admin --> UC01
Admin --> UC03
Admin --> UC_CU
Admin --> UC_EU
Admin --> UC_DU
Admin --> UC_RP
Admin --> UC_AR
Admin --> UC_MC
Admin --> UC_ML
Admin --> UC_MD
Admin --> UC_MV
Admin --> UC_RA
Admin --> UC_EA
Admin --> UC_DA
Admin --> UC_AA
Admin --> UC_TA
Admin --> UC_QR
Admin --> UC_GR
Admin --> UC_ED
Admin --> UC_CS
Admin --> UC_BD

UC_RA ..> UC_QR : <<include>>

@enduml
```

![Use Case Admin](./images/Use_Case_Admin.png)

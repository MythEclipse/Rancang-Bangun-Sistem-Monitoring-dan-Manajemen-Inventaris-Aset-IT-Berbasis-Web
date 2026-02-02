# Use Case Diagram - Teknisi/Staff IT

## 📋 Deskripsi

Use Case Diagram khusus untuk Teknisi/Staff IT yang menunjukkan semua fungsionalitas yang dapat dilakukan untuk monitoring dan perbaikan aset.

---

## Use Cases Teknisi/Staff IT

```plantuml
@startuml Use_Case_Technician
skinparam backgroundColor #FEFEFE
skinparam usecase {
    BackgroundColor LightGreen
}

left to right direction

actor "Teknisi/Staff IT" as Tech #LightGreen

rectangle "Modul Teknisi" {
    usecase "Login" as UC01
    usecase "View Dashboard" as UC03

    package "Monitoring Aset" {
        usecase "View Asset List" as UC_VAL
        usecase "View Asset Details" as UC_VAD
        usecase "Scan QR/Barcode" as UC_SQ
        usecase "Search Asset" as UC_SA
        usecase "Filter by Status" as UC_FS
        usecase "View Asset History" as UC_VAH
    }

    package "Update Status" {
        usecase "Update to Normal" as UC_UN
        usecase "Update to Repair" as UC_UR
        usecase "Update to Broken" as UC_UB
        usecase "Add Status Notes" as UC_ASN
        usecase "Upload Photo Evidence" as UC_UP
    }

    package "Maintenance" {
        usecase "View Maintenance Schedule" as UC_VMS
        usecase "Input Maintenance Log" as UC_IML
        usecase "Record Repair Cost" as UC_RRC
        usecase "Complete Maintenance Task" as UC_CMT
    }

    package "Pengajuan" {
        usecase "Submit Replacement Request" as UC_SRR
        usecase "Submit Disposal Request" as UC_SDR
        usecase "View Request Status" as UC_VRS
        usecase "Cancel Request" as UC_CR
    }
}

Tech --> UC01
Tech --> UC03
Tech --> UC_VAL
Tech --> UC_VAD
Tech --> UC_SQ
Tech --> UC_SA
Tech --> UC_FS
Tech --> UC_VAH
Tech --> UC_UN
Tech --> UC_UR
Tech --> UC_UB
Tech --> UC_ASN
Tech --> UC_UP
Tech --> UC_VMS
Tech --> UC_IML
Tech --> UC_RRC
Tech --> UC_CMT
Tech --> UC_SRR
Tech --> UC_SDR
Tech --> UC_VRS
Tech --> UC_CR

UC_SQ ..> UC_VAD : <<include>>
UC_IML ..> UC_RRC : <<extend>>
UC_UB ..> UC_SRR : <<extend>>

@enduml
```

![Use Case Technician](./images/Use_Case_Technician.png)

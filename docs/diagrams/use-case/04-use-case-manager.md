# Use Case Diagram - Manajer/Kepala Departemen

## 📋 Deskripsi

Use Case Diagram khusus untuk Manajer/Kepala Departemen yang menunjukkan semua fungsionalitas approval, analytics, dan reporting.

---

## Use Cases Manajer/Kepala Departemen

```plantuml
@startuml Use_Case_Manager
skinparam backgroundColor #FEFEFE
skinparam usecase {
    BackgroundColor LightCoral
}

left to right direction

actor "Manajer/Kepala Departemen" as Manager #LightCoral

rectangle "Modul Manajer" {
    usecase "Login" as UC01
    usecase "View Dashboard" as UC03

    package "Approval Center" {
        usecase "View Pending Requests" as UC_VPR
        usecase "Approve Request" as UC_AR
        usecase "Reject Request" as UC_RR
        usecase "Add Approval Notes" as UC_AN
        usecase "View Request History" as UC_VRH
    }

    package "Analytics & Reports" {
        usecase "View Analytics Dashboard" as UC_VAD
        usecase "View Asset Summary" as UC_VAS
        usecase "View Maintenance Summary" as UC_VMS
        usecase "View Cost Analysis" as UC_VCA
        usecase "View Department Report" as UC_VDR
    }

    package "Export & Download" {
        usecase "Export to PDF" as UC_EP
        usecase "Export to Excel" as UC_EE
        usecase "Print Report" as UC_PR
        usecase "Schedule Report" as UC_SR
    }

    package "Notifications" {
        usecase "View Notifications" as UC_VN
        usecase "Mark as Read" as UC_MR
        usecase "Configure Alert Preferences" as UC_CAP
    }
}

Manager --> UC01
Manager --> UC03
Manager --> UC_VPR
Manager --> UC_AR
Manager --> UC_RR
Manager --> UC_AN
Manager --> UC_VRH
Manager --> UC_VAD
Manager --> UC_VAS
Manager --> UC_VMS
Manager --> UC_VCA
Manager --> UC_VDR
Manager --> UC_EP
Manager --> UC_EE
Manager --> UC_PR
Manager --> UC_SR
Manager --> UC_VN
Manager --> UC_MR
Manager --> UC_CAP

UC_AR ..> UC_AN : <<extend>>
UC_RR ..> UC_AN : <<include>>
UC_VDR ..> UC_EP : <<extend>>
UC_VDR ..> UC_EE : <<extend>>

@enduml
```

![Use Case Manager](./images/Use_Case_Manager.png)

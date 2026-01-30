# Sequence Diagram

## 📋 Deskripsi

Sequence Diagram menggambarkan alur interaksi antar objek dalam sistem pada setiap use case yang relevan. Diagram ini menunjukkan urutan pesan yang dikirim antar objek beserta waktu eksekusinya.

---

## 1. Sequence Diagram: Login & Authentication

### Deskripsi

Proses autentikasi pengguna untuk masuk ke sistem. Berlaku untuk semua aktor (Admin, Teknisi, Manajer).

```plantuml
@startuml SD_Login
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Login & Authentication

actor "User\n(Admin/Teknisi/Manajer)" as User
participant "Login Page\n<<View>>" as LoginPage
participant "AuthController\n<<Controller>>" as AuthController
participant "AuthService\n<<Service>>" as AuthService
participant "UserRepository\n<<Repository>>" as UserRepo
database "Database" as DB
participant "SessionManager\n<<Service>>" as Session
participant "Dashboard\n<<View>>" as Dashboard

User -> LoginPage : 1. Akses halaman login
activate LoginPage

User -> LoginPage : 2. Input username & password
LoginPage -> AuthController : 3. submitLogin(credentials)
activate AuthController

AuthController -> AuthService : 4. authenticate(username, password)
activate AuthService

AuthService -> UserRepo : 5. findByUsername(username)
activate UserRepo

UserRepo -> DB : 6. SELECT * FROM users WHERE username = ?
activate DB
DB --> UserRepo : 7. User data
deactivate DB

UserRepo --> AuthService : 8. User entity
deactivate UserRepo

alt Password Valid
    AuthService -> AuthService : 9. verifyPassword(inputPassword, hashedPassword)
    AuthService -> Session : 10. createSession(userId, role)
    activate Session
    Session --> AuthService : 11. JWT Token
    deactivate Session

    AuthService --> AuthController : 12. AuthResult(success, token, role)
    deactivate AuthService

    AuthController --> LoginPage : 13. LoginResponse(success, redirectUrl)
    deactivate AuthController

    LoginPage -> Dashboard : 14. Redirect to Dashboard
    activate Dashboard
    Dashboard --> User : 15. Display Dashboard sesuai role
    deactivate Dashboard

else Password Invalid
    AuthService --> AuthController : 12a. AuthResult(failed, "Invalid credentials")
    AuthController --> LoginPage : 13a. LoginResponse(failed, errorMessage)
    LoginPage --> User : 14a. Display error message
end

deactivate LoginPage

@enduml
```

---

## 2. Sequence Diagram: Registrasi Aset Baru

### Deskripsi

Proses pendaftaran aset IT baru ke dalam sistem oleh Administrator IT.

```plantuml
@startuml SD_Register_Asset
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Registrasi Aset Baru

actor "Administrator IT" as Admin
participant "Asset Form\n<<View>>" as AssetForm
participant "AssetController\n<<Controller>>" as AssetController
participant "AssetService\n<<Service>>" as AssetService
participant "QRCodeService\n<<Service>>" as QRService
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "CategoryRepository\n<<Repository>>" as CatRepo
participant "LocationRepository\n<<Repository>>" as LocRepo
database "Database" as DB
participant "FileStorage\n<<Service>>" as Storage

Admin -> AssetForm : 1. Akses form registrasi aset
activate AssetForm

AssetForm -> AssetController : 2. getFormData()
activate AssetController
AssetController -> CatRepo : 3. findAllCategories()
activate CatRepo
CatRepo -> DB : 4. SELECT * FROM categories
DB --> CatRepo : 5. Category list
deactivate CatRepo

AssetController -> LocRepo : 6. findAllLocations()
activate LocRepo
LocRepo -> DB : 7. SELECT * FROM locations
DB --> LocRepo : 8. Location list
deactivate LocRepo

AssetController --> AssetForm : 9. FormData(categories, locations, vendors)
deactivate AssetController

AssetForm --> Admin : 10. Display form dengan dropdown options

Admin -> AssetForm : 11. Input data aset\n(serial_number, model, brand, specs,\npurchase_date, warranty_end, category, location)
AssetForm -> AssetController : 12. createAsset(assetData)
activate AssetController

AssetController -> AssetController : 13. validateInput(assetData)

AssetController -> AssetService : 14. registerAsset(assetData)
activate AssetService

AssetService -> AssetService : 15. generateAssetCode()

AssetService -> AssetRepo : 16. checkSerialNumberExists(serial_number)
activate AssetRepo
AssetRepo -> DB : 17. SELECT FROM assets WHERE serial_number = ?
DB --> AssetRepo : 18. Result (null = tidak ada)
deactivate AssetRepo

alt Serial Number Unik
    AssetService -> AssetRepo : 19. save(assetEntity)
    activate AssetRepo
    AssetRepo -> DB : 20. INSERT INTO assets VALUES(...)
    DB --> AssetRepo : 21. assetId
    AssetRepo --> AssetService : 22. Saved asset with ID
    deactivate AssetRepo

    AssetService -> QRService : 23. generateQRCode(assetCode)
    activate QRService
    QRService -> QRService : 24. createQRImage()
    QRService -> Storage : 25. saveQRImage(qrImage, filename)
    activate Storage
    Storage --> QRService : 26. qrImagePath
    deactivate Storage
    QRService --> AssetService : 27. QRCode URL
    deactivate QRService

    AssetService -> AssetRepo : 28. updateQRPath(assetId, qrPath)
    AssetRepo -> DB : 29. UPDATE assets SET qr_code_path = ?

    AssetService --> AssetController : 30. AssetResult(success, asset)
    deactivate AssetService

    AssetController --> AssetForm : 31. Response(success, "Aset berhasil didaftarkan")
    deactivate AssetController

    AssetForm --> Admin : 32. Display success message + QR Code preview

else Serial Number Sudah Ada
    AssetService --> AssetController : 19a. AssetResult(failed, "Serial number already exists")
    AssetController --> AssetForm : 20a. Response(failed, errorMessage)
    AssetForm --> Admin : 21a. Display error message
end

deactivate AssetForm

@enduml
```

---

## 3. Sequence Diagram: Update Status Aset

### Deskripsi

Proses pembaruan status kondisi aset oleh Teknisi IT.

```plantuml
@startuml SD_Update_Status
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Update Status Aset

actor "Teknisi IT" as Tech
participant "Asset List\n<<View>>" as AssetList
participant "Asset Detail\n<<View>>" as AssetDetail
participant "AssetController\n<<Controller>>" as AssetController
participant "AssetService\n<<Service>>" as AssetService
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "AssetHistoryRepository\n<<Repository>>" as HistoryRepo
participant "NotificationService\n<<Service>>" as NotifService
database "Database" as DB

Tech -> AssetList : 1. Pilih aset untuk diupdate
activate AssetList

AssetList -> AssetController : 2. getAssetDetail(assetId)
activate AssetController
AssetController -> AssetRepo : 3. findById(assetId)
activate AssetRepo
AssetRepo -> DB : 4. SELECT * FROM assets WHERE id = ?
DB --> AssetRepo : 5. Asset data
AssetRepo --> AssetController : 6. Asset entity
deactivate AssetRepo
AssetController --> AssetList : 7. AssetDetailDTO
deactivate AssetController

AssetList -> AssetDetail : 8. Display detail aset
activate AssetDetail
AssetDetail --> Tech : 9. Tampilkan form update status

Tech -> AssetDetail : 10. Update status\n(status: Repair/Broken, notes, photo)

AssetDetail -> AssetController : 11. updateAssetStatus(assetId, statusData)
activate AssetController

AssetController -> AssetController : 12. validateStatusData(statusData)

AssetController -> AssetService : 13. updateStatus(assetId, newStatus, notes, technicianId)
activate AssetService

AssetService -> AssetRepo : 14. findById(assetId)
activate AssetRepo
AssetRepo -> DB : 15. SELECT * FROM assets WHERE id = ?
DB --> AssetRepo : 16. Current asset data
AssetRepo --> AssetService : 17. Asset entity (with old status)
deactivate AssetRepo

AssetService -> AssetService : 18. captureOldStatus()

AssetService -> AssetRepo : 19. updateStatus(assetId, newStatus)
activate AssetRepo
AssetRepo -> DB : 20. UPDATE assets SET status = ?, updated_at = NOW()
DB --> AssetRepo : 21. Update success
deactivate AssetRepo

AssetService -> HistoryRepo : 22. saveHistory(assetId, oldStatus, newStatus, techId, notes)
activate HistoryRepo
HistoryRepo -> DB : 23. INSERT INTO asset_history VALUES(...)
DB --> HistoryRepo : 24. History saved
deactivate HistoryRepo

alt Status = Broken (Critical)
    AssetService -> NotifService : 25. sendAlertToAdmin(assetId, "Asset marked as Broken")
    activate NotifService
    NotifService -> DB : 26. INSERT INTO notifications VALUES(...)
    NotifService --> AssetService : 27. Notification sent
    deactivate NotifService
end

AssetService --> AssetController : 28. UpdateResult(success, updatedAsset)
deactivate AssetService

AssetController --> AssetDetail : 29. Response(success, "Status berhasil diupdate")
deactivate AssetController

AssetDetail --> Tech : 30. Display success message & updated status
deactivate AssetDetail
deactivate AssetList

@enduml
```

---

## 4. Sequence Diagram: Input Maintenance Log

### Deskripsi

Proses pencatatan log pemeliharaan/perbaikan aset oleh Teknisi IT.

```plantuml
@startuml SD_Maintenance_Log
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Input Maintenance Log

actor "Teknisi IT" as Tech
participant "Maintenance Form\n<<View>>" as MaintenanceForm
participant "MaintenanceController\n<<Controller>>" as MaintenanceController
participant "MaintenanceService\n<<Service>>" as MaintenanceService
participant "MaintenanceLogRepository\n<<Repository>>" as LogRepo
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "FileUploadService\n<<Service>>" as UploadService
database "Database" as DB

Tech -> MaintenanceForm : 1. Akses form maintenance untuk aset
activate MaintenanceForm

MaintenanceForm -> MaintenanceController : 2. getMaintenanceForm(assetId)
activate MaintenanceController
MaintenanceController -> AssetRepo : 3. findById(assetId)
activate AssetRepo
AssetRepo -> DB : 4. SELECT * FROM assets WHERE id = ?
DB --> AssetRepo : 5. Asset data
AssetRepo --> MaintenanceController : 6. Asset entity
deactivate AssetRepo

MaintenanceController -> LogRepo : 7. findByAssetId(assetId)
activate LogRepo
LogRepo -> DB : 8. SELECT * FROM maintenance_logs WHERE asset_id = ?
DB --> LogRepo : 9. Previous maintenance logs
LogRepo --> MaintenanceController : 10. Log history
deactivate LogRepo

MaintenanceController --> MaintenanceForm : 11. FormData(asset, logHistory)
deactivate MaintenanceController

MaintenanceForm --> Tech : 12. Display form dengan riwayat maintenance

Tech -> MaintenanceForm : 13. Input data maintenance\n(type, description, cost, parts_replaced,\nattachments, completion_status)

MaintenanceForm -> MaintenanceController : 14. createMaintenanceLog(logData)
activate MaintenanceController

MaintenanceController -> MaintenanceController : 15. validateInput(logData)

opt Ada file attachment
    MaintenanceController -> UploadService : 16. uploadFiles(attachments)
    activate UploadService
    UploadService -> UploadService : 17. processFiles()
    UploadService --> MaintenanceController : 18. uploadedFilePaths[]
    deactivate UploadService
end

MaintenanceController -> MaintenanceService : 19. createLog(assetId, techId, logData)
activate MaintenanceService

MaintenanceService -> LogRepo : 20. save(maintenanceLogEntity)
activate LogRepo
LogRepo -> DB : 21. INSERT INTO maintenance_logs VALUES(...)
DB --> LogRepo : 22. logId
LogRepo --> MaintenanceService : 23. Saved log
deactivate LogRepo

alt Maintenance Selesai (completion_status = true)
    MaintenanceService -> AssetRepo : 24. updateStatus(assetId, "Normal")
    activate AssetRepo
    AssetRepo -> DB : 25. UPDATE assets SET status = 'Normal', last_maintenance = NOW()
    DB --> AssetRepo : 26. Update success
    deactivate AssetRepo

    MaintenanceService -> AssetRepo : 27. updateNextMaintenanceDate(assetId)
    activate AssetRepo
    AssetRepo -> DB : 28. UPDATE assets SET next_maintenance = ?
    DB --> AssetRepo : 29. Update success
    deactivate AssetRepo
end

MaintenanceService --> MaintenanceController : 30. LogResult(success, log)
deactivate MaintenanceService

MaintenanceController --> MaintenanceForm : 31. Response(success, "Log maintenance berhasil disimpan")
deactivate MaintenanceController

MaintenanceForm --> Tech : 32. Display success message & updated history
deactivate MaintenanceForm

@enduml
```

---

## 5. Sequence Diagram: Submit Replacement Request (Pengajuan Penggantian Aset)

### Deskripsi

Proses pengajuan penggantian/penghapusan aset rusak oleh Teknisi IT.

```plantuml
@startuml SD_Submit_Request
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Submit Replacement Request

actor "Teknisi IT" as Tech
participant "Request Form\n<<View>>" as RequestForm
participant "RequestController\n<<Controller>>" as RequestController
participant "RequestService\n<<Service>>" as RequestService
participant "RequestRepository\n<<Repository>>" as RequestRepo
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "NotificationService\n<<Service>>" as NotifService
participant "UserRepository\n<<Repository>>" as UserRepo
database "Database" as DB

Tech -> RequestForm : 1. Akses form pengajuan untuk aset rusak
activate RequestForm

RequestForm -> RequestController : 2. getRequestForm(assetId)
activate RequestController
RequestController -> AssetRepo : 3. findById(assetId)
activate AssetRepo
AssetRepo -> DB : 4. SELECT * FROM assets WHERE id = ?
DB --> AssetRepo : 5. Asset data
AssetRepo --> RequestController : 6. Asset entity
deactivate AssetRepo

alt Asset Status != Broken
    RequestController --> RequestForm : 7a. Response(failed, "Only broken assets can be requested")
    RequestForm --> Tech : 8a. Display error: Aset harus berstatus Broken
else Asset Status = Broken
    RequestController --> RequestForm : 7. FormData(asset, requestTypes)
    deactivate RequestController
    RequestForm --> Tech : 8. Display form pengajuan

    Tech -> RequestForm : 9. Input data pengajuan\n(request_type: Replacement/Disposal,\nreason, justification, attachments)

    RequestForm -> RequestController : 10. submitRequest(requestData)
    activate RequestController

    RequestController -> RequestController : 11. validateInput(requestData)

    RequestController -> RequestService : 12. createRequest(assetId, techId, requestData)
    activate RequestService

    RequestService -> RequestService : 13. generateRequestNumber()

    RequestService -> RequestRepo : 14. save(requestEntity)
    activate RequestRepo
    RequestRepo -> DB : 15. INSERT INTO requests VALUES(...)
    DB --> RequestRepo : 16. requestId
    RequestRepo --> RequestService : 17. Saved request
    deactivate RequestRepo

    RequestService -> AssetRepo : 18. updateStatus(assetId, "Pending Approval")
    activate AssetRepo
    AssetRepo -> DB : 19. UPDATE assets SET status = 'Pending Approval'
    DB --> AssetRepo : 20. Update success
    deactivate AssetRepo

    RequestService -> UserRepo : 21. findByRole("Manager")
    activate UserRepo
    UserRepo -> DB : 22. SELECT * FROM users WHERE role = 'Manager'
    DB --> UserRepo : 23. Manager list
    UserRepo --> RequestService : 24. Manager entities
    deactivate UserRepo

    loop For each Manager
        RequestService -> NotifService : 25. sendNotification(managerId, "New Request", requestDetails)
        activate NotifService
        NotifService -> DB : 26. INSERT INTO notifications VALUES(...)
        NotifService --> RequestService : 27. Notification sent
        deactivate NotifService
    end

    RequestService --> RequestController : 28. RequestResult(success, request)
    deactivate RequestService

    RequestController --> RequestForm : 29. Response(success, "Pengajuan berhasil dikirim")
    deactivate RequestController

    RequestForm --> Tech : 30. Display success message\n& request number for tracking
end

deactivate RequestForm

@enduml
```

---

## 6. Sequence Diagram: Approval Process (Proses Persetujuan Manajer)

### Deskripsi

Proses validasi dan persetujuan/penolakan pengajuan oleh Manajer.

```plantuml
@startuml SD_Approval_Process
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Approval Process

actor "Manajer" as Manager
participant "Approval Dashboard\n<<View>>" as Dashboard
participant "Request Detail\n<<View>>" as RequestDetail
participant "ApprovalController\n<<Controller>>" as ApprovalController
participant "ApprovalService\n<<Service>>" as ApprovalService
participant "RequestRepository\n<<Repository>>" as RequestRepo
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "InventoryService\n<<Service>>" as InventoryService
participant "NotificationService\n<<Service>>" as NotifService
database "Database" as DB

Manager -> Dashboard : 1. Akses dashboard approval
activate Dashboard

Dashboard -> ApprovalController : 2. getPendingRequests(managerId)
activate ApprovalController
ApprovalController -> RequestRepo : 3. findByStatus("Pending")
activate RequestRepo
RequestRepo -> DB : 4. SELECT * FROM requests WHERE status = 'Pending'
DB --> RequestRepo : 5. Pending requests
RequestRepo --> ApprovalController : 6. Request list
deactivate RequestRepo

ApprovalController --> Dashboard : 7. PendingRequestsDTO
deactivate ApprovalController

Dashboard --> Manager : 8. Display daftar pengajuan pending

Manager -> Dashboard : 9. Pilih request untuk di-review
Dashboard -> RequestDetail : 10. openRequestDetail(requestId)
activate RequestDetail

RequestDetail -> ApprovalController : 11. getRequestDetail(requestId)
activate ApprovalController
ApprovalController -> RequestRepo : 12. findById(requestId)
activate RequestRepo
RequestRepo -> DB : 13. SELECT * FROM requests r JOIN assets a...
DB --> RequestRepo : 14. Request with asset details
RequestRepo --> ApprovalController : 15. Complete request data
deactivate RequestRepo
ApprovalController --> RequestDetail : 16. RequestDetailDTO
deactivate ApprovalController

RequestDetail --> Manager : 17. Display detail pengajuan\n(asset info, reason, attachments)

alt Manager Menyetujui
    Manager -> RequestDetail : 18. Click "Approve" + notes
    RequestDetail -> ApprovalController : 19. approveRequest(requestId, managerId, notes)
    activate ApprovalController

    ApprovalController -> ApprovalService : 20. processApproval(requestId, managerId, "Approved", notes)
    activate ApprovalService

    ApprovalService -> RequestRepo : 21. findById(requestId)
    activate RequestRepo
    RequestRepo -> DB : 22. SELECT * FROM requests WHERE id = ?
    DB --> RequestRepo : 23. Request data
    RequestRepo --> ApprovalService : 24. Request entity
    deactivate RequestRepo

    ApprovalService -> RequestRepo : 25. updateStatus(requestId, "Approved", managerId, notes)
    activate RequestRepo
    RequestRepo -> DB : 26. UPDATE requests SET status = 'Approved', approved_by = ?, approved_at = NOW()
    DB --> RequestRepo : 27. Update success
    deactivate RequestRepo

    ApprovalService -> AssetRepo : 28. getAssetByRequestId(requestId)
    activate AssetRepo
    AssetRepo -> DB : 29. SELECT asset_id FROM requests WHERE id = ?
    DB --> AssetRepo : 30. assetId
    AssetRepo --> ApprovalService : 31. Asset entity
    deactivate AssetRepo

    alt Request Type = Disposal
        ApprovalService -> InventoryService : 32. processDisposal(assetId)
        activate InventoryService
        InventoryService -> AssetRepo : 33. updateStatus(assetId, "Disposed")
        AssetRepo -> DB : 34. UPDATE assets SET status = 'Disposed', disposed_at = NOW()
        InventoryService --> ApprovalService : 35. Disposal completed
        deactivate InventoryService
    else Request Type = Replacement
        ApprovalService -> InventoryService : 36. initiateReplacement(assetId)
        activate InventoryService
        InventoryService -> AssetRepo : 37. updateStatus(assetId, "Awaiting Replacement")
        AssetRepo -> DB : 38. UPDATE assets SET status = 'Awaiting Replacement'
        InventoryService --> ApprovalService : 39. Replacement initiated
        deactivate InventoryService
    end

    ApprovalService -> NotifService : 40. sendNotification(technicianId, "Request Approved", details)
    activate NotifService
    NotifService -> DB : 41. INSERT INTO notifications VALUES(...)
    NotifService --> ApprovalService : 42. Notification sent
    deactivate NotifService

    ApprovalService --> ApprovalController : 43. ApprovalResult(success, "Approved")
    deactivate ApprovalService

    ApprovalController --> RequestDetail : 44. Response(success, "Pengajuan disetujui")
    deactivate ApprovalController

    RequestDetail --> Manager : 45. Display success message

else Manager Menolak
    Manager -> RequestDetail : 18b. Click "Reject" + rejection reason
    RequestDetail -> ApprovalController : 19b. rejectRequest(requestId, managerId, reason)
    activate ApprovalController

    ApprovalController -> ApprovalService : 20b. processRejection(requestId, managerId, reason)
    activate ApprovalService

    ApprovalService -> RequestRepo : 21b. updateStatus(requestId, "Rejected", managerId, reason)
    RequestRepo -> DB : 22b. UPDATE requests SET status = 'Rejected', rejected_by = ?, rejection_reason = ?

    ApprovalService -> AssetRepo : 23b. updateStatus(assetId, "Broken")
    AssetRepo -> DB : 24b. UPDATE assets SET status = 'Broken'

    ApprovalService -> NotifService : 25b. sendNotification(technicianId, "Request Rejected", reason)
    NotifService -> DB : 26b. INSERT INTO notifications VALUES(...)

    ApprovalService --> ApprovalController : 27b. ApprovalResult(success, "Rejected")
    deactivate ApprovalService

    ApprovalController --> RequestDetail : 28b. Response(success, "Pengajuan ditolak")
    deactivate ApprovalController

    RequestDetail --> Manager : 29b. Display rejection confirmation
end

deactivate RequestDetail
deactivate Dashboard

@enduml
```

---

## 7. Sequence Diagram: Monitoring & Alerting (Sistem Otomatis)

### Deskripsi

Proses monitoring otomatis sistem untuk pengecekan garansi dan jadwal maintenance.

```plantuml
@startuml SD_Monitoring_Alerting
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Monitoring & Alerting (Automated)

participant "Scheduler\n<<Cron Job>>" as Scheduler
participant "MonitoringService\n<<Service>>" as MonitoringService
participant "WarrantyChecker\n<<Component>>" as WarrantyChecker
participant "MaintenanceChecker\n<<Component>>" as MaintenanceChecker
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "AlertService\n<<Service>>" as AlertService
participant "NotificationService\n<<Service>>" as NotifService
participant "EmailService\n<<Service>>" as EmailService
participant "UserRepository\n<<Repository>>" as UserRepo
database "Database" as DB

== Daily Check - Triggered at 00:00 ==

Scheduler -> MonitoringService : 1. triggerDailyCheck()
activate MonitoringService

== Warranty Expiry Check ==

MonitoringService -> WarrantyChecker : 2. checkWarrantyExpiry()
activate WarrantyChecker

WarrantyChecker -> AssetRepo : 3. findAssetsWithExpiringWarranty(30 days)
activate AssetRepo
AssetRepo -> DB : 4. SELECT * FROM assets\nWHERE warranty_end BETWEEN NOW() AND NOW() + 30 days\nAND warranty_notified = false
DB --> AssetRepo : 5. Assets with expiring warranty
AssetRepo --> WarrantyChecker : 6. Asset list
deactivate AssetRepo

loop For each expiring asset
    WarrantyChecker -> AlertService : 7. createWarrantyAlert(asset)
    activate AlertService

    AlertService -> UserRepo : 8. findAdminUsers()
    activate UserRepo
    UserRepo -> DB : 9. SELECT * FROM users WHERE role = 'Admin'
    DB --> UserRepo : 10. Admin list
    UserRepo --> AlertService : 11. Admin entities
    deactivate UserRepo

    loop For each Admin
        AlertService -> NotifService : 12. sendInAppNotification(adminId, alertData)
        activate NotifService
        NotifService -> DB : 13. INSERT INTO notifications VALUES(...)
        NotifService --> AlertService : 14. Sent
        deactivate NotifService

        AlertService -> EmailService : 15. sendEmail(adminEmail, "Warranty Expiry Alert", emailBody)
        activate EmailService
        EmailService --> AlertService : 16. Email sent
        deactivate EmailService
    end

    AlertService -> AssetRepo : 17. markWarrantyNotified(assetId)
    activate AssetRepo
    AssetRepo -> DB : 18. UPDATE assets SET warranty_notified = true
    AssetRepo --> AlertService : 19. Marked
    deactivate AssetRepo

    AlertService --> WarrantyChecker : 20. Alert created
    deactivate AlertService
end

WarrantyChecker --> MonitoringService : 21. WarrantyCheckResult(count: X)
deactivate WarrantyChecker

== Maintenance Schedule Check ==

MonitoringService -> MaintenanceChecker : 22. checkMaintenanceSchedule()
activate MaintenanceChecker

MaintenanceChecker -> AssetRepo : 23. findAssetsDueForMaintenance()
activate AssetRepo
AssetRepo -> DB : 24. SELECT * FROM assets\nWHERE next_maintenance <= NOW()\nAND status != 'Disposed'
DB --> AssetRepo : 25. Assets due for maintenance
AssetRepo --> MaintenanceChecker : 26. Asset list
deactivate AssetRepo

loop For each asset due
    MaintenanceChecker -> AlertService : 27. createMaintenanceAlert(asset)
    activate AlertService

    AlertService -> UserRepo : 28. findTechnicianUsers()
    activate UserRepo
    UserRepo -> DB : 29. SELECT * FROM users WHERE role = 'Technician'
    DB --> UserRepo : 30. Technician list
    UserRepo --> AlertService : 31. Technician entities
    deactivate UserRepo

    loop For each Technician
        AlertService -> NotifService : 32. sendInAppNotification(techId, maintenanceAlert)
        activate NotifService
        NotifService -> DB : 33. INSERT INTO notifications VALUES(...)
        NotifService --> AlertService : 34. Sent
        deactivate NotifService
    end

    AlertService --> MaintenanceChecker : 35. Alert created
    deactivate AlertService
end

MaintenanceChecker --> MonitoringService : 36. MaintenanceCheckResult(count: Y)
deactivate MaintenanceChecker

== Generate Daily Summary ==

MonitoringService -> MonitoringService : 37. compileDailySummary()
MonitoringService -> EmailService : 38. sendDailySummaryToManagement(summary)
activate EmailService
EmailService --> MonitoringService : 39. Summary sent
deactivate EmailService

MonitoringService --> Scheduler : 40. DailyCheckComplete(warrantyAlerts: X, maintenanceAlerts: Y)
deactivate MonitoringService

@enduml
```

---

## 8. Sequence Diagram: Generate Reports

### Deskripsi

Proses pembuatan dan export laporan oleh Administrator atau Manajer.

```plantuml
@startuml SD_Generate_Reports
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Generate Reports

actor "Admin/Manajer" as User
participant "Report Page\n<<View>>" as ReportPage
participant "ReportController\n<<Controller>>" as ReportController
participant "ReportService\n<<Service>>" as ReportService
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "MaintenanceLogRepository\n<<Repository>>" as LogRepo
participant "RequestRepository\n<<Repository>>" as RequestRepo
participant "PDFGenerator\n<<Service>>" as PDFGen
participant "ExcelGenerator\n<<Service>>" as ExcelGen
participant "FileDownloadService\n<<Service>>" as Download
database "Database" as DB

User -> ReportPage : 1. Akses halaman laporan
activate ReportPage

ReportPage --> User : 2. Display form filter laporan\n(type, date_range, category, status)

User -> ReportPage : 3. Select report type & filters\n(e.g., "Asset Summary", Jan-Dec 2026)

ReportPage -> ReportController : 4. generateReport(reportType, filters)
activate ReportController

ReportController -> ReportController : 5. validateFilters(filters)

ReportController -> ReportService : 6. createReport(reportType, filters)
activate ReportService

alt Report Type = Asset Summary
    ReportService -> AssetRepo : 7a. getAssetSummary(filters)
    activate AssetRepo
    AssetRepo -> DB : 8a. SELECT status, COUNT(*), SUM(value)\nFROM assets\nWHERE purchase_date BETWEEN ? AND ?\nGROUP BY status
    DB --> AssetRepo : 9a. Summary data
    AssetRepo --> ReportService : 10a. AssetSummaryDTO
    deactivate AssetRepo

else Report Type = Maintenance History
    ReportService -> LogRepo : 7b. getMaintenanceHistory(filters)
    activate LogRepo
    LogRepo -> DB : 8b. SELECT * FROM maintenance_logs ml\nJOIN assets a ON ml.asset_id = a.id\nWHERE ml.date BETWEEN ? AND ?
    DB --> LogRepo : 9b. Maintenance data
    LogRepo --> ReportService : 10b. MaintenanceHistoryDTO
    deactivate LogRepo

else Report Type = Request Analytics
    ReportService -> RequestRepo : 7c. getRequestAnalytics(filters)
    activate RequestRepo
    RequestRepo -> DB : 8c. SELECT request_type, status, COUNT(*)\nFROM requests\nWHERE created_at BETWEEN ? AND ?\nGROUP BY request_type, status
    DB --> RequestRepo : 9c. Analytics data
    RequestRepo --> ReportService : 10c. RequestAnalyticsDTO
    deactivate RequestRepo
end

ReportService -> ReportService : 11. formatReportData()

ReportService --> ReportController : 12. ReportData(data, charts)
deactivate ReportService

ReportController --> ReportPage : 13. ReportPreviewDTO
deactivate ReportController

ReportPage --> User : 14. Display report preview\n(tables, charts, summary)

alt User wants to export
    User -> ReportPage : 15. Click "Export to PDF/Excel"
    ReportPage -> ReportController : 16. exportReport(reportData, format)
    activate ReportController

    alt Format = PDF
        ReportController -> PDFGen : 17a. generatePDF(reportData)
        activate PDFGen
        PDFGen -> PDFGen : 18a. createPDFDocument()
        PDFGen -> PDFGen : 19a. addTablesAndCharts()
        PDFGen --> ReportController : 20a. PDFFile(bytes)
        deactivate PDFGen
    else Format = Excel
        ReportController -> ExcelGen : 17b. generateExcel(reportData)
        activate ExcelGen
        ExcelGen -> ExcelGen : 18b. createWorkbook()
        ExcelGen -> ExcelGen : 19b. addSheets()
        ExcelGen --> ReportController : 20b. ExcelFile(bytes)
        deactivate ExcelGen
    end

    ReportController -> Download : 21. prepareDownload(file, filename)
    activate Download
    Download --> ReportController : 22. DownloadURL
    deactivate Download

    ReportController --> ReportPage : 23. DownloadResponse(url)
    deactivate ReportController

    ReportPage --> User : 24. Trigger file download
end

deactivate ReportPage

@enduml
```

---

## 9. Sequence Diagram: Scan QR/Barcode

### Deskripsi

Proses identifikasi aset menggunakan scan QR/Barcode oleh Teknisi.

```plantuml
@startuml SD_Scan_QR
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: Scan QR/Barcode

actor "Teknisi IT" as Tech
participant "Scanner Page\n<<View>>" as ScannerPage
participant "Camera/Scanner\n<<Component>>" as Camera
participant "QRDecoder\n<<Service>>" as QRDecoder
participant "AssetController\n<<Controller>>" as AssetController
participant "AssetService\n<<Service>>" as AssetService
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "MaintenanceLogRepository\n<<Repository>>" as LogRepo
participant "Asset Detail\n<<View>>" as AssetDetail
database "Database" as DB

Tech -> ScannerPage : 1. Akses halaman scanner
activate ScannerPage

ScannerPage -> Camera : 2. initializeCamera()
activate Camera
Camera --> ScannerPage : 3. Camera ready
ScannerPage --> Tech : 4. Display camera viewfinder

Tech -> Camera : 5. Point camera at QR Code
Camera -> Camera : 6. captureFrame()
Camera -> QRDecoder : 7. decodeQR(frame)
activate QRDecoder

alt QR Code Valid
    QRDecoder --> Camera : 8. DecodedData(assetCode)
    deactivate QRDecoder
    Camera --> ScannerPage : 9. QR Detected: assetCode
    deactivate Camera

    ScannerPage -> AssetController : 10. findAssetByCode(assetCode)
    activate AssetController

    AssetController -> AssetService : 11. getAssetByCode(assetCode)
    activate AssetService

    AssetService -> AssetRepo : 12. findByAssetCode(assetCode)
    activate AssetRepo
    AssetRepo -> DB : 13. SELECT * FROM assets WHERE asset_code = ?
    DB --> AssetRepo : 14. Asset data
    AssetRepo --> AssetService : 15. Asset entity
    deactivate AssetRepo

    alt Asset Found
        AssetService -> LogRepo : 16. findRecentLogs(assetId, limit: 5)
        activate LogRepo
        LogRepo -> DB : 17. SELECT * FROM maintenance_logs\nWHERE asset_id = ?\nORDER BY date DESC LIMIT 5
        DB --> LogRepo : 18. Recent logs
        LogRepo --> AssetService : 19. Log list
        deactivate LogRepo

        AssetService --> AssetController : 20. AssetDetailDTO(asset, recentLogs)
        deactivate AssetService

        AssetController --> ScannerPage : 21. AssetResponse(success, assetDetail)
        deactivate AssetController

        ScannerPage -> AssetDetail : 22. Display asset detail
        activate AssetDetail
        AssetDetail --> Tech : 23. Show asset info:\n- Name, Serial, Status\n- Location, Last Maintenance\n- Recent logs\n- Quick action buttons
        deactivate AssetDetail

    else Asset Not Found
        AssetService --> AssetController : 16a. AssetResult(notFound)
        AssetController --> ScannerPage : 17a. Response(failed, "Asset not found")
        ScannerPage --> Tech : 18a. Display error: Asset tidak ditemukan
    end

else QR Code Invalid/Unreadable
    QRDecoder --> Camera : 8b. DecodedData(null, "Invalid QR")
    Camera --> ScannerPage : 9b. Scan failed
    ScannerPage --> Tech : 10b. Display: "QR Code tidak valid, coba lagi"
end

deactivate ScannerPage

@enduml
```

---

## 10. Sequence Diagram: View Analytics Dashboard (Manajer)

### Deskripsi

Proses menampilkan dashboard analytics untuk Manajer.

```plantuml
@startuml SD_Analytics_Dashboard
skinparam backgroundColor #FEFEFE
skinparam sequenceMessageAlign center

title Sequence Diagram: View Analytics Dashboard

actor "Manajer" as Manager
participant "Dashboard Page\n<<View>>" as Dashboard
participant "DashboardController\n<<Controller>>" as DashboardController
participant "AnalyticsService\n<<Service>>" as AnalyticsService
participant "AssetRepository\n<<Repository>>" as AssetRepo
participant "RequestRepository\n<<Repository>>" as RequestRepo
participant "MaintenanceLogRepository\n<<Repository>>" as LogRepo
participant "ChartService\n<<Service>>" as ChartService
participant "CacheService\n<<Service>>" as Cache
database "Database" as DB

Manager -> Dashboard : 1. Akses dashboard analytics
activate Dashboard

Dashboard -> DashboardController : 2. getAnalyticsData(managerId)
activate DashboardController

DashboardController -> Cache : 3. getCachedAnalytics(cacheKey)
activate Cache

alt Cache Hit
    Cache --> DashboardController : 4a. CachedData(analytics)

else Cache Miss
    Cache --> DashboardController : 4b. null
    deactivate Cache

    DashboardController -> AnalyticsService : 5. generateAnalytics()
    activate AnalyticsService

    ' Asset Statistics
    AnalyticsService -> AssetRepo : 6. getAssetStatistics()
    activate AssetRepo
    AssetRepo -> DB : 7. SELECT status, COUNT(*) as count,\nSUM(purchase_price) as total_value\nFROM assets GROUP BY status
    DB --> AssetRepo : 8. Asset stats
    AssetRepo --> AnalyticsService : 9. AssetStatsDTO
    deactivate AssetRepo

    ' Asset by Category
    AnalyticsService -> AssetRepo : 10. getAssetsByCategory()
    activate AssetRepo
    AssetRepo -> DB : 11. SELECT c.name, COUNT(a.id)\nFROM assets a JOIN categories c\nGROUP BY c.id
    DB --> AssetRepo : 12. Category distribution
    AssetRepo --> AnalyticsService : 13. CategoryDistributionDTO
    deactivate AssetRepo

    ' Pending Requests Count
    AnalyticsService -> RequestRepo : 14. getPendingRequestsCount()
    activate RequestRepo
    RequestRepo -> DB : 15. SELECT COUNT(*) FROM requests\nWHERE status = 'Pending'
    DB --> RequestRepo : 16. Pending count
    RequestRepo --> AnalyticsService : 17. Integer
    deactivate RequestRepo

    ' Monthly Maintenance Cost
    AnalyticsService -> LogRepo : 18. getMonthlyMaintenanceCost(year)
    activate LogRepo
    LogRepo -> DB : 19. SELECT MONTH(date), SUM(cost)\nFROM maintenance_logs\nWHERE YEAR(date) = ?\nGROUP BY MONTH(date)
    DB --> LogRepo : 20. Monthly costs
    LogRepo --> AnalyticsService : 21. MonthlyCostDTO[]
    deactivate LogRepo

    ' Request Trends
    AnalyticsService -> RequestRepo : 22. getRequestTrends(6 months)
    activate RequestRepo
    RequestRepo -> DB : 23. SELECT MONTH(created_at), request_type, COUNT(*)\nFROM requests\nWHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)\nGROUP BY MONTH(created_at), request_type
    DB --> RequestRepo : 24. Trend data
    RequestRepo --> AnalyticsService : 25. TrendDataDTO[]
    deactivate RequestRepo

    ' Generate Chart Data
    AnalyticsService -> ChartService : 26. generateChartConfigs(allData)
    activate ChartService
    ChartService --> AnalyticsService : 27. ChartConfigs (pie, bar, line)
    deactivate ChartService

    AnalyticsService -> Cache : 28. cacheAnalytics(cacheKey, analytics, TTL: 5min)
    activate Cache
    Cache --> AnalyticsService : 29. Cached
    deactivate Cache

    AnalyticsService --> DashboardController : 30. AnalyticsDTO(stats, charts, trends)
    deactivate AnalyticsService
end

DashboardController --> Dashboard : 31. DashboardData(analytics, notifications)
deactivate DashboardController

Dashboard --> Manager : 32. Display interactive dashboard:\n- KPI Cards (Total Assets, Value, Pending)\n- Pie Chart (Status Distribution)\n- Bar Chart (Category Distribution)\n- Line Chart (Maintenance Cost Trend)\n- Table (Recent Requests)

deactivate Dashboard

@enduml
```

---

## Summary Sequence Diagrams

| No  | Diagram                    | Aktor Utama   | Deskripsi                                 |
| --- | -------------------------- | ------------- | ----------------------------------------- |
| 1   | Login & Authentication     | Semua         | Proses autentikasi pengguna               |
| 2   | Registrasi Aset Baru       | Administrator | Pendaftaran aset baru + QR Code           |
| 3   | Update Status Aset         | Teknisi       | Pembaruan kondisi aset                    |
| 4   | Input Maintenance Log      | Teknisi       | Pencatatan log pemeliharaan               |
| 5   | Submit Replacement Request | Teknisi       | Pengajuan penggantian aset                |
| 6   | Approval Process           | Manajer       | Persetujuan/penolakan pengajuan           |
| 7   | Monitoring & Alerting      | Sistem        | Pengecekan otomatis garansi & maintenance |
| 8   | Generate Reports           | Admin/Manajer | Pembuatan dan export laporan              |
| 9   | Scan QR/Barcode            | Teknisi       | Identifikasi aset via scan                |
| 10  | View Analytics Dashboard   | Manajer       | Tampilan dashboard analytics              |

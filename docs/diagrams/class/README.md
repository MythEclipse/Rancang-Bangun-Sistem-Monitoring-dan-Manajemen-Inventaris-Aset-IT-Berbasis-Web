# Class Diagram

Folder ini berisi semua Class Diagram untuk Sistem Monitoring dan Manajemen Inventaris Aset IT.

## File-file dalam folder ini:

1. **01-class-overview.md** - Class Diagram Utama (Overview)
   - Semua packages dan entity classes
   - User Management, Asset Management, Maintenance, Request & Approval, Notification System
   - Relationships antar kelas

2. **02-class-user-management.md** - Class Diagram: User Management Detail
   - User, Role, Department, Session
   - AuthResult, UserDTO, Permission
   - LoginLog dan LoginAction

3. **03-class-asset-management.md** - Class Diagram: Asset Management Detail
   - Asset, Category, Location, Vendor
   - AssetStatus, AssetCondition, DepreciationMethod
   - AssetHistory dan HistoryActionType

4. **04-class-maintenance.md** - Class Diagram: Maintenance Management Detail
   - MaintenanceLog, MaintenanceSchedule
   - MaintenanceType, MaintenanceStatus, ScheduleType
   - Part, PartUsage untuk spare parts

5. **05-class-request-approval.md** - Class Diagram: Request & Approval Detail
   - Request, ApprovalHistory, ApprovalWorkflow
   - RequestType, RequestStatus, Priority, Urgency
   - ApprovalAction dan ApprovalDelegate

6. **06-class-notification.md** - Class Diagram: Notification System Detail
   - Notification, NotificationTemplate, NotificationPreference
   - NotificationType, NotificationCategory, DigestMode
   - NotificationQueue dan NotificationLog

7. **07-class-services.md** - Class Diagram: Services & Repositories
   - AuthService, AssetService, MaintenanceService, RequestService
   - NotificationService, ReportService, QRCodeService
   - Repository interfaces untuk data access

## Struktur Folder:

```
class/
├── 01-class-overview.md
├── 02-class-user-management.md
├── 03-class-asset-management.md
├── 04-class-maintenance.md
├── 05-class-request-approval.md
├── 06-class-notification.md
├── 07-class-services.md
└── images/
    ├── Class_Diagram_Overview.png
    ├── Class_User_Management.png
    ├── Class_Asset_Management.png
    ├── Class_Maintenance.png
    ├── Class_Request_Approval.png
    ├── Class_Notification.png
    └── Class_Services.png
```

## Lihat juga:

- [Use Case Diagrams](../use-case/) - Perspektif pengguna sistem
- [Sequence Diagrams](../sequence/) - Alur interaksi antar objek
- [Activity Diagrams](../activity/) - Alur proses bisnis

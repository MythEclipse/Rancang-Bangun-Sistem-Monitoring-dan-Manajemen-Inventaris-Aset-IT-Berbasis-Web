import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  decimal,
  pgEnum,
  date,
  jsonb,
  time,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "TECHNICIAN",
  "MANAGER",
]);
export const assetStatusEnum = pgEnum("asset_status", [
  "NEW",
  "ACTIVE",
  "REPAIR",
  "BROKEN",
  "PENDING_APPROVAL",
  "AWAITING_REPLACEMENT",
  "DISPOSED",
  "ARCHIVED",
]);
export const assetConditionEnum = pgEnum("asset_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
]);
export const depreciationMethodEnum = pgEnum("depreciation_method", [
  "STRAIGHT_LINE",
  "DECLINING_BALANCE",
  "SUM_OF_YEARS",
  "UNITS_OF_PRODUCTION",
]);
export const historyActionTypeEnum = pgEnum("history_action_type", [
  "CREATED",
  "UPDATED",
  "STATUS_CHANGED",
  "LOCATION_CHANGED",
  "ASSIGNED",
  "UNASSIGNED",
  "TRANSFERRED",
  "MAINTENANCE",
  "DISPOSED",
  "ARCHIVED",
  "RESTORED",
]);
export const maintenanceTypeEnum = pgEnum("maintenance_type", [
  "PREVENTIVE",
  "CORRECTIVE",
  "PREDICTIVE",
  "INSPECTION",
  "CLEANING",
  "CALIBRATION",
  "UPGRADE",
  "EMERGENCY",
]);
export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "DRAFT",
  "SCHEDULED",
  "ASSIGNED",
  "IN_PROGRESS",
  "PENDING_PARTS",
  "ON_HOLD",
  "COMPLETED",
  "VERIFIED",
  "CANCELLED",
]);
export const scheduleTypeEnum = pgEnum("schedule_type", [
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMI_ANNUALLY",
  "YEARLY",
  "CUSTOM",
]);
export const priorityLevelEnum = pgEnum("priority_level", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);
export const urgencyLevelEnum = pgEnum("urgency_level", [
  "ROUTINE",
  "SOON",
  "URGENT",
  "IMMEDIATE",
]);
export const requestTypeEnum = pgEnum("request_type", [
  "DISPOSAL",
  "REPLACEMENT",
  "MAJOR_REPAIR",
  "PROCUREMENT_NEW",
  "PROCUREMENT_ADDITIONAL",
  "TRANSFER",
  "LOAN",
  "RETURN",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "DRAFT",
  "SUBMITTED",
  "PENDING_REVIEW",
  "NEEDS_CLARIFICATION",
  "UNDER_EVALUATION",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "IN_PROGRESS",
  "COMPLETED",
  "CLOSED",
]);
export const approvalActionEnum = pgEnum("approval_action", [
  "CREATED",
  "SUBMITTED",
  "VIEWED",
  "REVIEWED",
  "COMMENTED",
  "REQUESTED_INFO",
  "INFO_PROVIDED",
  "APPROVED",
  "REJECTED",
  "ESCALATED",
  "DELEGATED",
  "CANCELLED",
  "REOPENED",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "WARRANTY_EXPIRY_WARNING",
  "WARRANTY_EXPIRED",
  "MAINTENANCE_DUE_SOON",
  "MAINTENANCE_OVERDUE",
  "MAINTENANCE_COMPLETED",
  "REQUEST_SUBMITTED",
  "REQUEST_APPROVED",
  "REQUEST_REJECTED",
  "REQUEST_NEEDS_INFO",
  "REQUEST_CANCELLED",
  "ASSET_STATUS_CHANGED",
  "ASSET_ASSIGNED",
  "ASSET_TRANSFERRED",
  "ASSET_CRITICAL",
  "LOW_STOCK_ALERT",
  "SYSTEM_ALERT",
  "SECURITY_ALERT",
  "REPORT_READY",
  "GENERAL",
]);
export const notificationCategoryEnum = pgEnum("notification_category", [
  "ASSETS",
  "MAINTENANCE",
  "REQUESTS",
  "SYSTEM",
  "SECURITY",
  "REPORTS",
]);
export const digestModeEnum = pgEnum("digest_mode", [
  "INSTANT",
  "HOURLY",
  "DAILY",
  "WEEKLY",
]);
export const loginActionEnum = pgEnum("login_action", [
  "LOGIN",
  "LOGOUT",
  "FAILED_ATTEMPT",
  "PASSWORD_RESET",
  "TOKEN_REFRESH",
]);

// Tables

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  managerId: uuid("manager_id"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarPath: varchar("avatar_path", { length: 255 }),
  role: userRoleEnum("role").default("TECHNICIAN").notNull(),
  departmentId: uuid("department_id").references(() => departments.id),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  failedAttempts: integer("failed_attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  twoFactorSecret: varchar("two_factor_secret", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  refreshToken: varchar("refresh_token", { length: 500 }).unique(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  deviceInfo: jsonb("device_info"),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
});

export const loginLogs = pgTable("login_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: loginActionEnum("action").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  success: boolean("success").notNull(),
  failReason: varchar("fail_reason", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  parentId: uuid("parent_id"), // Self referencing, will add relations later if needed
  level: integer("level").default(1),
  maintenanceIntervalDays: integer("maintenance_interval_days").default(90),
  depreciationRate: decimal("depreciation_rate", {
    precision: 5,
    scale: 2,
  }).default("10.00"),
  specificationTemplate: jsonb("specification_template"),
  requiredFields: jsonb("required_fields"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  contactPerson: varchar("contact_person", { length: 100 }),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  fax: varchar("fax", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  website: varchar("website", { length: 255 }),
  taxId: varchar("tax_id", { length: 50 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  paymentTerms: varchar("payment_terms", { length: 100 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  building: varchar("building", { length: 100 }),
  floor: varchar("floor", { length: 20 }),
  room: varchar("room", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  description: text("description"),
  capacity: integer("capacity"),
  responsiblePersonId: uuid("responsible_person_id").references(() => users.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetCode: varchar("asset_code", { length: 50 }).notNull().unique(),
  serialNumber: varchar("serial_number", { length: 100 }).unique().notNull(), // Schema says unique and not null
  qrCodePath: varchar("qr_code_path", { length: 255 }),
  barcodePath: varchar("barcode_path", { length: 255 }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  model: varchar("model", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "restrict" })
    .notNull(),
  specifications: jsonb("specifications"),
  macAddress: varchar("mac_address", { length: 17 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  purchaseDate: date("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 15, scale: 2 }),
  vendorId: uuid("vendor_id").references(() => vendors.id, {
    onDelete: "set null",
  }),
  invoiceNumber: varchar("invoice_number", { length: 100 }),
  warrantyStart: date("warranty_start"),
  warrantyEnd: date("warranty_end"),
  warrantyDocument: varchar("warranty_document", { length: 255 }),
  warrantyNotified: boolean("warranty_notified").default(false).notNull(),
  depreciationRate: decimal("depreciation_rate", { precision: 5, scale: 2 }),
  depreciationMethod: depreciationMethodEnum("depreciation_method").default(
    "STRAIGHT_LINE",
  ),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }),
  residualValue: decimal("residual_value", { precision: 15, scale: 2 }),
  status: assetStatusEnum("status").default("NEW").notNull(),
  condition: assetConditionEnum("condition").default("GOOD"),
  locationId: uuid("location_id").references(() => locations.id, {
    onDelete: "set null",
  }),
  assignedToId: uuid("assigned_to_id").references(() => users.id, {
    onDelete: "set null",
  }),
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  lastMaintenanceDate: date("last_maintenance_date"),
  nextMaintenanceDate: date("next_maintenance_date"),
  maintenanceIntervalDays: integer("maintenance_interval_days"),
  totalMaintenanceCost: decimal("total_maintenance_cost", {
    precision: 15,
    scale: 2,
  }).default("0"),
  documents: jsonb("documents"),
  photos: jsonb("photos"),
  notes: text("notes"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  disposedAt: timestamp("disposed_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const assetHistory = pgTable("asset_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .references(() => assets.id, { onDelete: "cascade" })
    .notNull(),
  actionType: historyActionTypeEnum("action_type").notNull(),
  previousValue: jsonb("previous_value"),
  newValue: jsonb("new_value"),
  changedBy: uuid("changed_by")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  notes: text("notes"),
  changedAt: timestamp("changed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .references(() => assets.id, { onDelete: "cascade" })
    .notNull(),
  assignedTo: uuid("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),
  scheduleType: scheduleTypeEnum("schedule_type").notNull(),
  intervalDays: integer("interval_days"),
  intervalWeeks: integer("interval_weeks"),
  intervalMonths: integer("interval_months"),
  dayOfWeek: integer("day_of_week"),
  dayOfMonth: integer("day_of_month"),
  customCron: varchar("custom_cron", { length: 100 }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  nextDueDate: date("next_due_date"),
  lastPerformedDate: date("last_performed_date"),
  reminderDays: integer("reminder_days").default(7),
  notifyTechnician: boolean("notify_technician").default(true).notNull(),
  notifyAdmin: boolean("notify_admin").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isPaused: boolean("is_paused").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  maintenanceNumber: varchar("maintenance_number", { length: 50 })
    .notNull()
    .unique(),
  assetId: uuid("asset_id")
    .references(() => assets.id, { onDelete: "restrict" })
    .notNull(),
  technicianId: uuid("technician_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  scheduleId: uuid("schedule_id").references(() => maintenanceSchedules.id, {
    onDelete: "set null",
  }),
  maintenanceType: maintenanceTypeEnum("maintenance_type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  findings: text("findings"),
  actionTaken: text("action_taken"),
  recommendation: text("recommendation"),
  partsReplaced: jsonb("parts_replaced"),
  partsCost: decimal("parts_cost", { precision: 15, scale: 2 }).default("0"),
  laborCost: decimal("labor_cost", { precision: 15, scale: 2 }).default("0"),
  otherCost: decimal("other_cost", { precision: 15, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }).default("0"),
  laborHours: decimal("labor_hours", { precision: 5, scale: 2 }),
  technicianNotes: text("technician_notes"),
  status: maintenanceStatusEnum("status").default("SCHEDULED").notNull(),
  priority: priorityLevelEnum("priority").default("MEDIUM"),
  scheduledDate: date("scheduled_date"),
  dueDate: date("due_date"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  verifiedBy: uuid("verified_by").references(() => users.id, {
    onDelete: "set null",
  }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  beforePhotos: jsonb("before_photos"),
  afterPhotos: jsonb("after_photos"),
  documents: jsonb("documents"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const parts = pgTable("parts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  partNumber: varchar("part_number", { length: 100 }).unique(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  unitPrice: decimal("unit_price", { precision: 15, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("IDR"),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  minStockLevel: integer("min_stock_level").default(5),
  reorderPoint: integer("reorder_point").default(10),
  vendorId: uuid("vendor_id").references(() => vendors.id, {
    onDelete: "set null",
  }),
  leadTimeDays: integer("lead_time_days"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const partUsage = pgTable("part_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  maintenanceLogId: uuid("maintenance_log_id")
    .references(() => maintenanceLogs.id, { onDelete: "cascade" })
    .notNull(),
  partId: uuid("part_id")
    .references(() => parts.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 15, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const requests = pgTable("requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestNumber: varchar("request_number", { length: 50 }).notNull().unique(),
  assetId: uuid("asset_id")
    .references(() => assets.id, { onDelete: "restrict" })
    .notNull(),
  requesterId: uuid("requester_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  requestType: requestTypeEnum("request_type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  reason: text("reason").notNull(),
  justification: text("justification"),
  background: text("background"),
  estimatedCost: decimal("estimated_cost", { precision: 15, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 15, scale: 2 }),
  budgetCode: varchar("budget_code", { length: 50 }),
  priority: priorityLevelEnum("priority").default("MEDIUM").notNull(),
  urgency: urgencyLevelEnum("urgency").default("ROUTINE"),
  requestedCompletionDate: date("requested_completion_date"),
  status: requestStatusEnum("status").default("DRAFT").notNull(),
  currentStep: integer("current_step").default(1),
  totalSteps: integer("total_steps").default(1),
  approvedBy: uuid("approved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approverNotes: text("approver_notes"),
  rejectedBy: uuid("rejected_by").references(() => users.id, {
    onDelete: "set null",
  }),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  completionNotes: text("completion_notes"),
  attachments: jsonb("attachments"),
  photos: jsonb("photos"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
});

export const approvalHistory = pgTable("approval_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id")
    .references(() => requests.id, { onDelete: "cascade" })
    .notNull(),
  approverId: uuid("approver_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  action: approvalActionEnum("action").notNull(),
  previousStatus: requestStatusEnum("previous_status"),
  newStatus: requestStatusEnum("new_status"),
  comments: text("comments"),
  internalNotes: text("internal_notes"),
  delegatedFrom: uuid("delegated_from").references(() => users.id, {
    onDelete: "set null",
  }),
  delegatedTo: uuid("delegated_to").references(() => users.id, {
    onDelete: "set null",
  }),
  delegationReason: text("delegation_reason"),
  actionAt: timestamp("action_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  relatedEntityId: uuid("related_entity_id"),
  relatedEntityType: varchar("related_entity_type", { length: 50 }),
  type: notificationTypeEnum("type").notNull(),
  category: notificationCategoryEnum("category"),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("action_url", { length: 500 }),
  actionLabel: varchar("action_label", { length: 100 }),
  data: jsonb("data"),
  metadata: jsonb("metadata"),
  isRead: boolean("is_read").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  deliveredVia: jsonb("delivered_via"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  failedChannels: jsonb("failed_channels"),
  readAt: timestamp("read_at", { withTimezone: true }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notificationTemplates = pgTable("notification_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  type: notificationTypeEnum("type").notNull(),
  category: notificationCategoryEnum("category"),
  subject: varchar("subject", { length: 200 }),
  titleTemplate: text("title_template").notNull(),
  bodyTemplate: text("body_template").notNull(),
  htmlBodyTemplate: text("html_body_template"),
  enabledChannels: jsonb("enabled_channels"),
  channelConfigs: jsonb("channel_configs"),
  variables: jsonb("variables"),
  sampleData: jsonb("sample_data"),
  isActive: boolean("is_active").default(true).notNull(),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationTypeEnum("type").notNull(),
  inAppEnabled: boolean("in_app_enabled").default(true).notNull(),
  emailEnabled: boolean("email_enabled").default(true).notNull(),
  smsEnabled: boolean("sms_enabled").default(false).notNull(),
  pushEnabled: boolean("push_enabled").default(true).notNull(),
  webhookEnabled: boolean("webhook_enabled").default(false).notNull(),
  digestMode: digestModeEnum("digest_mode").default("INSTANT"),
  quietHoursStart: time("quiet_hours_start"),
  quietHoursEnd: time("quiet_hours_end"),
  timezone: varchar("timezone", { length: 50 }).default("Asia/Jakarta"),
  minPriority: priorityLevelEnum("min_priority"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relationships definition for query convenience
export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  // ... add more as needed for query builder
}));

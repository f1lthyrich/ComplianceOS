import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "compliance_manager", "auditor", "finance"]).default("user").notNull(),
  company: text("company"),
  department: text("department"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Compliance Frameworks Table
 * Tracks different compliance standards (SOC 2, GDPR, HIPAA, ISO 27001, etc.)
 */
export const complianceFrameworks = mysqlTable("compliance_frameworks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "SOC 2 Type II"
  description: text("description"),
  status: mysqlEnum("status", ["not_started", "in_progress", "compliant", "at_risk", "non_compliant"]).default("not_started").notNull(),
  complianceScore: int("complianceScore").default(0), // 0-100
  dueDate: timestamp("dueDate"),
  lastAuditDate: timestamp("lastAuditDate"),
  nextAuditDate: timestamp("nextAuditDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceFramework = typeof complianceFrameworks.$inferSelect;
export type InsertComplianceFramework = typeof complianceFrameworks.$inferInsert;

/**
 * Licenses Table
 * Tracks software licenses, subscriptions, and compliance certifications
 */
export const licenses = mysqlTable("licenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Enterprise Suite"
  vendor: varchar("vendor", { length: 255 }).notNull(),
  licenseKey: varchar("licenseKey", { length: 255 }),
  type: mysqlEnum("type", ["software", "certification", "subscription", "compliance_tool"]).notNull(),
  status: mysqlEnum("status", ["active", "expiring_soon", "expired", "inactive"]).default("active").notNull(),
  purchaseDate: timestamp("purchaseDate"),
  expiryDate: timestamp("expiryDate").notNull(),
  renewalDate: timestamp("renewalDate"),
  cost: decimal("cost", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  quantity: int("quantity").default(1),
  assignedUsers: int("assignedUsers"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type License = typeof licenses.$inferSelect;
export type InsertLicense = typeof licenses.$inferInsert;

/**
 * Compliance Tasks Table
 * Tracks compliance-related tasks and action items
 */
export const complianceTasks = mysqlTable("compliance_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  frameworkId: int("frameworkId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "blocked"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  assignedTo: int("assignedTo"), // User ID
  dueDate: timestamp("dueDate"),
  completedDate: timestamp("completedDate"),
  evidence: text("evidence"), // URL or file reference
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceTask = typeof complianceTasks.$inferSelect;
export type InsertComplianceTask = typeof complianceTasks.$inferInsert;

/**
 * Audit Logs Table
 * Tracks all changes and actions for compliance and audit purposes
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "license_created", "framework_updated"
  entityType: varchar("entityType", { length: 100 }).notNull(), // e.g., "license", "framework", "task"
  entityId: int("entityId"),
  changes: json("changes"), // JSON object of what changed
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Notifications Table
 * Tracks license expiry alerts and compliance reminders
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["license_expiry", "task_due", "audit_reminder", "compliance_alert", "team_assignment"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  relatedEntityType: varchar("relatedEntityType", { length: 100 }),
  relatedEntityId: int("relatedEntityId"),
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Reports Table
 * Stores generated compliance reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  frameworkId: int("frameworkId"),
  title: varchar("title", { length: 255 }).notNull(),
  reportType: mysqlEnum("reportType", ["compliance_status", "license_summary", "audit_trail", "risk_assessment", "custom"]).notNull(),
  content: text("content"),
  fileUrl: varchar("fileUrl", { length: 500 }),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Team Members Table
 * Tracks team members and their roles within the organization
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  memberId: int("memberId").notNull(), // Reference to another user
  role: mysqlEnum("role", ["compliance_manager", "auditor", "finance", "viewer"]).notNull(),
  permissions: json("permissions"), // JSON array of specific permissions
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  removedAt: timestamp("removedAt"),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Compliance Checklist Items Table
 * Individual items within a compliance framework
 */
export const checklistItems = mysqlTable("checklist_items", {
  id: int("id").autoincrement().primaryKey(),
  frameworkId: int("frameworkId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  isCompleted: boolean("isCompleted").default(false),
  completedDate: timestamp("completedDate"),
  evidence: text("evidence"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertChecklistItem = typeof checklistItems.$inferInsert;

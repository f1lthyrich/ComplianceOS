import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, complianceFrameworks, licenses, complianceTasks, auditLogs, notifications, reports, teamMembers, checklistItems } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "company", "department"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ COMPLIANCE FRAMEWORKS ============

export async function getComplianceFrameworks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(complianceFrameworks).where(eq(complianceFrameworks.userId, userId));
}

export async function createComplianceFramework(userId: number, data: { name: string; description?: string; dueDate?: Date }) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(complianceFrameworks).values([{
    userId,
    name: data.name,
    description: data.description,
    dueDate: data.dueDate,
  }]);
  return result;
}

export async function updateComplianceFramework(id: number, userId: number, data: Partial<{ name: string; status: "not_started" | "in_progress" | "compliant" | "at_risk" | "non_compliant"; complianceScore: number; dueDate: Date }>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(complianceFrameworks).set(data as any).where(and(eq(complianceFrameworks.id, id), eq(complianceFrameworks.userId, userId)));
}

// ============ LICENSES ============

export async function getLicenses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(licenses).where(eq(licenses.userId, userId)).orderBy(desc(licenses.createdAt));
}

export async function getExpiringLicenses(userId: number, daysUntilExpiry: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const today = new Date();
  const futureDate = new Date(today.getTime() + daysUntilExpiry * 24 * 60 * 60 * 1000);
  
  return db.select().from(licenses).where(
    and(
      eq(licenses.userId, userId),
      gte(licenses.expiryDate, today),
      lte(licenses.expiryDate, futureDate)
    )
  );
}

export async function createLicense(userId: number, data: {
  name: string;
  vendor: string;
  type: string;
  expiryDate: Date;
  cost?: number;
  quantity?: number;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const insertData: any = {
    userId,
    name: data.name,
    vendor: data.vendor,
    type: data.type as any,
    expiryDate: data.expiryDate,
    notes: data.notes,
  };
  if (data.cost) insertData.cost = data.cost;
  if (data.quantity) insertData.quantity = data.quantity;
  return db.insert(licenses).values([insertData]);
}

export async function updateLicense(id: number, userId: number, data: Partial<any>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(licenses).set(data).where(and(eq(licenses.id, id), eq(licenses.userId, userId)));
}

export async function deleteLicense(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(licenses).where(and(eq(licenses.id, id), eq(licenses.userId, userId)));
}

// ============ COMPLIANCE TASKS ============

export async function getComplianceTasks(userId: number, frameworkId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(complianceTasks.userId, userId)];
  if (frameworkId) conditions.push(eq(complianceTasks.frameworkId, frameworkId));
  
  return db.select().from(complianceTasks).where(and(...conditions)).orderBy(desc(complianceTasks.dueDate));
}

export async function createComplianceTask(userId: number, data: {
  frameworkId: number;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: Date;
  assignedTo?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(complianceTasks).values([{
    userId,
    frameworkId: data.frameworkId,
    title: data.title,
    description: data.description,
    priority: (data.priority as any) || "medium",
    dueDate: data.dueDate,
    assignedTo: data.assignedTo,
  }]);
}

export async function updateComplianceTask(id: number, userId: number, data: Partial<any>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(complianceTasks).set(data).where(and(eq(complianceTasks.id, id), eq(complianceTasks.userId, userId)));
}

// ============ AUDIT LOGS ============

export async function createAuditLog(userId: number, data: {
  action: string;
  entityType: string;
  entityId?: number;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(auditLogs).values([{
    userId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    changes: data.changes,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  }]);
}

export async function getAuditLogs(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.createdAt)).limit(limit);
}

// ============ NOTIFICATIONS ============

export async function createNotification(userId: number, data: {
  type: string;
  title: string;
  message?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(notifications).values([{
    userId,
    type: data.type as any,
    title: data.title,
    message: data.message,
    relatedEntityType: data.relatedEntityType,
    relatedEntityId: data.relatedEntityId,
  }]);
}

export async function getNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.update(notifications).set({ isRead: true, readAt: new Date() }).where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}

// ============ REPORTS ============

export async function createReport(userId: number, data: {
  frameworkId?: number;
  title: string;
  reportType: string;
  content?: string;
  fileUrl?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(reports).values([{
    userId,
    frameworkId: data.frameworkId,
    title: data.title,
    reportType: data.reportType as any,
    content: data.content,
    fileUrl: data.fileUrl,
  }]);
}

export async function getReports(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt));
}

// ============ CHECKLIST ITEMS ============

export async function getChecklistItems(frameworkId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(checklistItems).where(eq(checklistItems.frameworkId, frameworkId));
}

export async function createChecklistItem(frameworkId: number, data: {
  title: string;
  description?: string;
  category?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(checklistItems).values([{
    frameworkId,
    title: data.title,
    description: data.description,
    category: data.category,
  }]);
}

export async function updateChecklistItem(id: number, data: Partial<any>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(checklistItems).set(data).where(eq(checklistItems.id, id));
}

// ============ TEAM MEMBERS ============

export async function getTeamMembers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(and(eq(teamMembers.userId, userId)));
}

export async function addTeamMember(userId: number, memberId: number, role: string) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(teamMembers).values([{
    userId,
    memberId,
    role: role as any,
  }]);
}

export async function removeTeamMember(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(teamMembers).where(and(eq(teamMembers.id, id), eq(teamMembers.userId, userId)));
}

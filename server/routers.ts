import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ COMPLIANCE FRAMEWORKS ============
  compliance: router({
    getFrameworks: protectedProcedure.query(async ({ ctx }) => {
      return db.getComplianceFrameworks(ctx.user.id);
    }),

    createFramework: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createComplianceFramework(ctx.user.id, input);
        await db.createAuditLog(ctx.user.id, {
          action: "framework_created",
          entityType: "compliance_framework",
          changes: input,
        });
        return result;
      }),

    updateFramework: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        status: z.enum(["not_started", "in_progress", "compliant", "at_risk", "non_compliant"]).optional(),
        complianceScore: z.number().min(0).max(100).optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const result = await db.updateComplianceFramework(id, ctx.user.id, data);
        await db.createAuditLog(ctx.user.id, {
          action: "framework_updated",
          entityType: "compliance_framework",
          entityId: id,
          changes: data,
        });
        return result;
      }),

    getChecklist: protectedProcedure
      .input(z.object({ frameworkId: z.number() }))
      .query(async ({ input }) => {
        return db.getChecklistItems(input.frameworkId);
      }),

    addChecklistItem: protectedProcedure
      .input(z.object({
        frameworkId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createChecklistItem(input.frameworkId, {
          title: input.title,
          description: input.description,
          category: input.category,
        });
        await db.createAuditLog(ctx.user.id, {
          action: "checklist_item_created",
          entityType: "checklist_item",
          changes: input,
        });
        return result;
      }),

    updateChecklistItem: protectedProcedure
      .input(z.object({
        id: z.number(),
        isCompleted: z.boolean().optional(),
        evidence: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const result = await db.updateChecklistItem(id, {
          ...data,
          completedDate: data.isCompleted ? new Date() : null,
        });
        await db.createAuditLog(ctx.user.id, {
          action: "checklist_item_updated",
          entityType: "checklist_item",
          entityId: id,
          changes: data,
        });
        return result;
      }),
  }),

  // ============ LICENSES ============
  licenses: router({
    getLicenses: protectedProcedure.query(async ({ ctx }) => {
      return db.getLicenses(ctx.user.id);
    }),

    getExpiringLicenses: protectedProcedure
      .input(z.object({ daysUntilExpiry: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        return db.getExpiringLicenses(ctx.user.id, input.daysUntilExpiry);
      }),

    createLicense: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        vendor: z.string().min(1),
        type: z.enum(["software", "certification", "subscription", "compliance_tool"]),
        expiryDate: z.date(),
        cost: z.number().optional(),
        quantity: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createLicense(ctx.user.id, input);
        
        // Create notification for expiring licenses
        const daysUntilExpiry = Math.floor((input.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30) {
          await db.createNotification(ctx.user.id, {
            type: "license_expiry",
            title: `License expiring soon: ${input.name}`,
            message: `${input.name} expires in ${daysUntilExpiry} days`,
            relatedEntityType: "license",
          });
        }

        await db.createAuditLog(ctx.user.id, {
          action: "license_created",
          entityType: "license",
          changes: input,
        });
        return result;
      }),

    updateLicense: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        status: z.enum(["active", "expiring_soon", "expired", "inactive"]).optional(),
        expiryDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const result = await db.updateLicense(id, ctx.user.id, data);
        await db.createAuditLog(ctx.user.id, {
          action: "license_updated",
          entityType: "license",
          entityId: id,
          changes: data,
        });
        return result;
      }),

    deleteLicense: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.deleteLicense(input.id, ctx.user.id);
        await db.createAuditLog(ctx.user.id, {
          action: "license_deleted",
          entityType: "license",
          entityId: input.id,
        });
        return result;
      }),
  }),

  // ============ COMPLIANCE TASKS ============
  tasks: router({
    getTasks: protectedProcedure
      .input(z.object({ frameworkId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getComplianceTasks(ctx.user.id, input.frameworkId);
      }),

    createTask: protectedProcedure
      .input(z.object({
        frameworkId: z.number(),
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        dueDate: z.date().optional(),
        assignedTo: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createComplianceTask(ctx.user.id, input);
        
        if (input.dueDate) {
          await db.createNotification(ctx.user.id, {
            type: "task_due",
            title: `Task due: ${input.title}`,
            message: `Task "${input.title}" is due on ${input.dueDate.toDateString()}`,
            relatedEntityType: "task",
          });
        }

        await db.createAuditLog(ctx.user.id, {
          action: "task_created",
          entityType: "compliance_task",
          changes: input,
        });
        return result;
      }),

    updateTask: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "in_progress", "completed", "blocked"]).optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        evidence: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const result = await db.updateComplianceTask(id, ctx.user.id, {
          ...data,
          completedDate: data.status === "completed" ? new Date() : null,
        });
        await db.createAuditLog(ctx.user.id, {
          action: "task_updated",
          entityType: "compliance_task",
          entityId: id,
          changes: data,
        });
        return result;
      }),
  }),

  // ============ NOTIFICATIONS ============
  notifications: router({
    getNotifications: protectedProcedure.query(async ({ ctx }) => {
      return db.getNotifications(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.markNotificationAsRead(input.id, ctx.user.id);
      }),
  }),

  // ============ AUDIT LOGS ============
  audit: router({
    getLogs: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return db.getAuditLogs(ctx.user.id, input.limit);
      }),
  }),

  // ============ REPORTS ============
  reports: router({
    getReports: protectedProcedure.query(async ({ ctx }) => {
      return db.getReports(ctx.user.id);
    }),

    generateComplianceReport: protectedProcedure
      .input(z.object({
        frameworkId: z.number(),
        title: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const frameworks = await db.getComplianceFrameworks(ctx.user.id);
        const framework = frameworks.find(f => f.id === input.frameworkId);
        
        if (!framework) throw new Error("Framework not found");

        const content = `
Compliance Report: ${framework.name}
Generated: ${new Date().toDateString()}
Status: ${framework.status}
Compliance Score: ${framework.complianceScore}%
        `;

        const result = await db.createReport(ctx.user.id, {
          frameworkId: input.frameworkId,
          title: input.title || `${framework.name} Report`,
          reportType: "compliance_status",
          content,
        });

        await db.createAuditLog(ctx.user.id, {
          action: "report_generated",
          entityType: "report",
          changes: { frameworkId: input.frameworkId },
        });

        return result;
      }),
  }),

  // ============ DASHBOARD STATS ============
  dashboard: router({
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const frameworks = await db.getComplianceFrameworks(ctx.user.id);
      const licenses = await db.getLicenses(ctx.user.id);
      const expiringLicenses = await db.getExpiringLicenses(ctx.user.id, 30);
      const tasks = await db.getComplianceTasks(ctx.user.id);
      const notifications = await db.getNotifications(ctx.user.id);

      const avgComplianceScore = frameworks.length > 0
        ? Math.round(frameworks.reduce((sum, f) => sum + (f.complianceScore || 0), 0) / frameworks.length)
        : 0;

      const pendingTasks = tasks.filter(t => t.status === "pending").length;
      const completedTasks = tasks.filter(t => t.status === "completed").length;

      return {
        totalFrameworks: frameworks.length,
        averageComplianceScore: avgComplianceScore,
        totalLicenses: licenses.length,
        expiringLicensesCount: expiringLicenses.length,
        pendingTasks,
        completedTasks,
        unreadNotifications: notifications.filter(n => !n.isRead).length,
        frameworks,
        licenses,
        expiringLicenses,
        tasks,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

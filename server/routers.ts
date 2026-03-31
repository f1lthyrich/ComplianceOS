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

  // ============ FRAMEWORK TEMPLATES ============
  templates: router({
    getTemplates: publicProcedure.query(async () => {
      return [
        {
          id: "soc2",
          name: "SOC 2 Type II",
          description: "Security, Availability, Processing Integrity, Confidentiality, Privacy",
          requirements: [
            "Implement access controls",
            "Monitor system activities",
            "Maintain audit logs",
            "Conduct security assessments",
            "Implement encryption",
            "Develop incident response plan",
            "Train employees on security",
            "Perform annual audits",
          ],
        },
        {
          id: "gdpr",
          name: "GDPR Compliance",
          description: "General Data Protection Regulation for EU residents",
          requirements: [
            "Implement data protection policies",
            "Obtain user consent",
            "Maintain data inventory",
            "Implement right to be forgotten",
            "Conduct privacy impact assessments",
            "Appoint Data Protection Officer",
            "Establish data processing agreements",
            "Report data breaches within 72 hours",
          ],
        },
        {
          id: "hipaa",
          name: "HIPAA Compliance",
          description: "Health Insurance Portability and Accountability Act",
          requirements: [
            "Implement access controls",
            "Encrypt patient data",
            "Maintain audit controls",
            "Implement transmission security",
            "Conduct risk assessments",
            "Develop security policies",
            "Train workforce on HIPAA",
            "Implement business associate agreements",
          ],
        },
        {
          id: "iso27001",
          name: "ISO 27001",
          description: "Information Security Management System",
          requirements: [
            "Establish information security policy",
            "Implement access controls",
            "Manage cryptography",
            "Implement physical security",
            "Manage operations security",
            "Implement communications security",
            "Conduct regular audits",
            "Maintain incident management",
          ],
        },
      ];
    }),

    createFromTemplate: protectedProcedure
      .input(z.object({
        templateId: z.string(),
        customName: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const templates = await appRouter.createCaller(ctx).templates.getTemplates();
        const template = templates.find(t => t.id === input.templateId);
        if (!template) throw new Error("Template not found");

        const framework = await db.createComplianceFramework(ctx.user.id, {
          name: input.customName || template.name,
          description: template.description,
        });

        if (framework && typeof framework === 'object' && 'id' in framework) {
          const frameworkId = (framework as any).id as number;
          for (const requirement of template.requirements) {
            await db.createChecklistItem(frameworkId, {
              title: requirement,
            });
          }
        }

        await db.createAuditLog(ctx.user.id, {
          action: "framework_created_from_template",
          entityType: "compliance_framework",
          changes: { templateId: input.templateId },
        });

        return framework;
      }),
  }),

  // ============ CSV IMPORT ============
  import: router({
    importLicensesCSV: protectedProcedure
      .input(z.object({
        csvData: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const lines = input.csvData.split('\n').filter(l => l.trim());
        if (lines.length < 2) throw new Error("CSV must have headers and at least one row");

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const imported = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
          });

          try {
            const license = await db.createLicense(ctx.user.id, {
              name: row.name || row.license_name || `License ${i}`,
              vendor: row.vendor || 'Unknown',
              type: 'software',
              expiryDate: row.expiry_date ? new Date(row.expiry_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            });
            imported.push(license);
          } catch (error) {
            console.error(`Failed to import row ${i}:`, error);
          }
        }

        await db.createAuditLog(ctx.user.id, {
          action: "licenses_imported",
          entityType: "license",
          changes: { count: imported.length },
        });

        return { imported, count: imported.length };
      }),
  }),

  // ============ TEAM MANAGEMENT ============
  team: router({
    getMembers: protectedProcedure.query(async ({ ctx }) => {
      return db.getTeamMembers(ctx.user.id);
    }),

    addMember: protectedProcedure
      .input(z.object({
        memberId: z.number(),
        role: z.enum(["admin", "manager", "auditor", "finance", "viewer"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const member = await db.addTeamMember(ctx.user.id, input.memberId, input.role);

        await db.createAuditLog(ctx.user.id, {
          action: "team_member_added",
          entityType: "team_member",
          changes: { memberId: input.memberId, role: input.role },
        });

        return member;
      }),

    removeMember: protectedProcedure
      .input(z.object({ memberId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeTeamMember(input.memberId, ctx.user.id);

        await db.createAuditLog(ctx.user.id, {
          action: "team_member_removed",
          entityType: "team_member",
          changes: { memberId: input.memberId },
        });

        return { success: true };
      }),
  }),

  // ============ PDF REPORTS ============
  pdfReports: router({
    generateReport: protectedProcedure
      .input(z.object({
        type: z.enum(["compliance", "audit", "license_inventory"]),
        frameworkId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        let reportContent = "";

        if (input.type === "compliance" && input.frameworkId) {
          const frameworks = await db.getComplianceFrameworks(ctx.user.id);
          const framework = frameworks.find(f => f.id === input.frameworkId);
          if (framework) {
            reportContent = `Compliance Report: ${framework.name}\nStatus: ${framework.status}\nScore: ${framework.complianceScore}%\nGenerated: ${new Date().toISOString()}`;
          }
        } else if (input.type === "license_inventory") {
          const licenses = await db.getLicenses(ctx.user.id);
          reportContent = `License Inventory Report\nTotal Licenses: ${licenses.length}\n${licenses.map(l => `- ${l.name} (${l.vendor})`).join('\n')}\nGenerated: ${new Date().toISOString()}`;
        } else if (input.type === "audit") {
          const logs = await db.getAuditLogs(ctx.user.id);
          reportContent = `Audit Log Report\nTotal Events: ${logs.length}\nGenerated: ${new Date().toISOString()}`;
        }

        await db.createAuditLog(ctx.user.id, {
          action: "report_generated",
          entityType: "report",
          changes: { type: input.type },
        });

        return {
          success: true,
          reportUrl: `/reports/${Date.now()}.pdf`,
          content: reportContent,
        };
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

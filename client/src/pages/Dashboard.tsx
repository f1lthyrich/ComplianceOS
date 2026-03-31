import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield, Plus, Download, Settings, LogOut, Menu, X, FileText, Users, Clock,
  AlertCircle, CheckCircle, TrendingUp, BarChart3, Lock, Zap, Calendar, Search,
  Filter, Edit2, Trash2, Eye, EyeOff, Bell, Inbox, PieChart, Activity, Layers,
  Database, Workflow, Target, Briefcase, MailOpen, Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data
  const { data: frameworks } = trpc.compliance.getFrameworks.useQuery();
  const { data: licenses } = trpc.licenses.getLicenses.useQuery();
  const { data: tasks } = trpc.tasks.getTasks.useQuery({ frameworkId: undefined });
  const { data: notifications } = trpc.notifications.getNotifications.useQuery();
  const { data: auditLogs } = trpc.audit.getLogs.useQuery({ limit: 50 });
  const { data: teamMembers } = trpc.team.getMembers.useQuery();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "frameworks", label: "Frameworks", icon: Shield },
    { id: "licenses", label: "Licenses", icon: Lock },
    { id: "tasks", label: "Tasks", icon: Clock },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "team", label: "Team", icon: Users },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "audit", label: "Audit", icon: Activity },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "compliance-calendar", label: "Calendar", icon: Calendar },
    { id: "risk-assessment", label: "Risk", icon: AlertCircle },
    { id: "workflows", label: "Workflows", icon: Workflow },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-lg text-foreground">ComplianceOS</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-muted/30 sticky top-16 z-40 overflow-x-auto">
        <div className="container flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="container section-padding">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
                <p className="text-muted-foreground">Your compliance operations dashboard</p>
              </motion.div>

              <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
                {[
                  { label: "Active Frameworks", value: frameworks?.length || 0, icon: Shield, color: "text-blue-500" },
                  { label: "Total Licenses", value: licenses?.length || 0, icon: Lock, color: "text-green-500" },
                  { label: "Pending Tasks", value: tasks?.filter((t) => t.status === "pending").length || 0, icon: Clock, color: "text-yellow-500" },
                  { label: "Compliance Score", value: "87%", icon: TrendingUp, color: "text-purple-500" },
                ].map((metric: any, idx: number) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
                            <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                          </div>
                          <Icon className={`w-8 h-8 ${metric.color}`} />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
                <Card className="card-premium p-6">
                  <div className="space-y-4">
                    {auditLogs?.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-sm font-medium">{log.action}</p>
                          <p className="text-muted-foreground text-xs">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* FRAMEWORKS */}
          {activeTab === "frameworks" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Compliance Frameworks</h2>
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2" />New</Button>
              </div>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                {frameworks?.map((f: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-foreground mb-4">{f.name}</h3>
                      <Badge variant="outline" className="mb-4">{f.status}</Badge>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: `${f.complianceScore}%` }} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{f.complianceScore}% Complete</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* LICENSES */}
          {activeTab === "licenses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">License Management</h2>
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add</Button>
              </div>
              <div className="space-y-4">
                {licenses?.map((l: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{l.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">Vendor: {l.vendor}</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Expires: {new Date(l.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TASKS */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Compliance Tasks</h2>
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2" />New Task</Button>
              </div>
              <div className="space-y-4">
                {tasks?.map((t: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{t.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline">{t.priority}</Badge>
                            <Badge variant={t.status === "completed" ? "default" : "secondary"}>{t.status}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Compliance Reports</h2>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                {[
                  { title: "Compliance Status", desc: "Current framework status", icon: BarChart3 },
                  { title: "License Inventory", desc: "All licenses & expiry dates", icon: FileText },
                  { title: "Audit Trail", desc: "Complete change history", icon: Activity },
                  { title: "Risk Assessment", desc: "Identify compliance gaps", icon: AlertCircle },
                  { title: "Task Summary", desc: "Pending & completed tasks", icon: Clock },
                  { title: "Team Activity", desc: "Team contributions", icon: Users },
                ].map((r: any, idx: number) => {
                  const Icon = r.icon;
                  return (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                        <Icon className="w-8 h-8 text-accent mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">{r.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
                        <Button variant="outline" size="sm" className="w-full"><Download className="w-4 h-4 mr-2" />Generate</Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* TEAM */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add Member</Button>
              </div>
              <div className="space-y-4">
                {teamMembers?.map((m: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-foreground">{m.memberId}</h3>
                          <Badge variant="outline" className="mt-2">{m.role}</Badge>
                        </div>
                        <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Alerts & Notifications</h2>
              <div className="space-y-4">
                {notifications?.map((n: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-4">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{n.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{n.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
              <Card className="card-premium p-6">
                <div className="space-y-4">
                  {auditLogs?.map((l: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium">{l.action}</p>
                        <p className="text-sm text-muted-foreground">{l.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(l.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Compliance Analytics</h2>
              <motion.div className="grid md:grid-cols-2 gap-6" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                  <Card className="card-premium p-6">
                    <h3 className="font-semibold text-foreground mb-4">Compliance Trend</h3>
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Chart Placeholder</div>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="card-premium p-6">
                    <h3 className="font-semibold text-foreground mb-4">License Distribution</h3>
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Chart Placeholder</div>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="card-premium p-6">
                    <h3 className="font-semibold text-foreground mb-4">Task Completion</h3>
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Chart Placeholder</div>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card className="card-premium p-6">
                    <h3 className="font-semibold text-foreground mb-4">Team Activity</h3>
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Chart Placeholder</div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Integrations</h2>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                {[
                  { name: "Slack", icon: Smartphone },
                  { name: "Microsoft Teams", icon: Users },
                  { name: "Jira", icon: Workflow },
                  { name: "Salesforce", icon: Briefcase },
                  { name: "Email", icon: MailOpen },
                  { name: "Webhooks", icon: Zap },
                ].map((i: any, idx: number) => {
                  const Icon = i.icon;
                  return (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                        <Icon className="w-8 h-8 text-accent mb-4" />
                        <h3 className="font-semibold text-foreground mb-4">{i.name}</h3>
                        <Button variant="outline" size="sm" className="w-full">Connect</Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* COMPLIANCE CALENDAR */}
          {activeTab === "compliance-calendar" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Compliance Calendar</h2>
              <Card className="card-premium p-6">
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>Interactive calendar view coming soon</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* RISK ASSESSMENT */}
          {activeTab === "risk-assessment" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Risk Assessment</h2>
              <motion.div className="space-y-4" variants={containerVariants}>
                {[
                  { risk: "High", item: "SOC 2 Audit Pending", action: "Schedule Audit" },
                  { risk: "Medium", item: "3 Licenses Expiring Soon", action: "Renew Licenses" },
                  { risk: "Low", item: "Team Training Required", action: "Assign Training" },
                ].map((r: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Badge variant={r.risk === "High" ? "destructive" : r.risk === "Medium" ? "secondary" : "outline"}>{r.risk}</Badge>
                          <h3 className="font-semibold text-foreground mt-2 mb-1">{r.item}</h3>
                        </div>
                        <Button variant="outline" size="sm">{r.action}</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* WORKFLOWS */}
          {activeTab === "workflows" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Compliance Workflows</h2>
                <Button className="btn-primary"><Plus className="w-4 h-4 mr-2" />New Workflow</Button>
              </div>
              <motion.div className="grid md:grid-cols-2 gap-6" variants={containerVariants}>
                {[
                  { name: "License Renewal", desc: "Auto-create tasks 30 days before expiry" },
                  { name: "Compliance Check", desc: "Weekly compliance score review" },
                  { name: "Audit Prep", desc: "Prepare audit documentation" },
                  { name: "Team Sync", desc: "Monthly compliance team meeting" },
                ].map((w: any, idx: number) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="card-premium p-6 hover:shadow-lg transition-shadow">
                      <Workflow className="w-8 h-8 text-accent mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">{w.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{w.desc}</p>
                      <Button variant="outline" size="sm" className="w-full">Configure</Button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <Card className="card-premium p-6">
                <h3 className="font-semibold text-foreground mb-4">API Key Management</h3>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg mb-4">
                  <code className="text-sm text-foreground flex-1 truncate">sk_live_••••••••••••••••••••••••••</code>
                  <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">Copy API Key</Button>
              </Card>

              <Card className="card-premium p-6">
                <h3 className="font-semibold text-foreground mb-4">Preferences</h3>
                <div className="space-y-4">
                  {["Email Notifications", "Weekly Digest", "Expiry Alerts"].map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <label className="text-foreground">{p}</label>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;

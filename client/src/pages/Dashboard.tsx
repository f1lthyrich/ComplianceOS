import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, FileText, Plus, Trash2, Eye, EyeOff, Download, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Dashboard Stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.dashboard.getStats.useQuery();

  // Compliance Frameworks
  const { data: frameworks } = trpc.compliance.getFrameworks.useQuery();
  const createFrameworkMutation = trpc.compliance.createFramework.useMutation({
    onSuccess: () => {
      toast.success("Framework created");
      refetchStats();
    },
  });

  // Licenses
  const { data: licenses } = trpc.licenses.getLicenses.useQuery();
  const createLicenseMutation = trpc.licenses.createLicense.useMutation({
    onSuccess: () => {
      toast.success("License added");
      refetchStats();
    },
  });
  const deleteLicenseMutation = trpc.licenses.deleteLicense.useMutation({
    onSuccess: () => {
      toast.success("License deleted");
      refetchStats();
    },
  });

  // Tasks
  const { data: tasks } = trpc.tasks.getTasks.useQuery({ frameworkId: undefined });
  const createTaskMutation = trpc.tasks.createTask.useMutation({
    onSuccess: () => {
      toast.success("Task created");
      refetchStats();
    },
  });
  const updateTaskMutation = trpc.tasks.updateTask.useMutation({
    onSuccess: () => {
      toast.success("Task updated");
      refetchStats();
    },
  });

  // Notifications
  const { data: notifications } = trpc.notifications.getNotifications.useQuery();
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => refetchStats(),
  });

  // Reports
  const { data: reports } = trpc.reports.getReports.useQuery();
  const generateReportMutation = trpc.reports.generateComplianceReport.useMutation({
    onSuccess: () => {
      toast.success("Report generated");
      refetchStats();
    },
  });

  // Audit Logs
  const { data: auditLogs } = trpc.audit.getLogs.useQuery({ limit: 20 });

  if (statsLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Logout
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gray-900 hover:bg-gray-800 text-white transition-colors w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Framework</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Compliance Framework</DialogTitle>
                  </DialogHeader>
                  <CreateFrameworkForm onSuccess={() => refetchStats()} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
                <Card className="p-6 hover:shadow-md transition-all duration-300 bg-white border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Frameworks</p>
                      <p className="text-4xl font-light mt-3 text-gray-900">{stats?.totalFrameworks || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
                <Card className="p-6 hover:shadow-md transition-all duration-300 bg-white border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Avg Compliance</p>
                      <p className="text-4xl font-light mt-3 text-gray-900">{stats?.averageComplianceScore || 0}%</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
                <Card className="p-6 hover:shadow-md transition-all duration-300 bg-white border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Expiring Licenses</p>
                      <p className="text-4xl font-light mt-3 text-gray-900">{stats?.expiringLicensesCount || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
                <Card className="p-6 hover:shadow-md transition-all duration-300 bg-white border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Pending Tasks</p>
                      <p className="text-4xl font-light mt-3 text-gray-900">{stats?.pendingTasks || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Notifications */}
            {notifications && notifications.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Notifications</h3>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{notif.title}</p>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                      </div>
                      {!notif.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate({ id: notif.id })}
                        >
                          Mark read
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frameworks?.map((framework) => (
                <motion.div
                  key={framework.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{framework.name}</h3>
                        <p className="text-sm text-gray-600">{framework.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        framework.status === "compliant" ? "bg-green-100 text-green-800" :
                        framework.status === "at_risk" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {framework.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Compliance Score</span>
                        <span className="font-semibold">{framework.complianceScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${framework.complianceScore}%` }}
                          transition={{ duration: 0.5 }}
                          className="bg-blue-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add License
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New License</DialogTitle>
                </DialogHeader>
                <AddLicenseForm onSuccess={() => refetchStats()} />
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {licenses?.map((license) => (
                <motion.div
                  key={license.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <Card className="p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold">{license.name}</h4>
                      <p className="text-sm text-gray-600">{license.vendor}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(license.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        license.status === "active" ? "bg-green-100 text-green-800" :
                        license.status === "expiring_soon" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {license.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLicenseMutation.mutate({ id: license.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <CreateTaskForm frameworks={frameworks || []} onSuccess={() => refetchStats()} />
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {tasks?.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <select
                        defaultValue={task.status}
                        onChange={(e) => updateTaskMutation.mutate({ id: task.id, status: e.target.value as any })}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded ${
                        task.priority === "critical" ? "bg-red-100 text-red-800" :
                        task.priority === "high" ? "bg-orange-100 text-orange-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-gray-600">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Report</DialogTitle>
                </DialogHeader>
                <GenerateReportForm frameworks={frameworks || []} onSuccess={() => refetchStats()} />
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {reports?.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                    <div>
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-gray-600">{report.reportType}</p>
                      <p className="text-xs text-gray-500">
                        Generated: {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Form Components
function CreateFrameworkForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const mutation = trpc.compliance.createFramework.useMutation({
    onSuccess: () => {
      toast.success("Framework created");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ name, description });
      }}
      className="space-y-4"
    >
      <div>
        <Label>Framework Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., SOC 2 Type II" required />
      </div>
      <div>
        <Label>Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
      </div>
      <Button type="submit" className="w-full">Create Framework</Button>
    </form>
  );
}

function AddLicenseForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [type, setType] = useState("software");
  const [expiryDate, setExpiryDate] = useState("");
  const mutation = trpc.licenses.createLicense.useMutation({
    onSuccess: () => {
      toast.success("License added");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          name,
          vendor,
          type: type as any,
          expiryDate: new Date(expiryDate),
        });
      }}
      className="space-y-4"
    >
      <div>
        <Label>License Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Microsoft 365" required />
      </div>
      <div>
        <Label>Vendor</Label>
        <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g., Microsoft" required />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="certification">Certification</SelectItem>
            <SelectItem value="compliance_tool">Compliance Tool</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Expiry Date</Label>
        <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">Add License</Button>
    </form>
  );
}

function CreateTaskForm({ frameworks, onSuccess }: { frameworks: any[]; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [frameworkId, setFrameworkId] = useState(frameworks[0]?.id.toString() || "");
  const [priority, setPriority] = useState("medium");
  const mutation = trpc.tasks.createTask.useMutation({
    onSuccess: () => {
      toast.success("Task created");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          title,
          frameworkId: parseInt(frameworkId),
          priority: priority as any,
        });
      }}
      className="space-y-4"
    >
      <div>
        <Label>Task Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Review access controls" required />
      </div>
      <div>
        <Label>Framework</Label>
        <Select value={frameworkId} onValueChange={setFrameworkId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frameworks.map((f) => (
              <SelectItem key={f.id} value={f.id.toString()}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Create Task</Button>
    </form>
  );
}

function GenerateReportForm({ frameworks, onSuccess }: { frameworks: any[]; onSuccess: () => void }) {
  const [frameworkId, setFrameworkId] = useState(frameworks[0]?.id.toString() || "");
  const [title, setTitle] = useState("");
  const mutation = trpc.reports.generateComplianceReport.useMutation({
    onSuccess: () => {
      toast.success("Report generated");
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          frameworkId: parseInt(frameworkId),
          title,
        });
      }}
      className="space-y-4"
    >
      <div>
        <Label>Framework</Label>
        <Select value={frameworkId} onValueChange={setFrameworkId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frameworks.map((f) => (
              <SelectItem key={f.id} value={f.id.toString()}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Report Title (Optional)</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Custom report title" />
      </div>
      <Button type="submit" className="w-full">Generate Report</Button>
    </form>
  );
}

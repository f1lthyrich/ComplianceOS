import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, EyeOff, Plus, Trash2, Lock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

/**
 * Settings Page - User profile, API key management, and integrations
 */

// API Key Management Component
function APIKeyManagement() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key_1",
      name: "Production API Key",
      key: "sk_prod_••••••••••••••••••••••••",
      createdAt: "2025-03-15",
      lastUsed: "2 hours ago",
      visible: false,
    },
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    const newKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `sk_prod_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Just now",
      visible: true,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowNewKeyForm(false);
    toast.success("API key created successfully");
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API key deleted");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, visible: !key.visible } : key
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for integrations and custom applications.
          </p>
        </div>
        <Button
          onClick={() => setShowNewKeyForm(!showNewKeyForm)}
          className="btn-primary"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Key
        </Button>
      </div>

      {showNewKeyForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border border-border bg-muted/30"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="key-name" className="text-foreground font-medium">
                Key Name
              </Label>
              <Input
                id="key-name"
                placeholder="e.g., Production API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreateKey} className="btn-primary" size="sm">
                Create
              </Button>
              <Button
                onClick={() => setShowNewKeyForm(false)}
                variant="outline"
                size="sm"
                className="btn-outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {apiKeys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-premium p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-4 h-4 text-accent" />
                    <h4 className="font-semibold text-foreground">{apiKey.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 mb-3 p-3 bg-muted rounded-lg">
                    <code className="text-sm text-muted-foreground flex-1 font-mono">
                      {apiKey.visible ? apiKey.key : apiKey.key}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-1 hover:bg-border rounded transition-colors"
                      title={apiKey.visible ? "Hide" : "Show"}
                    >
                      {apiKey.visible ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="p-1 hover:bg-border rounded transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Created: {apiKey.createdAt}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteKey(apiKey.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "Acme Corporation",
    role: "Compliance Manager",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Profile Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal information and preferences.
        </p>
      </div>

      <Card className="card-premium p-6">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-foreground font-medium">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-foreground font-medium">
                Role
              </Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="btn-primary">
              Save Changes
            </Button>
            <Button variant="outline" className="btn-outline">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Integrations Component
function IntegrationsSettings() {
  const integrations = [
    {
      name: "Slack",
      description: "Get compliance alerts in Slack",
      status: "Connected",
      connected: true,
    },
    {
      name: "Microsoft Teams",
      description: "Integrate with Microsoft Teams",
      status: "Not Connected",
      connected: false,
    },
    {
      name: "Jira",
      description: "Sync compliance tasks with Jira",
      status: "Not Connected",
      connected: false,
    },
    {
      name: "Salesforce",
      description: "Connect to Salesforce CRM",
      status: "Not Connected",
      connected: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect ComplianceOS with your favorite tools and services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-premium p-6 h-full flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  {integration.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    integration.connected
                      ? "bg-accent/10 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {integration.status}
                </span>
                <Button
                  size="sm"
                  className={integration.connected ? "btn-outline" : "btn-primary"}
                >
                  {integration.connected ? "Manage" : "Connect"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Main Settings Component
export default function Settings() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium p-8 text-center">
          <p className="text-foreground">Please log in to access settings.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, API keys, and integrations
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-4xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="profile" className="space-y-6">
                <ProfileSettings />
              </TabsContent>

              <TabsContent value="api-keys" className="space-y-6">
                <APIKeyManagement />
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <IntegrationsSettings />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

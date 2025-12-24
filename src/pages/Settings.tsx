import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Link2,
  Shield,
  Users,
  Monitor,
  Sun,
  Moon,
  Camera,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";

const navItems = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: User },
  { id: "team", label: "Team Members", icon: Users },
];

const Settings = () => {
  const { settings, loading, saving, user, updateSettings, fetchSettings } = useSettings();

  const [activeTab, setActiveTab] = useState("general");
  const [showWebhook, setShowWebhook] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    theme: "dark" as "dark" | "light",
    displayName: "",
    email: "",
    slackWebhook: "",
    notifyOnFailure: true,
    notifyOnSuccess: false,
    emailDigest: "weekly" as "daily" | "weekly" | "none",
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        theme: settings.theme,
        notifyOnFailure: settings.notifyOnFailure,
        notifyOnSuccess: settings.notifyOnSuccess,
        emailDigest: settings.emailDigest,
        slackWebhook: settings.slackWebhook || "",
      }));
    }
  }, [settings]);

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        displayName: user.name || user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSave = async () => {
    const success = await updateSettings({
      theme: formData.theme,
      notifyOnFailure: formData.notifyOnFailure,
      notifyOnSuccess: formData.notifyOnSuccess,
      emailDigest: formData.emailDigest,
      slackWebhook: formData.slackWebhook || undefined,
    });

    if (success) {
      toast.success("Settings saved successfully");
      setHasChanges(false);
    } else {
      toast.error("Failed to save settings");
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <main className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="w-56 border-r border-border p-4 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {loading ? "Loading..." : formData.displayName || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground">Pro Plan</p>
            </div>
          </div>

          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Settings
          </p>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="px-8 py-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">General Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your workspace preferences, appearance, and core configurations.
            </p>
          </header>

          {/* Loading State */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Appearance Section */}
                <section className="animate-fade-in">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateField("theme", option.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                          formData.theme === option.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <option.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Profile Information */}
                <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
                  <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                          {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full" />
                          ) : (
                            <User className="w-10 h-10 text-muted-foreground" />
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          Remove
                        </Button>
                        <p className="text-[10px] text-muted-foreground">.JPG, .GIF or PNG. 1MB Max.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => updateField("displayName", e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Slack Integration */}
                <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Slack Integration</h2>
                      <p className="text-sm text-muted-foreground">
                        Receive real-time alerts for CI/CD failures directly in your team channel.
                      </p>
                    </div>
                    <Badge variant={formData.slackWebhook ? "success" : "secondary"} className="text-[10px]">
                      {formData.slackWebhook ? "Active" : "Not configured"}
                    </Badge>
                  </div>

                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                      <Label htmlFor="webhook">Webhook URL</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="webhook"
                            type={showWebhook ? "text" : "password"}
                            value={formData.slackWebhook}
                            placeholder="https://hooks.slack.com/services/..."
                            className="pl-10 pr-10 bg-secondary border-border font-mono text-xs"
                            onChange={(e) => updateField("slackWebhook", e.target.value)}
                          />
                          <button
                            onClick={() => setShowWebhook(!showWebhook)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showWebhook ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <Button variant="outline">Test Connection</Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        This webhook will be used to post analysis summaries when a build fails.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Notification Preferences */}
                <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Notify on Failure</p>
                        <p className="text-xs text-muted-foreground">Get notified when CI/CD pipelines fail</p>
                      </div>
                      <Switch
                        checked={formData.notifyOnFailure}
                        onCheckedChange={(checked) => updateField("notifyOnFailure", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Notify on Success</p>
                        <p className="text-xs text-muted-foreground">Get notified when pipelines succeed</p>
                      </div>
                      <Switch
                        checked={formData.notifyOnSuccess}
                        onCheckedChange={(checked) => updateField("notifyOnSuccess", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div>
                        <p className="text-sm font-medium text-foreground">Email Digest</p>
                        <p className="text-xs text-muted-foreground">Receive summary emails</p>
                      </div>
                      <select
                        value={formData.emailDigest}
                        onChange={(e) => updateField("emailDigest", e.target.value)}
                        className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              {hasChanges && (
                <footer className="px-8 py-4 border-t border-border flex items-center justify-end gap-3 bg-card animate-fade-in">
                  <span className="text-sm text-muted-foreground mr-auto">Unsaved changes</span>
                  <Button variant="ghost" onClick={() => {
                    setHasChanges(false);
                    fetchSettings();
                  }}>
                    Discard
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </footer>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: User },
  { id: "team", label: "Team Members", icon: Users },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState<"system" | "light" | "dark">("dark");
  const [showWebhook, setShowWebhook] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setHasChanges(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <main className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="w-56 border-r border-border p-4 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">DevTools AI</p>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Appearance Section */}
            <section className="animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {[
                  { id: "system", label: "System", icon: Monitor },
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTheme(option.id as typeof theme);
                      setHasChanges(true);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                      theme === option.id
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
                      <User className="w-10 h-10 text-muted-foreground" />
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
                      defaultValue="DevTools AI"
                      onChange={() => setHasChanges(true)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="admin@devtools.ai"
                      onChange={() => setHasChanges(true)}
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
                <Badge variant="success" className="text-[10px]">Active</Badge>
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
                        defaultValue={import.meta.env.VITE_SLACK_WEBHOOK_URL}
                        className="pl-10 pr-10 bg-secondary border-border font-mono text-xs"
                        onChange={() => setHasChanges(true)}
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
                {[
                  {
                    id: "critical",
                    label: "Critical Failures",
                    description: "Get notified immediately for P0 and P1 incidents",
                    defaultChecked: true,
                  },
                  {
                    id: "insights",
                    label: "AI Insights",
                    description: "Receive notifications when new patterns are detected",
                    defaultChecked: true,
                  },
                  {
                    id: "weekly",
                    label: "Weekly Summary",
                    description: "Get a weekly digest of pipeline health and trends",
                    defaultChecked: false,
                  },
                  {
                    id: "resolved",
                    label: "Resolved Issues",
                    description: "Notify when issues are automatically resolved",
                    defaultChecked: false,
                  },
                ].map((pref) => (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                    <Switch
                      defaultChecked={pref.defaultChecked}
                      onCheckedChange={() => setHasChanges(true)}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          {hasChanges && (
            <footer className="px-8 py-4 border-t border-border flex items-center justify-end gap-3 bg-card animate-fade-in">
              <span className="text-sm text-muted-foreground mr-auto">Unsaved changes</span>
              <Button variant="ghost" onClick={() => setHasChanges(false)}>
                Discard
              </Button>
              <Button onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;

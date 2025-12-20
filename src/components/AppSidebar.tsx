import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  BarChart3,
  AlertTriangle,
  Settings,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Repositories", url: "/repositories", icon: FolderGit2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Incidents", url: "/incidents", icon: AlertTriangle, badge: 12 },
  { title: "AI Insights", url: "/insights", icon: Zap },
];

const configItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Team", url: "/team", icon: Users },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
          <Bot className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-semibold text-foreground tracking-tight">CICD.ai</h1>
            <p className="text-[10px] text-muted-foreground">v2.4.0</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive(item.url)
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="flex-1 animate-fade-in">{item.title}</span>
            )}
            {!collapsed && item.badge && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/20 text-destructive animate-fade-in">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Configuration Section */}
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground animate-fade-in">
              Configuration
            </p>
          )}
          {configItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive(item.url)
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="animate-fade-in">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="animate-fade-in">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

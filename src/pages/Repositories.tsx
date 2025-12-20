import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Bell,
  Plus,
  Filter,
  GitBranch,
  FolderGit2,
  CircleDollarSign,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Repository {
  id: string;
  name: string;
  branch: string;
  healthScore: number;
  alert?: {
    type: "critical" | "warning" | "success";
    title: string;
    description: string;
  };
  language: string;
  languageColor: string;
  lastActivity: string;
}

const repositories: Repository[] = [
  {
    id: "1",
    name: "frontend-monorepo",
    branch: "main",
    healthScore: 45,
    alert: {
      type: "critical",
      title: "Critical Pattern Detected",
      description: "Flaky test in auth.spec.ts causing 30% of failures.",
    },
    language: "TypeScript",
    languageColor: "bg-primary",
    lastActivity: "4m ago",
  },
  {
    id: "2",
    name: "backend-api-core",
    branch: "develop",
    healthScore: 98,
    alert: {
      type: "success",
      title: "Healthy Pipeline",
      description: "Build times improved by 12% this week.",
    },
    language: "JavaScript",
    languageColor: "bg-warning",
    lastActivity: "1h ago",
  },
  {
    id: "3",
    name: "payments-service",
    branch: "staging",
    healthScore: 72,
    alert: {
      type: "warning",
      title: "Slow Build Detected",
      description: "Docker layer caching missed in 4 recent runs.",
    },
    language: "GoLang",
    languageColor: "bg-info",
    lastActivity: "2h ago",
  },
  {
    id: "4",
    name: "docs-portal",
    branch: "prod",
    healthScore: 95,
    alert: {
      type: "success",
      title: "No Issues Detected",
      description: "Pipeline is running smoothly.",
    },
    language: "TypeScript",
    languageColor: "bg-primary",
    lastActivity: "5h ago",
  },
  {
    id: "5",
    name: "legacy-auth-service",
    branch: "v1.2-patch",
    healthScore: 32,
    alert: {
      type: "critical",
      title: "Anomaly Detected",
      description: "Unusual timeout spike post-deployment.",
    },
    language: "Java",
    languageColor: "bg-destructive",
    lastActivity: "1d ago",
  },
];

function HealthBar({ score }: { score: number }) {
  // Color based on score
  const getColor = () => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const bars = [
    { threshold: 20, height: 8 },
    { threshold: 40, height: 14 },
    { threshold: 60, height: 20 },
    { threshold: 80, height: 26 },
    { threshold: 100, height: 70 },
  ];

  return (
    <div className="flex items-end gap-1.5 h-10 mt-2">
      {bars.map((bar) => {
        const isActive = score >= bar.threshold - 19;
        return (
          <div
            key={bar.threshold}
            className={cn(
              "w-9 transition-all duration-500",
              isActive ? getColor() : "bg-muted/40"
            )}
            style={{ height: `${bar.height}px` }}
          />
        );
      })}
    </div>
  );
}



function RepoCard({ repo, delay }: { repo: Repository; delay: number }) {
  const scoreColor =
    repo.healthScore >= 80
      ? "text-success border-success"
      : repo.healthScore >= 50
        ? "text-warning border-warning"
        : "text-destructive border-destructive";

  const alertIcon = {
    critical: <AlertTriangle className="w-3 h-3" />,
    warning: <AlertTriangle className="w-3 h-3" />,
    success: <CheckCircle2 className="w-3 h-3" />,
  };

  const alertColor = {
    critical: "text-destructive",
    warning: "text-warning",
    success: "text-success",
  };

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300 animate-fade-in group cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <FolderGit2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {repo.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <GitBranch className="w-3 h-3" />
              {repo.branch}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold",
            scoreColor
          )}
        >
          {repo.healthScore}%
        </div>
      </div>

      <HealthBar score={repo.healthScore} />

      {repo.alert && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className={cn("flex items-start gap-2", alertColor[repo.alert.type])}>
            {alertIcon[repo.alert.type]}
            <div>
              <p className="text-xs font-medium">{repo.alert.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {repo.alert.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", repo.languageColor)} />
          <span className="text-xs text-muted-foreground">{repo.language}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{repo.lastActivity}</span>
      </div>
    </div>
  );
}

const Repositories = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="text-sm text-muted-foreground">
            <span>DevOps Corp</span>
            <span className="mx-2">/</span>
            <span>Projects</span>
            <span className="mx-2">/</span>
            <Badge variant="outline" className="text-xs">Repositories</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Repositories</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor CI/CD health and AI-detected failure patterns across your organization.
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Repository
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repositories... (Cmd+K)"
                className="h-10 w-full pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Status: All
              </Button>
              <Button variant="outline" size="sm">
                Language: All
              </Button>
              <Button variant="outline" size="sm">
                Provider: GitHub
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                More filters
              </Button>
            </div>
          </div>

          {/* Repository Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {repositories.map((repo, index) => (
              <RepoCard key={repo.id} repo={repo} delay={index * 100} />
            ))}

            {/* Connect Repository Card */}
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-primary/50 transition-colors cursor-pointer group animate-fade-in" style={{ animationDelay: "500ms" }}>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Connect Repository</h3>
              <p className="text-xs text-muted-foreground text-center">
                Import from GitHub, GitLab or<br />Bitbucket to start analyzing.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Pro Plan</span> · 8/10 Seats used
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Repositories;

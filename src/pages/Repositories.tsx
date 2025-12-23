import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  GitBranch,
  FolderGit2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepos, Repository } from "@/hooks/useRepos";
import { useState } from "react";

function HealthBar({ score }: { score: number }) {
  // Color based on score
  const getActiveColor = () => {
    if (score >= 80) return "bg-success";
    if (score >= 50) return "bg-warning";
    return "bg-destructive";
  };

  // Inactive bar color (visible)
  const inactiveColor = "bg-muted";

  const bars = [
    { threshold: 20, height: 10 },
    { threshold: 40, height: 16 },
    { threshold: 60, height: 22 },
    { threshold: 80, height: 28 },
    { threshold: 100, height: 34 },
  ];

  return (
    <div className="flex items-end gap-1.5 h-10 mt-2">
      {bars.map((bar, index) => {
        // Calculate how many bars should be active based on score
        // At 0% = 0 bars active, at 20% = 1 bar, at 40% = 2 bars, etc.
        const activeBarCount = Math.ceil(score / 20);
        const isActive = index < activeBarCount;

        return (
          <div
            key={bar.threshold}
            className={cn(
              "w-8 transition-all duration-500 rounded-sm",
              isActive ? getActiveColor() : inactiveColor
            )}
            style={{ height: `${bar.height}px` }}
          />
        );
      })}
    </div>
  );
}

function RepoCard({
  repo,
  healthScore,
  status,
  delay
}: {
  repo: Repository;
  healthScore: number;
  status: "healthy" | "warning" | "critical";
  delay: number;
}) {
  const scoreColor =
    healthScore >= 80
      ? "text-success border-success"
      : healthScore >= 50
        ? "text-warning border-warning"
        : "text-destructive border-destructive";

  const alertConfig = {
    critical: {
      icon: <AlertTriangle className="w-3 h-3" />,
      color: "text-destructive",
      title: "High Failure Rate",
      description: `${repo.failureCount7d} failures in the last 7 days`,
    },
    warning: {
      icon: <AlertTriangle className="w-3 h-3" />,
      color: "text-warning",
      title: "Moderate Issues",
      description: `${repo.failureRate7d.toFixed(0)}% failure rate this week`,
    },
    healthy: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      color: "text-success",
      title: "Healthy Pipeline",
      description: repo.totalRuns7d > 0
        ? `${repo.totalRuns7d - repo.failureCount7d} successful runs this week`
        : "No recent activity",
    },
  };

  const alert = alertConfig[status];

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
              {repo.owner}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold",
            scoreColor
          )}
        >
          {healthScore}%
        </div>
      </div>

      <HealthBar score={healthScore} />

      {/* Stats Row */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center flex-1">
          <p className="text-lg font-bold text-foreground">{repo.totalRuns}</p>
          <p className="text-[10px] text-muted-foreground">Total Runs</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-lg font-bold text-destructive">{repo.failureCount7d}</p>
          <p className="text-[10px] text-muted-foreground">Failures (7d)</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-lg font-bold text-success">{repo.totalRuns7d - repo.failureCount7d}</p>
          <p className="text-[10px] text-muted-foreground">Success (7d)</p>
        </div>
      </div>

      {/* Alert */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className={cn("flex items-start gap-2", alert.color)}>
          {alert.icon}
          <div>
            <p className="text-xs font-medium">{alert.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {alert.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", repo.isPrivate ? "bg-warning" : "bg-success")} />
          <span className="text-xs text-muted-foreground">{repo.isPrivate ? "Private" : "Public"}</span>
        </div>
        <a
          href={`https://github.com/${repo.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          View on GitHub
        </a>
      </div>
    </div>
  );
}

const Repositories = () => {
  const { repos, loading, error, refresh, syncRepos, getHealthScore, getStatus } = useRepos();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "warning" | "critical">("all");

  // Filter repos
  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;

    const status = getStatus(getHealthScore(repo));
    return status === statusFilter;
  });

  // Stats
  const healthyCount = repos.filter(r => getStatus(getHealthScore(r)) === "healthy").length;
  const warningCount = repos.filter(r => getStatus(getHealthScore(r)) === "warning").length;
  const criticalCount = repos.filter(r => getStatus(getHealthScore(r)) === "critical").length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h1 className="text-xl font-bold text-foreground">Repositories</h1>
            <p className="text-sm text-muted-foreground">
              Monitor CI/CD health and AI-detected failure patterns across your connected repos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refresh} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button onClick={syncRepos} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Sync from GitHub
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-foreground">{repos.length}</p>
              <p className="text-xs text-muted-foreground">Total Repositories</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-success">{healthyCount}</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-warning">{warningCount}</p>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All ({repos.length})
              </Button>
              <Button
                variant={statusFilter === "healthy" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("healthy")}
              >
                <CheckCircle2 className="w-3 h-3 mr-1 text-success" />
                Healthy ({healthyCount})
              </Button>
              <Button
                variant={statusFilter === "warning" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("warning")}
              >
                <AlertTriangle className="w-3 h-3 mr-1 text-warning" />
                Warning ({warningCount})
              </Button>
              <Button
                variant={statusFilter === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("critical")}
              >
                <AlertTriangle className="w-3 h-3 mr-1 text-destructive" />
                Critical ({criticalCount})
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 mb-6 text-destructive">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && repos.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && repos.length === 0 && (
            <div className="text-center py-16">
              <FolderGit2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No repositories connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sync your GitHub repositories to start monitoring CI/CD health.
              </p>
              <Button onClick={syncRepos} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Sync from GitHub
              </Button>
            </div>
          )}

          {/* Repository Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredRepos.map((repo, index) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  healthScore={getHealthScore(repo)}
                  status={getStatus(getHealthScore(repo))}
                  delay={index * 100}
                />
              ))}

              {/* Connect Repository Card */}
              <div
                className="rounded-xl border border-dashed border-border bg-card/50 p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-primary/50 transition-colors cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${filteredRepos.length * 100}ms` }}
                onClick={syncRepos}
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Connect Repository</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Import from GitHub to<br />start analyzing CI/CD failures.
                </p>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && repos.length > 0 && filteredRepos.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{repos.length} Repositories</span> · Last synced: just now
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Repositories;

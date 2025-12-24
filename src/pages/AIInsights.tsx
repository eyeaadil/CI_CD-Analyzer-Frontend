import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Brain,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInsights, Insight } from "@/hooks/useInsights";
import { useState } from "react";

const typeConfig = {
  anomaly: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  pattern: { icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
  suggestion: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
  resolved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
};

const severityConfig = {
  critical: { color: "text-destructive", badge: "destructive" as const },
  high: { color: "text-warning", badge: "warning" as const },
  medium: { color: "text-foreground", badge: "secondary" as const },
  low: { color: "text-muted-foreground", badge: "outline" as const },
};

function InsightCard({ insight, delay }: { insight: Insight; delay: number }) {
  const type = typeConfig[insight.type];
  const severity = severityConfig[insight.severity];
  const Icon = type.icon;

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300 animate-fade-in group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2.5 rounded-lg flex-shrink-0", type.bg)}>
          <Icon className={cn("w-5 h-5", type.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {insight.title}
                </h3>
                <Badge variant={severity.badge} className="text-[10px]">
                  {insight.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Brain className="w-3 h-3" />
                  <span>{insight.confidence}% confidence</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{insight.time}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {insight.details}
          </p>

          <div className="flex items-center justify-between">
            {insight.repository && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {insight.repository}
                </Badge>
              </div>
            )}

            {insight.actionable && insight.type !== "resolved" && (
              <Button size="sm" variant="ghost" className="text-primary text-xs ml-auto">
                View Details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}

            {insight.type === "resolved" && (
              <span className="text-xs text-success flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3 h-3" />
                Resolved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AIInsights = () => {
  const {
    insights,
    summary,
    loading,
    criticalCount,
    resolvedCount,
    patternCount,
    suggestionCount,
    refresh,
  } = useInsights();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter insights by search
  const filteredInsights = insights.filter(insight => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      insight.title.toLowerCase().includes(query) ||
      insight.description.toLowerCase().includes(query) ||
      (insight.repository?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">AI Insights</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-detected anomalies, patterns, and optimization suggestions across your pipelines.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Analysis
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-card animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summary?.critical || criticalCount}</p>
                  <p className="text-xs text-muted-foreground">Critical Issues</p>
                </div>
              </div>
            </div>

            <div className="stat-card animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summary?.patterns || patternCount}</p>
                  <p className="text-xs text-muted-foreground">Patterns Found</p>
                </div>
              </div>
            </div>

            <div className="stat-card animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summary?.suggestions || suggestionCount}</p>
                  <p className="text-xs text-muted-foreground">Suggestions</p>
                </div>
              </div>
            </div>

            <div className="stat-card animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{summary?.resolved || resolvedCount}</p>
                  <p className="text-xs text-muted-foreground">Resolved Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Type: All
              </Button>
              <Button variant="outline" size="sm">
                Severity: All
              </Button>
              <Button variant="outline" size="sm">
                Repository: All
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                More filters
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && insights.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && insights.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No insights yet</h3>
              <p className="text-sm text-muted-foreground">
                AI insights will appear here as your pipelines run and patterns are detected.
              </p>
            </div>
          )}

          {/* Insights List */}
          {!loading && filteredInsights.length > 0 && (
            <div className="space-y-4">
              {filteredInsights.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} delay={index * 100} />
              ))}
            </div>
          )}

          {/* No Search Results */}
          {!loading && insights.length > 0 && filteredInsights.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search query.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIInsights;


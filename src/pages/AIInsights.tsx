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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "anomaly" | "pattern" | "suggestion" | "resolved";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  details: string;
  confidence: number;
  repository?: string;
  time: string;
  actionable: boolean;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "anomaly",
    severity: "critical",
    title: "Docker Timeout Spike Detected",
    description: "200% increase in Docker timeout failures in staging environment",
    details: "Pattern started 2 hours ago. Correlates with increased traffic from load testing. Recommend scaling container resources.",
    confidence: 94,
    repository: "api-gateway",
    time: "2 mins ago",
    actionable: true,
  },
  {
    id: "2",
    type: "pattern",
    severity: "high",
    title: "Flaky Test Pattern Identified",
    description: "auth.spec.ts fails intermittently (15%) without code changes",
    details: "Test relies on external API mock that occasionally times out. Consider implementing retry logic or improving mock stability.",
    confidence: 89,
    repository: "frontend-monorepo",
    time: "15 mins ago",
    actionable: true,
  },
  {
    id: "3",
    type: "suggestion",
    severity: "medium",
    title: "Build Time Optimization Available",
    description: "Docker layer caching could reduce build time by 40%",
    details: "Detected repeated dependency installations. Moving package.json copy before source code would enable better caching.",
    confidence: 96,
    repository: "payments-service",
    time: "1 hour ago",
    actionable: true,
  },
  {
    id: "4",
    type: "anomaly",
    severity: "medium",
    title: "Memory Usage Anomaly",
    description: "Jest tests consuming 2x normal memory in CI",
    details: "Started after merge of PR #4821. Possible memory leak in new utility functions.",
    confidence: 78,
    repository: "backend-api-core",
    time: "2 hours ago",
    actionable: true,
  },
  {
    id: "5",
    type: "resolved",
    severity: "low",
    title: "Database Connection Pool Issue Fixed",
    description: "Connection timeout pattern no longer detected",
    details: "Issue resolved after infrastructure team increased pool size. Monitoring for 24 hours confirmed stability.",
    confidence: 100,
    repository: "auth-service",
    time: "3 hours ago",
    actionable: false,
  },
  {
    id: "6",
    type: "suggestion",
    severity: "low",
    title: "Test Coverage Gap Detected",
    description: "New payment module has 23% test coverage",
    details: "Critical payment flow paths lack unit tests. AI suggests 12 specific test cases to add.",
    confidence: 85,
    repository: "payments-service",
    time: "5 hours ago",
    actionable: true,
  },
];

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
  const criticalCount = insights.filter((i) => i.severity === "critical").length;
  const resolvedCount = insights.filter((i) => i.type === "resolved").length;

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
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
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
                  <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">3</p>
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
                  <p className="text-2xl font-bold text-foreground">2</p>
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
                  <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
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

          {/* Insights List */}
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} delay={index * 100} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;

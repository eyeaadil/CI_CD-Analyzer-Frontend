import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    Filter,
    Search,
    XCircle,
    GitBranch,
    User,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
    id: string;
    githubRunId: string;
    workflowName: string;
    branch: string;
    actor: string;
    commitSha: string;
    runUrl: string;
    createdAt: string;
    status: "active" | "resolved";
    repo: {
        name: string;
        owner: string;
        fullName: string;
    };
    analysis: {
        rootCause: string;
        failureStage: string;
        suggestedFix: string;
        priority: number;
        priorityLabel: string;
        failureType: string;
    } | null;
}

// Mock data - will be replaced with API calls
const incidents: Incident[] = [
    {
        id: "1",
        githubRunId: "12345678",
        workflowName: "CI Pipeline",
        branch: "main",
        actor: "john-dev",
        commitSha: "a1b2c3d",
        runUrl: "https://github.com/example/repo/actions/runs/12345678",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: "active",
        repo: {
            name: "api-gateway",
            owner: "acme-corp",
            fullName: "acme-corp/api-gateway",
        },
        analysis: {
            rootCause: "Database connection pool exhausted during high traffic load test. Max connections limit reached.",
            failureStage: "Integration Tests",
            suggestedFix: "Increase connection pool size in config or implement connection pooling with retry logic.",
            priority: 0,
            priorityLabel: "P0 - Critical",
            failureType: "RUNTIME",
        },
    },
    {
        id: "2",
        githubRunId: "12345679",
        workflowName: "Deploy Staging",
        branch: "feature/auth",
        actor: "jane-dev",
        commitSha: "b2c3d4e",
        runUrl: "https://github.com/example/repo/actions/runs/12345679",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: "active",
        repo: {
            name: "frontend-app",
            owner: "acme-corp",
            fullName: "acme-corp/frontend-app",
        },
        analysis: {
            rootCause: "Docker build timeout - node_modules cache invalidated causing full reinstall.",
            failureStage: "Build",
            suggestedFix: "Optimize Dockerfile layer caching by copying package.json before source files.",
            priority: 1,
            priorityLabel: "P1 - High",
            failureType: "BUILD",
        },
    },
    {
        id: "3",
        githubRunId: "12345680",
        workflowName: "Unit Tests",
        branch: "develop",
        actor: "bob-dev",
        commitSha: "c3d4e5f",
        runUrl: "https://github.com/example/repo/actions/runs/12345680",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "resolved",
        repo: {
            name: "auth-service",
            owner: "acme-corp",
            fullName: "acme-corp/auth-service",
        },
        analysis: {
            rootCause: "Flaky test in auth.spec.ts - race condition in token refresh test.",
            failureStage: "Test",
            suggestedFix: "Add proper async/await handling and increase timeout for token refresh test.",
            priority: 2,
            priorityLabel: "P2 - Medium",
            failureType: "TEST",
        },
    },
    {
        id: "4",
        githubRunId: "12345681",
        workflowName: "E2E Tests",
        branch: "main",
        actor: "alice-dev",
        commitSha: "d4e5f6g",
        runUrl: "https://github.com/example/repo/actions/runs/12345681",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: "active",
        repo: {
            name: "payments-service",
            owner: "acme-corp",
            fullName: "acme-corp/payments-service",
        },
        analysis: {
            rootCause: "Stripe API sandbox rate limit exceeded during parallel test execution.",
            failureStage: "E2E Tests",
            suggestedFix: "Implement request throttling or use mock Stripe API for CI environment.",
            priority: 1,
            priorityLabel: "P1 - High",
            failureType: "INFRA",
        },
    },
];

const priorityConfig: Record<number, { color: string; badge: "destructive" | "warning" | "secondary" | "outline" }> = {
    0: { color: "text-destructive", badge: "destructive" },
    1: { color: "text-warning", badge: "warning" },
    2: { color: "text-foreground", badge: "secondary" },
    3: { color: "text-muted-foreground", badge: "outline" },
};

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function IncidentCard({ incident, delay }: { incident: Incident; delay: number }) {
    const priority = priorityConfig[incident.analysis?.priority ?? 2];
    const isActive = incident.status === "active";

    return (
        <div
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300 animate-fade-in group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Left: Main Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant={priority.badge} className="text-xs">
                            {incident.analysis?.priorityLabel || "P2 - Medium"}
                        </Badge>
                        <Badge
                            variant={isActive ? "destructive" : "outline"}
                            className={cn(
                                "text-xs",
                                isActive ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-success/10 text-success border-success/30"
                            )}
                        >
                            {isActive ? (
                                <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Active
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Resolved
                                </>
                            )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(incident.createdAt)}
                        </span>
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {incident.workflowName}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {incident.branch}
                        </span>
                        <span className="font-mono">{incident.commitSha}</span>
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {incident.actor}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-[10px]">
                            {incident.repo.fullName}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                            {incident.analysis?.failureType || "Unknown"}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                            {incident.analysis?.failureStage || "Unknown Stage"}
                        </Badge>
                    </div>

                    {/* Root Cause */}
                    {incident.analysis && (
                        <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                                <span className="text-xs font-medium text-foreground">Root Cause</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {incident.analysis.rootCause}
                            </p>
                        </div>
                    )}

                    {/* Suggested Fix */}
                    {incident.analysis?.suggestedFix && (
                        <div className="bg-primary/5 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-medium text-primary">Suggested Fix</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {incident.analysis.suggestedFix}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" asChild>
                        <a href={incident.runUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            GitHub
                        </a>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-primary">
                        Details
                    </Button>
                </div>
            </div>
        </div>
    );
}

const Incidents = () => {
    const activeCount = incidents.filter((i) => i.status === "active").length;
    const resolvedCount = incidents.filter((i) => i.status === "resolved").length;
    const p0Count = incidents.filter((i) => i.analysis?.priority === 0).length;
    const p1Count = incidents.filter((i) => i.analysis?.priority === 1).length;

    return (
        <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-5 h-5 text-warning" />
                            <h1 className="text-xl font-bold text-foreground">Incidents</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Track and manage high-priority CI/CD pipeline failures.
                        </p>
                    </div>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="stat-card animate-fade-in">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-destructive/10">
                                    <XCircle className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                                    <p className="text-xs text-muted-foreground">Active Incidents</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: "100ms" }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-destructive/10">
                                    <AlertTriangle className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{p0Count}</p>
                                    <p className="text-xs text-muted-foreground">P0 Critical</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: "200ms" }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-warning/10">
                                    <Clock className="w-5 h-5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{p1Count}</p>
                                    <p className="text-xs text-muted-foreground">P1 High Priority</p>
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
                                placeholder="Search incidents..."
                                className="h-10 w-full pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Status: All
                            </Button>
                            <Button variant="outline" size="sm">
                                Priority: All
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

                    {/* Incidents List */}
                    <div className="space-y-4">
                        {incidents.map((incident, index) => (
                            <IncidentCard key={incident.id} incident={incident} delay={index * 100} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Incidents;

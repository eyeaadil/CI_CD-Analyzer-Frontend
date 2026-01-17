import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "react-router-dom";
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
    RefreshCw,
    Loader2,
    Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIncidents, Incident } from "@/hooks/useIncidents";
import { useState } from "react";

const priorityConfig: Record<number, { color: string; badge: "destructive" | "warning" | "secondary" | "outline" }> = {
    0: { color: "text-destructive", badge: "destructive" },
    1: { color: "text-warning", badge: "warning" },
    2: { color: "text-foreground", badge: "secondary" },
    3: { color: "text-muted-foreground", badge: "outline" },
    4: { color: "text-muted-foreground", badge: "outline" },
    5: { color: "text-muted-foreground", badge: "outline" },
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
    const priority = priorityConfig[incident.analysis?.priority ?? 2] || priorityConfig[2];
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
                        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                                <span className="text-xs font-medium text-destructive">Root Cause</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {incident.analysis.rootCause}
                            </p>
                        </div>
                    )}

                    {/* Suggested Fix */}
                    {incident.analysis?.suggestedFix && (
                        <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Lightbulb className="w-3.5 h-3.5 text-success" />
                                <span className="text-xs font-medium text-success">Suggested Fix</span>
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
                    <Button size="sm" variant="ghost" className="text-primary" asChild>
                        <Link to={`/run/${incident.id}`}>
                            Details
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

const Incidents = () => {
    const {
        incidents,
        loading,
        error,
        activeCount,
        resolvedCount,
        p0Count,
        p1Count,
        refresh,
    } = useIncidents();

    const [searchQuery, setSearchQuery] = useState("");

    // Filter incidents by search
    const filteredIncidents = incidents.filter(incident => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            incident.workflowName.toLowerCase().includes(query) ||
            incident.repo.fullName.toLowerCase().includes(query) ||
            incident.branch.toLowerCase().includes(query) ||
            incident.actor.toLowerCase().includes(query)
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
                            <AlertTriangle className="w-5 h-5 text-warning" />
                            <h1 className="text-xl font-bold text-foreground">Incidents</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Track and manage high-priority CI/CD pipeline failures.
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
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
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
                                    <p className="text-xs text-muted-foreground">Resolved</p>
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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

                    {/* Error State */}
                    {error && (
                        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && incidents.length === 0 && (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && incidents.length === 0 && (
                        <div className="text-center py-16">
                            <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No incidents</h3>
                            <p className="text-sm text-muted-foreground">
                                All your pipelines are running smoothly. No high-priority failures detected.
                            </p>
                        </div>
                    )}

                    {/* Incidents List */}
                    {!loading && filteredIncidents.length > 0 && (
                        <div className="space-y-4">
                            {filteredIncidents.map((incident, index) => (
                                <IncidentCard key={incident.id} incident={incident} delay={index * 100} />
                            ))}
                        </div>
                    )}

                    {/* No Search Results */}
                    {!loading && incidents.length > 0 && filteredIncidents.length === 0 && (
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

export default Incidents;


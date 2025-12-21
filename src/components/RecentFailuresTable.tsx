/**
 * Recent Failures Table Component
 * 
 * Displays recent failed builds in a card grid layout
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Filter,
    Download,
    ExternalLink,
    AlertTriangle,
    Clock,
    GitBranch,
    Zap,
    ChevronRight,
    Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Failure {
    id: string;
    repository: string;
    build: string;
    branch: string;
    type: string;
    typeColor: "destructive" | "warning" | "default";
    priority: string;
    priorityColor: "destructive" | "warning" | "default";
    analysis: string;
    analysisStatus: "available" | "analyzing";
    analysisDetails: string;
    time: string;
    actor: string;
}

const failures: Failure[] = [
    {
        id: "1",
        repository: "api-gateway",
        build: "#4822",
        branch: "main",
        type: "NullPointer",
        typeColor: "destructive",
        priority: "P0",
        priorityColor: "destructive",
        analysis: "Suggested fix available",
        analysisStatus: "available",
        analysisDetails: "Uncaught exception in UserAuth service lines 42-45.",
        time: "2m ago",
        actor: "john-dev",
    },
    {
        id: "2",
        repository: "frontend-web",
        build: "#4821",
        branch: "feature/auth",
        type: "Test Failure",
        typeColor: "warning",
        priority: "P3",
        priorityColor: "default",
        analysis: "Analyzing root cause...",
        analysisStatus: "analyzing",
        analysisDetails: "Comparing with previous successful build #4010.",
        time: "5m ago",
        actor: "jane-dev",
    },
    {
        id: "3",
        repository: "auth-service",
        build: "#4819",
        branch: "develop",
        type: "Timeout",
        typeColor: "warning",
        priority: "P1",
        priorityColor: "destructive",
        analysis: "Suggested fix available",
        analysisStatus: "available",
        analysisDetails: "DB connection pool exhausted during peak load.",
        time: "12m ago",
        actor: "bob-dev",
    },
    {
        id: "4",
        repository: "payments-api",
        build: "#4817",
        branch: "main",
        type: "Build Error",
        typeColor: "destructive",
        priority: "P2",
        priorityColor: "warning",
        analysis: "Suggested fix available",
        analysisStatus: "available",
        analysisDetails: "Missing dependency in package.json - axios@1.5.0.",
        time: "25m ago",
        actor: "alice-dev",
    },
];

function FailureCard({ failure, index }: { failure: Failure; index: number }) {
    const isHighPriority = failure.priority === "P0" || failure.priority === "P1";

    return (
        <div
            className={cn(
                "group p-4 rounded-xl border transition-all duration-300 hover:shadow-lg animate-fade-in",
                isHighPriority
                    ? "bg-destructive/5 border-destructive/20 hover:border-destructive/40"
                    : "bg-card border-border hover:border-primary/30"
            )}
            style={{ animationDelay: `${400 + index * 100}ms` }}
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isHighPriority ? "bg-destructive/10" : "bg-secondary"
                    )}>
                        <AlertTriangle className={cn(
                            "w-5 h-5",
                            isHighPriority ? "text-destructive" : "text-warning"
                        )} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {failure.repository}
                            </h4>
                            <span className="text-xs text-muted-foreground font-mono">{failure.build}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                {failure.branch}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {failure.time}
                            </span>
                            <span>@{failure.actor}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant={failure.priorityColor}
                        className={cn(
                            "text-[10px] font-bold",
                            failure.priorityColor === "destructive" && "glow-destructive"
                        )}
                    >
                        {failure.priority}
                    </Badge>
                    <Badge variant={failure.typeColor} className="text-[10px]">
                        {failure.type}
                    </Badge>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className={cn(
                "rounded-lg p-3 mb-3",
                failure.analysisStatus === "available"
                    ? "bg-primary/5 border border-primary/10"
                    : "bg-secondary/50"
            )}>
                <div className="flex items-start gap-2">
                    {failure.analysisStatus === "available" ? (
                        <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                        <Bot className="w-4 h-4 text-muted-foreground animate-pulse mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className={cn(
                            "text-xs font-medium",
                            failure.analysisStatus === "available" ? "text-primary" : "text-muted-foreground"
                        )}>
                            {failure.analysis}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {failure.analysisDetails}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {failure.analysisStatus === "available" && (
                        <Button size="sm" variant="default" className="h-7 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            View Fix
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        GitHub
                    </Button>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary">
                    Details
                    <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    );
}

export function RecentFailuresTable() {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "400ms" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Recent Failures</h3>
                        <p className="text-xs text-muted-foreground">{failures.length} failures need attention</p>
                    </div>
                    <Badge variant="destructive" className="text-[10px] ml-2">
                        {failures.filter(f => f.priority === "P0" || f.priority === "P1").length} Critical
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="w-3 h-3 mr-1" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {failures.map((failure, index) => (
                    <FailureCard key={failure.id} failure={failure} index={index} />
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-secondary/10 flex items-center justify-center">
                <Button variant="ghost" size="sm" className="text-primary text-xs">
                    View All Failures
                    <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    );
}

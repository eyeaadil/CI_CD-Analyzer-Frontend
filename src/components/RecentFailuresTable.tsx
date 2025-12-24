/**
 * Recent Failures Table Component
 * 
 * Displays recent failed builds in a card grid layout.
 * Receives data from props (fetched by useDashboard hook).
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Filter,
    Download,
    ExternalLink,
    AlertTriangle,
    Clock,
    GitBranch,
    Zap,
    ChevronRight,
    Bot,
    Loader2,
    X,
    Wrench,
    Target,
    Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecentFailure } from "@/store/slices/dashboardSlice";

// Props interface
interface RecentFailuresTableProps {
    failures?: RecentFailure[];
    loading?: boolean;
}

// Map priority to color
function getPriorityColor(priority: string): "destructive" | "warning" | "default" {
    if (priority === "P0" || priority === "P1") return "destructive";
    if (priority === "P2") return "warning";
    return "default";
}

// Format time ago
function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Analysis Modal Component
function AnalysisModal({
    failure,
    isOpen,
    onClose
}: {
    failure: RecentFailure | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!failure || !failure.analysis) return null;

    const priority = failure.analysis.priority || "P3";
    const priorityColor = getPriorityColor(priority);

    // Dynamic colors based on priority
    const isError = priority === "P0" || priority === "P1";
    const isWarning = priority === "P2";
    const isSuccess = priority === "P3" || priority === "P4";

    // Color classes based on priority
    const headerBg = isError ? "bg-destructive/10" : isWarning ? "bg-warning/10" : "bg-success/10";
    const headerBorder = isError ? "border-destructive/30" : isWarning ? "border-warning/30" : "border-success/30";
    const iconColor = isError ? "text-destructive" : isWarning ? "text-warning" : "text-success";
    const rootCauseBg = isError ? "bg-destructive/5" : isWarning ? "bg-warning/5" : "bg-success/5";
    const rootCauseBorder = isError ? "border-destructive/20" : isWarning ? "border-warning/20" : "border-success/20";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader className={cn("p-4 -m-6 mb-4 rounded-t-lg border-b", headerBg, headerBorder)}>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <Zap className={cn("w-5 h-5", iconColor)} />
                            AI Analysis
                        </DialogTitle>
                        <Badge variant={priorityColor} className="text-xs font-bold">
                            {priority}
                        </Badge>
                    </div>
                    <DialogDescription className="text-left">
                        {failure.repo.fullName} • #{failure.githubRunId.slice(-4)} • {failure.branch}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Root Cause - RED (error) */}
                    <div className="rounded-lg p-4 bg-destructive/5 border border-destructive/20">
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-destructive mb-1">Root Cause</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {failure.analysis.rootCause}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Failure Stage - YELLOW (warning) */}
                    {failure.analysis.failureStage && (
                        <div className="rounded-lg p-4 bg-warning/5 border border-warning/20">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-warning mb-1">Failure Stage</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {failure.analysis.failureStage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Failure Type */}
                    {failure.analysis.failureType && (
                        <div className="rounded-lg p-4 bg-secondary">
                            <div className="flex items-start gap-3">
                                <Wrench className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-foreground mb-1">Failure Type</h4>
                                    <Badge variant="secondary">{failure.analysis.failureType}</Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Suggested Fix - GREEN (success/analysis) */}
                    <div className="rounded-lg p-4 bg-success/5 border border-success/20">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-success mb-2">Suggested Fix</h4>
                                {failure.analysis.suggestedFix ? (
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {failure.analysis.suggestedFix}
                                    </p>
                                ) : (
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Review the error message in the failure stage</li>
                                        <li>Check recent commits on the branch</li>
                                        <li>Verify environment configuration</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <Button variant="outline" asChild>
                        <a href={failure.runUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on GitHub
                        </a>
                    </Button>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Individual failure card
function FailureCard({
    failure,
    index,
    onViewAnalysis
}: {
    failure: RecentFailure;
    index: number;
    onViewAnalysis: (failure: RecentFailure) => void;
}) {
    const priority = failure.analysis?.priority || "P3";
    const isHighPriority = priority === "P0" || priority === "P1";
    const priorityColor = getPriorityColor(priority);

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
                                {failure.repo.fullName}
                            </h4>
                            <span className="text-xs text-muted-foreground font-mono">
                                #{failure.githubRunId.slice(-4)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                {failure.branch}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(failure.createdAt)}
                            </span>
                            <span>@{failure.actor}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant={priorityColor}
                        className={cn(
                            "text-[10px] font-bold",
                            priorityColor === "destructive" && "glow-destructive"
                        )}
                    >
                        {priority}
                    </Badge>
                    {failure.analysis?.failureType && (
                        <Badge variant="secondary" className="text-[10px]">
                            {failure.analysis.failureType}
                        </Badge>
                    )}
                </div>
            </div>

            {/* AI Analysis Section */}
            {failure.analysis ? (
                <div className="space-y-2 mb-3">
                    {/* Root Cause */}
                    <div className="rounded-lg p-3 bg-destructive/5 border border-destructive/20">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-destructive">
                                    Root Cause
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {failure.analysis.rootCause}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Suggested Fix */}
                    {failure.analysis.suggestedFix && (
                        <div className="rounded-lg p-3 bg-success/5 border border-success/10">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-success">
                                        Suggested Fix
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {failure.analysis.suggestedFix}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-lg p-3 mb-3 bg-secondary/50">
                    <div className="flex items-start gap-2">
                        <Bot className="w-4 h-4 text-muted-foreground animate-pulse" />
                        <p className="text-xs text-muted-foreground">
                            Analyzing failure...
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {failure.analysis && (
                        <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs"
                            onClick={() => onViewAnalysis(failure)}
                        >
                            <Zap className="w-3 h-3 mr-1" />
                            View Analysis
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" asChild>
                        <a href={failure.runUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            GitHub
                        </a>
                    </Button>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-primary"
                    onClick={() => onViewAnalysis(failure)}
                >
                    Details
                    <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    );
}

export function RecentFailuresTable({ failures = [], loading = false }: RecentFailuresTableProps) {
    const [selectedFailure, setSelectedFailure] = useState<RecentFailure | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewAnalysis = (failure: RecentFailure) => {
        setSelectedFailure(failure);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFailure(null);
    };

    const criticalCount = failures.filter(f =>
        f.analysis?.priority === "P0" || f.analysis?.priority === "P1"
    ).length;

    return (
        <>
            <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "400ms" }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Recent Failures</h3>
                            <p className="text-xs text-muted-foreground">
                                {failures.length} failures need attention
                            </p>
                        </div>
                        {criticalCount > 0 && (
                            <Badge variant="destructive" className="text-[10px] ml-2">
                                {criticalCount} Critical
                            </Badge>
                        )}
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

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : failures.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No recent failures</p>
                        <p className="text-sm mt-1">Your builds are looking healthy!</p>
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {failures.map((failure, index) => (
                            <FailureCard
                                key={failure.id}
                                failure={failure}
                                index={index}
                                onViewAnalysis={handleViewAnalysis}
                            />
                        ))}
                    </div>
                )}

                {/* Footer */}
                {failures.length > 0 && (
                    <div className="px-4 py-3 border-t border-border bg-secondary/10 flex items-center justify-center">
                        <Button variant="ghost" size="sm" className="text-primary text-xs">
                            View All Failures
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Analysis Modal */}
            <AnalysisModal
                failure={selectedFailure}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}

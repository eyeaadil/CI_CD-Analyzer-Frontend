/**
 * Dashboard Page (Index)
 * 
 * Main dashboard showing:
 * - Stats cards with key metrics (from API)
 * - Top failure root causes (from API)
 * - Live activity feed (from API)
 * - Recent failures table (from API)
 */

import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { StatCard } from "@/components/StatCard";
import { FailureItem } from "@/components/FailureItem";
import { InsightItem } from "@/components/InsightItem";
import { RecentFailuresTable } from "@/components/RecentFailuresTable";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import {
    CheckCircle2,
    AlertTriangle,
    Clock,
    Zap,
    Search,
    Bell,
    ChevronDown,
    ExternalLink,
    RefreshCw,
    Loader2,
} from "lucide-react";

const Index = () => {
    const { user } = useAuth();
    const {
        stats,
        recentFailures,
        activity,
        failureCategories,
        loading,
        loadingStats,
        error,
        fetchDashboard,
        refresh,
    } = useDashboard();

    // Fetch dashboard data on mount
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Get user initials for avatar
    const getInitials = () => {
        if (user?.name) {
            return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }
        return "U";
    };

    // Calculate success rate from stats
    const successRate = stats ? (100 - stats.failureRate24h).toFixed(1) : "0";

    // Helper to determine color based on percentage (severity)
    const getFailureColor = (percentage: number): "red" | "orange" | "yellow" => {
        if (percentage >= 50) return "red";      // High severity (50%+)
        if (percentage >= 25) return "orange";   // Medium severity (25-49%)
        return "yellow";                          // Low severity (<25%)
    };

    // Map failure categories to display format
    const failureData = failureCategories.length > 0
        ? failureCategories.slice(0, 4).map((cat) => ({
            label: cat.category,
            count: cat.count,
            percentage: Math.round(cat.percentage),
            color: getFailureColor(cat.percentage),
        }))
        : [
            { label: "No data yet", count: 0, percentage: 0, color: "yellow" as const },
        ];

    // Map activity to insights format
    const insights = activity.slice(0, 3).map(item => ({
        type: item.type === "failure" ? "warning" as const : "success" as const,
        title: `${item.workflowName}`,
        description: `${item.status} on ${item.repo} (${item.branch})`,
        time: formatTimeAgo(item.createdAt),
    }));

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <AppSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">Dashboard</span>
                            <span className="mx-2">›</span>
                            <span className="text-foreground font-medium">All Repositories</span>
                            <ChevronDown className="inline w-4 h-4 ml-1" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Refresh Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={refresh}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search builds (Cmd+K)"
                                className="h-9 w-64 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
                        </Button>

                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                            {getInitials()}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Success Rate"
                            value={loadingStats ? "..." : `${successRate}%`}
                            change={stats ? `${stats.totalRuns24h} builds today` : ""}
                            changeType="positive"
                            subtitle={`Based on last ${stats?.totalRuns || 0} builds`}
                            icon={CheckCircle2}
                            iconColor="text-success"
                            delay={0}
                        />
                        <StatCard
                            title="Failed Builds (24h)"
                            value={loadingStats ? "..." : String(stats?.failedRuns24h || 0)}
                            change={stats?.failureRate24h ? `${stats.failureRate24h}% failure rate` : ""}
                            changeType={stats?.failedRuns24h ? "negative" : "positive"}
                            subtitle={`${stats?.failedRuns7d || 0} this week`}
                            icon={AlertTriangle}
                            iconColor="text-warning"
                            delay={100}
                        />
                        <StatCard
                            title="Total Repos"
                            value={loadingStats ? "..." : String(stats?.totalRepos || 0)}
                            subtitle="Connected repositories"
                            icon={Clock}
                            iconColor="text-foreground"
                            delay={200}
                        />
                        <StatCard
                            title="Total Runs"
                            value={loadingStats ? "..." : String(stats?.totalRuns || 0)}
                            subtitle="All time workflow runs"
                            icon={Zap}
                            iconColor="text-primary"
                            delay={300}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Failure Root Causes */}
                        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-foreground">Top Failure Root Causes</h3>
                                <Button variant="ghost" size="sm" className="text-primary text-xs" asChild>
                                    <a href="/analytics">
                                        View detailed report
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                </Button>
                            </div>

                            {failureCategories.length === 0 && !loading ? (
                                <div className="text-center text-muted-foreground py-8">
                                    No failure data yet. Run some workflows to see analytics.
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {failureData.map((item, index) => (
                                        <FailureItem
                                            key={item.label}
                                            {...item}
                                            delay={300 + index * 100}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Live Activity */}
                        <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
                            <div className="flex items-center gap-2 mb-5">
                                <Zap className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-foreground">Live Activity</h3>
                            </div>

                            {activity.length === 0 && !loading ? (
                                <div className="text-center text-muted-foreground py-8 text-sm">
                                    No recent activity
                                </div>
                            ) : loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {insights.map((insight, index) => (
                                        <InsightItem
                                            key={index}
                                            {...insight}
                                            delay={400 + index * 100}
                                        />
                                    ))}
                                </div>
                            )}

                            <Button variant="ghost" className="w-full mt-4 text-primary text-xs" asChild>
                                <a href="/analytics">View All Activity</a>
                            </Button>
                        </div>
                    </div>

                    {/* Recent Failures Table */}
                    <RecentFailuresTable
                        failures={recentFailures}
                        loading={loading}
                    />
                </div>
            </main>
        </div>
    );
};

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default Index;

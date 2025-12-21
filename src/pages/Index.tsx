/**
 * Dashboard Page (Index)
 * 
 * Main dashboard showing:
 * - Stats cards with key metrics
 * - Top failure root causes
 * - Live insights
 * - Recent failures table
 */

import { AppSidebar } from "@/components/AppSidebar";
import { StatCard } from "@/components/StatCard";
import { FailureItem } from "@/components/FailureItem";
import { InsightItem } from "@/components/InsightItem";
import { RecentFailuresTable } from "../components/RecentFailuresTable";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    AlertTriangle,
    Clock,
    Zap,
    Search,
    Bell,
    ChevronDown,
    ExternalLink,
} from "lucide-react";

// Mock data for display
const failureData = [
    { label: "Docker Timeout", count: 42, percentage: 34, color: "red" as const },
    { label: "Test Failures", count: 28, percentage: 22, color: "orange" as const },
    { label: "Build Errors", count: 18, percentage: 15, color: "yellow" as const },
    { label: "Env Config", count: 12, percentage: 10, color: "green" as const },
];

const insights = [
    {
        type: "warning" as const,
        title: "Anomaly Detected:",
        description: "Docker timeouts spiked by 200% in staging env over the last hour.",
        time: "2 mins ago",
    },
    {
        type: "info" as const,
        title: "Analysis completed for build #4822.",
        description: "Identified 2 potential fixes.",
        time: "15 mins ago",
    },
    {
        type: "success" as const,
        title: "Build #4821 flagged as flaky test (Jest).",
        description: "",
        time: "32 mins ago",
    },
];

const Index = () => {
    return (
        <div className="flex min-h-screen w-full bg-background">
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
                            JD
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Success Rate"
                            value="98.2%"
                            change="↑1.2%"
                            changeType="positive"
                            subtitle="Based on last 1,240 builds"
                            icon={CheckCircle2}
                            iconColor="text-success"
                            delay={0}
                        />
                        <StatCard
                            title="Active Incidents"
                            value="12"
                            change="+3 new"
                            changeType="negative"
                            subtitle="3 Critical"
                            icon={AlertTriangle}
                            iconColor="text-warning"
                            delay={100}
                        />
                        <StatCard
                            title="Avg. Fix Time"
                            value="14m"
                            change="↓2m"
                            changeType="positive"
                            subtitle="Faster than team avg (22m)"
                            icon={Clock}
                            iconColor="text-foreground"
                            delay={200}
                        />
                        <StatCard
                            title="AI Saved Time"
                            value="45 hrs"
                            subtitle="Estimated developer hours saved via auto-triage this week."
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
                                <Button variant="ghost" size="sm" className="text-primary text-xs">
                                    View detailed report
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                            </div>

                            <div className="space-y-5">
                                {failureData.map((item, index) => (
                                    <FailureItem
                                        key={item.label}
                                        {...item}
                                        delay={300 + index * 100}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Live Insights */}
                        <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
                            <div className="flex items-center gap-2 mb-5">
                                <Zap className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-foreground">Live Insights</h3>
                            </div>

                            <div className="space-y-4">
                                {insights.map((insight, index) => (
                                    <InsightItem
                                        key={index}
                                        {...insight}
                                        delay={400 + index * 100}
                                    />
                                ))}
                            </div>

                            <Button variant="ghost" className="w-full mt-4 text-primary text-xs">
                                View All Activity
                            </Button>
                        </div>
                    </div>

                    {/* Recent Failures Table */}
                    <RecentFailuresTable />
                </div>
            </main>
        </div>
    );
};

export default Index;

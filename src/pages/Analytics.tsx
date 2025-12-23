import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { StatCard } from "@/components/StatCard";
import { InsightItem } from "@/components/InsightItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  Clock,
  CheckCircle2,
  Activity,
  Download,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect } from "react";

const Analytics = () => {
  const [selectedDays, setSelectedDays] = useState(7);
  const [showAllStages, setShowAllStages] = useState(false);
  const { trends, categories, stats, loading, refresh } = useAnalytics(selectedDays);
  const { activity, fetchActivity } = useDashboard();

  // Fetch activity on mount
  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  console.log("activity", activity);
  // Format trends for chart (convert date to day name)
  const chartData = trends.map(t => {
    const date = new Date(t.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      date: t.date,
      total: t.total,
      failures: t.failures,
    };
  });

  // Map activity to insights format
  const insights = activity.slice(0, 3).map(item => ({
    type: item.type === "failure" ? "warning" as const : "success" as const,
    title: item.workflowName,
    description: `${item.status} on ${item.repo} (${item.branch})`,
    time: new Date(item.createdAt).toLocaleTimeString(),
  }));

  console.log("insights", insights);
  // Get failure stages data
  const stageData = categories?.byStage || [];
  const totalStageCount = stageData.reduce((sum, s) => sum + s.count, 0);

  // Get failure types data
  const typeData = categories?.byFailureType || [];
  const typeColors = ["bg-destructive", "bg-warning", "bg-primary", "bg-info"];


  console.log("average failure rate", stats);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h1 className="text-xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Deep dive into your pipeline failure trends and AI-detected anomalies.
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
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Time Selector */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {[
                { label: "24h", days: 1 },
                { label: "7d", days: 7 },
                { label: "30d", days: 30 },
              ].map(option => (
                <Button
                  key={option.days}
                  variant={selectedDays === option.days ? "default" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-3"
                  onClick={() => setSelectedDays(option.days)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Failures"
              value={stats.totalFailures.toString()}
              subtitle={`Out of ${stats.totalBuilds} builds`}
              icon={Clock}
              iconColor="text-destructive"
              delay={100}
            />
            <StatCard
              title="Total Successes"
              value={(stats.totalBuilds - stats.totalFailures).toString()}
              subtitle={`Out of ${stats.totalBuilds} builds`}
              icon={CheckCircle2}
              iconColor="text-success"
              delay={150}
            />
            <StatCard
              title="Success Rate"
              value={stats.totalBuilds > 0 ? `${(100 - stats.avgFailureRate).toFixed(1)}%` : "0%"}
              subtitle="Build success rate"
              icon={CheckCircle2}
              iconColor="text-primary"
              delay={200}
            />
            <StatCard
              title="Failure Rate"
              value={`${stats.avgFailureRate.toFixed(1)}%`}
              changeType={stats.avgFailureRate > 10 ? "negative" : "positive"}
              subtitle={`Last ${selectedDays} days`}
              icon={TrendingDown}
              iconColor={stats.avgFailureRate > 10 ? "text-destructive" : "text-success"}
              delay={0}
            />
            <StatCard
              title="Total Builds"
              value={stats.totalBuilds.toString()}
              subtitle={`Last ${selectedDays} days`}
              icon={Activity}
              iconColor="text-foreground"
              delay={300}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Failure Trends Chart */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Failure Trends</h3>
                <span className="text-xs text-muted-foreground">
                  Daily comparison of total vs. failed builds
                </span>
              </div>

              {loading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No trend data available
                </div>
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFailures" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(215, 16%, 55%)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(215, 16%, 55%)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 14%, 18%)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(160, 84%, 39%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />
                      <Area
                        type="monotone"
                        dataKey="failures"
                        stroke="hsl(0, 72%, 51%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorFailures)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Chart Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-success rounded" />
                  <span className="text-muted-foreground">Total Builds</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-destructive rounded" />
                  <span className="text-muted-foreground">Failures</span>
                </div>
              </div>
            </div>

            {/* AI Insights / Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h3 className="font-semibold text-foreground mb-2">Recent Activity</h3>
              <p className="text-xs text-muted-foreground mb-5">
                Latest workflow runs
              </p>

              {insights.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <InsightItem key={index} {...insight} delay={400 + index * 100} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Failures by Pipeline Stage */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Failures by Pipeline Stage</h3>
                <span className="text-xs text-muted-foreground">
                  {totalStageCount} total failures
                </span>
              </div>
              {stageData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No stage data available
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {(showAllStages ? stageData : stageData.slice(0, 5)).map((item, index) => {
                      const percentage = totalStageCount > 0
                        ? Math.round((item.count / totalStageCount) * 100)
                        : 0;
                      const colors = ["bg-destructive", "bg-warning", "bg-primary", "bg-info", "bg-success"];
                      const barColor = colors[index % colors.length];

                      return (
                        <div key={item.stage || index} className="group">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm text-foreground leading-relaxed flex-1 pr-4" title={item.stage}>
                              {item.stage || "Unknown Stage"}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm font-semibold text-foreground">
                                {item.count}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({percentage}%)
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {stageData.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 text-primary text-xs"
                      onClick={() => setShowAllStages(!showAllStages)}
                    >
                      {showAllStages ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          See Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          See More ({stageData.length - 5} more)
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Failure Types */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Failure Types</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Distribution of errors across all projects.
              </p>
              {typeData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No type data available
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {typeData.map((item, index) => (
                    <div key={item.type || "unknown"} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded ${typeColors[index % typeColors.length]}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.count}</p>
                        <p className="text-xs text-muted-foreground">{item.type || "Unknown"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;

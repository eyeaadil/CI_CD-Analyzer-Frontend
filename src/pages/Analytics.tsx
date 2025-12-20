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
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const chartData = [
  { name: "Mon", total: 8, failures: 2 },
  { name: "Tue", total: 12, failures: 4 },
  { name: "Wed", total: 15, failures: 3 },
  { name: "Thu", total: 10, failures: 2 },
  { name: "Fri", total: 18, failures: 14 },
  { name: "Sat", total: 8, failures: 2 },
  { name: "Sun", total: 6, failures: 1 },
];

const insights = [
  {
    type: "warning" as const,
    title: "Flaky Test Detected",
    description: "auth.spec.ts fails intermittently (15%) without code changes.",
    time: "HIGH CONFIDENCE · 2h ago",
  },
  {
    type: "info" as const,
    title: "Slow Response",
    description: "GET /orders latency spiked 340ms.",
    time: "MTT · 3h ago",
  },
  {
    type: "success" as const,
    title: "Environment Config",
    description: "Staging DB connection timeout pattern identified.",
    time: "LOW IMPACT · 5h ago",
  },
];

const Analytics = () => {
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
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project & Time Selector */}
          <div className="flex items-center justify-between">
            <Button variant="outline" className="gap-2">
              <code className="text-xs">&lt;/&gt;</code>
              frontend-react-app
              <ChevronDown className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
                24h
              </Button>
              <Button size="sm" className="text-xs h-7 px-3">
                7d
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
                30d
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
                Custom
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Failure Rate"
              value="12.5%"
              change="+2.1%"
              changeType="negative"
              subtitle="vs. previous 7 days"
              icon={TrendingDown}
              iconColor="text-destructive"
              delay={0}
            />
            <StatCard
              title="Time Saved (AI)"
              value="45m"
              change="+15m"
              changeType="positive"
              subtitle="Due to faster debugging"
              icon={Clock}
              iconColor="text-primary"
              delay={100}
            />
            <StatCard
              title="AI Accuracy"
              value="98%"
              subtitle="Based on user feedback"
              icon={CheckCircle2}
              iconColor="text-success"
              delay={200}
            />
            <StatCard
              title="Total Builds"
              value="1,204"
              change="+8%"
              changeType="positive"
              subtitle="High activity week"
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

              {/* Chart Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-primary rounded" />
                  <span className="text-muted-foreground">Total Builds</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-destructive rounded" />
                  <span className="text-muted-foreground">Failures</span>
                </div>

                {/* Friday Spike Annotation */}
                <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-lg">
                  <span className="text-xs text-warning font-medium">Friday, Oct 24</span>
                  <Badge variant="warning" className="text-[10px]">14 Failures</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    Spike due to dependency update in utils.
                  </span>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h3 className="font-semibold text-foreground mb-2">AI Insights</h3>
              <p className="text-xs text-muted-foreground mb-5">
                Anomalies detected in last 24h
              </p>

              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <InsightItem key={index} {...insight} delay={400 + index * 100} />
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-primary text-xs">
                View All Insights
              </Button>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Failures by Pipeline Stage */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Failures by Pipeline Stage</h3>
              <div className="space-y-3">
                {[
                  { stage: "Build", percentage: 12 },
                  { stage: "Test", percentage: 45 },
                  { stage: "Deploy", percentage: 28 },
                  { stage: "Integration", percentage: 15 },
                ].map((item) => (
                  <div key={item.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.stage}</span>
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failure Types */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Failure Types</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Distribution of errors across all projects.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: "Test Failures", count: 234, color: "bg-destructive" },
                  { type: "Timeout", count: 156, color: "bg-warning" },
                  { type: "Dependency", count: 89, color: "bg-primary" },
                  { type: "Config Error", count: 67, color: "bg-info" },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded ${item.color}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.count}</p>
                      <p className="text-xs text-muted-foreground">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;

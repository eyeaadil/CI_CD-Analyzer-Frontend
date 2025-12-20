import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Settings, Server } from "lucide-react";

interface FailureItemProps {
  label: string;
  count: number;
  percentage: number;
  color: "red" | "orange" | "yellow" | "green";
  delay?: number;
}

const iconMap = {
  "Docker Timeout": Clock,
  "Test Failures": AlertCircle,
  "Build Errors": Settings,
  "Env Config": Server,
};

export function FailureItem({ label, count, percentage, color, delay = 0 }: FailureItemProps) {
  const colorConfig = {
    red: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      text: "text-destructive",
      icon: "text-destructive",
      bar: "bg-destructive",
    },
    orange: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
      icon: "text-warning",
      bar: "bg-warning",
    },
    yellow: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
      icon: "text-warning",
      bar: "bg-warning/70",
    },
    green: {
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      icon: "text-success",
      bar: "bg-success",
    },
  };

  const config = colorConfig[color];
  const Icon = iconMap[label as keyof typeof iconMap] || AlertCircle;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] animate-fade-in",
        config.bg,
        config.border
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className={cn("p-2.5 rounded-lg bg-background/50", config.bg)}>
        <Icon className={cn("w-5 h-5", config.icon)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <span className={cn("text-xl font-bold", config.text)}>{count}</span>
            <span className="text-xs text-muted-foreground">failures</span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-background/50 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", config.bar)}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={cn("text-sm font-semibold min-w-[40px] text-right", config.text)}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}


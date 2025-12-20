import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className={cn("stat-card group animate-fade-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className={cn("p-1.5 rounded-lg bg-secondary", iconColor)}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground tracking-tight">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </span>
          )}
        </div>
        
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

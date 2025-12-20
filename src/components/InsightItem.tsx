import { cn } from "@/lib/utils";

interface InsightItemProps {
  type: "warning" | "info" | "success";
  title: string;
  description: string;
  time: string;
  delay?: number;
}

export function InsightItem({ type, title, description, time, delay = 0 }: InsightItemProps) {
  const dotColors = {
    warning: "bg-warning",
    info: "bg-primary",
    success: "bg-success",
  };

  const titleColors = {
    warning: "text-warning",
    info: "text-primary",
    success: "text-success",
  };

  return (
    <div 
      className="flex gap-3 animate-fade-in" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("w-2 h-2 mt-2 rounded-full flex-shrink-0", dotColors[type])} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", titleColors[type])}>{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">{time}</p>
      </div>
    </div>
  );
}

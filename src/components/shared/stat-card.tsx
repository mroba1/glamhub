import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-[hsl(38,65%,60%)]",
  className,
  prefix,
  suffix,
}: StatCardProps) {
  const TrendIcon =
    changeType === "increase" ? TrendingUp : changeType === "decrease" ? TrendingDown : Minus;

  const trendColor =
    changeType === "increase"
      ? "text-green-400"
      : changeType === "decrease"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div
      className={cn(
        "rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-6 card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[hsl(0,0%,55%)] truncate">{title}</p>
          <p className="text-2xl font-bold text-[hsl(0,0%,95%)] mt-1 font-serif">
            {prefix}{value}{suffix}
          </p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                {Math.abs(change)}% vs last month
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="h-12 w-12 rounded-xl bg-[hsl(38,65%,60%)/10%] flex items-center justify-center shrink-0 ml-4">
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}

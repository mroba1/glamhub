import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {Icon && (
        <div className="h-16 w-16 rounded-2xl bg-[hsl(38,65%,60%)/10%] flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-[hsl(38,65%,60%)]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[hsl(0,0%,80%)] mb-2 font-serif">{title}</h3>
      {description && (
        <p className="text-sm text-[hsl(0,0%,50%)] max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="gold" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

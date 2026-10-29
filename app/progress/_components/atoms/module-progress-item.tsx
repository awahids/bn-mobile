import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";
import type { ModuleProgressSummary } from "@/app/progress/_hooks/use-progress-page-data";

interface ModuleProgressItemProps {
  module: ModuleProgressSummary;
}

// Class names must be literal for Tailwind; `text-${color}` was never generated,
// so the rings and icons rendered without their color.
const COLOR_CLASSES: Record<ModuleProgressSummary["color"], { tile: string; text: string }> = {
  "chart-1": { tile: "bg-chart-1/10 text-chart-1", text: "text-chart-1" },
  "chart-2": { tile: "bg-chart-2/10 text-chart-2", text: "text-chart-2" },
  "chart-3": { tile: "bg-chart-3/10 text-chart-3", text: "text-chart-3" },
  "chart-4": { tile: "bg-chart-4/10 text-chart-4", text: "text-chart-4" },
  "chart-5": { tile: "bg-chart-5/10 text-chart-5", text: "text-chart-5" },
};

export function ModuleProgressItem({ module }: ModuleProgressItemProps) {
  const IconComponent = module.icon;
  const colors = COLOR_CLASSES[module.color];

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colors.tile)}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium">{module.module}</h4>
        <p className="text-xs text-muted-foreground">
          {module.completed}/{module.total}
        </p>
      </div>
      <ProgressRing progress={module.progress} size={36} strokeWidth={4} showValue className={colors.text} />
    </div>
  );
}

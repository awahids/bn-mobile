import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";
import type { ModuleProgressSummary } from "@/app/progress/_hooks/use-progress-page-data";

interface ModuleProgressItemProps {
  module: ModuleProgressSummary;
}

export function ModuleProgressItem({ module }: ModuleProgressItemProps) {
  const IconComponent = module.icon;

  return (
    <div className="text-center">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2", `bg-${module.color}/20`)}>
        <IconComponent className={cn("w-6 h-6", `text-${module.color}`)} />
      </div>
      <h4 className="font-medium text-sm mb-1">{module.module}</h4>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <ProgressRing progress={module.progress} size={32} className={cn(`text-${module.color}`)} />
        <span className="text-xs font-medium">{module.progress}%</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {module.completed}/{module.total}
      </p>
    </div>
  );
}

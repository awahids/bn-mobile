import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StickyPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function StickyPageHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  className,
  contentClassName,
}: StickyPageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border safe-p-top", className)}>
      <div className={cn("flex items-center justify-between p-4", contentClassName)}>
        <div className="flex items-center space-x-3">
          {leftSlot}
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>

        {rightSlot}
      </div>
    </header>
  );
}

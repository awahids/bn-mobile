import { type ReactNode } from "react";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { cn } from "@/lib/utils";

interface PageLoadingStateProps {
  bottomNav?: ReactNode;
  className?: string;
}

export function PageLoadingState({ bottomNav, className }: PageLoadingStateProps) {
  return (
    <MobilePageShell>
      <div className={cn("flex items-center justify-center min-h-screen", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
      {bottomNav}
    </MobilePageShell>
  );
}

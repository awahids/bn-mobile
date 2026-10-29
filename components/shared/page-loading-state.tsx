import { type ReactNode } from "react";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PageLoadingStateProps {
  /** Page title shown in the header while data loads, so the page paints text right away. */
  title?: ReactNode;
  subtitle?: ReactNode;
  bottomNav?: ReactNode;
  className?: string;
}

export function PageLoadingState({ title, subtitle, bottomNav, className }: PageLoadingStateProps) {
  return (
    <MobilePageShell>
      {title ? <StickyPageHeader title={title} subtitle={subtitle} /> : null}
      <div className={cn("space-y-4 p-4", !title && "pt-6", className)} aria-busy="true" aria-live="polite">
        <span className="sr-only">Memuat…</span>
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
      </div>
      {bottomNav}
    </MobilePageShell>
  );
}

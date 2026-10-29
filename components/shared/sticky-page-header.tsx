import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/ui/progress-ring";

interface StickyPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Renders the standard round back button. Ignored when `leftSlot` is set. */
  onBack?: () => void;
  leftSlot?: ReactNode;
  /** Shows a small progress ring (0-100) before `rightSlot`. */
  progress?: number;
  rightSlot?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function HeaderIconButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}

export function StickyPageHeader({
  title,
  subtitle,
  onBack,
  leftSlot,
  progress,
  rightSlot,
  className,
  contentClassName,
}: StickyPageHeaderProps) {
  const left =
    leftSlot ??
    (onBack ? (
      <HeaderIconButton onClick={onBack} aria-label="Kembali" data-testid="back-button">
        <ArrowLeft className="h-5 w-5" />
      </HeaderIconButton>
    ) : null);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md",
        className
      )}
    >
      <div className={cn("flex items-center gap-3 px-4 py-3", contentClassName)}>
        {left}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {typeof progress === "number" ? <ProgressRing progress={progress} size={40} strokeWidth={4} showValue /> : null}
        {rightSlot}
      </div>
    </header>
  );
}

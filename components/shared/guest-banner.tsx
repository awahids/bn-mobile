import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuestBannerProps {
  message: string;
  actionLabel?: string;
  onLogin: () => void;
  className?: string;
}

/** Compact "you're browsing as a guest" notice with a sign-in action. */
export function GuestBanner({ message, actionLabel = "Masuk", onLogin, className }: GuestBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3",
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserRound className="h-4 w-4" />
      </div>
      <p className="min-w-0 flex-1 text-xs leading-snug text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onLogin}
        className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {actionLabel}
      </button>
    </div>
  );
}

import { Moon, Sun } from "lucide-react";
import { GuestBanner } from "@/components/shared/guest-banner";
import { cn } from "@/lib/utils";

interface DhikrHeroSectionProps {
  isAuthenticated: boolean;
  currentSession: "morning" | "evening";
  totalCompleted: number;
  totalDhikr: number;
  completionPercentage: number;
  onLogin: () => void;
}

export function DhikrHeroSection({
  isAuthenticated,
  currentSession,
  totalCompleted,
  totalDhikr,
  completionPercentage,
  onLogin,
}: DhikrHeroSectionProps) {
  const isMorning = currentSession === "morning";
  const isDone = completionPercentage === 100;

  return (
    <section className="space-y-3 px-4 pb-4 pt-4">
      {!isAuthenticated ? (
        <GuestBanner message="Mode tamu: hitungan dzikir tidak tersimpan." onLogin={onLogin} />
      ) : null}

      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
              isMorning ? "bg-accent/15 text-accent" : "bg-chart-3/10 text-chart-3"
            )}
          >
            {isMorning ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold tracking-tight">Dzikir {isMorning ? "Pagi" : "Petang"}</h2>
            <p className="text-xs text-muted-foreground">
              {isDone ? "Alhamdulillah, semua dzikir selesai" : "Kumpulkan pahala hari ini"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold tabular-nums text-primary">{totalCompleted}</span>
            <span className="text-sm text-muted-foreground">/{totalDhikr}</span>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}

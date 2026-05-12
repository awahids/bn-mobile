import { ArrowLeft } from "lucide-react";
import { LazyProgressRing } from "@/components/lazy";
import { Button } from "@/components/ui/button";

interface TajwidHeaderProps {
  completedCount: number;
  totalRules: number;
  overallProgress: number;
  onBackHome: () => void;
}

export function TajwidHeader({
  completedCount,
  totalRules,
  overallProgress,
  onBackHome,
}: TajwidHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-chart-2/10 bg-background/90 backdrop-blur-md safe-p-top">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackHome}
              className="rounded-2xl bg-chart-2/10 hover:bg-chart-2/15"
              data-testid="back-home"
            >
              <ArrowLeft className="h-5 w-5 text-chart-2" />
            </Button>

            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground">
                Tajwid Interaktif
              </h1>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                {completedCount}/{totalRules} aturan dipelajari
              </p>
            </div>
          </div>

          <div className="relative flex h-11 w-11 items-center justify-center">
            <LazyProgressRing
              progress={overallProgress}
              size={44}
              className="text-chart-2 opacity-25"
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-chart-2">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

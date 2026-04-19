import { ArrowLeft, RotateCcw } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";

interface DhikrHeaderProps {
  greeting: string;
  totalCompleted: number;
  totalDhikr: number;
  completionPercentage: number;
  onBackHome: () => void;
  onResetAll: () => void;
}

export function DhikrHeader({
  greeting,
  totalCompleted,
  totalDhikr,
  completionPercentage,
  onBackHome,
  onResetAll,
}: DhikrHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackHome}
            className="rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors"
            data-testid="back-home"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">{greeting}</h1>
            <div className="flex items-center space-x-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {totalCompleted}/{totalDhikr} SELESAI
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <ProgressRing
              progress={completionPercentage}
              size={40}
              strokeWidth={3}
              className="text-primary opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primary">
              {completionPercentage}%
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetAll}
            className="rounded-2xl bg-accent/5 hover:bg-accent/10 transition-colors"
            data-testid="reset-all"
          >
            <RotateCcw className="w-4 h-4 text-accent" />
          </Button>
        </div>
      </div>
    </header>
  );
}

import { ArrowLeft, RotateCcw } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-sm safe-p-top">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackHome}
            className="rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 w-10 h-10"
            data-testid="back-home"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-black text-foreground tracking-tight leading-none mb-1">{greeting}</h1>
            <div className="flex items-center space-x-2">
              <span className={`flex h-2 w-2 rounded-full ${completionPercentage === 100 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]' : 'bg-primary animate-pulse'}`} />
              <p className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-widest leading-none">
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
              strokeWidth={4}
              className={`${completionPercentage === 100 ? 'text-primary' : 'text-primary opacity-20'}`}
            />
            <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${completionPercentage === 100 ? 'text-primary animate-bounce' : 'text-primary'}`}>
              {completionPercentage}%
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetAll}
            className="rounded-xl bg-accent/10 hover:bg-accent/20 transition-all duration-300 w-9 h-9"
            data-testid="reset-all"
          >
            <RotateCcw className="w-4 h-4 text-accent" />
          </Button>
        </div>
      </div>
    </header>
  );
}

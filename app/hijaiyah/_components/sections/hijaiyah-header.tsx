import { ArrowLeft } from "lucide-react";
import { LazyProgressRing } from "@/components/lazy";
import { Button } from "@/components/ui/button";

interface HijaiyahHeaderProps {
  completedCount: number;
  overallProgress: number;
  onBackHome: () => void;
}

export function HijaiyahHeader({ completedCount, overallProgress, onBackHome }: HijaiyahHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/10 safe-p-top">
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
            <h1 className="text-xl font-black text-foreground tracking-tight">Huruf Hijaiyah</h1>
            <div className="flex items-center space-x-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {completedCount}/28 HURUF SELESAI
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <LazyProgressRing progress={overallProgress} size={40} className="text-primary opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primary">
              {overallProgress}%
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

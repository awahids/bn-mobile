import { Flame } from "lucide-react";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";

interface ProgressHeaderProps {
  streak: number;
  onBackHome: () => void;
}

export function ProgressHeader({ streak, onBackHome }: ProgressHeaderProps) {
  return (
    <StickyPageHeader
      title="Progress Belajar"
      subtitle="Statistik pembelajaran Anda"
      onBack={onBackHome}
      rightSlot={
        <div
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5"
          aria-label={`Streak ${streak} hari`}
        >
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold tabular-nums">{streak}</span>
        </div>
      }
    />
  );
}

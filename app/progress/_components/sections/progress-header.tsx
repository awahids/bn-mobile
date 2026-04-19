import { ArrowLeft, Flame } from "lucide-react";
import { StickyPageHeader } from "@/components/page-atoms/sticky-page-header";
import { Button } from "@/components/ui/button";

interface ProgressHeaderProps {
  streak: number;
  onBackHome: () => void;
}

export function ProgressHeader({ streak, onBackHome }: ProgressHeaderProps) {
  return (
    <StickyPageHeader
      title="Progress Belajar"
      subtitle="Statistik pembelajaran Anda"
      leftSlot={
        <Button variant="ghost" size="icon" onClick={onBackHome} data-testid="back-home">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      rightSlot={
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-lg font-bold text-orange-500">{streak}</span>
        </div>
      }
    />
  );
}

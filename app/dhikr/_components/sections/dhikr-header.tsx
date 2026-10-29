import { RotateCcw } from "lucide-react";
import { HeaderIconButton, StickyPageHeader } from "@/components/shared/sticky-page-header";

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
    <StickyPageHeader
      title={greeting}
      subtitle={`${totalCompleted}/${totalDhikr} dzikir selesai`}
      onBack={onBackHome}
      progress={completionPercentage}
      rightSlot={
        <HeaderIconButton onClick={onResetAll} aria-label="Ulangi semua hitungan" data-testid="reset-all">
          <RotateCcw className="h-4 w-4" />
        </HeaderIconButton>
      }
    />
  );
}

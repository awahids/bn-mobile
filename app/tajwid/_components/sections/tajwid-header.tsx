import { StickyPageHeader } from "@/components/shared/sticky-page-header";

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
    <StickyPageHeader
      title="Tajwid Interaktif"
      subtitle={`${completedCount}/${totalRules} aturan dipelajari`}
      onBack={onBackHome}
      progress={overallProgress}
    />
  );
}

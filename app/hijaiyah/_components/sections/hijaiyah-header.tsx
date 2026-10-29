import { StickyPageHeader } from "@/components/shared/sticky-page-header";

interface HijaiyahHeaderProps {
  completedCount: number;
  overallProgress: number;
  onBackHome: () => void;
}

export function HijaiyahHeader({ completedCount, overallProgress, onBackHome }: HijaiyahHeaderProps) {
  return (
    <StickyPageHeader
      title="Huruf Hijaiyah"
      subtitle={`${completedCount}/28 huruf selesai`}
      onBack={onBackHome}
      progress={overallProgress}
    />
  );
}

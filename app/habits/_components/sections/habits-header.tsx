"use client";

import { StickyPageHeader } from "@/components/shared/sticky-page-header";

interface HabitsHeaderProps {
  rate: number;
  onBack: () => void;
}

export function HabitsHeader({ rate, onBack }: HabitsHeaderProps) {
  return (
    <StickyPageHeader
      title="Habits"
      subtitle="Kebiasaan baik harian"
      onBack={onBack}
      progress={rate}
    />
  );
}

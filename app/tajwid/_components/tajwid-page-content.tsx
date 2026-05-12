"use client";

import { useRouter } from "next/navigation";
import { LazyBottomNavigation } from "@/components/lazy";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { useTajwidPageController } from "@/app/tajwid/_hooks/use-tajwid-page-controller";
import { TajwidHeader } from "@/app/tajwid/_components/sections/tajwid-header";
import { TajwidLearnSection } from "@/app/tajwid/_components/sections/tajwid-learn-section";
import { TajwidOverviewSection } from "@/app/tajwid/_components/sections/tajwid-overview-section";
import { TajwidQuickSwitch } from "@/app/tajwid/_components/sections/tajwid-quick-switch";
import { TajwidAudioPlayer } from "@/app/tajwid/_components/sections/tajwid-audio-player";

export function TajwidPageContent() {
  const router = useRouter();
  const {
    rules,
    selectedRule,
    setSelectedRule,
    selectedRuleIndex,
    selectedRuleProgress,
    currentTab,
    setCurrentTab,
    audioPlayerVisible,
    setAudioPlayerVisible,
    audio,
    completedCount,
    totalRules,
    overallProgress,
    getRuleProgress,
    navigateToRule,
    openAudioPlayer,
  } = useTajwidPageController();

  if (!selectedRule) {
    return null;
  }

  return (
    <MobilePageShell className="pb-32 overflow-x-hidden">
      <TajwidHeader
        completedCount={completedCount}
        totalRules={totalRules}
        overallProgress={overallProgress}
        onBackHome={() => router.push("/")}
      />

      {currentTab === "learn" && (
        <TajwidLearnSection
          selectedRule={selectedRule}
          selectedIndex={selectedRuleIndex}
          totalRules={rules.length}
          isCompleted={selectedRuleProgress.completed}
          onPrevRule={() => navigateToRule("prev")}
          onNextRule={() => navigateToRule("next")}
          onPlayAudio={() => openAudioPlayer(selectedRule)}
        />
      )}

      {currentTab === "overview" && (
        <TajwidOverviewSection
          rules={rules}
          selectedRule={selectedRule}
          getRuleProgress={getRuleProgress}
          onSelectRule={(rule) => {
            setSelectedRule(rule);
            setCurrentTab("learn");
          }}
        />
      )}

      <TajwidQuickSwitch currentTab={currentTab} onChangeTab={setCurrentTab} />

      <TajwidAudioPlayer
        isVisible={audioPlayerVisible}
        selectedRule={selectedRule}
        audio={audio}
        onClose={() => setAudioPlayerVisible(false)}
      />

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}

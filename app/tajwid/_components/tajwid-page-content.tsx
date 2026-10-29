"use client";

import { useRouter } from "next/navigation";
import { LazyBottomNavigation } from "@/components/lazy";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { PageLoadingState } from "@/components/shared/page-loading-state";
import { useTajwidPageController } from "@/app/tajwid/_hooks/use-tajwid-page-controller";
import { TajwidHeader } from "@/app/tajwid/_components/sections/tajwid-header";
import { TajwidLearnSection } from "@/app/tajwid/_components/sections/tajwid-learn-section";
import { TajwidOverviewSection } from "@/app/tajwid/_components/sections/tajwid-overview-section";
import { TajwidQuizSection } from "@/app/tajwid/_components/sections/tajwid-quiz-section";
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
    openExampleAudio,
    loadingExampleAudioKey,
  } = useTajwidPageController();

  if (!selectedRule) {
    // Rules come from the API; show the page skeleton instead of a blank screen.
    return <PageLoadingState bottomNav={<LazyBottomNavigation />} />;
  }

  return (
    <MobilePageShell className="pb-44 overflow-x-hidden">
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
          onOpenQuiz={() => setCurrentTab("quiz")}
          onPlayExampleAudio={openExampleAudio}
          loadingExampleAudioKey={loadingExampleAudioKey}
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

      {currentTab === "quiz" && <TajwidQuizSection rules={rules} />}

      <TajwidQuickSwitch currentTab={currentTab} onChangeTab={setCurrentTab} />

      <TajwidAudioPlayer
        isVisible={audioPlayerVisible}
        audio={audio}
        onClose={() => setAudioPlayerVisible(false)}
      />

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}

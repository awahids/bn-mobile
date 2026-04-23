"use client";

import { useRouter } from "next/navigation";
import { isApiError } from "@/lib/api-client";
import { usePreloadOnHover } from "@/lib/lazy-loading";
import { preloadComponents, LazyBottomNavigation } from "@/components/lazy";
import { AuthError, NetworkError } from "@/components/shared/error-boundary";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { PageLoadingState } from "@/components/shared/page-loading-state";
import { useDhikrPageController } from "@/app/dhikr/_hooks/use-dhikr-page-controller";
import { DhikrHeader } from "@/app/dhikr/_components/sections/dhikr-header";
import { DhikrHeroSection } from "@/app/dhikr/_components/sections/dhikr-hero-section";
import { DhikrSessionTabs } from "@/app/dhikr/_components/sections/dhikr-session-tabs";
import { DhikrListSection } from "@/app/dhikr/_components/sections/dhikr-list-section";
import { DhikrCompletionCard } from "@/app/dhikr/_components/sections/dhikr-completion-card";
import { DhikrAudioPlayer } from "@/app/dhikr/_components/sections/dhikr-audio-player";

export function DhikrPageContent() {
  const router = useRouter();
  const {
    status,
    isAuthenticated,
    currentSession,
    setCurrentSession,
    audioPlayerVisible,
    setAudioPlayerVisible,
    setSelectedDhikr,
    countersError,
    audio,
    currentDhikrList,
    totalCompleted,
    completionPercentage,
    timeBasedGreeting,
    getCounterData,
    handleCounterUpdate,
    resetAllCounters,
    playAudio,
    selectedDhikrTitle,
    selectedDhikrAudioUrl,
    isLoadingDhikrs,
  } = useDhikrPageController();

  const audioPlayerPreloadProps = usePreloadOnHover(preloadComponents.audioPlayer);
  const dhikrCounterPreloadProps = usePreloadOnHover(preloadComponents.dhikrCounter);

  if (status === "loading" || isLoadingDhikrs) {
    return <PageLoadingState bottomNav={<LazyBottomNavigation />} />;
  }

  if (isAuthenticated && countersError && isApiError(countersError) && countersError.status === 401) {
    return <AuthError />;
  }

  if (isAuthenticated && countersError && isApiError(countersError) && countersError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />;
  }

  return (
    <MobilePageShell className="pb-32 overflow-x-hidden">
      <DhikrHeader
        greeting={timeBasedGreeting}
        totalCompleted={totalCompleted}
        totalDhikr={currentDhikrList.length}
        completionPercentage={completionPercentage}
        onBackHome={() => router.push("/")}
        onResetAll={resetAllCounters}
      />

      <DhikrHeroSection
        isAuthenticated={isAuthenticated}
        currentSession={currentSession}
        totalCompleted={totalCompleted}
        totalDhikr={currentDhikrList.length}
        completionPercentage={completionPercentage}
        onLogin={() => router.push("/login?callbackUrl=/dhikr")}
      />

      <DhikrSessionTabs currentSession={currentSession} onChangeSession={setCurrentSession} />

      <DhikrListSection
        dhikrList={currentDhikrList}
        getCounterData={getCounterData}
        audioPlayerPreloadProps={audioPlayerPreloadProps}
        dhikrCounterPreloadProps={dhikrCounterPreloadProps}
        onPlayDhikr={(dhikr) => {
          playAudio(dhikr.audioUrl || "");
          setSelectedDhikr(dhikr.id);
        }}
        onUpdateCounter={handleCounterUpdate}
      />

      {completionPercentage === 100 && <DhikrCompletionCard />}

      <DhikrAudioPlayer
        title={selectedDhikrTitle}
        audioUrl={selectedDhikrAudioUrl}
        isVisible={audioPlayerVisible}
        audio={audio}
        onClose={() => setAudioPlayerVisible(false)}
      />

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}

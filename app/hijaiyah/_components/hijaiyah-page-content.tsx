"use client";

import { useRouter } from "next/navigation";
import { LazyBottomNavigation, preloadComponents } from "@/components/lazy";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { usePreloadOnHover } from "@/lib/lazy-loading";
import { useHijaiyahPageController } from "@/app/hijaiyah/_hooks/use-hijaiyah-page-controller";
import { HijaiyahHeader } from "@/app/hijaiyah/_components/sections/hijaiyah-header";
import { HijaiyahHeroSection } from "@/app/hijaiyah/_components/sections/hijaiyah-hero-section";
import { HijaiyahOverviewSection } from "@/app/hijaiyah/_components/sections/hijaiyah-overview-section";
import { HijaiyahLearnSection } from "@/app/hijaiyah/_components/sections/hijaiyah-learn-section";
import { HijaiyahQuickSwitch } from "@/app/hijaiyah/_components/sections/hijaiyah-quick-switch";
import { HijaiyahAudioPlayer } from "@/app/hijaiyah/_components/sections/hijaiyah-audio-player";

export function HijaiyahPageContent() {
  const router = useRouter();
  const {
    isGuestMode,
    selectedLetter,
    setSelectedLetter,
    currentTab,
    setCurrentTab,
    audioPlayerVisible,
    setAudioPlayerVisible,
    writingCompleted,
    setWritingCompleted,
    writingCanvasRef,
    audio,
    getLetterProgress,
    handleLetterComplete,
    playAudio,
    navigateToLetter,
    letterProgress,
    completedCount,
    overallProgress,
  } = useHijaiyahPageController();

  const audioPlayerPreloadProps = usePreloadOnHover(preloadComponents.audioPlayer);
  const writingCanvasPreloadProps = usePreloadOnHover(preloadComponents.writingCanvas);

  return (
    <MobilePageShell className="pb-32 overflow-x-hidden">
      <HijaiyahHeader
        completedCount={completedCount}
        overallProgress={overallProgress}
        onBackHome={() => router.push("/")}
      />

      <HijaiyahHeroSection
        isGuestMode={isGuestMode}
        onLogin={() => router.push("/login?callbackUrl=/hijaiyah")}
      />

      {currentTab === "overview" && (
        <HijaiyahOverviewSection
          selectedLetter={selectedLetter}
          getLetterProgress={getLetterProgress}
          onSelectLetter={(letter) => {
            setSelectedLetter(letter);
            setCurrentTab("learn");
          }}
        />
      )}

      {currentTab === "learn" && (
        <HijaiyahLearnSection
          selectedLetter={selectedLetter}
          writingCompleted={writingCompleted}
          letterCompleted={letterProgress.completed}
          writingCanvasRef={writingCanvasRef}
          audioPlayerPreloadProps={audioPlayerPreloadProps}
          writingCanvasPreloadProps={writingCanvasPreloadProps}
          onPrevLetter={() => navigateToLetter("prev")}
          onNextLetter={() => navigateToLetter("next")}
          onPlayAudio={() => playAudio(selectedLetter.audioUrl)}
          onWritingComplete={() => {
            setWritingCompleted(true);
            if (!letterProgress.completed) {
              handleLetterComplete(selectedLetter.id, 85);
            }
          }}
          onResetWriting={() => {
            setWritingCompleted(false);
            writingCanvasRef.current?.clearCanvas();
          }}
        />
      )}

      <HijaiyahQuickSwitch currentTab={currentTab} onChangeTab={setCurrentTab} />

      <HijaiyahAudioPlayer
        isVisible={audioPlayerVisible}
        selectedLetter={selectedLetter}
        audio={audio}
        onClose={() => setAudioPlayerVisible(false)}
      />

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}

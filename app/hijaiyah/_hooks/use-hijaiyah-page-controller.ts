import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAudio } from "@/hooks/use-audio";
import { usePreferences } from "@/hooks/use-preferences";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { useHijaiyahLetters } from "@/hooks/use-hijaiyah";
import type { HijaiyahLetterAPI } from "@/lib/api-core";
import type { WritingCanvasRef } from "@/components/features/hijaiyah/writing-canvas";

export function useHijaiyahPageController() {
  const { status, isAuthenticated } = useAuth();
  const { data: letters = [] } = useHijaiyahLetters();
  const [pickedLetter, setSelectedLetter] = useState<HijaiyahLetterAPI | null>(null);
  // Default to the first letter during render (not in an effect) so the page is
  // server-rendered with content instead of an empty shell until hydration.
  const selectedLetter = pickedLetter ?? letters[0] ?? null;
  const [currentTab, setCurrentTab] = useState<"learn" | "overview">("learn");
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [writingCompleted, setWritingCompleted] = useState(false);
  const [guestCompletedLetters, setGuestCompletedLetters] = useState<string[]>([]);
  const writingCanvasRef = useRef<WritingCanvasRef>(null);

  const { data: progressData = [] } = useProgress("hijaiyah", {
    enabled: status === "authenticated",
  });
  const updateProgress = useUpdateProgress();
  const audio = useAudio();
  const { preferences } = usePreferences();
  const lastAutoPlayedLetterIdRef = useRef<string | null>(null);

  const isGuestMode = status !== "loading" && !isAuthenticated;

  const getLetterProgress = (letterId: string) => {
    if (!isAuthenticated) {
      const completed = guestCompletedLetters.includes(letterId);
      return {
        progress: completed ? 100 : 0,
        completed,
        score: completed ? 85 : 0,
      };
    }

    const progress = progressData.find((p) => p.itemId === letterId);
    return {
      progress: progress?.progress || 0,
      completed: progress?.completed || false,
      score: progress?.score || 0,
    };
  };

  const handleLetterComplete = async (letterId: string, score: number = 100) => {
    if (!isAuthenticated) {
      setGuestCompletedLetters((prev) => (prev.includes(letterId) ? prev : [...prev, letterId]));
      return;
    }

    await updateProgress.mutateAsync({
      module: "hijaiyah",
      itemId: letterId,
      progress: 100,
      completed: true,
      score,
      timeSpent: 0,
    });
  };

  const playAudio = (audioUrl: string) => {
    audio.play(audioUrl);
    setAudioPlayerVisible(true);
  };

  // Auto-play the pronunciation when the user moves to another letter. The first
  // letter shown on page load is skipped so audio never starts unprompted.
  useEffect(() => {
    if (!selectedLetter) return;
    const previousId = lastAutoPlayedLetterIdRef.current;
    lastAutoPlayedLetterIdRef.current = selectedLetter.id;
    if (previousId === null || previousId === selectedLetter.id) return;
    if (!preferences.autoPlayAudio || !preferences.audioEnabled || !selectedLetter.audioUrl) return;

    void audio.play(selectedLetter.audioUrl);
    setAudioPlayerVisible(true);
    // Only react to letter changes; audio/preferences identity must not replay it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLetter?.id]);

  const navigateToLetter = (direction: "prev" | "next") => {
    if (!selectedLetter) return;
    const currentIndex = letters.findIndex((l) => l.id === selectedLetter.id);
    if (direction === "prev" && currentIndex > 0) {
      setSelectedLetter(letters[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < letters.length - 1) {
      setSelectedLetter(letters[currentIndex + 1]);
    }
    setWritingCompleted(false);
  };

  const letterProgress = selectedLetter ? getLetterProgress(selectedLetter.id) : { progress: 0, completed: false, score: 0 };

  const completedCount = isAuthenticated
    ? progressData.filter((p) => p.completed).length
    : guestCompletedLetters.length;
  const totalLetters = letters.length || 28;
  const overallProgress = Math.round((completedCount / totalLetters) * 100);

  return {
    status,
    isAuthenticated,
    isGuestMode,
    letters,
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
  };
}

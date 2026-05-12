import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { QuranAyah, QuranSurah } from "@/data/quran";
import { createHafalanProgressEntry, type HafalanProgressMap } from "@/lib/hafalan-storage";

interface QuranHafalanSectionProps {
  surahs: QuranSurah[];
  selectedSurahId: number | null;
  onSelectSurah: (surahId: number) => void;
  ayahs: QuranAyah[];
  ayahsLoading: boolean;
  progressMap: HafalanProgressMap;
  onUpdateAyahProgress: (itemId: string, nextConsecutiveCorrect: number) => Promise<void> | void;
  onResetSurah: (surahId: number, ayahNumbers: number[]) => Promise<void> | void;
  onPlayAyah: (ayah: QuranAyah) => void;
}

function deterministicScore(seed: number, index: number): number {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function maskAyahText(text: string, hiddenWordCount: number, seed: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || hiddenWordCount <= 0) {
    return text;
  }

  const count = Math.min(hiddenWordCount, words.length);
  const rankedIndices = words
    .map((_, index) => ({
      index,
      score: deterministicScore(seed, index),
    }))
    .sort((left, right) => left.score - right.score)
    .slice(0, count)
    .map((item) => item.index);

  const hiddenIndexSet = new Set(rankedIndices);
  return words
    .map((word, index) => (hiddenIndexSet.has(index) ? "ــــ" : word))
    .join(" ");
}

export function QuranHafalanSection({
  surahs,
  selectedSurahId,
  onSelectSurah,
  ayahs,
  ayahsLoading,
  progressMap,
  onUpdateAyahProgress,
  onResetSurah,
  onPlayAyah,
}: QuranHafalanSectionProps) {
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [hideWordsEnabled, setHideWordsEnabled] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Keep a ref so the effect below can read the latest progressMap without
  // subscribing to it as a dependency — prevents the effect from re-running
  // (and re-jumping the ayah index) every time the user answers an ayah.
  const progressMapRef = useRef(progressMap);
  progressMapRef.current = progressMap;

  useEffect(() => {
    if (!selectedSurahId || ayahs.length === 0) {
      setCurrentAyahIndex(0);
      setIsAnswerRevealed(false);
      return;
    }

    const firstIncompleteIndex = ayahs.findIndex((ayah) => {
      const itemId = `${selectedSurahId}:${ayah.number}`;
      return !progressMapRef.current[itemId]?.completed;
    });

    if (firstIncompleteIndex === -1) {
      setCurrentAyahIndex(Math.max(0, ayahs.length - 1));
    } else {
      setCurrentAyahIndex(firstIncompleteIndex);
    }
    setIsAnswerRevealed(false);
    // progressMap intentionally excluded — changes during active practice must
    // not re-jump the index; handleSelfCheck + moveNextAyah own that navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayahs, selectedSurahId]);

  const selectedSurah = useMemo(
    () => surahs.find((surah) => surah.id === selectedSurahId) ?? null,
    [selectedSurahId, surahs]
  );

  const currentAyah = ayahs[currentAyahIndex] ?? null;
  const currentItemId = selectedSurahId && currentAyah
    ? `${selectedSurahId}:${currentAyah.number}`
    : null;
  const currentProgressEntry = currentItemId
    ? progressMap[currentItemId] ?? createHafalanProgressEntry()
    : createHafalanProgressEntry();

  const completedCount = useMemo(() => {
    if (!selectedSurahId || ayahs.length === 0) {
      return 0;
    }

    return ayahs.reduce((count, ayah) => {
      const itemId = `${selectedSurahId}:${ayah.number}`;
      return progressMap[itemId]?.completed ? count + 1 : count;
    }, 0);
  }, [ayahs, progressMap, selectedSurahId]);

  const allCompleted = ayahs.length > 0 && completedCount === ayahs.length;
  const hiddenWordCount = Math.max(1, 1 + currentProgressEntry.consecutiveCorrect);

  const displayedAyahText = useMemo(() => {
    if (!currentAyah || !selectedSurahId || !hideWordsEnabled || isAnswerRevealed) {
      return currentAyah?.text ?? "";
    }
    const seed = selectedSurahId * 1000 + currentAyah.number;
    return maskAyahText(currentAyah.text, hiddenWordCount, seed);
  }, [
    currentAyah,
    hiddenWordCount,
    hideWordsEnabled,
    isAnswerRevealed,
    selectedSurahId,
  ]);

  const moveNextAyah = () => {
    setCurrentAyahIndex((prev) => Math.min(ayahs.length - 1, prev + 1));
  };

  const handleSelfCheck = async (isCorrect: boolean) => {
    if (!currentItemId || !currentAyah || isSubmitting) {
      return;
    }

    const nextConsecutiveCorrect = isCorrect
      ? Math.min(2, currentProgressEntry.consecutiveCorrect + 1)
      : 0;

    setIsSubmitting(true);
    try {
      await onUpdateAyahProgress(currentItemId, nextConsecutiveCorrect);
      setIsAnswerRevealed(false);
      moveNextAyah();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSurah = async () => {
    if (!selectedSurahId || ayahs.length === 0 || isResetting) {
      return;
    }

    setIsResetting(true);
    try {
      await onResetSurah(
        selectedSurahId,
        ayahs.map((ayah) => ayah.number)
      );
      setCurrentAyahIndex(0);
      setIsAnswerRevealed(false);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="px-4 pb-24 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Target Hafalan Surah Pendek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={selectedSurahId ?? ""}
            onChange={(event) => onSelectSurah(Number(event.target.value))}
          >
            {surahs.map((surah) => (
              <option key={surah.id} value={surah.id}>
                {surah.id}. {surah.name} ({surah.numberOfAyahs} ayat)
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Button
              variant={hideWordsEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setHideWordsEnabled((prev) => !prev);
                setIsAnswerRevealed(false);
              }}
            >
              {hideWordsEnabled ? "Sembunyikan kata: ON" : "Sembunyikan kata: OFF"}
            </Button>
            <Button
              variant={showTranslation ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTranslation((prev) => !prev)}
            >
              {showTranslation ? "Terjemahan: ON" : "Terjemahan: OFF"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Progress surah: {completedCount}/{ayahs.length || 0} ayat selesai
          </p>
        </CardContent>
      </Card>

      {ayahsLoading && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Memuat ayat hafalan...
          </CardContent>
        </Card>
      )}

      {!ayahsLoading && allCompleted && selectedSurah && (
        <Card className="border-chart-2/30">
          <CardHeader>
            <CardTitle className="text-xl">{selectedSurah.name} selesai dihafal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Semua ayat sudah mencapai 2x benar beruntun.
            </p>
            <Button onClick={handleResetSurah} disabled={isResetting}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {isResetting ? "Mengulang..." : "Ulangi Surah"}
            </Button>
          </CardContent>
        </Card>
      )}

      {!ayahsLoading && !allCompleted && currentAyah && selectedSurahId && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-chart-2 px-3 py-1 text-xs font-bold text-white">
                  Ayat {currentAyah.number}
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentProgressEntry.consecutiveCorrect}/2 benar beruntun
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onPlayAyah(currentAyah)}>
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-right text-2xl leading-loose font-arabic text-chart-2">
                {displayedAyahText}
              </p>
              {hideWordsEnabled && !isAnswerRevealed && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Mode latihan: {hiddenWordCount} kata disembunyikan
                </p>
              )}
            </div>

            {showTranslation && (
              <>
                <Separator className="my-3" />
                <p className="text-sm leading-relaxed">{currentAyah.translation}</p>
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!isAnswerRevealed && hideWordsEnabled && (
                <Button
                  variant="outline"
                  onClick={() => setIsAnswerRevealed(true)}
                  disabled={isSubmitting}
                >
                  Tampilkan Jawaban
                </Button>
              )}

              {(!hideWordsEnabled || isAnswerRevealed) && (
                <>
                  <Button
                    onClick={() => handleSelfCheck(true)}
                    disabled={isSubmitting}
                  >
                    Benar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelfCheck(false)}
                    disabled={isSubmitting}
                  >
                    Belum
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

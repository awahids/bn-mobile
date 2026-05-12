import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useRouter } from "next/navigation";
import { useAudio } from "@/hooks/use-audio";
import { useAuth } from "@/hooks/use-auth";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { useFilteredSurahs, useSurahAyahs, useSurahs } from "@/hooks/use-quran";
import {
  compareHafalanEntries,
  createHafalanProgressEntry,
  mergeHafalanProgressMaps,
  readHafalanProgressFromStorage,
  toHafalanEntryFromServer,
  toHafalanProgressPayload,
  type HafalanProgressMap,
  writeHafalanProgressToStorage,
} from "@/lib/hafalan-storage";
import { api, type Bookmark as ApiBookmark } from "@/lib/api-client";
import { appStore, setAppSearchQuery, setAudioPlayerVisible, setSelectedSurah } from "@/store/app-store";

export function useQuranPageController() {
  const router = useRouter();
  const { isAuthenticated, status } = useAuth();
  const queryClient = useQueryClient();
  const { searchQuery, selectedSurah, audioPlayerVisible } = useStore(appStore, (state) => state);

  const audio = useAudio();
  const [currentTab, setCurrentTab] = useState<"read" | "hafalan">("read");
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [selectedTargetSurah, setSelectedTargetSurah] = useState<number | null>(null);
  const [hafalanProgressMap, setHafalanProgressMap] = useState<HafalanProgressMap>({});
  const [hafalanHydrated, setHafalanHydrated] = useState(false);
  const syncAttemptedRef = useRef(false);
  const hafalanProgressMapRef = useRef(hafalanProgressMap);
  hafalanProgressMapRef.current = hafalanProgressMap;
  const updateProgress = useUpdateProgress();

  useEffect(() => {
    if (audio.currentSrc && !audioPlayerVisible) {
      setAudioPlayerVisible(true);
    }
  }, [audio.currentSrc, audioPlayerVisible]);

  const { data: bookmarks = [] } = useQuery<ApiBookmark[]>({
    queryKey: ["user-bookmarks", "quran"],
    queryFn: () => api.bookmarks.getBookmarks("quran"),
    enabled: status === "authenticated",
    retry: false,
  });

  const createBookmark = useMutation({
    mutationFn: (payload: { contentId: string; note?: string }) =>
      api.bookmarks.createBookmark({
        type: "quran",
        contentId: payload.contentId,
        note: payload.note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
    },
  });

  const deleteBookmark = useMutation({
    mutationFn: (bookmarkId: string) => api.bookmarks.deleteBookmark(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
    },
  });

  const isBookmarked = (surahId: number, ayahNumber?: number) => {
    const contentId = ayahNumber ? `${surahId}:${ayahNumber}` : surahId.toString();
    return bookmarks.some((bookmark) => bookmark.contentId === contentId);
  };

  const toggleBookmark = async (surahId: number, ayahNumber?: number) => {
    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/quran");
      return;
    }

    const contentId = ayahNumber ? `${surahId}:${ayahNumber}` : surahId.toString();
    const existingBookmark = bookmarks.find((bookmark) => bookmark.contentId === contentId);

    try {
      if (existingBookmark) {
        await deleteBookmark.mutateAsync(existingBookmark.id);
      } else {
        await createBookmark.mutateAsync({
          contentId,
          note: ayahNumber ? `Ayat ${ayahNumber}` : undefined,
        });
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const playAudio = (audioUrl: string, title: string, subtitle: string) => {
    audio.setMeta({ title, subtitle });
    audio.play(audioUrl);
    setAudioPlayerVisible(true);
  };

  const handleSurahSelect = (surahId: number) => {
    setSelectedSurah(surahId);
    setCurrentAyah(null);
    if (isAuthenticated) {
      updateProgress.mutate({
        module: "quran",
        itemId: surahId.toString(),
        progress: 0,
        completed: false,
      });
    }
  };

  const { data: allSurahs = [] } = useSurahs();
  const juzAmmaSurahs = useMemo(
    () => allSurahs.filter((surah) => surah.id >= 78 && surah.id <= 114),
    [allSurahs]
  );
  const selectedTargetSurahData = selectedTargetSurah
    ? allSurahs.find((surah) => surah.id === selectedTargetSurah) ?? null
    : null;

  const selectedSurahData = selectedSurah ? allSurahs.find((s) => s.id === selectedSurah) ?? null : null;
  const filteredSurahs = useFilteredSurahs(searchQuery);
  const { data: surahAyahs = [], isLoading: ayahsLoading } = useSurahAyahs(selectedSurah);
  const { data: hafalanAyahs = [], isLoading: hafalanAyahsLoading } =
    useSurahAyahs(selectedTargetSurah);

  const { data: serverHafalanProgress = [], isFetched: isHafalanProgressFetched } = useProgress(
    "hafalan",
    {
      enabled: status === "authenticated",
    }
  );

  const serverHafalanProgressMap = useMemo(() => {
    const mapped: HafalanProgressMap = {};

    serverHafalanProgress.forEach((item) => {
      mapped[item.itemId] = toHafalanEntryFromServer(item);
    });

    return mapped;
  }, [serverHafalanProgress]);

  useEffect(() => {
    const stored = readHafalanProgressFromStorage();
    setHafalanProgressMap(stored);
    setHafalanHydrated(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      syncAttemptedRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (selectedTargetSurah || juzAmmaSurahs.length === 0) {
      return;
    }
    setSelectedTargetSurah(juzAmmaSurahs[0].id);
  }, [juzAmmaSurahs, selectedTargetSurah]);

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !hafalanHydrated ||
      !isHafalanProgressFetched ||
      syncAttemptedRef.current
    ) {
      return;
    }

    syncAttemptedRef.current = true;

    void (async () => {
      const merged = mergeHafalanProgressMaps(hafalanProgressMapRef.current, serverHafalanProgressMap);
      const shouldSync = Object.entries(merged).filter(([itemId, mergedEntry]) => {
        const serverEntry = serverHafalanProgressMap[itemId];
        if (!serverEntry) {
          return true;
        }
        return compareHafalanEntries(mergedEntry, serverEntry) > 0;
      });

      for (const [itemId, mergedEntry] of shouldSync) {
        const payload = toHafalanProgressPayload(mergedEntry);
        try {
          await api.progress.updateProgress({
            module: "hafalan",
            itemId,
            progress: payload.progress,
            completed: payload.completed,
            score: payload.score,
            timeSpent: 0,
          });
        } catch (error) {
          console.error(`Failed to sync hafalan progress ${itemId}:`, error);
        }
      }

      setHafalanProgressMap(merged);
      writeHafalanProgressToStorage(merged);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    })();
    // hafalanProgressMap intentionally excluded — read via ref so the effect
    // only fires when auth/fetch state changes, not on every progress update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hafalanHydrated, isHafalanProgressFetched, queryClient, serverHafalanProgressMap, status]);

  const changeTab = (tab: "read" | "hafalan") => {
    setCurrentTab(tab);
    if (tab === "hafalan") {
      setSelectedSurah(null);
    }
  };

  const updateHafalanEntry = useCallback(
    async (itemId: string, nextConsecutiveCorrect: number) => {
      const nextEntry = createHafalanProgressEntry({
        consecutiveCorrect: nextConsecutiveCorrect,
        completed: nextConsecutiveCorrect >= 2,
        updatedAt: new Date().toISOString(),
      });

      setHafalanProgressMap((prev) => {
        const next = {
          ...prev,
          [itemId]: nextEntry,
        };
        writeHafalanProgressToStorage(next);
        return next;
      });

      if (status !== "authenticated") {
        return;
      }

      const payload = toHafalanProgressPayload(nextEntry);
      try {
        await updateProgress.mutateAsync({
          module: "hafalan",
          itemId,
          progress: payload.progress,
          completed: payload.completed,
          score: payload.score,
          timeSpent: 0,
        });
      } catch (error) {
        console.error(`Failed to update hafalan progress ${itemId}:`, error);
      }
    },
    [status, updateProgress]
  );

  const resetHafalanSurah = useCallback(
    async (surahId: number, ayahNumbers: number[]) => {
      const now = new Date().toISOString();
      const resetEntries = ayahNumbers.map((ayahNumber) => ({
        itemId: `${surahId}:${ayahNumber}`,
        entry: createHafalanProgressEntry({
          consecutiveCorrect: 0,
          completed: false,
          updatedAt: now,
        }),
      }));

      setHafalanProgressMap((prev) => {
        const next = { ...prev };
        resetEntries.forEach(({ itemId, entry }) => {
          next[itemId] = entry;
        });
        writeHafalanProgressToStorage(next);
        return next;
      });

      if (status !== "authenticated") {
        return;
      }

      for (const { itemId, entry } of resetEntries) {
        const payload = toHafalanProgressPayload(entry);
        try {
          await api.progress.updateProgress({
            module: "hafalan",
            itemId,
            progress: payload.progress,
            completed: payload.completed,
            score: payload.score,
            timeSpent: 0,
          });
        } catch (error) {
          console.error(`Failed to reset hafalan progress ${itemId}:`, error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
    [queryClient, status]
  );

  const goBackHome = () => {
    router.push("/");
  };

  return {
    searchQuery,
    currentTab,
    changeTab,
    selectedSurah,
    selectedSurahData,
    filteredSurahs,
    surahAyahs,
    ayahsLoading,
    juzAmmaSurahs,
    selectedTargetSurah,
    setSelectedTargetSurah,
    selectedTargetSurahData,
    hafalanAyahs,
    hafalanAyahsLoading,
    hafalanProgressMap,
    updateHafalanEntry,
    resetHafalanSurah,
    audioPlayerVisible,
    currentAyah,
    setCurrentAyah,
    audio,
    setAppSearchQuery,
    setSelectedSurah,
    setAudioPlayerVisible,
    isBookmarked,
    toggleBookmark,
    playAudio,
    handleSurahSelect,
    goBackHome,
    isBookmarkMutating: createBookmark.isPending || deleteBookmark.isPending,
  };
}

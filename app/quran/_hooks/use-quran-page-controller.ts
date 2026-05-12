import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useRouter } from "next/navigation";
import { useAudio } from "@/hooks/use-audio";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProgress } from "@/hooks/use-progress";
import { useFilteredSurahs, useSurahAyahs, useSurahs } from "@/hooks/use-quran";
import { api, type Bookmark as ApiBookmark } from "@/lib/api-client";
import { appStore, setAppSearchQuery, setAudioPlayerVisible, setSelectedSurah } from "@/store/app-store";

export function useQuranPageController() {
  const router = useRouter();
  const { isAuthenticated, status } = useAuth();
  const queryClient = useQueryClient();
  const { searchQuery, selectedSurah, audioPlayerVisible } = useStore(appStore, (state) => state);

  const audio = useAudio();
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
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
  const selectedSurahData = selectedSurah ? allSurahs.find((s) => s.id === selectedSurah) ?? null : null;
  const filteredSurahs = useFilteredSurahs(searchQuery);
  const { data: surahAyahs = [], isLoading: ayahsLoading } = useSurahAyahs(selectedSurah);

  const goBackHome = () => {
    router.push("/");
  };

  return {
    searchQuery,
    selectedSurah,
    selectedSurahData,
    filteredSurahs,
    surahAyahs,
    ayahsLoading,
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

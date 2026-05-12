import { useQuery } from "@tanstack/react-query";
import { fetchSurahAyahs, QuranAyah, QuranSurah, quranSurahs } from "@/data/quran";
import { api } from "@/lib/api-core";

export function useSurahs() {
  return useQuery<QuranSurah[]>({
    queryKey: ["quran", "surahs"],
    queryFn: () => api.quranContent.getSurahs() as Promise<QuranSurah[]>,
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: quranSurahs,
  });
}

export function useSurahAyahs(surahNumber: number | null) {
  return useQuery<QuranAyah[]>({
    queryKey: ["quran", "ayahs", surahNumber],
    queryFn: () => (surahNumber ? fetchSurahAyahs(surahNumber) : Promise.resolve([])),
    enabled: !!surahNumber,
  });
}

export function useFilteredSurahs(query: string) {
  const { data: surahs = [] } = useSurahs();
  
  const searchTerm = query.toLowerCase();
  return surahs.filter(surah => 
    surah.name.toLowerCase().includes(searchTerm) ||
    surah.englishName.toLowerCase().includes(searchTerm) ||
    surah.id.toString() === searchTerm
  );
}

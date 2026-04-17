import { useQuery } from "@tanstack/react-query";
import { quranSurahs, fetchSurahAyahs, QuranAyah, QuranSurah } from "@/data/quran";

export function useSurahs() {
  return useQuery<QuranSurah[]>({
    queryKey: ["quran", "surahs"],
    queryFn: async () => {
      // In a real app, this might be an API call
      // For now, we return the static data wrapped in a promise
      return quranSurahs;
    },
    staleTime: Infinity, // Surah list doesn't change
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

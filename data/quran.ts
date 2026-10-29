export interface QuranSurah {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  audioUrl?: string;
}

export interface QuranAyah {
  number: number;
  text: string;
  translation: string;
  audioUrl?: string;
}

// Fallback data for pre-login demo (5 items). Full data is served from the API.
export const quranSurahs: QuranSurah[] = [
  { id: 1, name: "Al-Faatiha", arabicName: "الفاتحة", englishName: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3" },
  { id: 2, name: "Al-Baqara", arabicName: "البقرة", englishName: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3" },
  { id: 3, name: "Aal-i-Imraan", arabicName: "آل عمران", englishName: "The Family of Imraan", numberOfAyahs: 200, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/3.mp3" },
  { id: 4, name: "An-Nisaa", arabicName: "النساء", englishName: "The Women", numberOfAyahs: 176, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/4.mp3" },
  { id: 5, name: "Al-Maaida", arabicName: "المائدة", englishName: "The Table", numberOfAyahs: 120, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/5.mp3" },
];

// API helper functions for Al Quran Cloud
export async function fetchSurahAyahs(surahNumber: number): Promise<QuranAyah[]> {
  try {
    // Fetch Arabic text with audio
    const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
    const arabicData = await arabicResponse.json();
    
    // Fetch Indonesian translation
    const indonesianResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`);
    const indonesianData = await indonesianResponse.json();
    
    if (arabicData.code === 200 && indonesianData.code === 200) {
      const ayahs = arabicData.data.ayahs.map((arabicAyah: any, index: number) => ({
        number: arabicAyah.numberInSurah,
        text: arabicAyah.text,
        translation: indonesianData.data.ayahs[index]?.text || '',
        audioUrl: arabicAyah.audio
      }));
      return ayahs;
    }
    return [];
  } catch (error) {
    console.error('Error fetching surah ayahs:', error);
    return [];
  }
}

export const getSurahById = (id: number) => {
  return quranSurahs.find(surah => surah.id === id);
};

export interface QuranDisplayReference {
  surahId: number | null;
  ayahNumber: number | null;
  title: string;
  subtitle: string;
  shortLabel: string;
  progressPercent: number;
  progressLabel: string;
}

export const parseQuranContentId = (contentId?: string | null) => {
  if (!contentId) {
    return { surahId: null, ayahNumber: null };
  }

  const [surahPart, ayahPart] = contentId.split(":");
  const parsedSurahId = Number(surahPart);
  const parsedAyah = ayahPart ? Number(ayahPart) : Number.NaN;

  const surahId = Number.isFinite(parsedSurahId) && parsedSurahId > 0 ? parsedSurahId : null;
  const ayahNumber = Number.isFinite(parsedAyah) && parsedAyah > 0 ? parsedAyah : null;

  return { surahId, ayahNumber };
};

export const getQuranDisplayReference = (contentId?: string | null): QuranDisplayReference => {
  const { surahId, ayahNumber } = parseQuranContentId(contentId);
  if (!surahId) {
    return {
      surahId: null,
      ayahNumber: null,
      title: "Al-Qur'an",
      subtitle: "Mulai dari surah pertama",
      shortLabel: "Belum ada",
      progressPercent: 0,
      progressLabel: "0%",
    };
  }

  const surah = getSurahById(surahId);
  const surahName = surah?.name || `Surah ${surahId}`;
  const totalAyahs = surah?.numberOfAyahs;

  if (ayahNumber && totalAyahs) {
    const progressPercent = Math.max(0, Math.min(100, Math.round((ayahNumber / totalAyahs) * 100)));
    return {
      surahId,
      ayahNumber,
      title: surahName,
      subtitle: `Ayat ${ayahNumber} dari ${totalAyahs}`,
      shortLabel: `${surahName} :${ayahNumber}`,
      progressPercent,
      progressLabel: `${ayahNumber}/${totalAyahs}`,
    };
  }

  return {
    surahId,
    ayahNumber: null,
    title: surahName,
    subtitle: totalAyahs ? `Surah ${surahId} • ${totalAyahs} ayat` : `Surah ${surahId}`,
    shortLabel: surahName,
    progressPercent: 0,
    progressLabel: "Tersimpan",
  };
};


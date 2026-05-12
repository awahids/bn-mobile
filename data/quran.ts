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

// Sample ayahs for Al-Fatihah with API audio URLs
export const alFatihahAyahs: QuranAyah[] = [
  {
    number: 1,
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3"
  },
  {
    number: 2,
    text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "Segala puji bagi Allah, Tuhan semesta alam.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3"
  },
  {
    number: 3,
    text: "الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "Maha Pemurah lagi Maha Penyayang.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3"
  },
  {
    number: 4,
    text: "مَالِكِ يَوْمِ الدِّينِ",
    translation: "Yang menguasai di Hari Pembalasan.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3"
  },
  {
    number: 5,
    text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation: "Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3"
  },
  {
    number: 6,
    text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translation: "Tunjukilah kami jalan yang lurus,",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3"
  },
  {
    number: 7,
    text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translation: "(yaitu) Jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3"
  }
];

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

export const searchSurahs = (query: string) => {
  const searchTerm = query.toLowerCase();
  return quranSurahs.filter(surah => 
    surah.name.toLowerCase().includes(searchTerm) ||
    surah.englishName.toLowerCase().includes(searchTerm) ||
    surah.id.toString() === searchTerm
  );
};

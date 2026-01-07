export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  count: number;
  session: 'morning' | 'evening' | 'both';
  category: string;
  audioUrl?: string;
  reference?: string;
}

export const dhikrData: DhikrItem[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "Subhanallah",
    translation: "Subhanallah",
    meaning: "Maha Suci Allah",
    count: 33,
    session: "both",
    category: "Tasbih",
    audioUrl: "/audio/dhikr/subhanallah.mp3",
    reference: "HR. Muslim"
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillahi",
    translation: "Alhamdulillah",
    meaning: "Segala puji bagi Allah",
    count: 33,
    session: "both",
    category: "Tahmid",
    audioUrl: "/audio/dhikr/alhamdulillah.mp3",
    reference: "HR. Muslim"
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allahu Akbar",
    meaning: "Allah Maha Besar",
    count: 34,
    session: "both",
    category: "Takbir",
    audioUrl: "/audio/dhikr/allahuakbar.mp3",
    reference: "HR. Muslim"
  },
  {
    id: "istighfar",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullah al-'azhim alladzi la ilaha illa huwa al-hayy al-qayyum wa atubu ilaih",
    translation: "Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup, Yang Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya",
    meaning: "Doa Istighfar",
    count: 100,
    session: "both",
    category: "Istighfar",
    audioUrl: "/audio/dhikr/istighfar.mp3",
    reference: "HR. Abu Dawud"
  },
  {
    id: "salawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    transliteration: "Allahumma shalli 'ala Muhammad wa 'ala ali Muhammad",
    translation: "Ya Allah, limpahkanlah rahmat kepada Muhammad dan keluarga Muhammad",
    meaning: "Shalawat kepada Nabi",
    count: 10,
    session: "both",
    category: "Shalawat",
    audioUrl: "/audio/dhikr/salawat.mp3",
    reference: "HR. Bukhari"
  },
  {
    id: "ayat-kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "Allahu la ilaha illa huwa al-hayy al-qayyum...",
    translation: "Allah, tidak ada Tuhan selain Dia, Yang Maha Hidup, Yang terus menerus mengurus makhluk-Nya...",
    meaning: "Ayat Kursi - Perlindungan dan Kekuasaan Allah",
    count: 1,
    session: "both",
    category: "Ayat Al-Qur'an",
    audioUrl: "/audio/dhikr/ayat-kursi.mp3",
    reference: "QS. Al-Baqarah: 255"
  },
  {
    id: "qul-huwa",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    transliteration: "Qul huwa Allahu ahad, Allah ash-shamad, lam yalid wa lam yulad, wa lam yakun lahu kufuwan ahad",
    translation: "Katakanlah: Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia.",
    meaning: "Surah Al-Ikhlas - Keesaan Allah",
    count: 3,
    session: "both",
    category: "Surah Pendek",
    audioUrl: "/audio/dhikr/qul-huwa.mp3",
    reference: "QS. Al-Ikhlas"
  }
];

export const getMorningDhikr = () => {
  return dhikrData.filter(item => item.session === 'morning' || item.session === 'both');
};

export const getEveningDhikr = () => {
  return dhikrData.filter(item => item.session === 'evening' || item.session === 'both');
};

export const getDhikrById = (id: string) => {
  return dhikrData.find(item => item.id === id);
};

export const getDhikrByCategory = (category: string) => {
  return dhikrData.filter(item => item.category === category);
};

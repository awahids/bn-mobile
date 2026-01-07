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

// All 114 Surahs with Al Quran Cloud API data and audio URLs
export const quranSurahs: QuranSurah[] = [
  { id: 1, name: "Al-Faatiha", arabicName: "الفاتحة", englishName: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3" },
  { id: 2, name: "Al-Baqara", arabicName: "البقرة", englishName: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3" },
  { id: 3, name: "Aal-i-Imraan", arabicName: "آل عمران", englishName: "The Family of Imraan", numberOfAyahs: 200, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/3.mp3" },
  { id: 4, name: "An-Nisaa", arabicName: "النساء", englishName: "The Women", numberOfAyahs: 176, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/4.mp3" },
  { id: 5, name: "Al-Maaida", arabicName: "المائدة", englishName: "The Table", numberOfAyahs: 120, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/5.mp3" },
  { id: 6, name: "Al-An'aam", arabicName: "الأنعام", englishName: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/6.mp3" },
  { id: 7, name: "Al-A'raaf", arabicName: "الأعراف", englishName: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/7.mp3" },
  { id: 8, name: "Al-Anfaal", arabicName: "الأنفال", englishName: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/8.mp3" },
  { id: 9, name: "At-Tawba", arabicName: "التوبة", englishName: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/9.mp3" },
  { id: 10, name: "Yunus", arabicName: "يونس", englishName: "Jonas", numberOfAyahs: 109, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/10.mp3" },
  { id: 11, name: "Hud", arabicName: "هود", englishName: "Hud", numberOfAyahs: 123, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/11.mp3" },
  { id: 12, name: "Yusuf", arabicName: "يوسف", englishName: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/12.mp3" },
  { id: 13, name: "Ar-Ra'd", arabicName: "الرعد", englishName: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/13.mp3" },
  { id: 14, name: "Ibrahim", arabicName: "إبراهيم", englishName: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/14.mp3" },
  { id: 15, name: "Al-Hijr", arabicName: "الحجر", englishName: "The Rock", numberOfAyahs: 99, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/15.mp3" },
  { id: 16, name: "An-Nahl", arabicName: "النحل", englishName: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/16.mp3" },
  { id: 17, name: "Al-Israa", arabicName: "الإسراء", englishName: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/17.mp3" },
  { id: 18, name: "Al-Kahf", arabicName: "الكهف", englishName: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3" },
  { id: 19, name: "Maryam", arabicName: "مريم", englishName: "Mary", numberOfAyahs: 98, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/19.mp3" },
  { id: 20, name: "Taa-Haa", arabicName: "طه", englishName: "Taa-Haa", numberOfAyahs: 135, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/20.mp3" },
  { id: 21, name: "Al-Anbiyaa", arabicName: "الأنبياء", englishName: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/21.mp3" },
  { id: 22, name: "Al-Hajj", arabicName: "الحج", englishName: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/22.mp3" },
  { id: 23, name: "Al-Muminoon", arabicName: "المؤمنون", englishName: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/23.mp3" },
  { id: 24, name: "An-Noor", arabicName: "النور", englishName: "The Light", numberOfAyahs: 64, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/24.mp3" },
  { id: 25, name: "Al-Furqaan", arabicName: "الفرقان", englishName: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/25.mp3" },
  { id: 26, name: "Ash-Shu'araa", arabicName: "الشعراء", englishName: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/26.mp3" },
  { id: 27, name: "An-Naml", arabicName: "النمل", englishName: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/27.mp3" },
  { id: 28, name: "Al-Qasas", arabicName: "القصص", englishName: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/28.mp3" },
  { id: 29, name: "Al-Ankaboot", arabicName: "العنكبوت", englishName: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/29.mp3" },
  { id: 30, name: "Ar-Room", arabicName: "الروم", englishName: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/30.mp3" },
  { id: 31, name: "Luqman", arabicName: "لقمان", englishName: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/31.mp3" },
  { id: 32, name: "As-Sajda", arabicName: "السجدة", englishName: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/32.mp3" },
  { id: 33, name: "Al-Ahzaab", arabicName: "الأحزاب", englishName: "The Clans", numberOfAyahs: 73, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/33.mp3" },
  { id: 34, name: "Saba", arabicName: "سبأ", englishName: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/34.mp3" },
  { id: 35, name: "Faatir", arabicName: "فاطر", englishName: "The Originator", numberOfAyahs: 45, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/35.mp3" },
  { id: 36, name: "Yaseen", arabicName: "يس", englishName: "Yaseen", numberOfAyahs: 83, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3" },
  { id: 37, name: "As-Saaffaat", arabicName: "الصافات", englishName: "Those drawn up in Ranks", numberOfAyahs: 182, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/37.mp3" },
  { id: 38, name: "Saad", arabicName: "ص", englishName: "The letter Saad", numberOfAyahs: 88, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/38.mp3" },
  { id: 39, name: "Az-Zumar", arabicName: "الزمر", englishName: "The Groups", numberOfAyahs: 75, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/39.mp3" },
  { id: 40, name: "Ghafir", arabicName: "غافر", englishName: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/40.mp3" },
  { id: 41, name: "Fussilat", arabicName: "فصلت", englishName: "Explained in detail", numberOfAyahs: 54, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/41.mp3" },
  { id: 42, name: "Ash-Shura", arabicName: "الشورى", englishName: "Consultation", numberOfAyahs: 53, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/42.mp3" },
  { id: 43, name: "Az-Zukhruf", arabicName: "الزخرف", englishName: "Ornaments of gold", numberOfAyahs: 89, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/43.mp3" },
  { id: 44, name: "Ad-Dukhaan", arabicName: "الدخان", englishName: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/44.mp3" },
  { id: 45, name: "Al-Jaathiya", arabicName: "الجاثية", englishName: "Crouching", numberOfAyahs: 37, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/45.mp3" },
  { id: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", englishName: "The Dunes", numberOfAyahs: 35, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/46.mp3" },
  { id: 47, name: "Muhammad", arabicName: "محمد", englishName: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/47.mp3" },
  { id: 48, name: "Al-Fath", arabicName: "الفتح", englishName: "The Victory", numberOfAyahs: 29, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/48.mp3" },
  { id: 49, name: "Al-Hujuraat", arabicName: "الحجرات", englishName: "The Inner Apartments", numberOfAyahs: 18, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/49.mp3" },
  { id: 50, name: "Qaaf", arabicName: "ق", englishName: "The letter Qaaf", numberOfAyahs: 45, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/50.mp3" },
  { id: 51, name: "Adh-Dhaariyat", arabicName: "الذاريات", englishName: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/51.mp3" },
  { id: 52, name: "At-Tur", arabicName: "الطور", englishName: "The Mount", numberOfAyahs: 49, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/52.mp3" },
  { id: 53, name: "An-Najm", arabicName: "النجم", englishName: "The Star", numberOfAyahs: 62, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/53.mp3" },
  { id: 54, name: "Al-Qamar", arabicName: "القمر", englishName: "The Moon", numberOfAyahs: 55, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/54.mp3" },
  { id: 55, name: "Ar-Rahmaan", arabicName: "الرحمن", englishName: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3" },
  { id: 56, name: "Al-Waaqia", arabicName: "الواقعة", englishName: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/56.mp3" },
  { id: 57, name: "Al-Hadid", arabicName: "الحديد", englishName: "The Iron", numberOfAyahs: 29, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/57.mp3" },
  { id: 58, name: "Al-Mujaadila", arabicName: "المجادلة", englishName: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/58.mp3" },
  { id: 59, name: "Al-Hashr", arabicName: "الحشر", englishName: "The Exile", numberOfAyahs: 24, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/59.mp3" },
  { id: 60, name: "Al-Mumtahana", arabicName: "الممتحنة", englishName: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/60.mp3" },
  { id: 61, name: "As-Saff", arabicName: "الصف", englishName: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/61.mp3" },
  { id: 62, name: "Al-Jumu'a", arabicName: "الجمعة", englishName: "Friday", numberOfAyahs: 11, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/62.mp3" },
  { id: 63, name: "Al-Munaafiqoon", arabicName: "المنافقون", englishName: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/63.mp3" },
  { id: 64, name: "At-Taghaabun", arabicName: "التغابن", englishName: "Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/64.mp3" },
  { id: 65, name: "At-Talaaq", arabicName: "الطلاق", englishName: "Divorce", numberOfAyahs: 12, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/65.mp3" },
  { id: 66, name: "At-Tahrim", arabicName: "التحريم", englishName: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/66.mp3" },
  { id: 67, name: "Al-Mulk", arabicName: "الملك", englishName: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3" },
  { id: 68, name: "Al-Qalam", arabicName: "القلم", englishName: "The Pen", numberOfAyahs: 52, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/68.mp3" },
  { id: 69, name: "Al-Haaqqa", arabicName: "الحاقة", englishName: "The Reality", numberOfAyahs: 52, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/69.mp3" },
  { id: 70, name: "Al-Ma'aarij", arabicName: "المعارج", englishName: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/70.mp3" },
  { id: 71, name: "Nooh", arabicName: "نوح", englishName: "Noah", numberOfAyahs: 28, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/71.mp3" },
  { id: 72, name: "Al-Jinn", arabicName: "الجن", englishName: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/72.mp3" },
  { id: 73, name: "Al-Muzzammil", arabicName: "المزمل", englishName: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/73.mp3" },
  { id: 74, name: "Al-Muddaththir", arabicName: "المدثر", englishName: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/74.mp3" },
  { id: 75, name: "Al-Qiyaama", arabicName: "القيامة", englishName: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/75.mp3" },
  { id: 76, name: "Al-Insaan", arabicName: "الإنسان", englishName: "Man", numberOfAyahs: 31, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/76.mp3" },
  { id: 77, name: "Al-Mursalaat", arabicName: "المرسلات", englishName: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/77.mp3" },
  { id: 78, name: "An-Naba", arabicName: "النبأ", englishName: "The Announcement", numberOfAyahs: 40, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/78.mp3" },
  { id: 79, name: "An-Naazi'aat", arabicName: "النازعات", englishName: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/79.mp3" },
  { id: 80, name: "Abasa", arabicName: "عبس", englishName: "He frowned", numberOfAyahs: 42, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/80.mp3" },
  { id: 81, name: "At-Takwir", arabicName: "التكوير", englishName: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/81.mp3" },
  { id: 82, name: "Al-Infitaar", arabicName: "الانفطار", englishName: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/82.mp3" },
  { id: 83, name: "Al-Mutaffifin", arabicName: "المطففين", englishName: "Defrauding", numberOfAyahs: 36, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/83.mp3" },
  { id: 84, name: "Al-Inshiqaaq", arabicName: "الانشقاق", englishName: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/84.mp3" },
  { id: 85, name: "Al-Burooj", arabicName: "البروج", englishName: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/85.mp3" },
  { id: 86, name: "At-Taariq", arabicName: "الطارق", englishName: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/86.mp3" },
  { id: 87, name: "Al-A'laa", arabicName: "الأعلى", englishName: "The Most High", numberOfAyahs: 19, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/87.mp3" },
  { id: 88, name: "Al-Ghaashiya", arabicName: "الغاشية", englishName: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/88.mp3" },
  { id: 89, name: "Al-Fajr", arabicName: "الفجر", englishName: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/89.mp3" },
  { id: 90, name: "Al-Balad", arabicName: "البلد", englishName: "The City", numberOfAyahs: 20, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/90.mp3" },
  { id: 91, name: "Ash-Shams", arabicName: "الشمس", englishName: "The Sun", numberOfAyahs: 15, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/91.mp3" },
  { id: 92, name: "Al-Layl", arabicName: "الليل", englishName: "The Night", numberOfAyahs: 21, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/92.mp3" },
  { id: 93, name: "Ad-Duhaa", arabicName: "الضحى", englishName: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3" },
  { id: 94, name: "Ash-Sharh", arabicName: "الشرح", englishName: "The Relief", numberOfAyahs: 8, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/94.mp3" },
  { id: 95, name: "At-Tin", arabicName: "التين", englishName: "The Fig", numberOfAyahs: 8, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/95.mp3" },
  { id: 96, name: "Al-Alaq", arabicName: "العلق", englishName: "The Clot", numberOfAyahs: 19, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/96.mp3" },
  { id: 97, name: "Al-Qadr", arabicName: "القدر", englishName: "The Power, Fate", numberOfAyahs: 5, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/97.mp3" },
  { id: 98, name: "Al-Bayyina", arabicName: "البينة", englishName: "The Evidence", numberOfAyahs: 8, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/98.mp3" },
  { id: 99, name: "Az-Zalzala", arabicName: "الزلزلة", englishName: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/99.mp3" },
  { id: 100, name: "Al-Aadiyaat", arabicName: "العاديات", englishName: "The Chargers", numberOfAyahs: 11, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/100.mp3" },
  { id: 101, name: "Al-Qaari'a", arabicName: "القارعة", englishName: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/101.mp3" },
  { id: 102, name: "At-Takaathur", arabicName: "التكاثر", englishName: "Competition", numberOfAyahs: 8, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/102.mp3" },
  { id: 103, name: "Al-Asr", arabicName: "العصر", englishName: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/103.mp3" },
  { id: 104, name: "Al-Humaza", arabicName: "الهمزة", englishName: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/104.mp3" },
  { id: 105, name: "Al-Fil", arabicName: "الفيل", englishName: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/105.mp3" },
  { id: 106, name: "Quraysh", arabicName: "قريش", englishName: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/106.mp3" },
  { id: 107, name: "Al-Maa'un", arabicName: "الماعون", englishName: "Almsgiving", numberOfAyahs: 7, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/107.mp3" },
  { id: 108, name: "Al-Kawthar", arabicName: "الكوثر", englishName: "Abundance", numberOfAyahs: 3, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/108.mp3" },
  { id: 109, name: "Al-Kaafiroon", arabicName: "الكافرون", englishName: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/109.mp3" },
  { id: 110, name: "An-Nasr", arabicName: "النصر", englishName: "Divine Support", numberOfAyahs: 3, revelationType: "Medinan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/110.mp3" },
  { id: 111, name: "Al-Masad", arabicName: "المسد", englishName: "The Palm Fibre", numberOfAyahs: 5, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/111.mp3" },
  { id: 112, name: "Al-Ikhlaas", arabicName: "الإخلاص", englishName: "Sincerity", numberOfAyahs: 4, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3" },
  { id: 113, name: "Al-Falaq", arabicName: "الفلق", englishName: "The Dawn", numberOfAyahs: 5, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3" },
  { id: 114, name: "An-Naas", arabicName: "الناس", englishName: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3" }
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

export const searchSurahs = (query: string) => {
  const searchTerm = query.toLowerCase();
  return quranSurahs.filter(surah => 
    surah.name.toLowerCase().includes(searchTerm) ||
    surah.englishName.toLowerCase().includes(searchTerm) ||
    surah.id.toString() === searchTerm
  );
};

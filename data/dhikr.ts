// Source: https://github.com/muslim-dev/dzikrr/tree/main/data
export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  count: number;
  session: "morning" | "evening" | "both";
  category: string;
  audioUrl?: string;
  reference?: string;
}

export const dhikrData: DhikrItem[] = [
  {
    "id": "dzikr-1",
    "arabic": "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    "transliteration": "Membaca Ayat Kursi",
    "translation": "Membaca Ayat Kursi",
    "meaning": "Allah, tidak ada ilah (yang berhak disembah) melainkan Dia, yang hidup kekal lagi terus menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa’at di sisi-Nya tanpa seizin-Nya. Dia mengetahui apa-apa yang di hadapan mereka dan di belakang mereka. Mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dia tidak merasa berat memelihara keduanya. Dan Dia Maha Tinggi lagi Maha besar.",
    "count": 1,
    "session": "both",
    "category": "Dzikir Pagi & Petang",
    "reference": "Q.S. Al-Baqarah: 255"
  },
  {
    "id": "dzikr-2-ikhlas",
    "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\nقُلْ هُوَ اللَّهُ أَحَدٌ . اللَّهُ الصَّمَدُ . لَمْ يَلِدْ وَلَمْ يُولَدْ . وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    "transliteration": "Membaca Surah Al-Ikhlas",
    "translation": "Membaca Surah Al-Ikhlas",
    "meaning": "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah ilah yang bergantung kepada-Nya segala urusan. Dia tidak beranak dan tiada pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.",
    "count": 3,
    "session": "both",
    "category": "Dzikir Pagi & Petang",
    "reference": "Q.S. Al Ikhlas: 1-4"
  },
  {
    "id": "dzikr-2-falaq",
    "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ . مِن شَرِّ مَا خَلَقَ . وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ . وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ . وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    "transliteration": "Membaca Surah Al-Falaq",
    "translation": "Membaca Surah Al-Falaq",
    "meaning": "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Rabb yang menguasai Shubuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan-kejahatan wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.",
    "count": 3,
    "session": "both",
    "category": "Dzikir Pagi & Petang",
    "reference": "Q.S. Al Falaq: 1-5"
  },
  {
    "id": "dzikr-2-nas",
    "arabic": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ . مَلِكِ النَّاسِ . إِلَهِ النَّاسِ . مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ . الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ . مِنَ الْجِنَّةِ وَ النَّاسِ",
    "transliteration": "Membaca Surah An-Nas",
    "translation": "Membaca Surah An-Nas",
    "meaning": "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Rabb manusia. Raja manusia. Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari jin dan manusia.",
    "count": 3,
    "session": "both",
    "category": "Dzikir Pagi & Petang",
    "reference": "QS. An Naas: 1-6"
  },
  {
    "id": "dzikr-3",
    "arabic": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    "transliteration": "Meminta kebaikan untuk hari Ini",
    "translation": "Meminta kebaikan untuk hari Ini",
    "meaning": "Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabbku, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksaan di neraka dan siksaan di alam kubur.",
    "count": 1,
    "session": "morning",
    "category": "Dzikir Pagi"
  },
  {
    "id": "dzikr-4",
    "arabic": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُبِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُبِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُبِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    "transliteration": "Meminta kebaikan untuk malam Ini",
    "translation": "Meminta kebaikan untuk malam Ini",
    "meaning": "Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu.Wahai Rabbku, aku mohon kepada-Mu kebaikan di malam ini dan kebaikan sesudahnya. Aku berlindung kepadaMu dari kejahatan malam ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepadaMu dari kemalasan dan kejelekan di hari tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksaan di neraka dan siksaan di kubur.",
    "count": 1,
    "session": "evening",
    "category": "Dzikir Petang"
  },
  {
    "id": "dzikr-5",
    "arabic": "اَللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ",
    "transliteration": "Do’a ketika memasuki waktu pagi",
    "translation": "Do’a ketika memasuki waktu pagi",
    "meaning": "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan (bagi semua makhluk).",
    "count": 1,
    "session": "morning",
    "category": "Dzikir Pagi",
    "reference": "HR. Tirmidzi no. 3391 dan Abu Daud no. 5068. Al Hafizh Abu Thohir mengatakan bahwa sanad hadits ini shahih."
  },
  {
    "id": "dzikr-6",
    "arabic": "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا،وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيْرُ",
    "transliteration": "Do’a ketika memasuki waktu petang",
    "translation": "Do’a ketika memasuki waktu petang",
    "meaning": "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu petang, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan pertolonganMu kami hidup dan dengan kehendakMu kami mati. Dan kepada-Mu tempat kembali (bagi semua makhluk).",
    "count": 1,
    "session": "evening",
    "category": "Dzikir Petang",
    "reference": "HR. Tirmidzi no. 3391 dan Abu Daud no. 5068. Al Hafizh Abu Thohir mengatakan bahwa sanad hadits ini shahih."
  },
  {
    "id": "dzikr-7",
    "arabic": "اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ.",
    "transliteration": "Membaca Sayyidul Istighfar",
    "translation": "Membaca Sayyidul Istighfar",
    "meaning": "Ya Allah, Engkau adalah Rabbku, tidak ada ilah yang berhak disembah kecuali Engkau, Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku pada-Mu (yaitu aku akan mentauhidkan-Mu) semampuku dan aku yakin akan janji-Mu (berupa surga untukku). Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tiada yang mengampuni dosa kecuali Engkau.",
    "count": 1,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-8",
    "arabic": "اَللَّهُمَّ إِنِّيْ أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيْعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لاَ إِلَـهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيْكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُوْلُكَ",
    "transliteration": "Mentauhidkan Allah Subhana wa Ta’ala di waktu pagi",
    "translation": "Mentauhidkan Allah Subhana wa Ta’ala di waktu pagi",
    "meaning": "Ya Allah, sesungguhnya aku di waktu pagi ini mempersaksikan Engkau, malaikat yang memikul ‘Arys-Mu, malaikat-malaikat dan seluruh makhluk-Mu, bahwa sesungguhnya Engkau adalah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu dan sesungguhnya Muhammad adalah hamba dan utusan-Mu.",
    "count": 4,
    "session": "morning",
    "category": "Dzikir Pagi"
  },
  {
    "id": "dzikr-9",
    "arabic": "اَللَّهُمَّ إِنِّيْ أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيْعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لاَ إِلَـهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيْكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُوْلُكَ",
    "transliteration": "Mentauhidkan Allah Subhana wa Ta’ala di waktu petang",
    "translation": "Mentauhidkan Allah Subhana wa Ta’ala di waktu petang",
    "meaning": "Ya Allah, sesungguhnya aku di waktu petang ini mempersaksikan Engkau, malaikat yang memikul ‘Arys-Mu, malaikat-malaikat dan seluruh makhluk-Mu, bahwa sesungguhnya Engkau adalah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu dan sesungguhnya Muhammad adalah hamba dan utusan-Mu.",
    "count": 4,
    "session": "evening",
    "category": "Dzikir Petang"
  },
  {
    "id": "dzikr-10",
    "arabic": "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى. اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ",
    "transliteration": "Memohon keselamatan dunia dan akhirat",
    "translation": "Memohon keselamatan dunia dan akhirat",
    "meaning": "Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan dalam agama, dunia, keluarga dan hartaku. Ya Allah, tutupilah auratku (aib dan sesuatu yang tidak layak dilihat orang) dan tenteramkanlah aku dari rasa takut. Ya Allah, peliharalah aku dari muka, belakang, kanan, kiri dan atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak disambar dari bawahku (oleh ular atau tenggelam dalam bumi dan lain-lain yang membuat aku jatuh).",
    "count": 1,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-11",
    "arabic": "اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ",
    "transliteration": "Do'a pagi, petang dan saat beranjak tidur",
    "translation": "Do'a pagi, petang dan saat beranjak tidur",
    "meaning": "Ya Allah, Yang Maha Mengetahui yang ghaib dan yang nyata, wahai Rabb pencipta langit dan bumi, Rabb segala sesuatu dan yang merajainya. Aku bersaksi bahwa tidak ada ilah yang berhak disembah kecuali Engkau. Aku berlindung kepadaMu dari kejahatan diriku, setan dan balatentaranya (godaan untuk berbuat syirik pada Allah), dan aku (berlindung kepada-Mu) dari berbuat kejelekan terhadap diriku atau menyeretnya kepada seorang muslim.",
    "count": 1,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-12",
    "arabic": "بِسْمِ اللَّهِ الَّذِى لاَ يَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِى الأَرْضِ وَلاَ فِى السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    "transliteration": "Do'a terhindar dari bahaya yang tiba-tiba",
    "translation": "Do'a terhindar dari bahaya yang tiba-tiba",
    "meaning": "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan berbahaya, Dia-lah Yang Maha Mendengar lagi Maha Mengetahui.",
    "count": 3,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-13",
    "arabic": "رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    "transliteration": "Ridha",
    "translation": "Ridha",
    "meaning": "Aku ridha Allah sebagai Rabb, Islam sebagai agama dan Muhammad shallallahu ‘alaihi wa sallam sebagai nabi.",
    "count": 3,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-14",
    "arabic": "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، وَأَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ أَبَدًا",
    "transliteration": "Do'a meminta dilancarkan urusan",
    "translation": "Do'a meminta dilancarkan urusan",
    "meaning": "Wahai Rabb Yang Maha Hidup, wahai Rabb Yang Berdiri Sendiri (tidak butuh segala sesuatu), dengan rahmat-Mu aku minta pertolongan, perbaikilah segala urusanku dan jangan diserahkan kepadaku sekali pun sekejap mata (tanpa mendapat pertolongan dariMu).",
    "count": 1,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-15",
    "arabic": "أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    "transliteration": "Bertauhid",
    "translation": "Bertauhid",
    "meaning": "Di waktu pagi kami memegang agama Islam, kalimat ikhlas (kalimat syahadat), agama Nabi kami Muhammad shallallahu ‘alaihi wa sallam, dan agama bapak kami Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang musyrik.",
    "count": 1,
    "session": "morning",
    "category": "Dzikir Pagi",
    "reference": "HR. Ahmad (3: 406). Syaikh Syu’aib Al Arnauth mengatakan bahwa sanad hadits ini shahih sesuai syarat Bukhari Muslim. Lihat pula As Silsilah Ash Shahihah no. 2989"
  },
  {
    "id": "dzikr-16",
    "arabic": "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    "transliteration": "Dzikir Ringan Namun Berat di Timbangan",
    "translation": "Dzikir Ringan Namun Berat di Timbangan",
    "meaning": "Maha suci Allah, aku memuji-Nya.",
    "count": 100,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-17",
    "arabic": "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ",
    "transliteration": "Bertauhid",
    "translation": "Bertauhid",
    "meaning": "Tidak ada ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagiNya. Bagi-Nya kerajaan dan segala pujian. Dia-lah yang berkuasa atas segala sesuatu.",
    "count": 10,
    "session": "both",
    "category": "Dzikir Pagi & Petang"
  },
  {
    "id": "dzikr-18",
    "arabic": "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    "transliteration": "Memuji-muji Allah Subhana wa Ta'ala",
    "translation": "Memuji-muji Allah Subhana wa Ta'ala",
    "meaning": "Maha Suci Allah, aku memujiNya sebanyak makhluk-Nya, sejauh kerelaan-Nya, seberat timbangan ‘Arsy-Nya dan sebanyak tinta tulisan kalimat-Nya.",
    "count": 3,
    "session": "morning",
    "category": "Dzikir Pagi"
  },
  {
    "id": "dzikr-19",
    "arabic": "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    "transliteration": "Meminta Ilmu dan Rezeki",
    "translation": "Meminta Ilmu dan Rezeki",
    "meaning": "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat (bagi diriku dan orang lain), rezeki yang halal dan amal yang diterima (di sisi-Mu dan mendapatkan ganjaran yang baik).",
    "count": 1,
    "session": "morning",
    "category": "Dzikir Pagi"
  },
  {
    "id": "dzikr-20",
    "arabic": "أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ",
    "transliteration": "Istighfar",
    "translation": "Istighfar",
    "meaning": "Aku memohon ampun kepada Allah dan bertobat kepada-Nya.",
    "count": 100,
    "session": "morning",
    "category": "Dzikir Pagi",
    "reference": "HR. Bukhari no. 6307 dan Muslim no. 2702"
  },
  {
    "id": "dzikr-21",
    "arabic": "أَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    "transliteration": "Do'a meminta perlindungan",
    "translation": "Do'a meminta perlindungan",
    "meaning": "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang diciptakanNya.",
    "count": 3,
    "session": "evening",
    "category": "Dzikir Petang"
  }
];

export const getMorningDhikr = () => {
  return dhikrData.filter((item) => item.session === "morning" || item.session === "both");
};

export const getEveningDhikr = () => {
  return dhikrData.filter((item) => item.session === "evening" || item.session === "both");
};

export const getDhikrById = (id: string) => {
  return dhikrData.find((item) => item.id === id);
};

export const getDhikrByCategory = (category: string) => {
  return dhikrData.filter((item) => item.category === category);
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  material: string; // New field for learning material before the question
  category: 'hijaiyah' | 'tajwid' | 'worship' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  // Hijaiyah Questions
  {
    id: "h1",
    question: "Huruf apakah ini: ب",
    options: ["Alif", "Ba", "Ta", "Tsa"],
    correctAnswer: 1,
    explanation: "Huruf ب dibaca 'Ba' dan merupakan huruf kedua dalam alfabet Arab.",
    material: "Huruf Ba (ب) adalah huruf kedua dalam alfabet Arab. Huruf ini memiliki satu titik di bawah. Dalam pengucapannya, kedua bibir dirapatkan.",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "h2", 
    question: "Berapa jumlah huruf Hijaiyah?",
    options: ["26", "27", "28", "29"],
    correctAnswer: 2,
    material: "Huruf Hijaiyah adalah sistem alfabet yang digunakan dalam bahasa Arab dan Al-Qur'an. Secara umum, jumlah huruf dasar Hijaiyah adalah 28 huruf.",
    explanation: "Huruf Hijaiyah berjumlah 28 huruf, dari Alif hingga Ya.",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "h3",
    question: "Huruf mana yang memiliki 3 titik di atas?",
    options: ["ت", "ث", "ج", "خ"],
    correctAnswer: 1,
    material: "Beberapa huruf hijaiyah memiliki bentuk yang mirip namun dibedakan oleh titik. Huruf Ta (ت) punya 2 titik di atas, sedangkan Tsa (ث) punya 3 titik di atas.",
    explanation: "Huruf ث (Tsa) memiliki 3 titik di atas, sedangkan ت (Ta) memiliki 2 titik.",
    category: "hijaiyah",
    difficulty: "medium"
  },
  {
    id: "h4",
    question: "Huruf apakah ini: ج",
    options: ["Ha", "Kho", "Jim", "Dal"],
    correctAnswer: 2,
    material: "Huruf Jim (ج) memiliki satu titik di tengah perutnya. Pengucapannya keluar dari tengah lidah yang bertemu dengan langit-langit mulut.",
    explanation: "Huruf ج dibaca 'Jim'.",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "h5",
    question: "Manakah huruf 'Kho'?",
    options: ["ح", "خ", "ج", "ع"],
    correctAnswer: 1,
    material: "Huruf Kho (خ) memiliki titik di atas kepalanya. Suaranya terdengar seperti suara 'ngorok' halus yang keluar dari tenggorokan bagian atas.",
    explanation: "Huruf خ adalah 'Kho'.",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "h6",
    question: "Huruf 'Dal' adalah...",
    options: ["د", "ذ", "ر", "ز"],
    correctAnswer: 0,
    material: "Huruf Dal (د) tidak memiliki titik. Pengucapannya dengan menyentuhkan ujung lidah ke pangkal gigi seri bagian atas.",
    explanation: "Huruf د adalah 'Dal'.",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "h7",
    question: "Huruf 'Ra' memiliki bentuk yang mirip dengan...",
    options: ["Dal", "Zain", "Sin", "Lam"],
    correctAnswer: 1,
    material: "Huruf Ra (ر) dan Zain (ز) memiliki bentuk yang sama, namun Zain memiliki satu titik di atasnya.",
    explanation: "Ra (ر) mirip dengan Zain (ز).",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "h8",
    question: "Huruf Sin (س) memiliki berapa lekukan kecil di atasnya?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    material: "Huruf Sin (س) memiliki dua lekukan kecil dan satu lekukan besar di bawahnya. Sin tidak memiliki titik.",
    explanation: "Sin memiliki 2 lekukan kecil di awal.",
    category: "hijaiyah",
    difficulty: "medium"
  },
  {
    id: "h9",
    question: "Manakah huruf Shad?",
    options: ["س", "ش", "ص", "ض"],
    correctAnswer: 2,
    material: "Huruf Shad (ص) diucapkan dengan suara desis yang kuat dan posisi lidah yang naik ke langit-langit (tebal).",
    explanation: "Huruf ص adalah Shad.",
    category: "hijaiyah",
    difficulty: "medium"
  },
  {
    id: "h10",
    question: "Huruf yang diucapkan dengan ujung lidah menyentuh ujung gigi seri atas dan terdengar lembut adalah...",
    options: ["ت", "ث", "س", "ص"],
    correctAnswer: 1,
    material: "Huruf Tsa (ث) diucapkan dengan mengeluarkan sedikit ujung lidah di antara gigi seri atas dan bawah.",
    explanation: "Huruf ث (Tsa) diucapkan dengan ujung lidah.",
    category: "hijaiyah",
    difficulty: "hard"
  },
  
  // Tajwid Questions
  {
    id: "t1",
    question: "Apa yang dimaksud dengan Tajwid?",
    options: [
      "Membaca Al-Qur'an dengan cepat",
      "Membaca Al-Qur'an dengan benar sesuai kaidah",
      "Menghafal Al-Qur'an",
      "Menulis Al-Qur'an"
    ],
    correctAnswer: 1,
    material: "Secara bahasa, Tajwid berarti memperindah atau melakukan dengan baik. Dalam ilmu Al-Qur'an, Tajwid adalah ilmu untuk membaca Al-Qur'an dengan benar sesuai makhraj dan sifat hurufnya.",
    explanation: "Tajwid adalah ilmu yang mempelajari cara membaca Al-Qur'an dengan benar sesuai kaidah yang telah ditetapkan.",
    category: "tajwid",
    difficulty: "easy"
  },
  {
    id: "t2",
    question: "Berapa panjang bacaan Mad Thobi'i?",
    options: ["1 harakat", "2 harakat", "4 harakat", "6 harakat"],
    correctAnswer: 1,
    material: "Mad Thobi'i atau Mad Ashli terjadi apabila ada Alif setelah fathah, Wawu sukun setelah dhommah, atau Ya sukun setelah kasroh. Panjangnya adalah 2 harakat.",
    explanation: "Mad Thobi'i dibaca sepanjang 2 harakat atau 2 ketukan.",
    category: "tajwid",
    difficulty: "medium"
  },
  {
    id: "t3",
    question: "Hukum Nun Sukun bertemu dengan huruf 'Ba' disebut...",
    options: ["Izhari", "Idgham", "Iqlab", "Ikhfa"],
    correctAnswer: 2,
    material: "Iqlab secara bahasa berarti mengganti. Dalam tajwid, Iqlab terjadi jika Nun sukun atau Tanwin bertemu huruf Ba (ب), suaranya diganti menjadi Mim disertai dengung.",
    explanation: "Iqlab adalah mengganti suara Nun menjadi Mim saat bertemu Ba.",
    category: "tajwid",
    difficulty: "medium"
  },
  {
    id: "t4",
    question: "Huruf-huruf Qolqolah terkumpul dalam kalimat...",
    options: ["يَرْمَلُوْن", "قُطْبُ جَدٍ", "أَبْغِ حَجَّكَ", "ءي"],
    correctAnswer: 1,
    material: "Qolqolah berarti pantulan. Hurufnya ada 5: Qaf, Tha, Ba, Jim, Dal (ق، ط، ب، ج، د), yang sering disingkat 'Qutbu Jadin'.",
    explanation: "Huruf Qolqolah adalah Qaf, Tha, Ba, Jim, Dal.",
    category: "tajwid",
    difficulty: "medium"
  },
  {
    id: "t5",
    question: "Apa arti dari 'Izhari'?",
    options: ["Samar", "Jelas", "Memasukkan", "Memantul"],
    correctAnswer: 1,
    material: "Izhar secara bahasa berarti jelas. Dalam tajwid, Izhar Halqi terjadi jika Nun sukun atau Tanwin bertemu salah satu huruf tenggorokan (ء، هـ، ع، ح، غ، خ).",
    explanation: "Izhar berarti dibaca dengan jelas tanpa dengung.",
    category: "tajwid",
    difficulty: "easy"
  },
  {
    id: "t6",
    question: "Berapakah jumlah huruf Ikhfa Haqiqi?",
    options: ["5", "10", "15", "20"],
    correctAnswer: 2,
    material: "Ikhfa berarti menyamarkan. Huruf Ikhfa Haqiqi berjumlah 15 huruf, yaitu selain huruf Izhar, Iqlab, dan Idgham.",
    explanation: "Ada 15 huruf Ikhfa Haqiqi.",
    category: "tajwid",
    difficulty: "hard"
  },
  {
    id: "t7",
    question: "Ghunnah artinya...",
    options: ["Jelas", "Dengung", "Panjang", "Pendek"],
    correctAnswer: 1,
    material: "Ghunnah adalah suara yang keluar dari pangkal hidung. Hukum ini wajib dibaca pada Nun dan Mim yang bertasydid (نّ dan مّ).",
    explanation: "Ghunnah adalah suara mendengung.",
    category: "tajwid",
    difficulty: "easy"
  },
  {
    id: "t8",
    question: "Hukum Alif Lam yang dibaca jelas disebut...",
    options: ["Alif Lam Syamsiyah", "Alif Lam Qomariyah", "Alif Lam Ma'rifah", "Alif Lam Nakirah"],
    correctAnswer: 1,
    material: "Alif Lam Qomariyah adalah hukum membaca Alif Lam secara jelas (Idzhar) ketika bertemu dengan 14 huruf tertentu.",
    explanation: "Alif Lam Qomariyah dibaca jelas.",
    category: "tajwid",
    difficulty: "medium"
  },
  {
    id: "t9",
    question: "Mad yang terjadi di akhir ayat karena waqof disebut...",
    options: ["Mad Thobi'i", "Mad Wajib Muttasil", "Mad Arid Lissukun", "Mad Jaiz Munfasil"],
    correctAnswer: 2,
    material: "Mad Arid Lissukun terjadi jika ada Mad Thobi'i bertemu huruf hidup di akhir ayat atau tempat waqof. Panjangnya bisa 2, 4, atau 6 harakat.",
    explanation: "Mad Arid Lissukun terjadi karena waqof.",
    category: "tajwid",
    difficulty: "hard"
  },
  {
    id: "t10",
    question: "Idgham Bighunnah artinya memasukkan suara dengan...",
    options: ["Jelas", "Dengung", "Tanpa Dengung", "Cepat"],
    correctAnswer: 1,
    material: "Idgham Bighunnah terjadi jika Nun sukun atau Tanwin bertemu huruf Ya, Nun, Mim, Wawu (ي، ن، م، و). Dibaca dengan memasukkan suara dan mendengung.",
    explanation: "Idgham Bighunnah disertai dengan dengung.",
    category: "tajwid",
    difficulty: "medium"
  },

  // Worship Questions
  {
    id: "w1",
    question: "Berapa rakaat shalat Maghrib?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"],
    correctAnswer: 1,
    material: "Shalat fardhu lima waktu memiliki jumlah rakaat yang berbeda: Subuh (2), Dhuhur (4), Ashar (4), Maghrib (3), dan Isya (4).",
    explanation: "Shalat Maghrib adalah 3 rakaat, terdiri dari 2 rakaat sirr dan 1 rakaat jahr.",
    category: "worship",
    difficulty: "easy"
  },
  {
    id: "w2",
    question: "Kapan waktu shalat Dhuha?",
    options: [
      "Setelah terbit matahari hingga sebelum Dhuhur",
      "Setelah Maghrib hingga Isya",
      "Setelah Isya hingga Subuh", 
      "Setelah Subuh hingga terbit matahari"
    ],
    correctAnswer: 0,
    material: "Shalat Dhuha adalah shalat sunnah yang dilakukan di pagi hari. Waktunya dimulai saat matahari mulai meninggi (sekitar 15 menit setelah terbit) hingga mendekati waktu Dhuhur.",
    explanation: "Shalat Dhuha dilakukan setelah matahari terbit (naik setinggi tombak) hingga sebelum masuk waktu Dhuhur.",
    category: "worship",
    difficulty: "medium"
  },
  {
    id: "w3",
    question: "Rukun Islam yang pertama adalah...",
    options: ["Shalat", "Zakat", "Syahadat", "Puasa"],
    correctAnswer: 2,
    material: "Islam dibangun di atas lima rukun: Syahadat, Shalat, Zakat, Puasa, dan Haji bagi yang mampu.",
    explanation: "Syahadat adalah rukun Islam yang pertama.",
    category: "worship",
    difficulty: "easy"
  },
  {
    id: "w4",
    question: "Membasuh muka dalam wudhu hukumnya...",
    options: ["Sunnah", "Wajib/Rukun", "Makruh", "Mubah"],
    correctAnswer: 1,
    material: "Rukun wudhu ada enam: Niat, membasuh wajah, membasuh kedua tangan hingga siku, mengusap sebagian kepala, membasuh kedua kaki hingga mata kaki, dan tertib.",
    explanation: "Membasuh muka adalah salah satu rukun wudhu.",
    category: "worship",
    difficulty: "easy"
  },
  {
    id: "w5",
    question: "Apa rukun iman yang ketiga?",
    options: ["Iman kepada Allah", "Iman kepada Malaikat", "Iman kepada Kitab-kitab", "Iman kepada Rasul"],
    correctAnswer: 2,
    material: "Rukun Iman ada enam: Beriman kepada Allah, Malaikat, Kitab-kitab-Nya, para Rasul-Nya, Hari Akhir, serta Qada dan Qadar.",
    explanation: "Beriman kepada Kitab-kitab Allah adalah rukun iman ketiga.",
    category: "worship",
    difficulty: "medium"
  },
  {
    id: "w6",
    question: "Puasa Ramadan hukumnya...",
    options: ["Sunnah", "Mubah", "Wajib", "Haram"],
    correctAnswer: 2,
    material: "Puasa Ramadan adalah salah satu kewajiban bagi setiap Muslim yang sudah baligh, berakal, dan mampu melakukannya.",
    explanation: "Puasa Ramadan wajib bagi umat Muslim.",
    category: "worship",
    difficulty: "easy"
  },
  {
    id: "w7",
    question: "Arah kiblat umat Islam saat shalat adalah...",
    options: ["Baitul Maqdis", "Masjid Nabawi", "Ka'bah", "Masjid Quba"],
    correctAnswer: 2,
    material: "Setiap Muslim wajib menghadap ke Ka'bah di Makkah (Al-Masjid Al-Haram) saat melaksanakan shalat.",
    explanation: "Ka'bah adalah kiblat umat Islam.",
    category: "worship",
    difficulty: "easy"
  },
  {
    id: "w8",
    question: "Berapakah jumlah zakat fitrah yang harus dikeluarkan per orang?",
    options: ["1 kg beras", "2,5 kg atau 3,5 liter beras", "5 kg beras", "10 kg beras"],
    correctAnswer: 1,
    material: "Zakat fitrah wajib dikeluarkan di akhir Ramadan sebesar satu sha' makanan pokok, yang setara dengan sekitar 2,5 kg atau 3,5 liter beras.",
    explanation: "Zakat fitrah setara dengan 2,5 kg atau 3,5 liter beras.",
    category: "worship",
    difficulty: "medium"
  },
  {
    id: "w9",
    question: "Mengusap telinga saat wudhu hukumnya...",
    options: ["Wajib", "Sunnah", "Haram", "Makruh"],
    correctAnswer: 1,
    material: "Dalam wudhu, terdapat rukun yang wajib dilakukan dan sunnah yang jika dilakukan menambah pahala, seperti mengusap telinga.",
    explanation: "Mengusap telinga adalah sunnah wudhu.",
    category: "worship",
    difficulty: "medium"
  },
  {
    id: "w10",
    question: "Shalat sunnah yang mengiringi shalat fardhu disebut shalat...",
    options: ["Tahajjud", "Witir", "Rawatib", "Istikharah"],
    correctAnswer: 2,
    material: "Shalat sunnah Rawatib adalah shalat yang dilakukan sebelum (Qobliyah) atau sesudah (Ba'diyyah) shalat fardhu.",
    explanation: "Shalat Rawatib adalah pendamping shalat fardhu.",
    category: "worship",
    difficulty: "medium"
  },

  // General Knowledge Questions
  {
    id: "g1",
    question: "Berapa jumlah surah dalam Al-Qur'an?",
    options: ["112", "113", "114", "115"],
    correctAnswer: 2,
    material: "Al-Qur'an diturunkan secara bertahap kepada Nabi Muhammad SAW. Kitab suci ini terbagi menjadi 30 Juz and terdiri dari 114 Surah.",
    explanation: "Al-Qur'an terdiri dari 114 surah, dimulai dari Al-Fatihah hingga An-Nas.",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "g2",
    question: "Siapa nama malaikat yang bertugas menyampaikan wahyu?",
    options: ["Mikail", "Jibril", "Israfil", "Ridwan"],
    correctAnswer: 1,
    material: "Beriman kepada malaikat adalah rukun iman kedua. Setiap malaikat memiliki tugas khusus, seperti Jibril pembawa wahyu and Mikail pembagi rezeki.",
    explanation: "Malaikat Jibril (Gabriel) adalah malaikat yang bertugas menyampaikan wahyu dari Allah kepada para nabi.",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "g3",
    question: "Di kota mana Nabi Muhammad SAW lahir?",
    options: ["Madinah", "Thaif", "Makkah", "Badar"],
    correctAnswer: 2,
    material: "Nabi Muhammad SAW lahir pada hari Senin, 12 Rabiul Awal tahun Gajah. Beliau dilahirkan di Makkah, sebuah kota suci di Jazirah Arab.",
    explanation: "Nabi Muhammad SAW lahir di kota Makkah pada tahun 571 Masehi (Tahun Gajah).",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "g4",
    question: "Apa nama kitab yang diturunkan kepada Nabi Daud AS?",
    options: ["Taurat", "Zabur", "Injil", "Al-Qur'an"],
    correctAnswer: 1,
    material: "Allah menurunkan kitab-kitab kepada para rasul: Taurat (Musa), Zabur (Daud), Injil (Isa), and Al-Qur'an (Muhammad).",
    explanation: "Nabi Daud AS menerima kitab Zabur.",
    category: "general",
    difficulty: "medium"
  },
  {
    id: "g5",
    question: "Siapakah nama ayah Nabi Muhammad SAW?",
    options: ["Abu Thalib", "Abdul Muthalib", "Abdullah", "Hamzah"],
    correctAnswer: 2,
    material: "Nabi Muhammad SAW adalah putra dari pasangan Abdullah bin Abdul Muthalib and Aminah binti Wahb.",
    explanation: "Ayah Nabi Muhammad adalah Abdullah.",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "g6",
    question: "Siapakah wanita pertama yang memeluk Islam?",
    options: ["Aisyah", "Fathimah", "Khadijah", "Sumayyah"],
    correctAnswer: 2,
    material: "Istri pertama Nabi Muhammad SAW, Khadijah binti Khuwailid, adalah orang pertama yang beriman and mendukung dakwah beliau.",
    explanation: "Khadijah adalah orang pertama yang masuk Islam.",
    category: "general",
    difficulty: "medium"
  },
  {
    id: "g7",
    question: "Apa nama bulan pertama dalam kalender Hijriah?",
    options: ["Ramadan", "Muharram", "Syawal", "Zulhijjah"],
    correctAnswer: 1,
    material: "Kalender Islam (Hijriah) terdiri dari 12 bulan, dimulai dari Muharram and diakhiri dengan Zulhijjah.",
    explanation: "Muharram adalah bulan pertama tahun Hijriah.",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "g8",
    question: "Peristiwa perjalanan Nabi Muhammad dari Makkah ke Baitul Maqdis lalu ke langit disebut...",
    options: ["Hijrah", "Isra Mi'raj", "Fathu Makkah", "Haji Wada"],
    correctAnswer: 1,
    material: "Isra Mi'raj adalah mukjizat besar di mana Nabi Muhammad SAW diperjalankan dalam satu malam and menerima perintah shalat lima waktu.",
    explanation: "Peristiwa itu disebut Isra Mi'raj.",
    category: "general",
    difficulty: "medium"
  },
  {
    id: "g9",
    question: "Siapakah sahabat Nabi yang dijuluki 'Al-Faruq'?",
    options: ["Abu Bakar Ash-Shiddiq", "Umar bin Khattab", "Utsman bin Affan", "Ali bin Abi Thalib"],
    correctAnswer: 1,
    material: "Umar bin Khattab dikenal karena ketegasannya dalam membedakan yang haq (benar) and yang bathil (salah), sehingga dijuluki Al-Faruq.",
    explanation: "Umar bin Khattab dijuluki Al-Faruq.",
    category: "general",
    difficulty: "hard"
  },
  {
    id: "g10",
    question: "Surah terpanjang dalam Al-Qur'an adalah...",
    options: ["Ali Imran", "An-Nisa", "Al-Maidah", "Al-Baqarah"],
    correctAnswer: 3,
    material: "Surah Al-Baqarah adalah surah kedua dalam Al-Qur'an and merupakan surah terpanjang dengan jumlah 286 ayat.",
    explanation: "Al-Baqarah adalah surah terpanjang.",
    category: "general",
    difficulty: "medium"
  }
];

export const getQuestionsByCategory = (category: QuizQuestion['category']) => {
  return quizQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: QuizQuestion['difficulty']) => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (category: QuizQuestion['category'], count: number = 10) => {
  const categoryQuestions = getQuestionsByCategory(category);
  const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const quizCategories = [
  {
    id: 'hijaiyah',
    name: 'Hijaiyah',
    description: 'Pengenalan huruf-huruf Arab',
    icon: 'Languages',
    color: 'chart-1'
  },
  {
    id: 'tajwid',
    name: 'Tajwid',
    description: 'Kaidah membaca Al-Qur\'an',
    icon: 'BookOpen',
    color: 'chart-2'
  },
  {
    id: 'worship',
    name: 'Ibadah',
    description: 'Tata cara ibadah dalam Islam',
    icon: 'Mosque',
    color: 'chart-3'
  },
  {
    id: 'general',
    name: 'Pengetahuan Umum',
    description: 'Sejarah and pengetahuan Islam',
    icon: 'Globe',
    color: 'chart-4'
  }
] as const;

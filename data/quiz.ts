export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  material: string;
  category: 'hijaiyah' | 'tajwid' | 'worship' | 'general' | 'fiqih' | 'sirah';
  difficulty: 'easy' | 'medium' | 'hard';
}

// Fallback data for pre-login demo (1 question per category). Full data is served from the API.
export const quizQuestions: QuizQuestion[] = [
  {
    id: "h1",
    question: "Huruf apakah ini: ب",
    options: ["Alif", "Ba", "Ta", "Tsa"],
    correctAnswer: 1,
    explanation: "Huruf ب dibaca 'Ba' dan merupakan huruf kedua dalam alfabet Arab.",
    material: "Huruf Ba (ب) adalah huruf kedua dalam alfabet Arab. Huruf ini memiliki satu titik di bawah.",
    category: "hijaiyah",
    difficulty: "easy"
  },
  {
    id: "t1",
    question: "Apa yang dimaksud dengan Nun Sukun?",
    options: ["Nun berharakat fathah", "Nun mati", "Nun berharakat kasrah", "Nun berharakat dhammah"],
    correctAnswer: 1,
    explanation: "Nun sukun adalah nun yang tidak berharakat (mati).",
    material: "Nun sukun (نْ) adalah huruf nun yang tidak memiliki harakat sehingga dibaca mati.",
    category: "tajwid",
    difficulty: "easy"
  },
  {
    id: "w1",
    question: "Berapa rakaat shalat Subuh?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    explanation: "Shalat Subuh terdiri dari 2 rakaat.",
    material: "Shalat Subuh adalah shalat wajib yang dilakukan pada waktu fajar dan terdiri dari 2 rakaat.",
    category: "worship",
    difficulty: "easy"
  },
  {
    id: "g1",
    question: "Siapakah Nabi terakhir dalam Islam?",
    options: ["Nabi Isa", "Nabi Musa", "Nabi Ibrahim", "Nabi Muhammad"],
    correctAnswer: 3,
    explanation: "Nabi Muhammad SAW adalah nabi dan rasul terakhir yang diutus Allah SWT.",
    material: "Dalam Islam, Nabi Muhammad SAW merupakan nabi dan rasul terakhir (khatamun nabiyyin).",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "f1",
    question: "Apa hukum shalat lima waktu?",
    options: ["Sunnah", "Wajib", "Makruh", "Mubah"],
    correctAnswer: 1,
    explanation: "Shalat lima waktu hukumnya wajib bagi setiap muslim yang baligh dan berakal.",
    material: "Dalam fikih, shalat lima waktu termasuk kewajiban utama yang harus dijaga oleh setiap muslim.",
    category: "fiqih",
    difficulty: "easy"
  },
  {
    id: "s1",
    question: "Di kota manakah Nabi Muhammad SAW dilahirkan?",
    options: ["Madinah", "Makkah", "Thaif", "Yaman"],
    correctAnswer: 1,
    explanation: "Nabi Muhammad SAW dilahirkan di Makkah.",
    material: "Sirah Nabawiyah memulai banyak peristiwa penting dari kota Makkah, tempat kelahiran Rasulullah SAW.",
    category: "sirah",
    difficulty: "easy"
  },
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
  },
  {
    id: 'fiqih',
    name: 'Fiqih',
    description: 'Hukum dan tata cara ibadah',
    icon: 'Scale',
    color: 'chart-5'
  },
  {
    id: 'sirah',
    name: 'Sirah Nabawiyah',
    description: 'Kisah Nabi dan sejarah Islam',
    icon: 'Star',
    color: 'chart-6'
  }
] as const;

export type QuizCategory = (typeof quizCategories)[number];
export type QuizCategoryId = QuizCategory["id"];

export const isQuizCategoryId = (value: string): value is QuizCategoryId => {
  return quizCategories.some((category) => category.id === value);
};

export const getQuizCategoryById = (categoryId: string): QuizCategory | undefined => {
  return quizCategories.find((category) => category.id === categoryId);
};

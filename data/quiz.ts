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

export interface HijaiyahLetter {
  id: string;
  arabic: string;
  name: string;
  transliteration: string;
  pronunciation: string;
  audioUrl: string;
  order: number;
  description: string;
  writingSteps: string[];
  strokePoints?: { x: number; y: number }[]; // Coordinates for guide points
}

export const hijaiyahLetters: HijaiyahLetter[] = [
  {
    id: "alif",
    arabic: "ا",
    name: "Alif",
    transliteration: "A",
    pronunciation: "Alif",
    audioUrl: "/audio/hijaiyah/alif.mp3",
    order: 1,
    description: "Huruf pertama dalam alfabet Arab",
    writingSteps: ["Tarik garis lurus dari atas ke bawah"],
    strokePoints: [
      { x: 50, y: 20 }, { x: 50, y: 35 }, { x: 50, y: 50 }, { x: 50, y: 65 }, { x: 50, y: 80 }
    ]
  },
  {
    id: "ba",
    arabic: "ب",
    name: "Ba",
    transliteration: "B",
    pronunciation: "Ba",
    audioUrl: "/audio/hijaiyah/ba.mp3",
    order: 2,
    description: "Huruf kedua dalam alfabet Arab",
    writingSteps: ["Buat garis melengkung", "Tambahkan satu titik di bawah"],
    strokePoints: [
      { x: 80, y: 40 }, { x: 85, y: 60 }, { x: 70, y: 70 }, { x: 50, y: 70 }, { x: 30, y: 70 }, { x: 15, y: 60 }, { x: 20, y: 40 }
    ]
  },
  {
    id: "ta",
    arabic: "ت",
    name: "Ta",
    transliteration: "T",
    pronunciation: "Ta",
    audioUrl: "/audio/hijaiyah/ta.mp3",
    order: 3,
    description: "Huruf ketiga dalam alfabet Arab",
    writingSteps: ["Buat garis melengkung seperti Ba", "Tambahkan dua titik di atas"],
    strokePoints: [
      { x: 80, y: 40 }, { x: 85, y: 60 }, { x: 70, y: 70 }, { x: 50, y: 70 }, { x: 30, y: 70 }, { x: 15, y: 60 }, { x: 20, y: 40 },
      { x: 40, y: 25 }, { x: 60, y: 25 }
    ]
  },
  {
    id: "tsa",
    arabic: "ث",
    name: "Tsa",
    transliteration: "Ts",
    pronunciation: "Tsa",
    audioUrl: "/audio/hijaiyah/tsa.mp3",
    order: 4,
    description: "Huruf keempat dalam alfabet Arab",
    writingSteps: ["Buat garis melengkung seperti Ba", "Tambahkan tiga titik di atas"],
    strokePoints: [
      { x: 80, y: 40 }, { x: 85, y: 60 }, { x: 70, y: 70 }, { x: 50, y: 70 }, { x: 30, y: 70 }, { x: 15, y: 60 }, { x: 20, y: 40 },
      { x: 40, y: 25 }, { x: 60, y: 25 }, { x: 50, y: 15 }
    ]
  },
  {
    id: "jim",
    arabic: "ج",
    name: "Jim",
    transliteration: "J",
    pronunciation: "Jim",
    audioUrl: "/audio/hijaiyah/jim.mp3",
    order: 5,
    description: "Huruf kelima dalam alfabet Arab",
    writingSteps: ["Buat setengah lingkaran", "Tambahkan garis vertikal", "Tambahkan satu titik di bawah"],
    strokePoints: [
      { x: 75, y: 30 }, { x: 50, y: 30 }, { x: 25, y: 30 },
      { x: 15, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 85 }, { x: 75, y: 75 },
      { x: 50, y: 55 }
    ]
  },
  {
    id: "ha",
    arabic: "ح",
    name: "Ha",
    transliteration: "H",
    pronunciation: "Ha",
    audioUrl: "/audio/hijaiyah/ha.mp3",
    order: 6,
    description: "Huruf keenam dalam alfabet Arab",
    writingSteps: ["Buat setengah lingkaran seperti Jim tanpa titik"],
    strokePoints: [
      { x: 75, y: 30 }, { x: 50, y: 30 }, { x: 25, y: 30 },
      { x: 15, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 85 }, { x: 75, y: 75 }
    ]
  },
  {
    id: "kha",
    arabic: "خ",
    name: "Kha",
    transliteration: "Kh",
    pronunciation: "Kha",
    audioUrl: "/audio/hijaiyah/kha.mp3",
    order: 7,
    description: "Huruf ketujuh dalam alfabet Arab",
    writingSteps: ["Buat setengah lingkaran seperti Ha", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 75, y: 30 }, { x: 50, y: 30 }, { x: 25, y: 30 },
      { x: 15, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 85 }, { x: 75, y: 75 },
      { x: 50, y: 15 }
    ]
  },
  {
    id: "dal",
    arabic: "د",
    name: "Dal",
    transliteration: "D",
    pronunciation: "Dal",
    audioUrl: "/audio/hijaiyah/dal.mp3",
    order: 8,
    description: "Huruf kedelapan dalam alfabet Arab",
    writingSteps: ["Buat garis melengkung pendek dengan ekor di atas"],
    strokePoints: [
      { x: 65, y: 35 }, { x: 45, y: 45 }, { x: 40, y: 65 }, { x: 55, y: 80 }, { x: 75, y: 80 }
    ]
  },
  {
    id: "dzal",
    arabic: "ذ",
    name: "Dzal",
    transliteration: "Dz",
    pronunciation: "Dzal",
    audioUrl: "/audio/hijaiyah/dzal.mp3",
    order: 9,
    description: "Huruf kesembilan dalam alfabet Arab",
    writingSteps: ["Buat seperti Dal", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 65, y: 35 }, { x: 45, y: 45 }, { x: 40, y: 65 }, { x: 55, y: 80 }, { x: 75, y: 80 },
      { x: 55, y: 20 }
    ]
  },
  {
    id: "ra",
    arabic: "ر",
    name: "Ra",
    transliteration: "R",
    pronunciation: "Ra",
    audioUrl: "/audio/hijaiyah/ra.mp3",
    order: 10,
    description: "Huruf kesepuluh dalam alfabet Arab",
    writingSteps: ["Buat garis pendek dengan lengkungan kecil"],
    strokePoints: [
      { x: 50, y: 40 }, { x: 55, y: 55 }, { x: 50, y: 70 }, { x: 35, y: 80 }, { x: 20, y: 80 }
    ]
  },
  {
    id: "zay",
    arabic: "ز",
    name: "Zay",
    transliteration: "Z",
    pronunciation: "Zay",
    audioUrl: "/audio/hijaiyah/zay.mp3",
    order: 11,
    description: "Huruf kesebelas dalam alfabet Arab",
    writingSteps: ["Buat seperti Ra", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 50, y: 40 }, { x: 55, y: 55 }, { x: 50, y: 70 }, { x: 35, y: 80 }, { x: 20, y: 80 },
      { x: 60, y: 25 }
    ]
  },
  {
    id: "sin",
    arabic: "س",
    name: "Sin",
    transliteration: "S",
    pronunciation: "Sin",
    audioUrl: "/audio/hijaiyah/sin.mp3",
    order: 12,
    description: "Huruf kedua belas dalam alfabet Arab",
    writingSteps: ["Buat tiga gelombang berturut-turut"],
    strokePoints: [
      { x: 80, y: 45 }, { x: 75, y: 55 }, { x: 70, y: 45 }, { x: 65, y: 55 }, { x: 60, y: 45 },
      { x: 55, y: 65 }, { x: 45, y: 80 }, { x: 25, y: 80 }, { x: 15, y: 65 }
    ]
  },
  {
    id: "syin",
    arabic: "ش",
    name: "Syin",
    transliteration: "Sy",
    pronunciation: "Syin",
    audioUrl: "/audio/hijaiyah/syin.mp3",
    order: 13,
    description: "Huruf ketiga belas dalam alfabet Arab",
    writingSteps: ["Buat seperti Sin", "Tambahkan tiga titik di atas"],
    strokePoints: [
      { x: 80, y: 45 }, { x: 75, y: 55 }, { x: 70, y: 45 }, { x: 65, y: 55 }, { x: 60, y: 45 },
      { x: 55, y: 65 }, { x: 45, y: 80 }, { x: 25, y: 80 }, { x: 15, y: 65 },
      { x: 60, y: 25 }, { x: 75, y: 25 }, { x: 67, y: 15 }
    ]
  },
  {
    id: "shad",
    arabic: "ص",
    name: "Shad",
    transliteration: "Sh",
    pronunciation: "Shad",
    audioUrl: "/audio/hijaiyah/shad.mp3",
    order: 14,
    description: "Huruf keempat belas dalam alfabet Arab",
    writingSteps: ["Buat oval dengan ekor panjang"],
    strokePoints: [
      { x: 55, y: 60 }, { x: 80, y: 60 }, { x: 90, y: 50 }, { x: 80, y: 45 }, { x: 55, y: 50 },
      { x: 55, y: 65 }, { x: 45, y: 80 }, { x: 25, y: 80 }, { x: 15, y: 65 }
    ]
  },
  {
    id: "dhad",
    arabic: "ض",
    name: "Dhad",
    transliteration: "Dh",
    pronunciation: "Dhad",
    audioUrl: "/audio/hijaiyah/dhad.mp3",
    order: 15,
    description: "Huruf kelima belas dalam alfabet Arab",
    writingSteps: ["Buat seperti Shad", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 55, y: 60 }, { x: 80, y: 60 }, { x: 90, y: 50 }, { x: 80, y: 45 }, { x: 55, y: 50 },
      { x: 55, y: 65 }, { x: 45, y: 80 }, { x: 25, y: 80 }, { x: 15, y: 65 },
      { x: 70, y: 25 }
    ]
  },
  {
    id: "tha",
    arabic: "ط",
    name: "Tha",
    transliteration: "Th",
    pronunciation: "Tha",
    audioUrl: "/audio/hijaiyah/tha.mp3",
    order: 16,
    description: "Huruf keenam belas dalam alfabet Arab",
    writingSteps: ["Buat oval dengan garis vertikal di tengah"],
    strokePoints: [
      { x: 30, y: 65 }, { x: 55, y: 65 }, { x: 75, y: 65 }, { x: 85, y: 55 }, { x: 75, y: 45 }, { x: 30, y: 45 },
      { x: 45, y: 15 }, { x: 45, y: 40 }, { x: 45, y: 65 }
    ]
  },
  {
    id: "zha",
    arabic: "ظ",
    name: "Zha",
    transliteration: "Zh",
    pronunciation: "Zha",
    audioUrl: "/audio/hijaiyah/zha.mp3",
    order: 17,
    description: "Huruf ketujuh belas dalam alfabet Arab",
    writingSteps: ["Buat seperti Tha", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 30, y: 65 }, { x: 55, y: 65 }, { x: 75, y: 65 }, { x: 85, y: 55 }, { x: 75, y: 45 }, { x: 30, y: 45 },
      { x: 45, y: 15 }, { x: 45, y: 40 }, { x: 45, y: 65 },
      { x: 60, y: 30 }
    ]
  },
  {
    id: "ain",
    arabic: "ع",
    name: "Ain",
    transliteration: "'",
    pronunciation: "Ain",
    audioUrl: "/audio/hijaiyah/ain.mp3",
    order: 18,
    description: "Huruf kedelapan belas dalam alfabet Arab",
    writingSteps: ["Buat lingkaran dengan bukaan di atas"],
    strokePoints: [
      { x: 65, y: 35 }, { x: 55, y: 25 }, { x: 45, y: 35 }, { x: 55, y: 45 },
      { x: 45, y: 60 }, { x: 25, y: 80 }, { x: 50, y: 90 }, { x: 75, y: 80 }
    ]
  },
  {
    id: "ghain",
    arabic: "غ",
    name: "Ghain",
    transliteration: "Gh",
    pronunciation: "Ghain",
    audioUrl: "/audio/hijaiyah/ghain.mp3",
    order: 19,
    description: "Huruf kesembilan belas dalam alfabet Arab",
    writingSteps: ["Buat seperti Ain", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 65, y: 35 }, { x: 55, y: 25 }, { x: 45, y: 35 }, { x: 55, y: 45 },
      { x: 45, y: 60 }, { x: 25, y: 80 }, { x: 50, y: 90 }, { x: 75, y: 80 },
      { x: 60, y: 15 }
    ]
  },
  {
    id: "fa",
    arabic: "ف",
    name: "Fa",
    transliteration: "F",
    pronunciation: "Fa",
    audioUrl: "/audio/hijaiyah/fa.mp3",
    order: 20,
    description: "Huruf kedua puluh dalam alfabet Arab",
    writingSteps: ["Buat lingkaran dengan garis di atas", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 75, y: 45 }, { x: 85, y: 55 }, { x: 75, y: 65 }, { x: 65, y: 55 }, { x: 75, y: 45 },
      { x: 65, y: 70 }, { x: 45, y: 75 }, { x: 15, y: 75 }, { x: 10, y: 60 },
      { x: 75, y: 25 }
    ]
  },
  {
    id: "qaf",
    arabic: "ق",
    name: "Qaf",
    transliteration: "Q",
    pronunciation: "Qaf",
    audioUrl: "/audio/hijaiyah/qaf.mp3",
    order: 21,
    description: "Huruf kedua puluh satu dalam alfabet Arab",
    writingSteps: ["Buat seperti Fa", "Tambahkan dua titik di atas"],
    strokePoints: [
      { x: 75, y: 45 }, { x: 85, y: 55 }, { x: 75, y: 65 }, { x: 65, y: 55 }, { x: 75, y: 45 },
      { x: 65, y: 75 }, { x: 45, y: 85 }, { x: 25, y: 85 }, { x: 15, y: 70 },
      { x: 65, y: 25 }, { x: 85, y: 25 }
    ]
  },
  {
    id: "kaf",
    arabic: "ك",
    name: "Kaf",
    transliteration: "K",
    pronunciation: "Kaf",
    audioUrl: "/audio/hijaiyah/kaf.mp3",
    order: 22,
    description: "Huruf kedua puluh dua dalam alfabet Arab",
    writingSteps: ["Buat bentuk seperti mangkuk dengan garis di atas"],
    strokePoints: [
      { x: 30, y: 20 }, { x: 30, y: 45 }, { x: 30, y: 70 }, { x: 50, y: 75 }, { x: 75, y: 70 }, { x: 80, y: 55 },
      { x: 50, y: 45 }, { x: 65, y: 45 }
    ]
  },
  {
    id: "lam",
    arabic: "ل",
    name: "Lam",
    transliteration: "L",
    pronunciation: "Lam",
    audioUrl: "/audio/hijaiyah/lam.mp3",
    order: 23,
    description: "Huruf kedua puluh tiga dalam alfabet Arab",
    writingSteps: ["Buat garis vertikal dengan lengkungan di bawah"],
    strokePoints: [
      { x: 60, y: 20 }, { x: 60, y: 45 }, { x: 60, y: 70 }, { x: 45, y: 85 }, { x: 25, y: 80 }, { x: 15, y: 65 }
    ]
  },
  {
    id: "mim",
    arabic: "م",
    name: "Mim",
    transliteration: "M",
    pronunciation: "Mim",
    audioUrl: "/audio/hijaiyah/mim.mp3",
    order: 24,
    description: "Huruf kedua puluh empat dalam alfabet Arab",
    writingSteps: ["Buat lingkaran kecil dengan ekor"],
    strokePoints: [
      { x: 60, y: 40 }, { x: 75, y: 50 }, { x: 60, y: 60 }, { x: 45, y: 50 }, { x: 60, y: 40 },
      { x: 40, y: 40 }, { x: 20, y: 40 }, { x: 20, y: 65 }, { x: 20, y: 85 }
    ]
  },
  {
    id: "nun",
    arabic: "ن",
    name: "Nun",
    transliteration: "N",
    pronunciation: "Nun",
    audioUrl: "/audio/hijaiyah/nun.mp3",
    order: 25,
    description: "Huruf kedua puluh lima dalam alfabet Arab",
    writingSteps: ["Buat setengah lingkaran", "Tambahkan satu titik di atas"],
    strokePoints: [
      { x: 80, y: 45 }, { x: 75, y: 70 }, { x: 50, y: 80 }, { x: 25, y: 70 }, { x: 20, y: 45 },
      { x: 50, y: 25 }
    ]
  },
  {
    id: "waw",
    arabic: "و",
    name: "Waw",
    transliteration: "W",
    pronunciation: "Waw",
    audioUrl: "/audio/hijaiyah/waw.mp3",
    order: 26,
    description: "Huruf kedua puluh enam dalam alfabet Arab",
    writingSteps: ["Buat lingkaran kecil dengan garis vertikal"],
    strokePoints: [
      { x: 65, y: 45 }, { x: 75, y: 55 }, { x: 65, y: 65 }, { x: 55, y: 55 }, { x: 65, y: 45 },
      { x: 45, y: 70 }, { x: 30, y: 85 }
    ]
  },
  {
    id: "ha2",
    arabic: "ه",
    name: "Ha",
    transliteration: "H",
    pronunciation: "Ha",
    audioUrl: "/audio/hijaiyah/ha2.mp3",
    order: 27,
    description: "Huruf kedua puluh tujuh dalam alfabet Arab",
    writingSteps: ["Buat oval dengan bukaan kecil"],
    strokePoints: [
      { x: 50, y: 30 }, { x: 75, y: 50 }, { x: 50, y: 80 }, { x: 25, y: 50 }, { x: 50, y: 30 },
      { x: 50, y: 55 }
    ]
  },
  {
    id: "ya",
    arabic: "ي",
    name: "Ya",
    transliteration: "Y",
    pronunciation: "Ya",
    audioUrl: "/audio/hijaiyah/ya.mp3",
    order: 28,
    description: "Huruf kedua puluh delapan dalam alfabet Arab",
    writingSteps: ["Buat garis melengkung", "Tambahkan dua titik di bawah"],
    strokePoints: [
      { x: 80, y: 40 }, { x: 70, y: 30 }, { x: 55, y: 40 }, { x: 45, y: 55 }, { x: 50, y: 75 }, { x: 30, y: 75 }, { x: 15, y: 60 },
      { x: 35, y: 90 }, { x: 55, y: 90 }
    ]
  }
];

export const getLetterById = (id: string) => {
  return hijaiyahLetters.find(letter => letter.id === id);
};

export const getLetterByOrder = (order: number) => {
  return hijaiyahLetters.find(letter => letter.order === order);
};

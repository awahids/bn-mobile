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
  strokePoints?: { x: number; y: number }[];
}

// Fallback data for pre-login demo (3 items). Full data is served from the API.
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
];

export const getLetterById = (id: string) => {
  return hijaiyahLetters.find(letter => letter.id === id);
};

export const getLetterByOrder = (order: number) => {
  return hijaiyahLetters.find(letter => letter.order === order);
};

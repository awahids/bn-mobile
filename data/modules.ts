import { Languages, BookOpen, BookMarked, HandHeart, Brain, Sparkles, GraduationCap, LucideIcon } from "lucide-react";

export interface ModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  /** One-line description shown on the "Semua Modul" bento cards. */
  description: string;
  href: string;
  icon: LucideIcon;
  /** Icon tile: tinted background + icon color. */
  tileClass: string;
  /** Accent text color (progress ring, labels). */
  textClass: string;
  /** Solid accent background (progress bars, dots). */
  barClass: string;
}

// Class names are written out in full so Tailwind can see them.
export const MODULES: ModuleConfig[] = [
  {
    id: "hijaiyah",
    title: "Hijaiyah",
    subtitle: "28 huruf Arab",
    description: "Kenali bunyi dan latih cara menulis tiap huruf.",
    href: "/hijaiyah",
    icon: Languages,
    tileClass: "bg-primary/10 text-primary",
    textClass: "text-primary",
    barClass: "bg-primary",
  },
  {
    id: "quran",
    title: "Al-Qur'an",
    subtitle: "114 surah",
    description: "Baca, dengarkan, dan hafalkan surah pilihan.",
    href: "/quran",
    icon: BookOpen,
    tileClass: "bg-accent/15 text-accent",
    textClass: "text-accent",
    barClass: "bg-accent",
  },
  {
    id: "tajwid",
    title: "Tajwid",
    subtitle: "15 aturan baca",
    description: "Aturan bacaan lengkap dengan contoh ayat.",
    href: "/tajwid",
    icon: BookMarked,
    tileClass: "bg-chart-5/10 text-chart-5",
    textClass: "text-chart-5",
    barClass: "bg-chart-5",
  },
  {
    id: "dhikr",
    title: "Dzikir",
    subtitle: "Pagi & petang",
    description: "Dzikir harian dengan penghitung otomatis.",
    href: "/dhikr",
    icon: HandHeart,
    tileClass: "bg-chart-3/10 text-chart-3",
    textClass: "text-chart-3",
    barClass: "bg-chart-3",
  },
  {
    id: "quiz",
    title: "Kuis",
    subtitle: "6 kategori",
    description: "Uji pemahaman dengan soal bertingkat.",
    href: "/quiz",
    icon: Brain,
    tileClass: "bg-chart-4/10 text-chart-4",
    textClass: "text-chart-4",
    barClass: "bg-chart-4",
  },
  {
    id: "habits",
    title: "Habits",
    subtitle: "Tracker harian",
    description: "Bangun kebiasaan baik dengan pengingat.",
    href: "/habits",
    icon: Sparkles,
    tileClass: "bg-chart-6/10 text-chart-6",
    textClass: "text-chart-6",
    barClass: "bg-chart-6",
  },
  {
    id: "sekolah-islam",
    title: "Sekolah Islam",
    subtitle: "Direktori sekolah",
    description: "Temukan sekolah Islam untuk anak.",
    href: "/sekolah-islam",
    icon: GraduationCap,
    tileClass: "bg-primary/10 text-primary",
    textClass: "text-primary",
    barClass: "bg-primary",
  },
];

export function getModule(id: string): ModuleConfig {
  const found = MODULES.find((module) => module.id === id);
  if (!found) throw new Error(`Unknown module: ${id}`);
  return found;
}

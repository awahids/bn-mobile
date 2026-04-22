import { Languages, BookOpen, BicepsFlexed, Brain, Sparkles, GraduationCap, LucideIcon } from "lucide-react";

export interface ModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  /** Tailwind text color class for accents */
  colorClass: string;
  /** Tailwind gradient classes for icon background */
  gradientClass: string;
  /** Tailwind shadow color class for icon glow */
  shadowClass: string;
  /** Tailwind bg color class for stat bar */
  bgAccentClass: string;
  /** Tailwind border color class */
  borderAccentClass: string;
  /** Tailwind shadow/glow color class */
  glowClass: string;
  /** Tailwind hover shadow/glow class */
  hoverGlowClass: string;
}

export const MODULES: ModuleConfig[] = [
  {
    id: "hijaiyah",
    title: "Hijaiyah",
    subtitle: "28 Huruf Arab",
    href: "/hijaiyah",
    icon: Languages,
    colorClass: "text-primary",
    gradientClass: "from-primary to-primary/40",
    shadowClass: "shadow-primary/20",
    bgAccentClass: "bg-primary/10",
    borderAccentClass: "border-primary/20",
    glowClass: "shadow-primary/5",
    hoverGlowClass: "hover:shadow-primary/10",
  },
  {
    id: "quran",
    title: "Al-Qur'an",
    subtitle: "114 Surah",
    href: "/quran",
    icon: BookOpen,
    colorClass: "text-accent",
    gradientClass: "from-accent to-accent/40",
    shadowClass: "shadow-accent/20",
    bgAccentClass: "bg-accent/10",
    borderAccentClass: "border-accent/20",
    glowClass: "shadow-accent/5",
    hoverGlowClass: "hover:shadow-accent/10",
  },
  {
    id: "dhikr",
    title: "Dhikr",
    subtitle: "Pagi & Petang",
    href: "/dhikr",
    icon: BicepsFlexed,
    colorClass: "text-chart-3",
    gradientClass: "from-chart-3 to-chart-3/40",
    shadowClass: "shadow-chart-3/20",
    bgAccentClass: "bg-chart-3/10",
    borderAccentClass: "border-chart-3/20",
    glowClass: "shadow-chart-3/5",
    hoverGlowClass: "hover:shadow-chart-3/10",
  },
  {
    id: "quiz",
    title: "Kuis",
    subtitle: "4 Kategori",
    href: "/quiz",
    icon: Brain,
    colorClass: "text-chart-4",
    gradientClass: "from-chart-4 to-chart-4/40",
    shadowClass: "shadow-chart-4/20",
    bgAccentClass: "bg-chart-4/10",
    borderAccentClass: "border-chart-4/20",
    glowClass: "shadow-chart-4/5",
    hoverGlowClass: "hover:shadow-chart-4/10",
  },
  {
    id: "habits",
    title: "Habits",
    subtitle: "Tracker Harian",
    href: "/habits",
    icon: Sparkles,
    colorClass: "text-chart-5",
    gradientClass: "from-chart-5 to-chart-5/40",
    shadowClass: "shadow-chart-5/20",
    bgAccentClass: "bg-chart-5/10",
    borderAccentClass: "border-chart-5/20",
    glowClass: "shadow-chart-5/5",
    hoverGlowClass: "hover:shadow-chart-5/10",
  },
  {
    id: "sekolah-islam",
    title: "Sekolah Islam",
    subtitle: "Sekolah Islam Anak Muslim",
    href: "/sekolah-islam",
    icon: GraduationCap,
    colorClass: "text-chart-6",
    gradientClass: "from-chart-6 to-chart-6/40",
    shadowClass: "shadow-chart-6/20",
    bgAccentClass: "bg-chart-6/10",
    borderAccentClass: "border-chart-6/20",
    glowClass: "shadow-chart-6/5",
    hoverGlowClass: "hover:shadow-chart-6/10",
  },
];

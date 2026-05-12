import type { Metadata } from "next";
import { QuranPageContent } from "@/app/quran/_components/quran-page-content";

export const metadata: Metadata = {
  title: "Al-Qur'an | Belajar Ngaji",
  description: "Baca dan pelajari Al-Qur'an — 114 surah lengkap dengan terjemahan dan audio.",
};

export default function QuranPage() {
  return <QuranPageContent />;
}

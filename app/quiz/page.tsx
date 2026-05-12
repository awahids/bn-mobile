import type { Metadata } from "next";
import { QuizCategoryPageContent } from "@/app/quiz/_components/quiz-category-page-content";

export const metadata: Metadata = {
  title: "Kuis Islam | Belajar Ngaji",
  description:
    "Uji pengetahuan Islam kamu — kategori Hijaiyah, Tajwid, Ibadah, dan Pengetahuan Umum.",
};

export default function QuizCategoryPage() {
  return <QuizCategoryPageContent />;
}

import type { Metadata } from "next";
import { ProgressPageContent } from "@/app/progress/_components/progress-page-content";

export const metadata: Metadata = {
  title: "Progress Belajar | Belajar Ngaji",
  description: "Pantau progress belajar harian, mingguan, dan pencapaian kamu di semua modul.",
};

export default function ProgressPage() {
  return <ProgressPageContent />;
}

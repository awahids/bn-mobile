import type { Metadata } from "next";
import { HabitsPageContent } from "./_components/habits-page-content";

export const metadata: Metadata = {
  title: "Kebiasaan Islami | Belajar Ngaji",
  description:
    "Bangun kebiasaan baik sehari-hari dan dapatkan saran dari AI Coach untuk menjaga konsistensi ibadah.",
};

export default function HabitsPage() {
  return <HabitsPageContent />;
}

import type { Metadata } from "next";
import { HijaiyahPageContent } from "@/app/hijaiyah/_components/hijaiyah-page-content";

export const metadata: Metadata = {
  title: "Belajar Hijaiyah | Belajar Ngaji",
  description:
    "Belajar huruf Hijaiyah dengan panduan audio, latihan menulis, dan tracking progress harian.",
};

export default function HijaiyahPage() {
  return <HijaiyahPageContent />;
}

import type { Metadata } from "next";
import { DhikrPageContent } from "@/app/dhikr/_components/dhikr-page-content";

export const metadata: Metadata = {
  title: "Dzikir Pagi & Petang | Belajar Ngaji",
  description:
    "Lakukan dzikir pagi dan petang harian dengan panduan teks Arab, terjemahan, dan penghitung otomatis.",
};

export default function DhikrPage() {
  return <DhikrPageContent />;
}

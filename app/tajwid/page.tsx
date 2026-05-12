import type { Metadata } from "next";
import { TajwidPageContent } from "@/app/tajwid/_components/tajwid-page-content";

export const metadata: Metadata = {
  title: "Tajwid Interaktif | Belajar Ngaji",
  description:
    "Pelajari tajwid dengan contoh ayat interaktif, highlight huruf, dan navigasi aturan baca yang mudah dipahami.",
};

export default function TajwidPage() {
  return <TajwidPageContent />;
}

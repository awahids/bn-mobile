import type { Metadata } from "next";
import { SekolahIslamPageContent } from "./_components/sekolah-islam-page-content";

export const metadata: Metadata = {
  title: "Direktori Sekolah Islam | Belajar Ngaji",
  description:
    "Temukan referensi sekolah Islam di Indonesia — mulai dari TK hingga MA — dan bantu komunitas dengan menambahkan data sekolah baru.",
};

export default function SekolahIslamPage() {
  return <SekolahIslamPageContent />;
}

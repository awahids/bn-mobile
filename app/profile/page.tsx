import type { Metadata } from "next";
import { ProfilePageContent } from "@/app/profile/_components/profile-page-content";

export const metadata: Metadata = {
  title: "Profil | Belajar Ngaji",
  description: "Kelola profil, pencapaian, dan preferensi akun kamu.",
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}

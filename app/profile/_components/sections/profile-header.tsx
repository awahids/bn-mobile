import { StickyPageHeader } from "@/components/shared/sticky-page-header";

interface ProfileHeaderProps {
  isAuthenticated: boolean;
  onBackHome: () => void;
}

export function ProfileHeader({ onBackHome }: ProfileHeaderProps) {
  return <StickyPageHeader title="Profil" subtitle="Akun dan preferensi" onBack={onBackHome} />;
}

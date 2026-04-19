import { ArrowLeft, Edit } from "lucide-react";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  isAuthenticated: boolean;
  onBackHome: () => void;
}

export function ProfileHeader({ isAuthenticated, onBackHome }: ProfileHeaderProps) {
  return (
    <StickyPageHeader
      title="Profil"
      subtitle="Pengaturan akun dan preferensi"
      leftSlot={
        <Button variant="ghost" size="icon" onClick={onBackHome} data-testid="back-home">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      rightSlot={
        <Button variant="ghost" size="icon" disabled={!isAuthenticated} data-testid="edit-profile">
          <Edit className="w-5 h-5" />
        </Button>
      }
    />
  );
}

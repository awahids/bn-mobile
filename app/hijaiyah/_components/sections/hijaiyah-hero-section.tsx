import { GuestBanner } from "@/components/shared/guest-banner";

interface HijaiyahHeroSectionProps {
  isGuestMode: boolean;
  onLogin: () => void;
}

export function HijaiyahHeroSection({ isGuestMode, onLogin }: HijaiyahHeroSectionProps) {
  if (!isGuestMode) return null;
  return (
    <div className="px-4 pb-2 pt-4">
      <GuestBanner message="Mode tamu: progress hijaiyah belum tersimpan ke akun." onLogin={onLogin} />
    </div>
  );
}

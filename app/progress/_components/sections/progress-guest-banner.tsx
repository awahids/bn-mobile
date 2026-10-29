import { GuestBanner } from "@/components/shared/guest-banner";

interface ProgressGuestBannerProps {
  onLogin: () => void;
}

export function ProgressGuestBanner({ onLogin }: ProgressGuestBannerProps) {
  return (
    <div className="px-4 pt-4">
      <GuestBanner message="Mode tamu: progress tidak disimpan permanen." onLogin={onLogin} />
    </div>
  );
}

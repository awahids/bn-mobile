import { Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface ProfileLearningPreferencesCardProps {
  isAuthenticated: boolean;
  dailyReminder: boolean;
  onChangeDailyReminder: (checked: boolean) => void;
  autoPlayAudio: boolean;
  onChangeAutoPlayAudio: (checked: boolean) => void;
  audioEnabled: boolean;
  challengeMode: boolean;
  onChangeChallengeMode: (checked: boolean) => void;
}

export function ProfileLearningPreferencesCard({
  isAuthenticated,
  dailyReminder,
  onChangeDailyReminder,
  autoPlayAudio,
  onChangeAutoPlayAudio,
  audioEnabled,
  challengeMode,
  onChangeChallengeMode,
}: ProfileLearningPreferencesCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Languages className="w-5 h-5" />
          <span>Preferensi Belajar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Pengingat Harian</h3>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated
                ? "Pukul 19.00 jika hari ini belum belajar"
                : "Masuk untuk menerima notifikasi pengingat"}
            </p>
          </div>
          <Switch
            checked={isAuthenticated && dailyReminder}
            onCheckedChange={onChangeDailyReminder}
            disabled={!isAuthenticated}
            aria-label="Pengingat harian"
            data-testid="daily-reminder-toggle"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Auto-play Audio</h3>
            <p className="text-sm text-muted-foreground">
              {audioEnabled
                ? "Putar suara otomatis saat pindah huruf atau aturan tajwid"
                : "Aktifkan Audio di Pengaturan untuk memakai fitur ini"}
            </p>
          </div>
          <Switch
            checked={audioEnabled && autoPlayAudio}
            onCheckedChange={onChangeAutoPlayAudio}
            disabled={!audioEnabled}
            aria-label="Auto-play audio"
            data-testid="autoplay-toggle"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Mode Tantangan</h3>
            <p className="text-sm text-muted-foreground">
              {challengeMode ? "Kuis dengan batas waktu 10 menit" : "Kuis tanpa batas waktu"}
            </p>
          </div>
          <Switch
            checked={challengeMode}
            onCheckedChange={onChangeChallengeMode}
            aria-label="Mode tantangan"
            data-testid="challenge-mode-toggle"
          />
        </div>
      </CardContent>
    </Card>
  );
}

import { Bell, Moon, Settings, Sun, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ProfileMenuRow } from "@/app/profile/_components/atoms/profile-menu-row";

interface ProfileSettingsCardProps {
  isAuthenticated: boolean;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  notifications: boolean;
  onChangeNotifications: (checked: boolean) => void;
  audioEnabled: boolean;
  onChangeAudioEnabled: (checked: boolean) => void;
}

export function ProfileSettingsCard({
  isAuthenticated,
  isDarkTheme,
  onToggleTheme,
  notifications,
  onChangeNotifications,
  audioEnabled,
  onChangeAudioEnabled,
}: ProfileSettingsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Pengaturan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileMenuRow
          title="Pengaturan Tema"
          description="Mode gelap/terang"
          icon={isDarkTheme ? Moon : Sun}
          action={<Switch checked={isDarkTheme} onCheckedChange={onToggleTheme} data-testid="theme-toggle" />}
        />

        <ProfileMenuRow
          title="Notifikasi"
          description="Pengingat waktu belajar"
          icon={Bell}
          action={
            <Switch
              checked={notifications}
              onCheckedChange={onChangeNotifications}
              disabled={!isAuthenticated}
              data-testid="notifications-toggle"
            />
          }
        />

        <ProfileMenuRow
          title="Audio"
          description="Suara pengucapan dan bacaan"
          icon={Volume2}
          action={
            <Switch
              checked={audioEnabled}
              onCheckedChange={onChangeAudioEnabled}
              disabled={!isAuthenticated}
              data-testid="audio-toggle"
            />
          }
        />
      </CardContent>
    </Card>
  );
}

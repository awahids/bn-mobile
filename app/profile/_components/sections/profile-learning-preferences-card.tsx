import { Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface ProfileLearningPreferencesCardProps {
  isAuthenticated: boolean;
}

export function ProfileLearningPreferencesCard({ isAuthenticated }: ProfileLearningPreferencesCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Languages className="w-5 h-5" />
          <span>Preferensi Belajar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Pengingat Harian</h3>
            <p className="text-sm text-muted-foreground">Notifikasi untuk belajar rutin</p>
          </div>
          <Switch defaultChecked disabled={!isAuthenticated} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Auto-play Audio</h3>
            <p className="text-sm text-muted-foreground">Mainkan audio secara otomatis</p>
          </div>
          <Switch defaultChecked={false} disabled={!isAuthenticated} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Mode Tantangan</h3>
            <p className="text-sm text-muted-foreground">Kuis dengan waktu terbatas</p>
          </div>
          <Switch defaultChecked disabled={!isAuthenticated} />
        </div>
      </CardContent>
    </Card>
  );
}

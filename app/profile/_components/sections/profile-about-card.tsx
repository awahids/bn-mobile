import { ArrowLeft, Info, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileMenuRow } from "@/app/profile/_components/atoms/profile-menu-row";

export function ProfileAboutCard() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tentang Aplikasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileMenuRow title="Versi Aplikasi" description="1.0.0" icon={Smartphone} action={null} />
        <ProfileMenuRow
          title="Tentang"
          description="Platform pembelajaran Al-Qur'an"
          icon={Info}
          action={
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}

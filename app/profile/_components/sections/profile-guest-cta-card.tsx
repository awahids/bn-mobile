import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileGuestCtaCardProps {
  onLogin: () => void;
}

export function ProfileGuestCtaCard({ onLogin }: ProfileGuestCtaCardProps) {
  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Masuk untuk Melihat Progress</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Lacak pembelajaran, simpan progress, dan dapatkan pencapaian dengan masuk ke akun Anda
        </p>
        <Button onClick={onLogin} className="w-full">
          Masuk Sekarang
        </Button>
      </CardContent>
    </Card>
  );
}

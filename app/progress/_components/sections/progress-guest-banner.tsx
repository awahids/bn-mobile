import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressGuestBannerProps {
  onLogin: () => void;
}

export function ProgressGuestBanner({ onLogin }: ProgressGuestBannerProps) {
  return (
    <div className="px-4 pt-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">Mode tamu aktif. Progress tidak disimpan permanen.</p>
          <Button size="sm" onClick={onLogin}>
            Masuk untuk simpan progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

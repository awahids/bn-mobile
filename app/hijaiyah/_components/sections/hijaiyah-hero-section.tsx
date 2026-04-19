import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HijaiyahHeroSectionProps {
  isGuestMode: boolean;
  onLogin: () => void;
}

export function HijaiyahHeroSection({ isGuestMode, onLogin }: HijaiyahHeroSectionProps) {
  return (
    <section className="relative pt-4 pb-8 px-6 mesh-gradient rounded-b-[3rem] shadow-xl shadow-primary/5 mb-6">
      {isGuestMode && (
        <Card className="relative z-10 mb-4 border-primary/20 bg-primary/10">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">Mode tamu aktif. Progress hijaiyah belum tersimpan ke akun.</p>
            <Button size="sm" onClick={onLogin}>
              Masuk untuk simpan progress
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="relative z-10 p-6 bg-white/20 backdrop-blur-md rounded-[2.5rem] border border-white/30 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Progres Belajar</h2>
            <p className="text-xs font-medium text-muted-foreground">Lanjutkan langkahmu hari ini</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-2xl">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DhikrHeroSectionProps {
  isAuthenticated: boolean;
  currentSession: "morning" | "evening";
  totalCompleted: number;
  totalDhikr: number;
  completionPercentage: number;
  onLogin: () => void;
}

export function DhikrHeroSection({
  isAuthenticated,
  currentSession,
  totalCompleted,
  totalDhikr,
  completionPercentage,
  onLogin,
}: DhikrHeroSectionProps) {
  return (
    <section className="relative pt-8 pb-12 px-6 mesh-gradient rounded-b-[3rem] shadow-xl shadow-primary/5 mb-8">
      <div className="relative z-10">
        {!isAuthenticated && (
          <Card className="mb-6 border-primary/20 bg-primary/10">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">Mode tamu aktif. Hitungan dzikir tidak tersimpan ke akun.</p>
              <Button size="sm" onClick={onLogin}>
                Masuk untuk sinkronisasi
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm animate-float">
              {currentSession === "morning" ? (
                <Sun className="w-6 h-6 text-chart-3" />
              ) : (
                <Moon className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-none mb-1">
                Dzikir {currentSession === "morning" ? "Pagi" : "Petang"}
              </h2>
              <p className="text-xs font-medium text-muted-foreground">Kumpulkan pahala hari ini</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary">{totalCompleted}</span>
            <span className="text-xs font-bold text-muted-foreground">/{totalDhikr}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-background/30 backdrop-blur-sm h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.5)]"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            <span>Bismillah</span>
            <span>Alhamdulillah</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
    </section>
  );
}

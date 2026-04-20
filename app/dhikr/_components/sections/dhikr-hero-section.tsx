import { Moon, Sun } from "lucide-react";
import {
  motion as framerMotion,
  AnimatePresence as FramerAnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const motion = framerMotion as any;
const AnimatePresence = FramerAnimatePresence as any;

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
    <section className="relative pt-6 pb-8 px-6 mesh-gradient rounded-b-[2.5rem] shadow-2xl shadow-primary/10 mb-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="mb-4 border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                <CardContent className="p-3 text-center">
                  <p className="text-[12px] text-foreground/80 font-medium mb-2">Mode tamu aktif. Hitungan dzikir tidak tersimpan.</p>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={onLogin}
                    className="rounded-full h-8 px-4 text-xs bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    Masuk Akun
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/30 backdrop-blur-xl rounded-[1.5rem] border border-white/40 shadow-xl shadow-primary/5"
            >
              {currentSession === "morning" ? (
                <Sun className="w-6 h-6 text-orange-500 fill-orange-500/20" />
              ) : (
                <Moon className="w-6 h-6 text-primary fill-primary/20" />
              )}
            </motion.div>
            <div>
              <motion.h2 
                className="text-lg font-black text-foreground tracking-tight leading-none mb-1"
              >
                Dzikir {currentSession === "morning" ? "Pagi" : "Petang"}
              </motion.h2>
              <motion.p 
                className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest"
              >
                Kumpulkan pahala hari ini
              </motion.p>
            </div>
          </div>
          <motion.div 
            className="text-right"
          >
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-primary leading-none tabular-nums">
                {totalCompleted}
              </span>
              <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">
                DARI {totalDhikr}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-white/20 backdrop-blur-sm h-3 rounded-full overflow-hidden border border-white/30 p-0.5 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full relative overflow-hidden"
            >
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
              />
            </motion.div>
          </div>
          <div className="flex justify-between text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.25em] px-1">
            <span>Bismillah</span>
            <span className={completionPercentage === 100 ? "text-primary" : ""}>
              {completionPercentage === 100 ? "Selesai" : "Alhamdulillah"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-[-30%] right-[-15%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
}

"use client";

import Image from "next/image";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shared/theme-provider";

interface HeroSectionProps {
  user: any;
}

export function HeroSection({ user }: HeroSectionProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="relative overflow-hidden pt-8 pb-12 px-6 mesh-gradient rounded-b-[2.5rem] shadow-xl shadow-primary/5 safe-p-top">
      <div className="relative z-10 flex flex-col space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-1.5 shadow-inner">
              <Image
                src="/images/logo/image.png"
                alt="Belajar Ngaji"
                width={48}
                height={48}
                className="h-full w-full object-cover rounded-xl"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground/90 tracking-tight">Belajar Ngaji</h1>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Aktif Belajar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-background/40 backdrop-blur-md border border-white/20 hover:bg-background/60 transition-all duration-300"
              data-testid="toggle-theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-accent" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-background/40 backdrop-blur-md border border-white/20 hover:bg-background/60 transition-all duration-300"
              data-testid="notifications"
            >
              <Bell className="w-4 h-4 text-foreground/70" />
            </Button>
          </div>
        </header>

        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            Assalamu&apos;alaikum,
            <span className="block text-primary">Sobat Ngaji ✨</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Lanjutkan langkahmu menuju keberkahan hari ini.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="glass p-4 rounded-3xl flex flex-col justify-between space-y-2 border-primary/10 shadow-sm">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Streak Saya</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-primary">{user?.streak || 7}</span>
              <span className="text-xs font-bold text-primary/60">HARI</span>
            </div>
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-3/4 animate-pulse-soft" />
            </div>
          </div>
          <div className="glass p-4 rounded-3xl flex flex-col justify-between space-y-2 border-accent/10 shadow-sm">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Target Hari Ini</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-accent">{user?.dailyProgress || 3}</span>
              <span className="text-xs font-bold text-accent/60">/ 5</span>
            </div>
            <div className="h-1.5 w-full bg-accent/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-1000"
                style={{ width: `${((user?.dailyProgress || 3) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
    </section>
  );
}

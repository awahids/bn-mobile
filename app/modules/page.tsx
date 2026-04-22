"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { MODULES } from "@/data/modules";

export default function ModulesPage() {
  return (
    <MobilePageShell className="pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background px-6 py-8">
        <div className="relative flex items-center gap-4">
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 flex flex-col items-center justify-center hover:bg-background/80 transition-colors">
              <ChevronLeft size={24} className="text-foreground/80" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-foreground text-balance">Semua Modul</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Pilih materi belajar anda</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="grid grid-cols-2 gap-4">
          {MODULES.map((module) => {
            const Icon = module.icon;

            return (
              <Link key={module.id} href={module.href} className="group">
                <div
                  className={`relative glass p-5 rounded-[2.5rem] transition-all duration-300 active:scale-95 flex flex-col h-full bg-card/40 dark:bg-card/20 border hover:shadow-xl ${module.borderAccentClass} ${module.glowClass} ${module.hoverGlowClass}`}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg group-hover:animate-float ${module.gradientClass} ${module.shadowClass}`}
                  >
                    <Icon className="text-white w-7 h-7" />
                  </div>
                  <h4 className="font-black text-card-foreground text-xl mb-1 leading-none tracking-tighter">
                    {module.title}
                  </h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                    {module.subtitle}
                  </p>
                  <div className="mt-8 pt-4 flex justify-end">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${module.bgAccentClass} ${module.borderAccentClass} ${module.colorClass}`}
                    >
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <BottomNavigation />
    </MobilePageShell>
  );
}

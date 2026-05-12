"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronRight, Trophy } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { MODULES } from "@/data/modules";
import { cn } from "@/lib/utils";

interface LearningModulesSectionProps {
  stats: {
    hijaiyah: { completed: number; total: number; progress: number };
    tajwid: { completed: number; total: number; progress: number };
    quran: { bookmarked: number; total: number; lastReadLabel: string };
    dhikr: { todayCount: number; progress: number };
    quiz: { bestScore: number; attempts: number };
    habits?: { rate: number; itemsDone: number; totalItems: number };
  };
}

export function LearningModulesSection({ stats }: LearningModulesSectionProps) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const topModules = MODULES.filter((module) =>
    ["hijaiyah", "quran", "tajwid", "quiz"].includes(module.id)
  ).slice(0, 4);

  return (
    <section className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Modul Pilihan</h3>
        <Link
          href="/modules"
          className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-tighter hover:bg-primary/20 active:scale-95 transition-all"
        >
          Explore All
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {topModules.map((module) => {
          const Icon = module.icon;

          return (
            <Link key={module.id} href={module.href} prefetch={true} className="group" data-testid={`module-${module.id}`}>
              <div className={cn(
                "relative glass p-5 rounded-[2rem] transition-all duration-300 active:scale-95 flex flex-col h-full bg-card/40 dark:bg-card/20",
                "border hover:shadow-xl",
                module.borderAccentClass,
                module.glowClass,
                module.hoverGlowClass
              )}>
                <div className={cn(
                  "w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg group-hover:animate-float",
                  module.gradientClass,
                  module.shadowClass
                )}>
                  <Icon className="text-white w-full h-full" />
                </div>
                <h4 className="font-black text-card-foreground text-lg mb-1 leading-none tracking-tighter">
                  {module.title}
                </h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-60 mb-4">{module.subtitle}</p>

                {/* Bottom section with flex-grow to push to bottom */}
                <div className="mt-auto">
                    {/* Stats Rendering based on module type */}
                    {module.id === "hijaiyah" && (
                    <div className={cn("flex items-center justify-between p-2 rounded-2xl border", module.bgAccentClass, module.borderAccentClass)}>
                        <span className={cn("text-[10px] font-black uppercase", module.colorClass)}>
                        {hasHydrated ? `${stats.hijaiyah.completed}/${stats.hijaiyah.total}` : "—"}
                        </span>
                        <ProgressRing
                        progress={hasHydrated ? stats.hijaiyah.progress : 0}
                        size={24}
                        className={module.colorClass}
                        />
                    </div>
                    )}

                    {module.id === "quran" && (
                    <div className={cn("flex items-center justify-between p-2 rounded-2xl min-h-[40px] border", module.bgAccentClass, module.borderAccentClass)}>
                        <span className={cn("text-[10px] font-black uppercase leading-tight max-w-[70%] truncate", module.colorClass)}>
                        {hasHydrated ? stats.quran.lastReadLabel : "Al-Qur'an"}
                        </span>
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center p-1.5 shadow-sm shrink-0", module.colorClass.replace("text-", "bg-"))}>
                        <Bookmark className="text-white w-full h-full" />
                        </div>
                    </div>
                    )}

                    {module.id === "dhikr" && (
                    <div className={cn("flex items-center justify-between p-2 rounded-2xl border", module.bgAccentClass, module.borderAccentClass)}>
                        <span className={cn("text-[10px] font-black uppercase", module.colorClass)}>{hasHydrated ? stats.dhikr.todayCount : 0}x</span>
                        <ProgressRing
                        progress={hasHydrated ? stats.dhikr.progress : 0}
                        size={24}
                        className={module.colorClass}
                        />
                    </div>
                    )}

                    {module.id === "tajwid" && (
                    <div className={cn("flex items-center justify-between p-2 rounded-2xl border", module.bgAccentClass, module.borderAccentClass)}>
                        <span className={cn("text-[10px] font-black uppercase", module.colorClass)}>
                        {hasHydrated ? `${stats.tajwid.completed}/${stats.tajwid.total}` : "—"}
                        </span>
                        <ProgressRing
                        progress={hasHydrated ? stats.tajwid.progress : 0}
                        size={24}
                        className={module.colorClass}
                        />
                    </div>
                    )}

                    {module.id === "quiz" && (
                    <div className={cn("flex items-center justify-between p-2 rounded-2xl border", module.bgAccentClass, module.borderAccentClass)}>
                        <span className={cn("text-[10px] font-black uppercase", module.colorClass)}>
                        {hasHydrated ? `${stats.quiz.bestScore}%` : "0%"}
                        </span>
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center p-1.5 shadow-sm", module.colorClass.replace("text-", "bg-"))}>
                        <Trophy className="text-white w-full h-full" />
                        </div>
                    </div>
                    )}

                    {module.id === "habits" && stats.habits && (
                    <div className={cn("flex items-center justify-between p-2 rounded-2xl border", module.bgAccentClass, module.borderAccentClass)}>
                        <span className={cn("text-[10px] font-black uppercase", module.colorClass)}>
                        {hasHydrated ? `${stats.habits.itemsDone}/${stats.habits.totalItems}` : "—"}
                        </span>
                        <ProgressRing
                        progress={hasHydrated ? stats.habits.rate : 0}
                        size={24}
                        className={module.colorClass}
                        />
                    </div>
                    )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

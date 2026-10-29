"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getModule } from "@/data/modules";
import { SectionHeader } from "@/components/shared/section-header";
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

interface ModuleTile {
  id: string;
  stat: string;
  progress: number | null;
}

export function LearningModulesSection({ stats }: LearningModulesSectionProps) {
  // Stats come from client-only sources (API, localStorage); render neutral
  // values on the server to avoid a hydration mismatch.
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const tiles: ModuleTile[] = [
    {
      id: "hijaiyah",
      stat: `${stats.hijaiyah.completed}/${stats.hijaiyah.total} huruf`,
      progress: stats.hijaiyah.progress,
    },
    { id: "quran", stat: stats.quran.lastReadLabel, progress: null },
    {
      id: "tajwid",
      stat: `${stats.tajwid.completed}/${stats.tajwid.total} aturan`,
      progress: stats.tajwid.progress,
    },
    {
      id: "quiz",
      stat: stats.quiz.attempts > 0 ? `Skor terbaik ${stats.quiz.bestScore}%` : "Belum ada kuis",
      progress: stats.quiz.attempts > 0 ? stats.quiz.bestScore : null,
    },
  ];

  return (
    <section className="px-4 pt-6">
      <SectionHeader
        title="Menu Belajar"
        action={
          <Link href="/modules" className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline">
            Semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => {
          const moduleInfo = getModule(tile.id);
          const Icon = moduleInfo.icon;
          const progress = hasHydrated ? tile.progress : null;

          return (
            <Link
              key={moduleInfo.id}
              href={moduleInfo.href}
              className="group flex flex-col rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
              data-testid={`module-${moduleInfo.id}`}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", moduleInfo.tileClass)}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold tracking-tight">{moduleInfo.title}</h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {hasHydrated ? tile.stat : moduleInfo.subtitle}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", moduleInfo.barClass)}
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

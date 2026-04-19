"use client";

import Link from "next/link";
import { Languages, BookOpen, BicepsFlexed, Brain, Bookmark, Trophy } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";

interface LearningModulesSectionProps {
  stats: {
    hijaiyah: { completed: number; total: number; progress: number };
    quran: { bookmarked: number; total: number; lastReadLabel: string };
    dhikr: { todayCount: number; progress: number };
    quiz: { bestScore: number; attempts: number };
  };
}

export function LearningModulesSection({ stats }: LearningModulesSectionProps) {
  return (
    <section className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Modul Pilihan</h3>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">Explore All</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Hijaiyah Module */}
        <Link href="/hijaiyah" prefetch={true} className="group" data-testid="module-hijaiyah">
          <div className="relative glass p-5 rounded-[2rem] border-primary/5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-chart-1 to-chart-1/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-1/10 group-hover:animate-float">
              <Languages className="text-white w-full h-full" />
            </div>
            <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Hijaiyah</h4>
            <p className="text-xs text-muted-foreground mb-4">28 Huruf Arab</p>
            <div className="flex items-center justify-between bg-primary/5 p-2 rounded-2xl">
              <span className="text-[10px] font-black text-primary uppercase">{stats.hijaiyah.completed}/{stats.hijaiyah.total}</span>
              <ProgressRing
                progress={stats.hijaiyah.progress}
                size={24}
                className="text-primary"
              />
            </div>
          </div>
        </Link>

        {/* Al-Quran Module */}
        <Link href="/quran" prefetch={true} className="group" data-testid="module-quran">
          <div className="relative glass p-5 rounded-[2rem] border-secondary/5 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/5 active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-chart-2 to-chart-2/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-2/10 group-hover:animate-float">
              <BookOpen className="text-white w-full h-full" />
            </div>
            <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Al-Qur&apos;an</h4>
            <p className="text-xs text-muted-foreground mb-4">114 Surah</p>
            <div className="flex items-center justify-between bg-accent/5 p-2 rounded-2xl">
              <span className="text-[10px] font-black text-accent uppercase">
                {stats.quran.lastReadLabel}
              </span>
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center p-1.5 shadow-sm">
                <Bookmark className="text-white w-full h-full" />
              </div>
            </div>
          </div>
        </Link>

        {/* Dhikr Module */}
        <Link href="/dhikr" prefetch={true} className="group" data-testid="module-dhikr">
          <div className="relative glass p-5 rounded-[2rem] border-chart-3/5 transition-all duration-300 hover:shadow-xl hover:shadow-chart-3/5 active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-chart-3 to-chart-3/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-3/10 group-hover:animate-float">
              <BicepsFlexed className="text-white w-full h-full" />
            </div>
            <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Dhikr</h4>
            <p className="text-xs text-muted-foreground mb-4">Pagi & Petang</p>
            <div className="flex items-center justify-between bg-chart-3/5 p-2 rounded-2xl">
              <span className="text-[10px] font-black text-chart-3 uppercase">{stats.dhikr.todayCount}x</span>
              <ProgressRing
                progress={stats.dhikr.progress}
                size={24}
                className="text-chart-3"
              />
            </div>
          </div>
        </Link>

        {/* Quiz Module */}
        <Link href="/quiz" prefetch={true} className="group" data-testid="module-quiz">
          <div className="relative glass p-5 rounded-[2rem] border-chart-4/5 transition-all duration-300 hover:shadow-xl hover:shadow-chart-4/5 active:scale-95">
            <div className="w-14 h-14 bg-gradient-to-br from-chart-4 to-chart-4/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-4/10 group-hover:animate-float">
              <Brain className="text-white w-full h-full" />
            </div>
            <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Kuis</h4>
            <p className="text-xs text-muted-foreground mb-4">4 Kategori</p>
            <div className="flex items-center justify-between bg-chart-4/5 p-2 rounded-2xl">
              <span className="text-[10px] font-black text-chart-4 uppercase">
                Skor: {stats.quiz.bestScore}%
              </span>
              <div className="w-6 h-6 bg-chart-4 rounded-full flex items-center justify-center p-1.5 shadow-sm">
                <Trophy className="text-white w-full h-full" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

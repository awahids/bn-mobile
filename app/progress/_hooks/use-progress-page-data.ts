import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { BookMarked, BookOpen, Brain, BicepsFlexed, Flame, Trophy, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const IconMap: Record<string, LucideIcon> = {
  Languages,
  BookOpen,
  BookMarked,
  Brain,
  BicepsFlexed,
  Flame,
  Trophy,
};

interface LearningStats {
  hijaiyah: {
    completed: number;
    total: number;
    progress: number;
  };
  quran: {
    bookmarked: number;
    total: number;
    progress: number;
  };
  dhikr: {
    todayCount: number;
    progress: number;
  };
  quiz: {
    bestScore: number;
    attempts: number;
  };
  hafalan: {
    completed: number;
    total: number;
    progress: number;
  };
}

export interface ModuleProgressSummary {
  module: string;
  icon: typeof Languages;
  progress: number;
  completed: number;
  total: number;
  color: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
  date: string | null;
}

export interface WeeklyActivityItem {
  day: string;
  completed: boolean;
}

function calculateStats(progressData: any[], quizStats?: any): LearningStats {
  const hijaiyahProgress = progressData.filter((p) => p.module === "hijaiyah");
  const quranProgress = progressData.filter((p) => p.module === "quran");
  const dhikrProgress = progressData.filter((p) => p.module === "dhikr");
  const hafalanProgress = progressData.filter((p) => p.module === "hafalan");

  return {
    hijaiyah: {
      completed: hijaiyahProgress.filter((p) => p.completed).length,
      total: 28,
      progress:
        hijaiyahProgress.length > 0
          ? Math.round(hijaiyahProgress.reduce((sum, p) => sum + p.progress, 0) / hijaiyahProgress.length)
          : 0,
    },
    quran: {
      bookmarked: quranProgress.length,
      total: 114,
      progress: Math.round((quranProgress.length / 114) * 100),
    },
    dhikr: {
      todayCount: dhikrProgress.filter((p) => p.completed).length,
      progress: dhikrProgress.length > 0 ? 100 : 0,
    },
    quiz: {
      bestScore: quizStats?.bestScore || 0,
      attempts: quizStats?.totalAttempts || 0,
    },
    hafalan: {
      completed: hafalanProgress.filter((p) => p.completed).length,
      total: hafalanProgress.length,
      progress:
        hafalanProgress.length > 0
          ? Math.round(
            (hafalanProgress.filter((p) => p.completed).length /
              hafalanProgress.length) *
            100
          )
          : 0,
    },
  };
}

export function useProgressPageData() {
  const { status, isAuthenticated } = useAuth();
  const isGuestMode = status !== "loading" && !isAuthenticated;

  const { data: user, error: userError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => api.user.getProfile(),
    enabled: status === "authenticated",
    retry: false,
  });

  const { data: progressData = [] } = useQuery({
    queryKey: ["user-progress"],
    queryFn: () => api.progress.getProgress(),
    enabled: status === "authenticated",
    retry: false,
  });

  const { data: quizStats } = useQuery({
    queryKey: ["quiz-stats"],
    queryFn: () => api.quiz.getStats(),
    enabled: status === "authenticated",
    retry: false,
  });

  const { data: quizAttempts = [] } = useQuery({
    queryKey: ["quiz-attempts"],
    queryFn: () => api.quiz.getAttempts(),
    enabled: status === "authenticated",
    retry: false,
  });

  const { data: rawAchievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => api.progress.getAchievements(),
    enabled: status === "authenticated",
  });

  const { data: rawWeeklyActivity = [] } = useQuery({
    queryKey: ["weekly-activity"],
    queryFn: () => api.progress.getWeeklyActivity(),
    enabled: status === "authenticated",
  });

  const recentProgress = useMemo(() => progressData.slice(0, 10), [progressData]);

  const stats = useMemo(() => calculateStats(progressData, quizStats), [progressData, quizStats]);

  const overallProgress: ModuleProgressSummary[] = useMemo(
    () => [
      {
        module: "Hijaiyah",
        icon: Languages,
        progress: stats.hijaiyah.progress,
        completed: stats.hijaiyah.completed,
        total: stats.hijaiyah.total,
        color: "chart-1",
      },
      {
        module: "Al-Qur'an",
        icon: BookOpen,
        progress: Math.round((stats.quran.bookmarked / stats.quran.total) * 100),
        completed: stats.quran.bookmarked,
        total: stats.quran.total,
        color: "chart-2",
      },
      {
        module: "Dhikr",
        icon: BicepsFlexed,
        progress: stats.dhikr.todayCount > 0 ? 100 : 0,
        completed: stats.dhikr.todayCount,
        total: 7,
        color: "chart-3",
      },
      {
        module: "Kuis",
        icon: Brain,
        progress: stats.quiz.bestScore,
        completed: stats.quiz.attempts,
        total: 100,
        color: "chart-4",
      },
      {
        module: "Hafalan",
        icon: BookMarked,
        progress: stats.hafalan.progress,
        completed: stats.hafalan.completed,
        total: stats.hafalan.total,
        color: "chart-5",
      },
    ],
    [stats]
  );

  const achievements: AchievementItem[] = useMemo(
    () =>
      rawAchievements.map((item) => ({
        ...item,
        icon: IconMap[item.icon] || Trophy,
      })),
    [rawAchievements]
  );

  const weeklyActivity: WeeklyActivityItem[] = useMemo(
    () => {
      if (!isAuthenticated || rawWeeklyActivity.length === 0) {
        return [
          { day: "Sen", completed: false },
          { day: "Sel", completed: false },
          { day: "Rab", completed: false },
          { day: "Kam", completed: false },
          { day: "Jum", completed: false },
          { day: "Sab", completed: false },
          { day: "Min", completed: false },
        ];
      }
      return rawWeeklyActivity;
    },
    [isAuthenticated, rawWeeklyActivity]
  );

  const displayStreak = isAuthenticated ? (user?.streak || 0) : 0;
  const latestQuizAttempt = quizAttempts[0];

  return {
    status,
    isAuthenticated,
    isGuestMode,
    userError,
    quizStats,
    quizAttempts,
    latestQuizAttempt,
    recentProgress,
    overallProgress,
    achievements,
    weeklyActivity,
    displayStreak,
  };
}

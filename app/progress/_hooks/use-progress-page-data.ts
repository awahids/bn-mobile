import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Brain, BicepsFlexed, Flame, Trophy, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
}

export interface ModuleProgressSummary {
  module: string;
  icon: typeof Languages;
  progress: number;
  completed: number;
  total: number;
  color: "chart-1" | "chart-2" | "chart-3" | "chart-4";
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
    ],
    [stats]
  );

  const achievements: AchievementItem[] = useMemo(
    () => [
      {
        id: "first-letter",
        title: "Huruf Pertama",
        description: "Selesaikan huruf Hijaiyah pertama",
        icon: Languages,
        unlocked: stats.hijaiyah.completed > 0,
        date: "2 hari lalu",
      },
      {
        id: "week-streak",
        title: "Seminggu Berturut",
        description: "Belajar 7 hari berturut-turut",
        icon: Flame,
        unlocked: (user?.streak || 0) >= 7,
        date: "Hari ini",
      },
      {
        id: "quiz-master",
        title: "Master Kuis",
        description: "Dapatkan skor 90% atau lebih",
        icon: Trophy,
        unlocked: stats.quiz.bestScore >= 90,
        date: "1 hari lalu",
      },
      {
        id: "dhikr-complete",
        title: "Dhikr Lengkap",
        description: "Selesaikan dhikr pagi dan petang",
        icon: BicepsFlexed,
        unlocked: false,
        date: null,
      },
    ],
    [stats.hijaiyah.completed, stats.quiz.bestScore, user?.streak]
  );

  const weeklyActivity: WeeklyActivityItem[] = useMemo(
    () =>
      isAuthenticated
        ? [
            { day: "Sen", completed: true },
            { day: "Sel", completed: true },
            { day: "Rab", completed: false },
            { day: "Kam", completed: true },
            { day: "Jum", completed: true },
            { day: "Sab", completed: false },
            { day: "Min", completed: true },
          ]
        : [
            { day: "Sen", completed: false },
            { day: "Sel", completed: false },
            { day: "Rab", completed: false },
            { day: "Kam", completed: false },
            { day: "Jum", completed: false },
            { day: "Sab", completed: false },
            { day: "Min", completed: false },
          ],
    [isAuthenticated]
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

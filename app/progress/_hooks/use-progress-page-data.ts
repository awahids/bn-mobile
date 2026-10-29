import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { BookMarked, BookOpen, Brain, HandHeart, Flame, Trophy, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { summarizeModuleProgress } from "@/app/progress/_lib/module-progress";

export const IconMap: Record<string, LucideIcon> = {
  Languages,
  BookOpen,
  BookMarked,
  Brain,
  HandHeart,
  Flame,
  Trophy,
};

export interface ModuleProgressSummary {
  module: string;
  icon: typeof Languages;
  progress: number;
  /** e.g. "2/28 huruf" or "Skor terbaik 80% · 3 kuis" */
  detail: string;
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

function toLocalDateKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
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

  const todayKey = useMemo(() => toLocalDateKey(), []);
  const { data: dhikrs = [] } = useQuery({
    queryKey: ["dhikrs"],
    queryFn: () => api.dhikr.getDhikrs(),
    staleTime: 1000 * 60 * 60 * 24,
  });
  const { data: dhikrCounters = [] } = useQuery({
    queryKey: ["home-dhikr-counters", todayKey],
    queryFn: () => api.dhikr.getCounters(todayKey),
    enabled: status === "authenticated",
    retry: false,
  });

  const summary = useMemo(
    () =>
      summarizeModuleProgress({
        progress: progressData,
        quizStats,
        dhikrCounters,
        // A dhikr marked "both" is read in the morning and evening session.
        dhikrTotal: dhikrs.reduce((sum, dhikr) => sum + (dhikr.session === "both" ? 2 : 1), 0),
      }),
    [dhikrCounters, dhikrs, progressData, quizStats]
  );

  const overallProgress: ModuleProgressSummary[] = useMemo(
    () => [
      { module: "Hijaiyah", icon: Languages, color: "chart-1", ...summary.hijaiyah },
      { module: "Al-Qur'an", icon: BookOpen, color: "chart-2", ...summary.quran },
      { module: "Dzikir", icon: HandHeart, color: "chart-3", ...summary.dhikr },
      { module: "Kuis", icon: Brain, color: "chart-4", ...summary.quiz },
      { module: "Hafalan", icon: BookMarked, color: "chart-5", ...summary.hafalan },
    ],
    [summary]
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

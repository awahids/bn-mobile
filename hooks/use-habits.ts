import { useState, useEffect, useMemo } from "react";

const HABITS_STORAGE_KEY = "hf_habits";
const COMPLETIONS_STORAGE_KEY = "hf_completions";

export interface Habit {
  id: string;
  name: string;
  category: string;
  reminderTime: string;
  reminderEnabled: boolean;
  createdAt: string;
}

export interface Completions {
  [date: string]: {
    [habitId: string]: boolean;
  };
}

export const CATEGORIES = ["Health", "Learning", "Mindfulness", "Fitness", "Social", "Finance", "Other"];
export const CAT_COLOR: Record<string, string> = {
  Health: "#10b981",
  Learning: "#3b82f6",
  Mindfulness: "#8b5cf6",
  Fitness: "#f59e0b",
  Social: "#ec4899",
  Finance: "#6366f1",
  Other: "#6b7280"
};

export const today = () => new Date().toISOString().split("T")[0];

export function getStreak(habitId: string, completions: Completions) {
  const d = new Date();
  const t = today();
  if (!completions[t]?.[habitId]) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (true) {
    const ds = d.toISOString().split("T")[0];
    if (completions[ds]?.[habitId]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completions>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const h = localStorage.getItem(HABITS_STORAGE_KEY);
    const c = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
    if (h) setHabits(JSON.parse(h));
    if (c) setCompletions(JSON.parse(c));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(completions));
    }
  }, [completions, loaded]);

  const toggleHabit = (id: string, date = today()) => {
    setCompletions((prev) => {
      const day = { ...(prev[date] || {}) };
      if (day[id]) {
        delete day[id];
      } else {
        day[id] = true;
      }
      return { ...prev, [date]: day };
    });
  };

  const saveHabit = (habit: Omit<Habit, "id" | "createdAt">, id?: string) => {
    if (id) {
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...habit } : h)));
    } else {
      const newHabit: Habit = {
        ...habit,
        id: Date.now().toString(),
        createdAt: today(),
      };
      setHabits((prev) => [...prev, newHabit]);
    }
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const stats = useMemo(() => {
    const t = today();
    const doneToday = Object.keys(completions[t] || {}).length;
    const totalHabits = habits.length;
    const rate = totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0;
    
    return {
      doneToday,
      totalHabits,
      rate,
    };
  }, [habits, completions]);

  return {
    habits,
    completions,
    loaded,
    toggleHabit,
    saveHabit,
    deleteHabit,
    stats,
  };
}

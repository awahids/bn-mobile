import { useCallback, useEffect, useMemo, useState } from "react";
import api, {
  isApiError,
  type HabitCompletionItem,
  type HabitItem,
} from "@/lib/api";
import { useAuth } from "./use-auth";

const LOCAL_HABITS_KEY = "bn_local_habits";
const LOCAL_COMPLETIONS_KEY = "bn_local_completions";

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

function toHabit(item: HabitItem): Habit {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    reminderTime: item.reminderTime || "",
    reminderEnabled: !!item.reminderEnabled,
    createdAt: item.createdAt ? String(item.createdAt).slice(0, 10) : today(),
  };
}

function toCompletionMap(items: HabitCompletionItem[]): Completions {
  const result: Completions = {};
  for (const item of items) {
    if (!item.completed) continue;
    if (!result[item.date]) {
      result[item.date] = {};
    }
    result[item.date][item.habitId] = true;
  }
  return result;
}

function removeCompletionForHabit(prev: Completions, habitID: string): Completions {
  const next: Completions = {};
  for (const [date, entries] of Object.entries(prev)) {
    if (!entries[habitID]) {
      next[date] = entries;
      continue;
    }
    const day = { ...entries };
    delete day[habitID];
    next[date] = day;
  }
  return next;
}

export function useHabits() {
  const { isAuthenticated, status } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completions>({});
  const [loaded, setLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to load from local storage
  const loadLocal = useCallback(() => {
    try {
      const localHabits = localStorage.getItem(LOCAL_HABITS_KEY);
      const localCompletions = localStorage.getItem(LOCAL_COMPLETIONS_KEY);
      if (localHabits) setHabits(JSON.parse(localHabits));
      if (localCompletions) setCompletions(JSON.parse(localCompletions));
    } catch (e) {
      console.error("Failed to load local habits:", e);
    }
  }, []);

  // Helper to save to local storage
  const saveLocal = useCallback((newHabits: Habit[], newCompletions: Completions) => {
    try {
      localStorage.setItem(LOCAL_HABITS_KEY, JSON.stringify(newHabits));
      localStorage.setItem(LOCAL_COMPLETIONS_KEY, JSON.stringify(newCompletions));
    } catch (e) {
      console.error("Failed to save local habits:", e);
    }
  }, []);

  const loadHabits = useCallback(async () => {
    if (status === "loading") return;

    if (!isAuthenticated) {
      loadLocal();
      setLoaded(true);
      return;
    }

    try {
      const payload = await api.habits.getHabits();
      setHabits((payload.habits || []).map(toHabit));
      setCompletions(toCompletionMap(payload.completions || []));
    } catch (error) {
      if (!isApiError(error) || error.status !== 401) {
        console.error("Failed to load habits:", error);
      }
      setHabits([]);
      setCompletions({});
    } finally {
      setLoaded(true);
    }
  }, [isAuthenticated, status, loadLocal]);

  // Sync logic
  useEffect(() => {
    if (status === "authenticated" && !isSyncing) {
      const localHabitsStr = localStorage.getItem(LOCAL_HABITS_KEY);
      const localCompletionsStr = localStorage.getItem(LOCAL_COMPLETIONS_KEY);

      if (localHabitsStr || localCompletionsStr) {
        void (async () => {
          setIsSyncing(true);
          try {
            const localHabits: Habit[] = localHabitsStr ? JSON.parse(localHabitsStr) : [];
            const localCompletions: Completions = localCompletionsStr ? JSON.parse(localCompletionsStr) : {};

            // Map local IDs to server IDs
            const idMap: Record<string, string> = {};

            // Sync habits
            for (const habit of localHabits) {
              try {
                const created = await api.habits.createHabit({
                  name: habit.name,
                  category: habit.category,
                  reminderTime: habit.reminderTime,
                  reminderEnabled: habit.reminderEnabled,
                });
                idMap[habit.id] = created.id;
              } catch (e) {
                console.error(`Failed to sync habit ${habit.name}:`, e);
              }
            }

            // Sync completions
            for (const [date, entry] of Object.entries(localCompletions)) {
              for (const [localId, completed] of Object.entries(entry)) {
                const serverId = idMap[localId];
                if (serverId && completed) {
                  try {
                    await api.habits.setCompletion({
                      habitId: serverId,
                      date,
                      completed: true,
                    });
                  } catch (e) {
                    console.error(`Failed to sync completion for ${date}:`, e);
                  }
                }
              }
            }

            // Clear local storage after sync
            localStorage.removeItem(LOCAL_HABITS_KEY);
            localStorage.removeItem(LOCAL_COMPLETIONS_KEY);
            
            // Reload habits from server
            await loadHabits();
          } catch (e) {
            console.error("Sync failed:", e);
          } finally {
            setIsSyncing(false);
          }
        })();
      }
    }
  }, [status, loadHabits, isSyncing]);

  useEffect(() => {
    void loadHabits();
  }, [loadHabits]);

  const toggleHabit = (id: string, date = today()) => {
    const currentlyCompleted = !!completions[date]?.[id];
    const nextCompleted = !currentlyCompleted;

    const updateState = (prev: Completions) => {
      const day = { ...(prev[date] || {}) };
      if (nextCompleted) {
        day[id] = true;
      } else {
        delete day[id];
      }
      const next = { ...prev, [date]: day };
      if (!isAuthenticated) {
        saveLocal(habits, next);
      }
      return next;
    };

    setCompletions(updateState);

    if (!isAuthenticated) return;

    void api.habits.setCompletion({
      habitId: id,
      date,
      completed: nextCompleted,
    }).catch((error) => {
      setCompletions((prev) => {
        const day = { ...(prev[date] || {}) };
        if (currentlyCompleted) {
          day[id] = true;
        } else {
          delete day[id];
        }
        return { ...prev, [date]: day };
      });

      if (!isApiError(error) || error.status !== 401) {
        console.error("Failed to update habit completion:", error);
      }
    });
  };

  const saveHabit = (habit: Omit<Habit, "id" | "createdAt">, id?: string) => {
    void (async () => {
      try {
        if (!isAuthenticated) {
          if (id) {
            const nextHabits = habits.map((h) => 
              h.id === id ? { ...h, ...habit } : h
            );
            setHabits(nextHabits);
            saveLocal(nextHabits, completions);
          } else {
            const newHabit: Habit = {
              ...habit,
              id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              createdAt: today(),
            };
            const nextHabits = [...habits, newHabit];
            setHabits(nextHabits);
            saveLocal(nextHabits, completions);
          }
          return;
        }

        if (id) {
          const updated = await api.habits.updateHabit(id, {
            name: habit.name,
            category: habit.category,
            reminderTime: habit.reminderTime,
            reminderEnabled: habit.reminderEnabled,
          });
          const mapped = toHabit(updated);
          setHabits((prev) => prev.map((entry) => (entry.id === id ? mapped : entry)));
          return;
        }

        const created = await api.habits.createHabit({
          name: habit.name,
          category: habit.category,
          reminderTime: habit.reminderTime,
          reminderEnabled: habit.reminderEnabled,
        });
        setHabits((prev) => [...prev, toHabit(created)]);
      } catch (error) {
        if (!isApiError(error) || error.status !== 401) {
          console.error("Failed to save habit:", error);
        }
      }
    })();
  };

  const deleteHabit = (id: string) => {
    void (async () => {
      try {
        if (!isAuthenticated) {
          const nextHabits = habits.filter((h) => h.id !== id);
          const nextCompletions = removeCompletionForHabit(completions, id);
          setHabits(nextHabits);
          setCompletions(nextCompletions);
          saveLocal(nextHabits, nextCompletions);
          return;
        }

        await api.habits.deleteHabit(id);
        setHabits((prev) => prev.filter((entry) => entry.id !== id));
        setCompletions((prev) => removeCompletionForHabit(prev, id));
      } catch (error) {
        if (!isApiError(error) || error.status !== 401) {
          console.error("Failed to delete habit:", error);
        }
      }
    })();
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
    isSyncing,
    toggleHabit,
    saveHabit,
    deleteHabit,
    stats,
  };
}

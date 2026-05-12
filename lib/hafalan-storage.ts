import type { UserProgress } from "@/lib/api-core";

export const HAFALAN_PROGRESS_STORAGE_KEY = "bn_hafalan_progress_v1";

export interface HafalanProgressEntry {
  consecutiveCorrect: number;
  completed: boolean;
  updatedAt: string;
}

export type HafalanProgressMap = Record<string, HafalanProgressEntry>;

function clampConsecutiveCorrect(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(2, Math.round(value)));
}

export function createHafalanProgressEntry(
  partial: Partial<HafalanProgressEntry> = {}
): HafalanProgressEntry {
  const baseConsecutive = clampConsecutiveCorrect(partial.consecutiveCorrect ?? 0);
  const completed = partial.completed ?? baseConsecutive >= 2;
  const consecutiveCorrect = completed ? 2 : baseConsecutive;

  return {
    consecutiveCorrect,
    completed,
    updatedAt: partial.updatedAt || new Date().toISOString(),
  };
}

export function toHafalanEntryFromServer(progress: UserProgress): HafalanProgressEntry {
  const progressHint = progress.progress >= 100 ? 2 : progress.progress >= 50 ? 1 : 0;
  const scoreHint = clampConsecutiveCorrect(progress.score ?? 0);
  const baseConsecutive = Math.max(progressHint, scoreHint);
  const completed = Boolean(progress.completed) || baseConsecutive >= 2;
  const parsedTimestamp = Date.parse(String(progress.lastAccessed));

  return createHafalanProgressEntry({
    consecutiveCorrect: completed ? 2 : baseConsecutive,
    completed,
    updatedAt: Number.isFinite(parsedTimestamp)
      ? new Date(parsedTimestamp).toISOString()
      : new Date().toISOString(),
  });
}

function getEntryRank(entry: HafalanProgressEntry): [number, number, number] {
  const completedRank = entry.completed ? 1 : 0;
  const consecutiveRank = clampConsecutiveCorrect(entry.consecutiveCorrect);
  const timestampRank = Number.isFinite(Date.parse(entry.updatedAt))
    ? Date.parse(entry.updatedAt)
    : 0;
  return [completedRank, consecutiveRank, timestampRank];
}

export function compareHafalanEntries(
  left: HafalanProgressEntry,
  right: HafalanProgressEntry
): number {
  const leftRank = getEntryRank(left);
  const rightRank = getEntryRank(right);

  for (let i = 0; i < leftRank.length; i += 1) {
    if (leftRank[i] > rightRank[i]) {
      return 1;
    }
    if (leftRank[i] < rightRank[i]) {
      return -1;
    }
  }

  return 0;
}

export function pickHigherHafalanEntry(
  first?: HafalanProgressEntry | null,
  second?: HafalanProgressEntry | null
): HafalanProgressEntry | null {
  if (!first && !second) {
    return null;
  }
  if (!first) {
    return second ?? null;
  }
  if (!second) {
    return first;
  }
  return compareHafalanEntries(first, second) >= 0 ? first : second;
}

export function mergeHafalanProgressMaps(
  localMap: HafalanProgressMap,
  serverMap: HafalanProgressMap
): HafalanProgressMap {
  const merged: HafalanProgressMap = {};
  const keys = new Set([...Object.keys(localMap), ...Object.keys(serverMap)]);

  keys.forEach((key) => {
    const chosen = pickHigherHafalanEntry(localMap[key], serverMap[key]);
    if (chosen) {
      merged[key] = createHafalanProgressEntry(chosen);
    }
  });

  return merged;
}

export function readHafalanProgressFromStorage(): HafalanProgressMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(HAFALAN_PROGRESS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, Partial<HafalanProgressEntry>>;
    const normalized: HafalanProgressMap = {};

    Object.entries(parsed).forEach(([key, value]) => {
      normalized[key] = createHafalanProgressEntry(value);
    });

    return normalized;
  } catch (error) {
    console.error("Failed to read hafalan progress from storage:", error);
    return {};
  }
}

export function writeHafalanProgressToStorage(progressMap: HafalanProgressMap): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(HAFALAN_PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error("Failed to write hafalan progress to storage:", error);
  }
}

export function toHafalanProgressPayload(entry: HafalanProgressEntry) {
  const normalized = createHafalanProgressEntry(entry);
  return {
    progress: normalized.completed ? 100 : normalized.consecutiveCorrect > 0 ? 50 : 0,
    score: normalized.consecutiveCorrect,
    completed: normalized.completed,
  };
}

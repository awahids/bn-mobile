import { describe, expect, test } from "bun:test";
import { summarizeModuleProgress } from "./module-progress";

const base = { progress: [], quizStats: undefined, dhikrCounters: [], dhikrTotal: 40 };

describe("summarizeModuleProgress", () => {
  test("empty data gives zero progress and readable details", () => {
    const s = summarizeModuleProgress(base);
    expect(s.hijaiyah).toEqual({ progress: 0, detail: "0/28 huruf" });
    expect(s.quran).toEqual({ progress: 0, detail: "0/114 surah" });
    expect(s.dhikr).toEqual({ progress: 0, detail: "0/40 dzikir hari ini" });
    expect(s.quiz).toEqual({ progress: 0, detail: "Belum ada kuis" });
    expect(s.hafalan).toEqual({ progress: 0, detail: "Belum mulai" });
  });

  test("hijaiyah counts completed letters out of 28, not the average of started ones", () => {
    const progress = [
      { module: "hijaiyah", itemId: "alif", progress: 100, completed: true },
      { module: "hijaiyah", itemId: "ba", progress: 100, completed: true },
      { module: "hijaiyah", itemId: "ta", progress: 40, completed: false },
    ];
    const s = summarizeModuleProgress({ ...base, progress });
    expect(s.hijaiyah).toEqual({ progress: 7, detail: "2/28 huruf" });
  });

  test("quran counts distinct surahs, even with several ayah records per surah", () => {
    const progress = [
      { module: "quran", itemId: "1:1" },
      { module: "quran", itemId: "1:2" },
      { module: "quran", itemId: "2" },
    ];
    expect(summarizeModuleProgress({ ...base, progress }).quran).toEqual({
      progress: 2,
      detail: "2/114 surah",
    });
  });

  test("dhikr uses today's counters against the real number of dhikr", () => {
    const dhikrCounters = [
      { count: 33, target: 33, completed: true },
      { count: 10, target: 33, completed: false },
    ];
    expect(summarizeModuleProgress({ ...base, dhikrCounters, dhikrTotal: 4 }).dhikr).toEqual({
      progress: 25,
      detail: "1/4 dzikir hari ini",
    });
  });

  test("dhikr total of zero does not divide by zero", () => {
    expect(summarizeModuleProgress({ ...base, dhikrTotal: 0 }).dhikr.progress).toBe(0);
  });

  test("quiz shows best score and attempt count", () => {
    const s = summarizeModuleProgress({ ...base, quizStats: { bestScore: 80, totalAttempts: 3 } });
    expect(s.quiz).toEqual({ progress: 80, detail: "Skor terbaik 80% · 3 kuis" });
  });

  test("hafalan reports memorised ayahs out of the ones started", () => {
    const progress = [
      { module: "hafalan", itemId: "1:1", completed: true },
      { module: "hafalan", itemId: "1:2", completed: false },
    ];
    expect(summarizeModuleProgress({ ...base, progress }).hafalan).toEqual({
      progress: 50,
      detail: "1/2 ayat dihafal",
    });
  });

  test("progress is clamped to 0-100", () => {
    const s = summarizeModuleProgress({ ...base, quizStats: { bestScore: 140, totalAttempts: 1 } });
    expect(s.quiz.progress).toBe(100);
  });
});

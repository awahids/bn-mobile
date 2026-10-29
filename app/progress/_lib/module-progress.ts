const HIJAIYAH_TOTAL = 28;
const QURAN_SURAH_TOTAL = 114;

interface ProgressRecord {
  module: string;
  itemId: string;
  progress?: number;
  completed?: boolean;
}

interface DhikrCounterRecord {
  count: number;
  target: number;
  completed?: boolean;
}

interface QuizStatsRecord {
  bestScore?: number;
  totalAttempts?: number;
}

export interface ModuleProgressInput {
  progress: ProgressRecord[];
  quizStats?: QuizStatsRecord;
  /** Today's dhikr counters (both sessions). */
  dhikrCounters: DhikrCounterRecord[];
  /** Number of dhikr available across both sessions. */
  dhikrTotal: number;
}

export interface ModuleProgressValue {
  /** 0-100 */
  progress: number;
  detail: string;
}

export interface ModuleProgress {
  hijaiyah: ModuleProgressValue;
  quran: ModuleProgressValue;
  dhikr: ModuleProgressValue;
  quiz: ModuleProgressValue;
  hafalan: ModuleProgressValue;
}

function percent(part: number, whole: number): number {
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) return 0;
  return clamp(Math.round((part / whole) * 100));
}

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function summarizeModuleProgress({
  progress,
  quizStats,
  dhikrCounters,
  dhikrTotal,
}: ModuleProgressInput): ModuleProgress {
  const byModule = (module: string) => progress.filter((record) => record.module === module);

  const hijaiyahDone = byModule("hijaiyah").filter((record) => record.completed).length;

  // Quran records may be per surah ("2") or per ayah ("2:255"); count surahs once.
  const surahs = new Set(byModule("quran").map((record) => record.itemId.split(":")[0]));

  const dhikrDone = dhikrCounters.filter(
    (counter) => counter.completed || (counter.target > 0 && counter.count >= counter.target)
  ).length;

  const attempts = quizStats?.totalAttempts ?? 0;
  const bestScore = clamp(quizStats?.bestScore ?? 0);

  const hafalan = byModule("hafalan");
  const hafalanDone = hafalan.filter((record) => record.completed).length;

  return {
    hijaiyah: {
      progress: percent(hijaiyahDone, HIJAIYAH_TOTAL),
      detail: `${hijaiyahDone}/${HIJAIYAH_TOTAL} huruf`,
    },
    quran: {
      progress: percent(surahs.size, QURAN_SURAH_TOTAL),
      detail: `${surahs.size}/${QURAN_SURAH_TOTAL} surah`,
    },
    dhikr: {
      progress: percent(dhikrDone, dhikrTotal),
      detail: `${dhikrDone}/${dhikrTotal} dzikir hari ini`,
    },
    quiz: attempts > 0
      ? { progress: bestScore, detail: `Skor terbaik ${bestScore}% · ${attempts} kuis` }
      : { progress: 0, detail: "Belum ada kuis" },
    hafalan: hafalan.length > 0
      ? { progress: percent(hafalanDone, hafalan.length), detail: `${hafalanDone}/${hafalan.length} ayat dihafal` }
      : { progress: 0, detail: "Belum mulai" },
  };
}

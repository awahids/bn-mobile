"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  api,
  isApiError,
  type Bookmark,
  type DhikrCounter,
  type PrayerTimes,
  type QuizAttempt,
  type QuizStats,
  type UserProgress,
} from "@/lib/api-client";
import { NetworkError } from "@/components/shared/error-boundary";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { usePrefetchByContext } from "@/lib/prefetch";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { useAuth } from "@/hooks/use-auth";
import { hijaiyahLetters } from "@/data/hijaiyah";
import { getQuranDisplayReference } from "@/data/quran";
import { getQuizCategoryById } from "@/data/quiz";
import { useHabits } from "@/hooks/use-habits";


// Section Components
import { HeroSection } from "@/components/sections/home/hero-section";
import { LearningModulesSection } from "@/components/sections/home/learning-modules-section";
import { ContinueLearningSection } from "@/components/sections/home/continue-learning-section";
import { RecentActivitySection } from "@/components/sections/home/recent-activity-section";
import { PrayerTimesSection } from "@/components/sections/home/prayer-times-section";

const DEFAULT_COORDS = { lat: -6.2, lng: 106.8167 }; // Jakarta fallback
const PRAYER_COORDS_STORAGE_KEY = "bn_prayer_coords_v1";
const PRAYER_TIMES_STORAGE_KEY = "bn_prayer_times_v1";

type ActivityType = "hijaiyah" | "quran" | "dhikr" | "quiz";
type LocationStatus = "idle" | "loading" | "denied" | "unsupported";
type Coordinates = { lat: number; lng: number };

interface PrayerTimesCachePayload {
  dateKey: string;
  coords: Coordinates;
  data: PrayerTimes;
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimestamp(value: unknown): number {
  if (!value) return 0;
  const parsed = new Date(value as string).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatRelativeTime(value: unknown): string {
  const timestamp = toTimestamp(value);
  if (!timestamp) return "Baru saja";

  const diffMs = Date.now() - timestamp;
  if (diffMs < 60_000) return "Baru saja";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return new Date(timestamp).toLocaleDateString("id-ID");
}

function isCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;
  const coords = value as Partial<Coordinates>;
  return (
    typeof coords.lat === "number" &&
    Number.isFinite(coords.lat) &&
    coords.lat >= -90 &&
    coords.lat <= 90 &&
    typeof coords.lng === "number" &&
    Number.isFinite(coords.lng) &&
    coords.lng >= -180 &&
    coords.lng <= 180
  );
}

function isPrayerTimes(value: unknown): value is PrayerTimes {
  if (!value || typeof value !== "object") return false;
  const times = value as Partial<PrayerTimes>;

  return (
    typeof times.fajr === "string" &&
    typeof times.sunrise === "string" &&
    typeof times.dhuhr === "string" &&
    typeof times.asr === "string" &&
    typeof times.maghrib === "string" &&
    typeof times.isha === "string" &&
    typeof times.date === "string" &&
    !!times.location &&
    typeof times.location === "object"
  );
}

function areCoordsEqual(a: Coordinates, b: Coordinates): boolean {
  return Math.abs(a.lat - b.lat) < 0.0001 && Math.abs(a.lng - b.lng) < 0.0001;
}

function formatCoordsLabel(coords: Coordinates): string {
  if (areCoordsEqual(coords, DEFAULT_COORDS)) {
    return "Jakarta (default)";
  }
  return `Lat ${coords.lat.toFixed(2)}, Lng ${coords.lng.toFixed(2)}`;
}

function getLocationLabel(prayerTimes: PrayerTimes | null | undefined, coords: Coordinates): string {
  if (prayerTimes?.location) {
    const loc = prayerTimes.location;
    const place =
      loc.label ||
      [loc.city, loc.district].filter(Boolean).join(", ") ||
      [loc.city, loc.country].filter(Boolean).join(", ");
    return place || "Lokasi terkini";
  }

  return formatCoordsLabel(coords);
}

function readStoredCoords(): Coordinates | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(PRAYER_COORDS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isCoordinates(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveStoredCoords(coords: Coordinates) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRAYER_COORDS_STORAGE_KEY, JSON.stringify(coords));
  } catch {
    // Ignore storage write errors.
  }
}

function readStoredPrayerTimes(todayKey: string, coords: Coordinates): PrayerTimes | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(PRAYER_TIMES_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PrayerTimesCachePayload>;
    if (
      typeof parsed.dateKey !== "string" ||
      parsed.dateKey !== todayKey ||
      !isCoordinates(parsed.coords) ||
      !areCoordsEqual(parsed.coords, coords) ||
      !isPrayerTimes(parsed.data)
    ) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function saveStoredPrayerTimes(todayKey: string, coords: Coordinates, prayerTimes: PrayerTimes) {
  if (typeof window === "undefined") return;

  try {
    const payload: PrayerTimesCachePayload = {
      dateKey: todayKey,
      coords,
      data: prayerTimes,
    };
    window.localStorage.setItem(PRAYER_TIMES_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage write errors.
  }
}

export function HomePageContent() {
  const { status } = useAuth();
  const { stats: habitStats, loaded: habitsLoaded } = useHabits();
  const isAuthenticated = status === "authenticated";

  const todayKey = useMemo(() => toLocalDateKey(), []);

  // Prefetch learning routes since users are likely to navigate to them from home
  usePrefetchByContext('home');

  const [coords, setCoords] = useState<Coordinates>(DEFAULT_COORDS);
  const [locationLabel, setLocationLabel] = useState("Jakarta (default)");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [cachedPrayerTimes, setCachedPrayerTimes] = useState<{
    coords: Coordinates;
    data: PrayerTimes;
  } | null>(null);
  const [isPrayerStorageHydrated, setIsPrayerStorageHydrated] = useState(false);

  useEffect(() => {
    const storedCoords = readStoredCoords() ?? DEFAULT_COORDS;
    const storedPrayerTimes = readStoredPrayerTimes(todayKey, storedCoords);

    setCoords(storedCoords);
    setLocationLabel(getLocationLabel(storedPrayerTimes, storedCoords));
    setCachedPrayerTimes(
      storedPrayerTimes
        ? {
            coords: storedCoords,
            data: storedPrayerTimes,
          }
        : null
    );
    setIsPrayerStorageHydrated(true);
  }, [todayKey]);

  // Prayer times query
  const {
    data: fetchedPrayerTimes,
    isLoading: prayerTimesQueryLoading,
  } = useQuery<PrayerTimes>({
    queryKey: ['prayer-times', todayKey, coords.lat, coords.lng],
    queryFn: () => api.utility.getPrayerTimes(coords),
    enabled: isPrayerStorageHydrated,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1
  });
  const prayerTimes =
    fetchedPrayerTimes ||
    (cachedPrayerTimes && areCoordsEqual(cachedPrayerTimes.coords, coords)
      ? cachedPrayerTimes.data
      : null);
  const prayerTimesLoading = !prayerTimes && (!isPrayerStorageHydrated || prayerTimesQueryLoading);

  useEffect(() => {
    if (!isPrayerStorageHydrated) return;
    saveStoredCoords(coords);
  }, [coords, isPrayerStorageHydrated]);

  useEffect(() => {
    if (!fetchedPrayerTimes || !isPrayerStorageHydrated) return;
    saveStoredPrayerTimes(todayKey, coords, fetchedPrayerTimes);
    setCachedPrayerTimes({
      coords,
      data: fetchedPrayerTimes,
    });
  }, [coords, fetchedPrayerTimes, isPrayerStorageHydrated, todayKey]);

  // User data query
  const {
    data: user,
    error: userError
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.user.getProfile(),
    enabled: isAuthenticated,
    retry: false
  });

  const { data: progressData = [] } = useQuery<UserProgress[]>({
    queryKey: ["home-progress"],
    queryFn: () => api.progress.getProgress(),
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: allDhikrs = [] } = useQuery({
    queryKey: ["dhikrs"],
    queryFn: () => api.dhikr.getDhikrs(),
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const { data: quranBookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ["home-bookmarks", "quran"],
    queryFn: () => api.bookmarks.getBookmarks("quran"),
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: quizStats } = useQuery<QuizStats>({
    queryKey: ["home-quiz-stats"],
    queryFn: () => api.quiz.getStats(),
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: quizAttempts = [] } = useQuery<QuizAttempt[]>({
    queryKey: ["home-quiz-attempts"],
    queryFn: () => api.quiz.getAttempts(),
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: dhikrCounters = [] } = useQuery<DhikrCounter[]>({
    queryKey: ["home-dhikr-counters", todayKey],
    queryFn: () => api.dhikr.getCounters(todayKey),
    enabled: isAuthenticated && !!todayKey,
    retry: false,
  });

  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeLeft: string }>({
    name: "—",
    timeLeft: "--"
  });

  useEffect(() => {
    if (!prayerTimes || typeof window === 'undefined') return;

    const toMinutes = (time: string) => {
      const [h, m] = time.split(' ')[0].split(':').map(Number);
      return h * 60 + m;
    };

    const formatTimeLeft = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      if (hours <= 0) return `${mins}m`;
      if (mins === 0) return `${hours}j`;
      return `${hours}j ${mins}m`;
    };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const list = [
      { name: "Subuh", time: prayerTimes.fajr },
      { name: "Dhuhur", time: prayerTimes.dhuhr },
      { name: "Ashar", time: prayerTimes.asr },
      { name: "Maghrib", time: prayerTimes.maghrib },
      { name: "Isya", time: prayerTimes.isha }
    ];

    const next = list.find((item) => toMinutes(item.time) > currentMinutes) || list[0];
    const minutesUntil = ((toMinutes(next.time) - currentMinutes) + 1440) % 1440;

    setNextPrayer({
      name: next.name,
      timeLeft: formatTimeLeft(minutesUntil)
    });
  }, [prayerTimes]);

  useEffect(() => {
    setLocationLabel(getLocationLabel(prayerTimes, coords));
  }, [prayerTimes, coords]);

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationLabel(`Lokasi aktif (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        setLocationStatus("idle");
      },
      () => {
        setLocationStatus("denied");
      },
      { timeout: 10000 }
    );
  }, []);

  const hijaiyahProgress = useMemo(
    () => progressData.filter((item) => item.module === "hijaiyah"),
    [progressData]
  );
  const quranProgress = useMemo(
    () => progressData.filter((item) => item.module === "quran"),
    [progressData]
  );

  const learningStats = useMemo(() => {
    const hijaiyahCompleted = hijaiyahProgress.filter((item) => item.completed).length;
    const hijaiyahProgressPercent = clampPercentage((hijaiyahCompleted / 28) * 100);

    const latestQuranProgress = [...quranProgress]
      .sort((a, b) => toTimestamp(b.lastAccessed) - toTimestamp(a.lastAccessed))[0];
    const latestQuranBookmark = quranBookmarks[0];

    const latestQuranContentId =
      toTimestamp(latestQuranProgress?.lastAccessed) >= toTimestamp(latestQuranBookmark?.createdAt)
        ? latestQuranProgress?.itemId
        : latestQuranBookmark?.contentId;
    const quranReference = getQuranDisplayReference(latestQuranContentId);

    const totalDhikrCount = dhikrCounters.reduce((sum, item) => sum + (item.count || 0), 0);
    const totalDhikrTarget = dhikrCounters.reduce((sum, item) => sum + (item.target || 0), 0);
    const dhikrProgressPercent =
      totalDhikrTarget > 0 ? clampPercentage((totalDhikrCount / totalDhikrTarget) * 100) : 0;

    const quizBestScore = quizStats?.bestScore ?? Math.max(...quizAttempts.map((item) => item.score || 0), 0);
    const totalQuizAttempts = quizStats?.totalAttempts ?? quizAttempts.length;

    return {
      hijaiyah: {
        completed: hijaiyahCompleted,
        total: 28,
        progress: hijaiyahProgressPercent,
      },
      quran: {
        bookmarked: quranBookmarks.length,
        total: 114,
        lastReadLabel: quranReference.shortLabel,
      },
      dhikr: {
        todayCount: totalDhikrCount,
        progress: dhikrProgressPercent,
      },
      quiz: {
        bestScore: clampPercentage(quizBestScore),
        attempts: totalQuizAttempts,
      },
      habits: habitsLoaded ? {
        rate: habitStats.rate,
        itemsDone: habitStats.doneToday,
        totalItems: habitStats.totalHabits,
      } : undefined,
    };
  }, [dhikrCounters, hijaiyahProgress, quranBookmarks, quranProgress, quizAttempts, quizStats, habitStats, habitsLoaded]);


  const continueLearningItems = useMemo(() => {
    const latestHijaiyah = [...hijaiyahProgress]
      .sort((a, b) => toTimestamp(b.lastAccessed) - toTimestamp(a.lastAccessed))[0];
    const latestQuranProgress = [...quranProgress]
      .sort((a, b) => toTimestamp(b.lastAccessed) - toTimestamp(a.lastAccessed))[0];
    const latestQuranBookmark = quranBookmarks[0];

    const hijaiyahLetter = hijaiyahLetters.find((item) => item.id === latestHijaiyah?.itemId) || hijaiyahLetters[0];
    const hijaiyahPercent = clampPercentage(latestHijaiyah?.progress ?? 0);

    const latestQuranContentId =
      toTimestamp(latestQuranProgress?.lastAccessed) >= toTimestamp(latestQuranBookmark?.createdAt)
        ? latestQuranProgress?.itemId
        : latestQuranBookmark?.contentId;
    const quranReference = getQuranDisplayReference(latestQuranContentId);
    const quranPercent = clampPercentage(
      latestQuranProgress?.progress ?? quranReference.progressPercent
    );

    return [
      {
        id: "continue-hijaiyah",
        href: "/hijaiyah",
        title: `Huruf ${hijaiyahLetter.name} (${hijaiyahLetter.arabic})`,
        subtitle: latestHijaiyah?.completed
          ? "Sudah selesai, lanjut huruf berikutnya"
          : "Pelajari cara menulis dan pengucapan",
        progressPercent: hijaiyahPercent,
        progressLabel: `${hijaiyahPercent}%`,
        iconText: hijaiyahLetter.arabic,
        iconType: "hijaiyah" as const,
      },
      {
        id: "continue-quran",
        href: "/quran",
        title: quranReference.title,
        subtitle: quranReference.subtitle,
        progressPercent: quranPercent,
        progressLabel:
          latestQuranProgress?.progress !== undefined
            ? `${quranPercent}%`
            : quranReference.progressLabel,
        iconType: "quran" as const,
      },
    ];
  }, [hijaiyahProgress, quranBookmarks, quranProgress]);

  const recentActivities = useMemo(() => {
    if (!isAuthenticated) return [] as { id: string; title: string; timeLabel: string; type: ActivityType }[];

    const progressActivities = progressData.map((item) => {
      let title = "Aktivitas belajar";

      if (item.module === "hijaiyah") {
        const letter = hijaiyahLetters.find((letterItem) => letterItem.id === item.itemId);
        title = item.completed
          ? `Menyelesaikan huruf ${letter?.name || item.itemId}`
          : `Belajar huruf ${letter?.name || item.itemId}`;
      } else if (item.module === "quran") {
        const reference = getQuranDisplayReference(item.itemId);
        title = `Membaca ${reference.title}`;
      } else if (item.module === "dhikr") {
        const dhikr = allDhikrs.find((d) => d.id === item.itemId);
        title = `Dhikr ${dhikr?.translation || item.itemId}`;
      } else if (item.module === "quiz") {
        const category = getQuizCategoryById(item.itemId);
        title = `Kuis ${category?.name || item.itemId}`;
      }

      return {
        id: `progress-${item.module}-${item.itemId}-${toTimestamp(item.lastAccessed)}`,
        title,
        type: item.module as ActivityType,
        timeLabel: formatRelativeTime(item.lastAccessed),
        timestamp: toTimestamp(item.lastAccessed),
      };
    });

    const quizActivities = quizAttempts.map((attempt) => {
      const category = getQuizCategoryById(attempt.category);
      return {
        id: `quiz-${attempt.id}`,
        title: `Kuis ${category?.name || attempt.category} - Skor ${attempt.score}%`,
        type: "quiz" as const,
        timeLabel: formatRelativeTime(attempt.completedAt),
        timestamp: toTimestamp(attempt.completedAt),
      };
    });

    const bookmarkActivities = quranBookmarks.map((bookmark) => {
      const reference = getQuranDisplayReference(bookmark.contentId);
      return {
        id: `bookmark-${bookmark.id}`,
        title: `Menyimpan ${reference.title}`,
        type: "quran" as const,
        timeLabel: formatRelativeTime(bookmark.createdAt),
        timestamp: toTimestamp(bookmark.createdAt),
      };
    });

    return [...progressActivities, ...quizActivities, ...bookmarkActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(({ id, title, type, timeLabel }) => ({ id, title, type, timeLabel }));
  }, [isAuthenticated, progressData, quranBookmarks, quizAttempts]);

  // Handle critical errors
  if (userError && isApiError(userError) && userError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />
  }

  return (
    <MobilePageShell className="pb-32">
      <HeroSection user={user} />
      
      <LearningModulesSection stats={learningStats} />

      <ContinueLearningSection items={continueLearningItems} />

      <RecentActivitySection activities={recentActivities} />

      <PrayerTimesSection 
        prayerTimes={prayerTimes}
        prayerTimesLoading={prayerTimesLoading}
        locationLabel={locationLabel}
        locationStatus={locationStatus}
        nextPrayer={nextPrayer}
        requestLocation={requestLocation}
      />

      <BottomNavigation />
    </MobilePageShell>
  );
}

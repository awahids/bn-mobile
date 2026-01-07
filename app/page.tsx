"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, isApiError, getErrorMessage } from "@/lib/api";
import { NetworkError } from "@/components/error-boundary";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ProgressRing } from "@/components/progress-ring";
import { usePrefetchByContext } from "@/lib/prefetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Bell,
  Play,
  Headphones,
  BookOpen,
  BicepsFlexed,
  Brain,
  Languages,
  Bookmark,
  Trophy,
  Check,
  Star,
  MapPin
} from "lucide-react";

const DEFAULT_COORDS = { lat: -6.2, lng: 106.8167 }; // Jakarta fallback

export default function Home() {
  const router = useRouter();

  // Prefetch learning routes since users are likely to navigate to them from home
  usePrefetchByContext('home');

  // Mock stats data
  const stats = {
    hijaiyah: { completed: 12, total: 28, progress: 43 }
  };

  // Simple theme state without provider dependency
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [locationLabel, setLocationLabel] = useState("Jakarta (default)");
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "denied" | "unsupported" | "error">("idle");

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    // Update document class if on client side
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  // Prayer times query
  const {
    data: prayerTimes,
    isLoading: prayerTimesLoading,
    error: prayerTimesError
  } = useQuery({
    queryKey: ['prayer-times', coords.lat, coords.lng],
    queryFn: () => api.utility.getPrayerTimes(coords),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1
  });

  // User data query
  const {
    data: user,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.user.getProfile(),
    retry: false
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
    if (prayerTimes?.location?.city || prayerTimes?.location?.country) {
      const place = [prayerTimes.location.city, prayerTimes.location.country].filter(Boolean).join(", ");
      setLocationLabel(place || "Lokasi terkini");
    } else if (coords) {
      setLocationLabel(`Lat ${coords.lat.toFixed(2)}, Lng ${coords.lng.toFixed(2)}`);
    }
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

  // Handle critical errors (user data is not critical, prayer times are not critical)
  // Only show error if there's a network issue that affects core functionality
  if (userError && isApiError(userError) && userError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-card border border-border flex items-center justify-center">
              <Image
                src="/images/logo/image.png"
                alt="Belajar Ngaji"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Belajar Ngaji</h1>
              <p className="text-xs text-muted-foreground">Assalamu&apos;alaikum</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
              data-testid="toggle-theme"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              data-testid="notifications"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">Selamat Pagi</h2>
                <p className="text-sm text-muted-foreground">Mari lanjutkan pembelajaran hari ini</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary" data-testid="user-streak">
                  {user?.streak || 7}
                </div>
                <div className="text-xs text-muted-foreground">Hari berturut</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress Harian</span>
                <span className="text-primary font-medium" data-testid="daily-progress">
                  {user?.dailyProgress || 3}/5
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full progress-animate"
                  style={{ width: `${((user?.dailyProgress || 3) / 5) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Modul Pembelajaran</h3>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Hijaiyah Module */}
          <Link href="/hijaiyah" prefetch={true} data-testid="module-hijaiyah">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-chart-1/20 rounded-xl flex items-center justify-center mb-3">
                  <Languages className="text-chart-1 w-6 h-6" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Hijaiyah</h4>
                <p className="text-xs text-muted-foreground mb-2">28 Huruf Arab</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-chart-1 font-medium">
                    {stats.hijaiyah.completed}/{stats.hijaiyah.total}
                  </div>
                  <ProgressRing
                    progress={stats.hijaiyah.progress}
                    size={32}
                    className="text-chart-1"
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Al-Quran Module */}
          <Link href="/quran" prefetch={true} data-testid="module-quran">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-chart-2/20 rounded-xl flex items-center justify-center mb-3">
                  <BookOpen className="text-chart-2 w-6 h-6" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Al-Qur&apos;an</h4>
                <p className="text-xs text-muted-foreground mb-2">114 Surah</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-chart-2 font-medium">Surah Al-Fatihah</div>
                  <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center">
                    <Bookmark className="text-white w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Dhikr Module */}
          <Link href="/dhikr" prefetch={true} data-testid="module-dhikr">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-chart-3/20 rounded-xl flex items-center justify-center mb-3">
                  <BicepsFlexed className="text-chart-3 w-6 h-6" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Dhikr</h4>
                <p className="text-xs text-muted-foreground mb-2">Pagi & Petang</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-chart-3 font-medium">33x</div>
                  <ProgressRing
                    progress={66}
                    size={32}
                    className="text-chart-3"
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Quiz Module */}
          <Link href="/quiz" prefetch={true} data-testid="module-quiz">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-chart-4/20 rounded-xl flex items-center justify-center mb-3">
                  <Brain className="text-chart-4 w-6 h-6" />
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Kuis</h4>
                <p className="text-xs text-muted-foreground mb-2">4 Kategori</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-chart-4 font-medium">Skor: 85%</div>
                  <div className="w-6 h-6 bg-chart-4 rounded-full flex items-center justify-center">
                    <Trophy className="text-white w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Continue Learning */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Lanjutkan Belajar</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            Lihat Semua
          </Button>
        </div>

        <div className="space-y-3">
          {/* Continue Hijaiyah */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-1/80 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-arabic font-bold">ب</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-card-foreground mb-1">Huruf Ba (ب)</h4>
                  <p className="text-sm text-muted-foreground mb-2">Pelajari cara menulis dan pengucapan</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-chart-1 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                </div>
                <Button size="icon" className="rounded-full">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Continue Al-Quran */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-2 to-chart-2/80 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-card-foreground mb-1">Al-Fatihah</h4>
                  <p className="text-sm text-muted-foreground mb-2">Ayat 3 dari 7</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-chart-2 h-2 rounded-full" style={{ width: '43%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">3/7</span>
                  </div>
                </div>
                <Button size="icon" className="rounded-full">
                  <Headphones className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Aktivitas Terbaru</h3>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                  <Check className="text-chart-1 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Menyelesaikan Huruf Alif</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-3/20 rounded-full flex items-center justify-center">
                  <BicepsFlexed className="text-chart-3 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Dhikr Pagi - 33x Tasbih</p>
                  <p className="text-xs text-muted-foreground">Hari ini, 06:30</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-4/20 rounded-full flex items-center justify-center">
                  <Brain className="text-chart-4 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Kuis Hijaiyah - Skor 90%</p>
                  <p className="text-xs text-muted-foreground">Kemarin, 19:45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Prayer Times */}
      <section className="p-4 pb-24">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3 gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Waktu Shalat</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{locationLabel}</span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={requestLocation}
                disabled={locationStatus === "loading"}
                className="text-xs"
              >
                {locationStatus === "loading" ? "Mencari..." : "Gunakan lokasi"}
              </Button>
            </div>

            {prayerTimesLoading && (
              <p className="text-xs text-muted-foreground">Memuat waktu shalat...</p>
            )}

            {prayerTimesError && (
              <p className="text-xs text-destructive">
                {getErrorMessage(prayerTimesError) || "Gagal memuat waktu shalat"}
              </p>
            )}

            {locationStatus === "denied" && (
              <p className="text-[11px] text-destructive">
                Izin lokasi ditolak. Aktifkan izin lokasi di browser untuk jadwal sesuai lokasi Anda.
              </p>
            )}
            {locationStatus === "unsupported" && (
              <p className="text-[11px] text-muted-foreground">
                Peramban tidak mendukung geolokasi. Menggunakan lokasi default.
              </p>
            )}

            {prayerTimes && (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Subuh</div>
                  <div className={`text-sm font-semibold ${nextPrayer.name === "Subuh" ? 'text-primary' : 'text-foreground'}`}>
                    {prayerTimes.fajr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Dhuhur</div>
                  <div className={`text-sm font-semibold ${nextPrayer.name === "Dhuhur" ? 'text-primary' : 'text-foreground'}`}>
                    {prayerTimes.dhuhr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Ashar</div>
                  <div className={`text-sm font-semibold ${nextPrayer.name === "Ashar" ? 'text-primary' : 'text-foreground'}`}>
                    {prayerTimes.asr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Maghrib</div>
                  <div className={`text-sm font-semibold ${nextPrayer.name === "Maghrib" ? 'text-primary' : 'text-foreground'}`}>
                    {prayerTimes.maghrib}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Isya</div>
                  <div className={`text-sm font-semibold ${nextPrayer.name === "Isya" ? 'text-primary' : 'text-foreground'}`}>
                    {prayerTimes.isha}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Selanjutnya</div>
                  <div className="text-xs font-medium text-primary">
                    {nextPrayer.name} • {nextPrayer.timeLeft}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}

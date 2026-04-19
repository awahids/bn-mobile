"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, isApiError, getErrorMessage } from "@/lib/api-client";
import { NetworkError } from "@/components/error-boundary";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ProgressRing } from "@/components/progress-ring";
import { usePrefetchByContext } from "@/lib/prefetch";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobilePageShell } from "@/components/page-atoms/mobile-page-shell";
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
  MapPin,
  Clock
} from "lucide-react";


const DEFAULT_COORDS = { lat: -6.2, lng: 106.8167 }; // Jakarta fallback

export function HomePageContent() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Prefetch learning routes since users are likely to navigate to them from home
  usePrefetchByContext('home');

  // Mock stats data
  const stats = {
    hijaiyah: { completed: 12, total: 28, progress: 43 }
  };

  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [locationLabel, setLocationLabel] = useState("Jakarta (default)");
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "denied" | "unsupported">("idle");

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
    if (prayerTimes?.location) {
      const loc = prayerTimes.location;
      const place = loc.label ||
        [loc.city, loc.district].filter(Boolean).join(", ") ||
        [loc.city, loc.country].filter(Boolean).join(", ");
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
    <MobilePageShell>
      {/* Immersive Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-6 mesh-gradient rounded-b-[2.5rem] shadow-xl shadow-primary/5">
        <div className="relative z-10 flex flex-col space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-1.5 shadow-inner">
                <Image
                  src="/images/logo/image.png"
                  alt="Belajar Ngaji"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover rounded-xl"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-foreground/90 tracking-tight">Belajar Ngaji</h1>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Aktif Belajar</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-background/40 backdrop-blur-md border border-white/20 hover:bg-background/60 transition-all duration-300"
                data-testid="toggle-theme"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-accent" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/40 backdrop-blur-md border border-white/20 hover:bg-background/60 transition-all duration-300"
                data-testid="notifications"
              >
                <Bell className="w-4 h-4 text-foreground/70" />
              </Button>
            </div>
          </header>

          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Assalamu&apos;alaikum,
              <span className="block text-primary">Sobat Ngaji ✨</span>
            </h2>
            <p className="text-muted-foreground text-sm font-medium">Lanjutkan langkahmu menuju keberkahan hari ini.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="glass p-4 rounded-3xl flex flex-col justify-between space-y-2 border-primary/10 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Streak Saya</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-primary">{user?.streak || 7}</span>
                <span className="text-xs font-bold text-primary/60">HARI</span>
              </div>
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-3/4 animate-pulse-soft" />
              </div>
            </div>
            <div className="glass p-4 rounded-3xl flex flex-col justify-between space-y-2 border-accent/10 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Target Hari Ini</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-accent">{user?.dailyProgress || 3}</span>
                <span className="text-xs font-bold text-accent/60">/ 5</span>
              </div>
              <div className="h-1.5 w-full bg-accent/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${((user?.dailyProgress || 3) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Modul Pembelajaran */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Modul Pilihan</h3>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">Explore All</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Hijaiyah Module */}
          <Link href="/hijaiyah" prefetch={true} className="group" data-testid="module-hijaiyah">
            <div className="relative glass p-5 rounded-[2rem] border-primary/5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-95">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-1 to-chart-1/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-1/10 group-hover:animate-float">
                <Languages className="text-white w-full h-full" />
              </div>
              <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Hijaiyah</h4>
              <p className="text-xs text-muted-foreground mb-4">28 Huruf Arab</p>
              <div className="flex items-center justify-between bg-primary/5 p-2 rounded-2xl">
                <span className="text-[10px] font-black text-primary uppercase">{stats.hijaiyah.completed}/{stats.hijaiyah.total}</span>
                <ProgressRing
                  progress={stats.hijaiyah.progress}
                  size={24}
                  className="text-primary"
                />
              </div>
            </div>
          </Link>

          {/* Al-Quran Module */}
          <Link href="/quran" prefetch={true} className="group" data-testid="module-quran">
            <div className="relative glass p-5 rounded-[2rem] border-secondary/5 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/5 active:scale-95">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-2 to-chart-2/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-2/10 group-hover:animate-float">
                <BookOpen className="text-white w-full h-full" />
              </div>
              <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Al-Qur&apos;an</h4>
              <p className="text-xs text-muted-foreground mb-4">114 Surah</p>
              <div className="flex items-center justify-between bg-accent/5 p-2 rounded-2xl">
                <span className="text-[10px] font-black text-accent uppercase">Surah Al-Fatihah</span>
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center p-1.5 shadow-sm">
                  <Bookmark className="text-white w-full h-full" />
                </div>
              </div>
            </div>
          </Link>

          {/* Dhikr Module */}
          <Link href="/dhikr" prefetch={true} className="group" data-testid="module-dhikr">
            <div className="relative glass p-5 rounded-[2rem] border-chart-3/5 transition-all duration-300 hover:shadow-xl hover:shadow-chart-3/5 active:scale-95">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-3 to-chart-3/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-3/10 group-hover:animate-float">
                <BicepsFlexed className="text-white w-full h-full" />
              </div>
              <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Dhikr</h4>
              <p className="text-xs text-muted-foreground mb-4">Pagi & Petang</p>
              <div className="flex items-center justify-between bg-chart-3/5 p-2 rounded-2xl">
                <span className="text-[10px] font-black text-chart-3 uppercase">33x</span>
                <ProgressRing
                  progress={66}
                  size={24}
                  className="text-chart-3"
                />
              </div>
            </div>
          </Link>

          {/* Quiz Module */}
          <Link href="/quiz" prefetch={true} className="group" data-testid="module-quiz">
            <div className="relative glass p-5 rounded-[2rem] border-chart-4/5 transition-all duration-300 hover:shadow-xl hover:shadow-chart-4/5 active:scale-95">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-4 to-chart-4/40 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-chart-4/10 group-hover:animate-float">
                <Brain className="text-white w-full h-full" />
              </div>
              <h4 className="font-bold text-card-foreground text-lg mb-1 leading-none">Kuis</h4>
              <p className="text-xs text-muted-foreground mb-4">4 Kategori</p>
              <div className="flex items-center justify-between bg-chart-4/5 p-2 rounded-2xl">
                <span className="text-[10px] font-black text-chart-4 uppercase">Skor: 85%</span>
                <div className="w-6 h-6 bg-chart-4 rounded-full flex items-center justify-center p-1.5 shadow-sm">
                  <Trophy className="text-white w-full h-full" />
                </div>
              </div>
            </div>
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

      {/* Prayer Times Widget */}
      <section className="px-6 pb-28">
        <div className="glass overflow-hidden rounded-[2.5rem] border-primary/10 shadow-lg shadow-primary/5">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center p-2">
                  <Clock className="text-primary w-full h-full" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Waktu Shalat</h3>
                  <div className="flex items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                    {locationLabel}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={requestLocation}
                disabled={locationStatus === "loading"}
                className="rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-tighter h-8"
              >
                {locationStatus === "loading" ? "Mencari..." : "Update Lokasi"}
              </Button>
            </div>

            {prayerTimesLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : prayerTimes ? (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Subuh", time: prayerTimes.fajr },
                  { name: "Dhuhur", time: prayerTimes.dhuhr },
                  { name: "Ashar", time: prayerTimes.asr },
                  { name: "Maghrib", time: prayerTimes.maghrib },
                  { name: "Isya", time: prayerTimes.isha }
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`relative p-3 rounded-2xl transition-all duration-300 ${nextPrayer.name === p.name
                        ? 'bg-primary shadow-lg shadow-primary/20 scale-105 z-10'
                        : 'bg-primary/5'
                      }`}
                  >
                    <div className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${nextPrayer.name === p.name ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                      {p.name}
                    </div>
                    <div className={`text-sm font-black ${nextPrayer.name === p.name ? 'text-white' : 'text-foreground'
                      }`}>
                      {p.time}
                    </div>
                    {nextPrayer.name === p.name && (
                      <div className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                ))}

                {/* Next Prayer Countdown Card */}
                <div className="col-span-1 rounded-2xl bg-accent p-3 shadow-lg shadow-accent/20 flex flex-col justify-center items-center text-center">
                  <div className="text-[9px] font-black text-white/70 uppercase tracking-tighter mb-0.5">Selanjutnya</div>
                  <div className="text-xs font-black text-white leading-none mb-1">{nextPrayer.name}</div>
                  <div className="text-[10px] font-bold text-white bg-black/10 px-2 py-0.5 rounded-full">{nextPrayer.timeLeft} lagi</div>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-xs text-muted-foreground font-medium">Gagal memuat jadwal shalat</p>
            )}
          </div>
        </div>
      </section>


      <BottomNavigation />
    </MobilePageShell>
  );
}

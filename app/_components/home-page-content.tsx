"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, isApiError } from "@/lib/api-client";
import { NetworkError } from "@/components/shared/error-boundary";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { usePrefetchByContext } from "@/lib/prefetch";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";

// Section Components
import { HeroSection } from "@/components/sections/home/hero-section";
import { LearningModulesSection } from "@/components/sections/home/learning-modules-section";
import { ContinueLearningSection } from "@/components/sections/home/continue-learning-section";
import { RecentActivitySection } from "@/components/sections/home/recent-activity-section";
import { PrayerTimesSection } from "@/components/sections/home/prayer-times-section";

const DEFAULT_COORDS = { lat: -6.2, lng: 106.8167 }; // Jakarta fallback

export function HomePageContent() {
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
  } = useQuery({
    queryKey: ['prayer-times', coords.lat, coords.lng],
    queryFn: () => api.utility.getPrayerTimes(coords),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1
  });

  // User data query
  const {
    data: user,
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

  // Handle critical errors
  if (userError && isApiError(userError) && userError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />
  }

  return (
    <MobilePageShell>
      <HeroSection user={user} />
      
      <LearningModulesSection stats={stats} />

      <ContinueLearningSection />

      <RecentActivitySection />

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

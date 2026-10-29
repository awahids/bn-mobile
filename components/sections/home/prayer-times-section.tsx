"use client";

import { Clock, Loader2, MapPin, Navigation } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

interface PrayerTimesSectionProps {
  prayerTimes: any;
  prayerTimesLoading: boolean;
  locationLabel: string;
  locationStatus: string;
  nextPrayer: { name: string; timeLeft: string };
  requestLocation: () => void;
}

export function PrayerTimesSection({
  prayerTimes,
  prayerTimesLoading,
  locationLabel,
  locationStatus,
  nextPrayer,
  requestLocation
}: PrayerTimesSectionProps) {
  const prayers = prayerTimes
    ? [
        { name: "Subuh", time: prayerTimes.fajr },
        { name: "Dzuhur", time: prayerTimes.dhuhr },
        { name: "Ashar", time: prayerTimes.asr },
        { name: "Maghrib", time: prayerTimes.maghrib },
        { name: "Isya", time: prayerTimes.isha },
      ]
    : [];

  return (
    <section className="px-4 pt-6">
      <SectionHeader
        title="Waktu Shalat"
        description={
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{locationLabel}</span>
          </span>
        }
        action={
          <button
            type="button"
            onClick={requestLocation}
            disabled={locationStatus === "loading"}
            className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-60"
          >
            {locationStatus === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Navigation className="h-3.5 w-3.5" />
            )}
            {locationStatus === "loading" ? "Mencari..." : "Lokasi saya"}
          </button>
        }
      />

      {locationStatus === "denied" || locationStatus === "unsupported" ? (
        <p role="status" className="mb-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
          {locationStatus === "denied"
            ? "Izin lokasi ditolak. Aktifkan akses lokasi di browser, lalu coba lagi."
            : "Perangkat tidak mendukung deteksi lokasi. Jadwal memakai lokasi default."}
        </p>
      ) : null}

      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        {prayerTimesLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : prayerTimes ? (
          <>
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3">
              <Clock className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm">
                <span className="text-muted-foreground">Berikutnya </span>
                <span className="font-semibold text-primary">{nextPrayer.name}</span>
                <span className="text-muted-foreground"> dalam </span>
                <span className="font-semibold tabular-nums">{nextPrayer.timeLeft}</span>
              </p>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center">
              {prayers.map((p) => {
                const isNext = nextPrayer.name === p.name;
                return (
                  <div
                    key={p.name}
                    className={cn(
                      "rounded-2xl px-1 py-2 transition-colors",
                      isNext ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    <div className={cn("text-[11px]", isNext ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {p.name}
                    </div>
                    <div className="text-sm font-semibold tabular-nums">{p.time}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">Gagal memuat jadwal shalat</p>
        )}
      </div>
    </section>
  );
}

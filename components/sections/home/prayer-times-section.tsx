"use client";

import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <section className="px-6 pb-4">
      <div className="glass overflow-hidden rounded-[2.5rem] border-primary/10 shadow-lg shadow-primary/5">
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center p-2">
                <Clock className="text-primary w-full h-full" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground">Waktu Shalat</h3>
                <div className="flex items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  <MapPin className="w-3 h-3 mr-1 shrink-0 text-primary" />
                  <span className="truncate">{locationLabel}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={requestLocation}
              disabled={locationStatus === "loading"}
              className="shrink-0 rounded-xl bg-primary/5 text-primary text-[11px] font-bold h-8 px-3"
            >
              {locationStatus === "loading" ? "Mencari..." : "Update Lokasi"}
            </Button>
          </div>

          {locationStatus === "denied" || locationStatus === "unsupported" ? (
            <p role="status" className="-mt-3 mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {locationStatus === "denied"
                ? "Izin lokasi ditolak. Aktifkan akses lokasi di browser, lalu coba lagi."
                : "Perangkat tidak mendukung deteksi lokasi. Jadwal memakai lokasi default."}
            </p>
          ) : null}

          {prayerTimesLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : prayerTimes ? (
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Subuh", time: prayerTimes.fajr },
                { name: "Dzuhur", time: prayerTimes.dhuhr },
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
                  <div className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${nextPrayer.name === p.name ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                    {p.name}
                  </div>
                  <div className={`text-sm font-black ${nextPrayer.name === p.name ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                    {p.time}
                  </div>
                  {nextPrayer.name === p.name && (
                    <div className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-accent rounded-full border-2 border-background animate-pulse" />
                  )}
                </div>
              ))}

              {/* Next Prayer Countdown Card */}
              <div className="col-span-1 rounded-2xl bg-accent p-3 shadow-lg shadow-accent/20 flex flex-col justify-center items-center text-center">
                <div className="text-[10px] font-bold text-accent-foreground/80 uppercase tracking-wide mb-0.5">Selanjutnya</div>
                <div className="text-xs font-black text-accent-foreground leading-none mb-1">{nextPrayer.name}</div>
                <div className="text-[10px] font-bold text-accent-foreground bg-black/10 px-2 py-0.5 rounded-full">{nextPrayer.timeLeft} lagi</div>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-xs text-muted-foreground font-medium">Gagal memuat jadwal shalat</p>
          )}
        </div>
      </div>
    </section>
  );
}

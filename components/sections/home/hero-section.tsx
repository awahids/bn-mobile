"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Bell } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { HeaderIconButton } from "@/components/shared/sticky-page-header";
import { useTheme } from "@/components/shared/theme-provider";

interface HeroSectionProps {
  user: any;
}

const DAILY_TARGET = 5;
const STREAK_GOAL_DAYS = 7;

function toSafeCount(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

export function HeroSection({ user }: HeroSectionProps) {
  const { theme, toggleTheme } = useTheme();
  const streak = toSafeCount(user?.streak);
  const dailyProgress = Math.min(toSafeCount(user?.dailyProgress), DAILY_TARGET);
  const streakPercent = Math.min(100, (streak / STREAK_GOAL_DAYS) * 100);
  const dailyPercent = (dailyProgress / DAILY_TARGET) * 100;
  const displayName = (user?.name || user?.username || "").trim().split(/\s+/)[0];

  return (
    <section className="bg-gradient-to-b from-primary/10 to-transparent px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-2xl border border-border bg-card p-1">
            <Image
              src="/images/logo/image.png"
              alt="Belajar Ngaji"
              width={40}
              height={40}
              className="h-full w-full rounded-xl object-cover"
              priority
            />
          </div>
          <span className="text-base font-semibold tracking-tight">Belajar Ngaji</span>
        </div>

        <div className="flex items-center gap-2">
          <HeaderIconButton
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
            data-testid="toggle-theme"
          >
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </HeaderIconButton>
          <Link
            href="/profile"
            aria-label="Pengaturan notifikasi"
            data-testid="notifications"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
          >
            <Bell className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">Assalamu&apos;alaikum,</p>
        <h1 className="text-2xl font-bold tracking-tight">{displayName || "Sobat Ngaji"}</h1>
      </div>

      {/* Activity summary, after 21st.dev "Activity Card" (kokonutd): rings with value + label. */}
      <div className="mt-4 grid grid-cols-2 divide-x divide-border rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3 pr-3">
          <ProgressRing
            progress={streakPercent}
            size={52}
            strokeWidth={5}
            className="text-primary"
            label={<span className="text-sm font-bold">{streak}</span>}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Streak</p>
            <p className="text-xs text-muted-foreground">{streak} dari {STREAK_GOAL_DAYS} hari</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pl-4">
          <ProgressRing
            progress={dailyPercent}
            size={52}
            strokeWidth={5}
            className="text-accent"
            label={<span className="text-sm font-bold">{dailyProgress}</span>}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Target harian</p>
            <p className="text-xs text-muted-foreground">{dailyProgress} dari {DAILY_TARGET} materi</p>
          </div>
        </div>
      </div>
    </section>
  );
}

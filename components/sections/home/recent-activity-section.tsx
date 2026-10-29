"use client";

import { History } from "lucide-react";
import { getModule } from "@/data/modules";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

interface RecentActivityItem {
  id: string;
  title: string;
  timeLabel: string;
  type: "hijaiyah" | "quran" | "dhikr" | "quiz" | "hafalan";
}

interface RecentActivitySectionProps {
  activities: RecentActivityItem[];
}

export function RecentActivitySection({ activities }: RecentActivitySectionProps) {
  return (
    <section className="px-4 pt-6">
      <SectionHeader title="Aktivitas Terbaru" />

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {activities.length > 0 ? (
          <ul className="divide-y divide-border">
            {activities.map((activity) => {
              // Hafalan is part of the Qur'an module.
              const moduleInfo = getModule(activity.type === "hafalan" ? "quran" : activity.type);
              const Icon = moduleInfo.icon;
              return (
                <li key={activity.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", moduleInfo.tileClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.timeLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Belum ada aktivitas</p>
            <p className="text-xs text-muted-foreground">Aktivitas belajarmu akan muncul di sini.</p>
          </div>
        )}
      </div>
    </section>
  );
}

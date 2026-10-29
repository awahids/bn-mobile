"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getModule } from "@/data/modules";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

interface ContinueLearningItem {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  progressPercent: number;
  progressLabel: string;
  iconText?: string;
  iconType: "hijaiyah" | "quran";
}

interface ContinueLearningSectionProps {
  items: ContinueLearningItem[];
}

export function ContinueLearningSection({ items }: ContinueLearningSectionProps) {
  return (
    <section className="px-4 pt-6">
      <SectionHeader title="Lanjutkan Belajar" />

      <div className="space-y-3">
        {items.map((item) => {
          const moduleInfo = getModule(item.iconType);
          const Icon = moduleInfo.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99]"
            >
              <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", moduleInfo.tileClass)}>
                {item.iconType === "hijaiyah" ? (
                  <span className="font-arabic text-2xl font-bold">{item.iconText || "ا"}</span>
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold tracking-tight">{item.title}</h3>
                <p className="truncate text-sm text-muted-foreground">{item.subtitle}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", moduleInfo.barClass)}
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{item.progressLabel}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

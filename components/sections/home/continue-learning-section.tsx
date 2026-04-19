"use client";

import Link from "next/link";
import { Play, BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Lanjutkan Belajar</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          Lihat Semua
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isHijaiyah = item.iconType === "hijaiyah";

          return (
            <Link key={item.id} href={item.href} prefetch>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center ${isHijaiyah
                          ? "bg-gradient-to-br from-chart-1 to-chart-1/80"
                          : "bg-gradient-to-br from-chart-2 to-chart-2/80"
                        }`}
                    >
                      {isHijaiyah ? (
                        <span className="text-white text-2xl font-arabic font-bold">
                          {item.iconText || "ا"}
                        </span>
                      ) : (
                        <BookOpen className="text-white w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${isHijaiyah ? "bg-chart-1" : "bg-chart-2"
                              }`}
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.progressLabel}</span>
                      </div>
                    </div>
                    <Button size="icon" className="rounded-full">
                      {isHijaiyah ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Headphones className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

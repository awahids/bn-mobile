"use client";

import { Check, BicepsFlexed, Brain, BookMarked, BookOpen, Languages } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const getIcon = (type: RecentActivityItem["type"]) => {
    if (type === "hijaiyah") {
      return <Languages className="text-chart-1 w-4 h-4" />
    }
    if (type === "quran") {
      return <BookOpen className="text-chart-2 w-4 h-4" />
    }
    if (type === "dhikr") {
      return <BicepsFlexed className="text-chart-3 w-4 h-4" />
    }
    if (type === "quiz") {
      return <Brain className="text-chart-4 w-4 h-4" />
    }
    if (type === "hafalan") {
      return <BookMarked className="text-chart-5 w-4 h-4" />
    }
    return <Check className="text-chart-1 w-4 h-4" />
  }

  const getIconBg = (type: RecentActivityItem["type"]) => {
    if (type === "hijaiyah") return "bg-chart-1/20"
    if (type === "quran") return "bg-chart-2/20"
    if (type === "dhikr") return "bg-chart-3/20"
    if (type === "quiz") return "bg-chart-4/20"
    if (type === "hafalan") return "bg-chart-5/20"
    return "bg-chart-1/20"
  }

  return (
    <section className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Aktivitas Terbaru</h3>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${getIconBg(activity.type)} rounded-full flex items-center justify-center`}
                  >
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.timeLabel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              Belum ada aktivitas terbaru
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

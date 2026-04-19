import { cn } from "@/lib/utils";
import type { WeeklyActivityItem } from "@/app/progress/_hooks/use-progress-page-data";

interface WeeklyActivityDayProps {
  day: WeeklyActivityItem;
}

export function WeeklyActivityDay({ day }: WeeklyActivityDayProps) {
  return (
    <div className="text-center">
      <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          day.completed ? "bg-chart-1 text-white" : "bg-muted text-muted-foreground"
        )}
      >
        {day.completed && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
    </div>
  );
}

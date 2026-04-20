import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AchievementItem } from "@/app/progress/_hooks/use-progress-page-data";

interface ProgressAchievementsTabProps {
  achievements: AchievementItem[];
}

export function ProgressAchievementsTab({ achievements }: ProgressAchievementsTabProps) {
  return (
    <div className="p-4 pb-24">
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlocked ? "bg-chart-1/5 border-chart-1" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 ${
                    achievement.unlocked ? "text-chart-1" : "text-muted-foreground"
                  }`}
                >
                  <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? "" : "opacity-50"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <Badge variant="default" className="bg-chart-1">
                      <Award className="w-3 h-3 mr-1" />
                      Terbuka • {achievement.date}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Terkunci</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

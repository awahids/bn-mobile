import { BicepsFlexed, BookMarked, BookOpen, Brain, Clock, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressActivityTabProps {
  recentProgress: any[];
}

export function ProgressActivityTab({ recentProgress }: ProgressActivityTabProps) {
  return (
    <div className="p-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProgress.length > 0 ? (
              recentProgress
                .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
                .slice(0, 10)
                .map((item, index) => (
                  <div key={`${item.module}-${item.itemId}-${index}`} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      {item.module === "hijaiyah" && <Languages className="w-4 h-4 text-chart-1" />}
                      {item.module === "quran" && <BookOpen className="w-4 h-4 text-chart-2" />}
                      {item.module === "dhikr" && <BicepsFlexed className="w-4 h-4 text-chart-3" />}
                      {item.module === "quiz" && <Brain className="w-4 h-4 text-chart-4" />}
                      {item.module === "hafalan" && <BookMarked className="w-4 h-4 text-chart-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">
                        {item.module} - {item.itemId}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.lastAccessed).toLocaleDateString("id-ID")}
                        </p>
                        {item.completed && (
                          <Badge variant="secondary" className="text-xs">
                            Selesai
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.progress}%</div>
                      {item.score > 0 && <div className="text-xs text-muted-foreground">Skor: {item.score}</div>}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada aktivitas belajar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

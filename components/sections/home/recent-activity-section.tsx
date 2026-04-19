"use client";

import { Check, BicepsFlexed, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RecentActivitySection() {
  return (
    <section className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Aktivitas Terbaru</h3>

      <div className="space-y-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                <Check className="text-chart-1 w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Menyelesaikan Huruf Alif</p>
                <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-chart-3/20 rounded-full flex items-center justify-center">
                <BicepsFlexed className="text-chart-3 w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Dhikr Pagi - 33x Tasbih</p>
                <p className="text-xs text-muted-foreground">Hari ini, 06:30</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-chart-4/20 rounded-full flex items-center justify-center">
                <Brain className="text-chart-4 w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Kuis Hijaiyah - Skor 90%</p>
                <p className="text-xs text-muted-foreground">Kemarin, 19:45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

"use client";

import { Play, BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContinueLearningSection() {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Lanjutkan Belajar</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          Lihat Semua
        </Button>
      </div>

      <div className="space-y-3">
        {/* Continue Hijaiyah */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-1/80 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-arabic font-bold">ب</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-card-foreground mb-1">Huruf Ba (ب)</h4>
                <p className="text-sm text-muted-foreground mb-2">Pelajari cara menulis dan pengucapan</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-chart-1 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">45%</span>
                </div>
              </div>
              <Button size="icon" className="rounded-full">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Continue Al-Quran */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-2 to-chart-2/80 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-card-foreground mb-1">Al-Fatihah</h4>
                <p className="text-sm text-muted-foreground mb-2">Ayat 3 dari 7</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-chart-2 h-2 rounded-full" style={{ width: '43%' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">3/7</span>
                </div>
              </div>
              <Button size="icon" className="rounded-full">
                <Headphones className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { Award, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileAchievementsCardProps {
  onSeeAll: () => void;
}

export function ProfileAchievementsCard({ onSeeAll }: ProfileAchievementsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Prestasi Terbaru</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 text-chart-1">
            <Flame className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Seminggu Berturut</h3>
            <p className="text-sm text-muted-foreground">Belajar 7 hari berturut-turut</p>
          </div>
          <Badge variant="default">Baru</Badge>
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={onSeeAll}>
          Lihat Semua Prestasi
        </Button>
      </CardContent>
    </Card>
  );
}

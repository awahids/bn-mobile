import { BookmarkCheck, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QuranSurah } from "@/data/quran";

interface QuranSurahListItemProps {
  surah: QuranSurah;
  isBookmarked: boolean;
  onSelect: () => void;
  onPlay: () => void;
}

export function QuranSurahListItem({ surah, isBookmarked, onSelect, onPlay }: QuranSurahListItemProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all"
      onClick={onSelect}
      data-testid={`surah-${surah.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
            <span className="text-chart-2 font-bold">{surah.id}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground">{surah.name}</h3>
              {isBookmarked && <BookmarkCheck className="w-4 h-4 text-chart-2" />}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{surah.englishName}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {surah.numberOfAyahs} Ayat
              </Badge>
              <Badge variant="outline" className="text-xs">
                {surah.revelationType}
              </Badge>
            </div>
          </div>

          <div className="text-right arabic-text">
            <div className="text-lg font-arabic text-chart-2 mb-1">{surah.arabicName}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              data-testid={`play-surah-${surah.id}`}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

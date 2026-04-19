import { Bookmark, BookmarkCheck, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { QuranAyah } from "@/data/quran";

interface QuranAyahCardProps {
  ayah: QuranAyah;
  isBookmarked: boolean;
  isBookmarkMutating: boolean;
  onPlay: () => void;
  onToggleBookmark: () => void;
}

export function QuranAyahCard({
  ayah,
  isBookmarked,
  isBookmarkMutating,
  onPlay,
  onToggleBookmark,
}: QuranAyahCardProps) {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{ayah.number}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onPlay} data-testid={`play-ayah-${ayah.number}`}>
              <Volume2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleBookmark}
              disabled={isBookmarkMutating}
              data-testid={`bookmark-ayah-${ayah.number}`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-chart-2" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="arabic-text mb-4">
          <div className="text-xl font-arabic leading-relaxed text-chart-2">{ayah.text}</div>
        </div>

        <Separator className="my-3" />

        <p className="text-sm text-foreground leading-relaxed">{ayah.translation}</p>
      </CardContent>
    </Card>
  );
}

import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { StickyPageHeader } from "@/components/page-atoms/sticky-page-header";
import { Button } from "@/components/ui/button";

interface QuranHeaderProps {
  selectedSurah: number | null;
  selectedSurahName?: string;
  selectedSurahArabicName?: string;
  isBookmarked: boolean;
  isBookmarkMutating: boolean;
  onBack: () => void;
  onToggleSurahBookmark: () => void;
}

export function QuranHeader({
  selectedSurah,
  selectedSurahName,
  selectedSurahArabicName,
  isBookmarked,
  isBookmarkMutating,
  onBack,
  onToggleSurahBookmark,
}: QuranHeaderProps) {
  return (
    <StickyPageHeader
      title={selectedSurah ? selectedSurahName : "Al-Qur'an"}
      subtitle={selectedSurah ? selectedSurahArabicName : "114 Surah"}
      leftSlot={
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="back-button">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      rightSlot={
        selectedSurah ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSurahBookmark}
            disabled={isBookmarkMutating}
            data-testid="bookmark-surah"
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-chart-2" /> : <Bookmark className="w-5 h-5" />}
          </Button>
        ) : null
      }
    />
  );
}

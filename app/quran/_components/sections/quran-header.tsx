import { Bookmark, BookmarkCheck } from "lucide-react";
import { HeaderIconButton, StickyPageHeader } from "@/components/shared/sticky-page-header";

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
      onBack={onBack}
      rightSlot={
        selectedSurah ? (
          <HeaderIconButton
            onClick={onToggleSurahBookmark}
            disabled={isBookmarkMutating}
            aria-label={isBookmarked ? "Hapus bookmark surah" : "Bookmark surah"}
            data-testid="bookmark-surah"
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
          </HeaderIconButton>
        ) : null
      }
    />
  );
}

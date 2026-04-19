import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuranSurahListItem } from "@/app/quran/_components/atoms/quran-surah-list-item";
import type { QuranSurah } from "@/data/quran";

interface QuranSurahListSectionProps {
  searchQuery: string;
  surahs: QuranSurah[];
  isBookmarked: (surahId: number) => boolean;
  onSearchChange: (query: string) => void;
  onSelectSurah: (surahId: number) => void;
  onPlaySurah: (surah: QuranSurah) => void;
}

export function QuranSurahListSection({
  searchQuery,
  surahs,
  isBookmarked,
  onSearchChange,
  onSelectSurah,
  onPlaySurah,
}: QuranSurahListSectionProps) {
  return (
    <>
      <section className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari surah atau nomor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            data-testid="search-surah"
          />
        </div>
      </section>

      <section className="px-4 pb-24">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {surahs.map((surah) => (
              <QuranSurahListItem
                key={surah.id}
                surah={surah}
                isBookmarked={isBookmarked(surah.id)}
                onSelect={() => onSelectSurah(surah.id)}
                onPlay={() => onPlaySurah(surah)}
              />
            ))}
          </div>
        </ScrollArea>
      </section>
    </>
  );
}

import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuranAyahCard } from "@/app/quran/_components/atoms/quran-ayah-card";
import type { QuranAyah, QuranSurah } from "@/data/quran";

interface QuranSurahDetailSectionProps {
  surah: QuranSurah;
  ayahs: QuranAyah[];
  ayahsLoading: boolean;
  isBookmarkMutating: boolean;
  isBookmarked: (ayahNumber: number) => boolean;
  onPlayAyah: (ayah: QuranAyah) => void;
  onToggleAyahBookmark: (ayahNumber: number) => void;
}

export function QuranSurahDetailSection({
  surah,
  ayahs,
  ayahsLoading,
  isBookmarkMutating,
  isBookmarked,
  onPlayAyah,
  onToggleAyahBookmark,
}: QuranSurahDetailSectionProps) {
  return (
    <section className="px-4 pb-24">
      <Card className="mb-4">
        <CardHeader className="text-center">
          <div className="text-3xl font-arabic text-chart-2 mb-2">{surah.arabicName}</div>
          <CardTitle className="text-xl">{surah.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {surah.englishName} • {surah.numberOfAyahs} Ayat
          </p>
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{surah.revelationType}</span>
          </div>
        </CardHeader>
      </Card>

      {surah.id !== 9 && (
        <Card className="mb-4 bg-gradient-to-r from-chart-2/10 to-chart-3/10">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-arabic text-chart-2 mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <p className="text-sm text-muted-foreground">
              Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang
            </p>
          </CardContent>
        </Card>
      )}

      {ayahsLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-chart-2/30 border-t-chart-2 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Memuat ayat...</p>
          </div>
        </div>
      )}

      {!ayahsLoading && (
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-4">
            {ayahs.map((ayah) => (
              <QuranAyahCard
                key={ayah.number}
                ayah={ayah}
                isBookmarked={isBookmarked(ayah.number)}
                isBookmarkMutating={isBookmarkMutating}
                onPlay={() => onPlayAyah(ayah)}
                onToggleBookmark={() => onToggleAyahBookmark(ayah.number)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </section>
  );
}

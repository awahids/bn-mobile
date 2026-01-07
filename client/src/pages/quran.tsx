import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AudioPlayer } from "@/components/audio-player";
import { useAudio } from "@/hooks/use-audio";
import { quranSurahs, alFatihahAyahs, getSurahById, fetchSurahAyahs, QuranAyah } from "@/data/quran";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Pause, 
  Bookmark, 
  BookmarkCheck,
  Volume2,
  MapPin
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Quran() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const [currentAudioTitle, setCurrentAudioTitle] = useState<string>("");
  const [currentAudioSubtitle, setCurrentAudioSubtitle] = useState<string>("");

  const audio = useAudio();

  // Bookmarks query
  const { data: bookmarks = [] } = useQuery<Array<{
    id: string;
    userId: string;
    type: string;
    contentId: string;
    note: string | null;
    createdAt: Date;
  }>>({
    queryKey: ["/api/bookmarks"],
    queryFn: async () => {
      const response = await fetch("/api/bookmarks?type=quran");
      return response.json();
    }
  });

  const filteredSurahs = quranSurahs.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.id.toString() === searchQuery
  );

  const isBookmarked = (surahId: number, ayahNumber?: number) => {
    const contentId = ayahNumber ? `${surahId}:${ayahNumber}` : surahId.toString();
    return bookmarks.some((b: any) => b.contentId === contentId);
  };

  const toggleBookmark = async (surahId: number, ayahNumber?: number) => {
    const contentId = ayahNumber ? `${surahId}:${ayahNumber}` : surahId.toString();
    const existing = bookmarks.find((b: any) => b.contentId === contentId);

    try {
      if (existing) {
        await apiRequest("DELETE", `/api/bookmarks/${existing.id}`);
      } else {
        await apiRequest("POST", "/api/bookmarks", {
          type: "quran",
          contentId,
          note: ayahNumber ? `Ayat ${ayahNumber}` : `Surah ${getSurahById(surahId)?.name}`
        });
      }
      
      // Invalidate bookmarks cache to refresh all bookmark-related queries
      await queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Helper function to convert CDN URLs to use our proxy
  const getProxyAudioUrl = (cdnUrl: string) => {
    return `/api/audio-proxy?url=${encodeURIComponent(cdnUrl)}`;
  };

  const playAudio = (audioUrl: string, title: string, subtitle: string) => {
    const proxyUrl = getProxyAudioUrl(audioUrl);
    setCurrentAudioUrl(proxyUrl);
    setCurrentAudioTitle(title);
    setCurrentAudioSubtitle(subtitle);
    audio.play(proxyUrl);
    setAudioPlayerVisible(true);
  };

  const handleSurahSelect = (surahId: number) => {
    setSelectedSurah(surahId);
    setCurrentAyah(null);
  };

  const selectedSurahData = selectedSurah ? getSurahById(selectedSurah) : null;

  // Dynamic ayah fetching for selected surah
  const { data: surahAyahs = [], isLoading: ayahsLoading } = useQuery<QuranAyah[]>({
    queryKey: ["/api/surah-ayahs", selectedSurah],
    queryFn: () => selectedSurah ? fetchSurahAyahs(selectedSurah) : Promise.resolve([]),
    enabled: !!selectedSurah
  });

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => selectedSurah ? setSelectedSurah(null) : setLocation('/')}
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {selectedSurah ? selectedSurahData?.name : "Al-Qur'an"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {selectedSurah ? selectedSurahData?.arabicName : "114 Surah"}
              </p>
            </div>
          </div>
          
          {selectedSurah && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(selectedSurah)}
              data-testid="bookmark-surah"
            >
              {isBookmarked(selectedSurah) ? (
                <BookmarkCheck className="w-5 h-5 text-chart-2" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Surah List View */}
      {!selectedSurah && (
        <>
          {/* Search */}
          <section className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari surah atau nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-surah"
              />
            </div>
          </section>

          {/* Surah List */}
          <section className="px-4 pb-24">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {filteredSurahs.map((surah) => (
                  <Card
                    key={surah.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSurahSelect(surah.id)}
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
                            {isBookmarked(surah.id) && (
                              <BookmarkCheck className="w-4 h-4 text-chart-2" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {surah.englishName}
                          </p>
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
                          <div className="text-lg font-arabic text-chart-2 mb-1">
                            {surah.arabicName}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (surah.audioUrl) {
                                playAudio(surah.audioUrl, surah.name, `${surah.numberOfAyahs} Ayat`);
                              }
                            }}
                            data-testid={`play-surah-${surah.id}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </section>
        </>
      )}

      {/* Surah Detail View - All Surahs */}
      {selectedSurah && (
        <section className="px-4 pb-24">
          {/* Surah Header */}
          <Card className="mb-4">
            <CardHeader className="text-center">
              <div className="text-3xl font-arabic text-chart-2 mb-2">
                {selectedSurahData?.arabicName}
              </div>
              <CardTitle className="text-xl">{selectedSurahData?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedSurahData?.englishName} • {selectedSurahData?.numberOfAyahs} Ayat
              </p>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedSurahData?.revelationType}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Bismillah - Show for all surahs except At-Tawba (9) */}
          {selectedSurah !== 9 && (
            <Card className="mb-4 bg-gradient-to-r from-chart-2/10 to-chart-3/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-arabic text-chart-2 mb-2">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <p className="text-sm text-muted-foreground">
                  Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang
                </p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {ayahsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-chart-2/30 border-t-chart-2 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Memuat ayat...</p>
              </div>
            </div>
          )}

          {/* Ayahs */}
          {!ayahsLoading && (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-4">
                {surahAyahs.map((ayah) => (
                <Card key={ayah.number} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{ayah.number}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (ayah.audioUrl) {
                              playAudio(ayah.audioUrl, `Ayat ${ayah.number}`, selectedSurahData?.name || "");
                              setCurrentAyah(ayah.number);
                            }
                          }}
                          data-testid={`play-ayah-${ayah.number}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(selectedSurah, ayah.number)}
                          data-testid={`bookmark-ayah-${ayah.number}`}
                        >
                          {isBookmarked(selectedSurah, ayah.number) ? (
                            <BookmarkCheck className="w-4 h-4 text-chart-2" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="arabic-text mb-4">
                      <div className="text-xl font-arabic leading-relaxed text-chart-2">
                        {ayah.text}
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <p className="text-sm text-foreground leading-relaxed">
                      {ayah.translation}
                    </p>
                  </CardContent>
                </Card>
              ))}
              </div>
            </ScrollArea>
          )}
        </section>
      )}


      {/* Audio Player */}
      <AudioPlayer
        title={currentAudioTitle || (currentAyah ? `Ayat ${currentAyah}` : selectedSurahData?.name || "Al-Qur'an")}
        subtitle={currentAudioSubtitle || (selectedSurahData?.name || "Recitation")}
        audioUrl={currentAudioUrl}
        isVisible={audioPlayerVisible}
        onClose={() => setAudioPlayerVisible(false)}
        // Audio state from useAudio hook
        isPlaying={audio.isPlaying}
        currentTime={audio.currentTime}
        duration={audio.duration}
        volume={audio.volume}
        isLoading={audio.isLoading}
        error={audio.error}
        // Audio controls from useAudio hook
        onPlay={() => audio.play()}
        onPause={audio.pause}
        onSeek={audio.seek}
        onVolumeChange={audio.setVolume}
      />

      <BottomNavigation />
    </div>
  );
}

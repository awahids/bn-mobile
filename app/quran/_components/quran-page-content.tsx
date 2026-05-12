"use client";

import { AudioPlayer } from "@/components/features/learning/audio-player";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { useQuranPageController } from "@/app/quran/_hooks/use-quran-page-controller";
import { QuranHeader } from "@/app/quran/_components/sections/quran-header";
import { QuranSurahListSection } from "@/app/quran/_components/sections/quran-surah-list-section";
import { QuranSurahDetailSection } from "@/app/quran/_components/sections/quran-surah-detail-section";
import { QuranQuickSwitch } from "@/app/quran/_components/sections/quran-quick-switch";
import { QuranHafalanSection } from "@/app/quran/_components/sections/quran-hafalan-section";

export function QuranPageContent() {
  const {
    searchQuery,
    currentTab,
    changeTab,
    selectedSurah,
    selectedSurahData,
    filteredSurahs,
    surahAyahs,
    ayahsLoading,
    juzAmmaSurahs,
    selectedTargetSurah,
    setSelectedTargetSurah,
    selectedTargetSurahData,
    hafalanAyahs,
    hafalanAyahsLoading,
    hafalanProgressMap,
    updateHafalanEntry,
    resetHafalanSurah,
    audioPlayerVisible,
    currentAyah,
    setCurrentAyah,
    audio,
    setAppSearchQuery,
    setSelectedSurah,
    setAudioPlayerVisible,
    isBookmarked,
    toggleBookmark,
    playAudio,
    handleSurahSelect,
    goBackHome,
    isBookmarkMutating,
  } = useQuranPageController();

  return (
    <MobilePageShell className="pb-32">
      <QuranHeader
        selectedSurah={selectedSurah}
        selectedSurahName={selectedSurahData?.name}
        selectedSurahArabicName={selectedSurahData?.arabicName}
        isBookmarked={selectedSurah ? isBookmarked(selectedSurah) : false}
        isBookmarkMutating={isBookmarkMutating}
        onBack={() => (selectedSurah ? setSelectedSurah(null) : goBackHome())}
        onToggleSurahBookmark={() => {
          if (selectedSurah) {
            toggleBookmark(selectedSurah);
          }
        }}
      />

      {currentTab === "read" && !selectedSurah && (
        <QuranSurahListSection
          searchQuery={searchQuery}
          surahs={filteredSurahs}
          isBookmarked={(surahId) => isBookmarked(surahId)}
          onSearchChange={setAppSearchQuery}
          onSelectSurah={handleSurahSelect}
          onPlaySurah={(surah) => {
            if (surah.audioUrl) {
              playAudio(surah.audioUrl, surah.name, `${surah.numberOfAyahs} Ayat`);
            }
          }}
        />
      )}

      {currentTab === "read" && selectedSurah && selectedSurahData && (
        <QuranSurahDetailSection
          surah={selectedSurahData}
          ayahs={surahAyahs}
          ayahsLoading={ayahsLoading}
          isBookmarkMutating={isBookmarkMutating}
          isBookmarked={(ayahNumber) => isBookmarked(selectedSurah, ayahNumber)}
          onPlayAyah={(ayah) => {
            if (ayah.audioUrl) {
              playAudio(ayah.audioUrl, `Ayat ${ayah.number}`, selectedSurahData.name);
              setCurrentAyah(ayah.number);
            }
          }}
          onToggleAyahBookmark={(ayahNumber) => toggleBookmark(selectedSurah, ayahNumber)}
        />
      )}

      {currentTab === "hafalan" && (
        <QuranHafalanSection
          surahs={juzAmmaSurahs}
          selectedSurahId={selectedTargetSurah}
          onSelectSurah={setSelectedTargetSurah}
          ayahs={hafalanAyahs}
          ayahsLoading={hafalanAyahsLoading}
          progressMap={hafalanProgressMap}
          onUpdateAyahProgress={updateHafalanEntry}
          onResetSurah={resetHafalanSurah}
          onPlayAyah={(ayah) => {
            if (ayah.audioUrl) {
              const subtitle = selectedTargetSurahData?.name || "Hafalan";
              playAudio(ayah.audioUrl, `Ayat ${ayah.number}`, subtitle);
              setCurrentAyah(ayah.number);
            }
          }}
        />
      )}

      {!selectedSurah && <QuranQuickSwitch currentTab={currentTab} onChangeTab={changeTab} />}

      <AudioPlayer
        title={audio.title || (currentAyah ? `Ayat ${currentAyah}` : selectedSurahData?.name || "Al-Qur'an")}
        subtitle={audio.subtitle || (selectedSurahData?.name || "Recitation")}
        audioUrl={audio.currentSrc}
        isVisible={audioPlayerVisible}
        onClose={() => setAudioPlayerVisible(false)}
        isPlaying={audio.isPlaying}
        currentTime={audio.currentTime}
        duration={audio.duration}
        volume={audio.volume}
        isLoading={audio.isLoading}
        error={audio.error}
        onPlay={() => audio.play()}
        onPause={audio.pause}
        onSeek={audio.seek}
        onVolumeChange={audio.setVolume}
      />

      <BottomNavigation />
    </MobilePageShell>
  );
}

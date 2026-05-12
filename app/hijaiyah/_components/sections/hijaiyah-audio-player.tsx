import { LazyAudioPlayer } from "@/components/lazy";
import type { HijaiyahLetterAPI } from "@/lib/api-core";

interface HijaiyahAudioPlayerProps {
  isVisible: boolean;
  selectedLetter: HijaiyahLetterAPI;
  audio: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isLoading: boolean;
    error: string | null;
    play: (src?: string) => void;
    pause: () => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
  };
  onClose: () => void;
}

export function HijaiyahAudioPlayer({
  isVisible,
  selectedLetter,
  audio,
  onClose,
}: HijaiyahAudioPlayerProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <LazyAudioPlayer
      title={`Huruf ${selectedLetter.name}`}
      subtitle={selectedLetter.pronunciation}
      audioUrl={selectedLetter.audioUrl ?? ""}
      isVisible={isVisible}
      onClose={onClose}
      isPlaying={audio.isPlaying}
      currentTime={audio.currentTime}
      duration={audio.duration}
      volume={audio.volume}
      isLoading={audio.isLoading}
      error={audio.error}
      onPlay={() => audio.play(selectedLetter.audioUrl ?? "")}
      onPause={audio.pause}
      onSeek={audio.seek}
      onVolumeChange={audio.setVolume}
    />
  );
}

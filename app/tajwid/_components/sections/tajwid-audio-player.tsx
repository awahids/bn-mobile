import { LazyAudioPlayer } from "@/components/lazy";

interface TajwidAudioPlayerProps {
  isVisible: boolean;
  audio: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isLoading: boolean;
    error: string | null;
    currentSrc: string;
    title: string;
    subtitle: string;
    play: (src?: string) => void;
    pause: () => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
  };
  onClose: () => void;
}

export function TajwidAudioPlayer({
  isVisible,
  audio,
  onClose,
}: TajwidAudioPlayerProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <LazyAudioPlayer
      title={audio.title || "Audio Tajwid"}
      subtitle={audio.subtitle || "Belajar Tajwid"}
      audioUrl={audio.currentSrc}
      isVisible={isVisible}
      onClose={onClose}
      isPlaying={audio.isPlaying}
      currentTime={audio.currentTime}
      duration={audio.duration}
      volume={audio.volume}
      isLoading={audio.isLoading}
      error={audio.error}
      onPlay={() => audio.play(audio.currentSrc)}
      onPause={audio.pause}
      onSeek={audio.seek}
      onVolumeChange={audio.setVolume}
    />
  );
}

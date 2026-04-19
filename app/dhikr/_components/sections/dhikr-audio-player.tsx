import { LazyAudioPlayer } from "@/components/lazy";

interface DhikrAudioPlayerProps {
  title: string;
  audioUrl: string;
  isVisible: boolean;
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
    setVolume: (volume: number) => void;
  };
  onClose: () => void;
}

export function DhikrAudioPlayer({ title, audioUrl, isVisible, audio, onClose }: DhikrAudioPlayerProps) {
  return (
    <LazyAudioPlayer
      title={title}
      subtitle="Dhikr Audio"
      audioUrl={audioUrl}
      isVisible={isVisible}
      onClose={onClose}
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
  );
}

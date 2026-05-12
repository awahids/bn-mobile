import { LazyAudioPlayer } from "@/components/lazy";
import type { TajwidRuleAPI } from "@/lib/api-core";

interface TajwidAudioPlayerProps {
  isVisible: boolean;
  selectedRule: TajwidRuleAPI;
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

export function TajwidAudioPlayer({
  isVisible,
  selectedRule,
  audio,
  onClose,
}: TajwidAudioPlayerProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <LazyAudioPlayer
      title={selectedRule.name}
      subtitle={selectedRule.arabicName}
      audioUrl={selectedRule.audioUrl ?? ""}
      isVisible={isVisible}
      onClose={onClose}
      isPlaying={audio.isPlaying}
      currentTime={audio.currentTime}
      duration={audio.duration}
      volume={audio.volume}
      isLoading={audio.isLoading}
      error={audio.error}
      onPlay={() => audio.play(selectedRule.audioUrl ?? "")}
      onPause={audio.pause}
      onSeek={audio.seek}
      onVolumeChange={audio.setVolume}
    />
  );
}

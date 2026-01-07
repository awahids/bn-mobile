import { Play, Pause, X, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/client/src/components/ui/button";
import { Slider } from "@/client/src/components/ui/slider";
import { cn } from "@/client/src/lib/utils";

interface AudioPlayerProps {
  title: string;
  subtitle: string;
  audioUrl: string;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  // Audio state from useAudio hook
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  // Audio controls from useAudio hook
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function AudioPlayer({
  title,
  subtitle,
  audioUrl,
  isVisible,
  onClose,
  className,
  // Audio state from useAudio hook
  isPlaying,
  currentTime,
  duration,
  volume,
  isLoading,
  error,
  // Audio controls from useAudio hook
  onPlay,
  onPause,
  onSeek,
  onVolumeChange
}: AudioPlayerProps) {
  const togglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (value: number[]) => {
    if (duration) {
      const newTime = (value[0] / 100) * duration;
      onSeek(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0] / 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn(
      "fixed bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm",
      "bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-4 slide-up",
      "border border-border",
      className
    )}>
      {error && (
        <div className="mb-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-3 mb-3">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
          disabled={isLoading || !!error}
          className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 border-0 disabled:opacity-50"
          data-testid="audio-play-pause"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-card-foreground truncate">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
          data-testid="audio-close"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground min-w-0">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1">
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
              data-testid="audio-progress"
            />
          </div>
          <span className="text-xs text-muted-foreground min-w-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
            disabled={isLoading || !!error}
            data-testid="audio-volume"
          />
        </div>
      </div>
    </div>
  );
}

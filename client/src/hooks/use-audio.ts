import { useState, useRef, useCallback } from "react";

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export function useAudio(src?: string) {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const createAudio = useCallback((audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.addEventListener('loadstart', () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    });

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ 
        ...prev, 
        duration: audio.duration,
        isLoading: false 
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });

    audio.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener('error', () => {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load audio',
        isLoading: false 
      }));
    });

    return audio;
  }, []);

  const play = useCallback(async (audioSrc?: string) => {
    try {
      const currentSrc = audioSrc || src;
      if (!currentSrc) return;

      let audio = audioRef.current;
      
      if (!audio || audio.src !== currentSrc) {
        audio = createAudio(currentSrc);
      }

      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to play audio',
        isPlaying: false 
      }));
    }
  }, [src, createAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    setVolume,
    toggle: state.isPlaying ? pause : () => play(),
  };
}

import { useCallback, useEffect, useState } from "react";

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  currentSrc: string;
  title: string;
  subtitle: string;
}

const initialState: AudioState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isLoading: false,
  error: null,
  currentSrc: "",
  title: "",
  subtitle: "",
};

let audioState: AudioState = initialState;
let audioRef: HTMLAudioElement | null = null;
const listeners = new Set<(state: AudioState) => void>();

const updateState = (updates: Partial<AudioState>) => {
  audioState = { ...audioState, ...updates };
  listeners.forEach((listener) => listener(audioState));
};

const createAudio = (audioSrc: string) => {
  if (audioRef) {
    audioRef.pause();
  }

  const audio = new Audio(audioSrc);
  audio.volume = audioState.volume;
  audioRef = audio;

  updateState({
    currentSrc: audioSrc,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    error: null,
    isPlaying: false,
  });

  audio.addEventListener("loadstart", () => {
    updateState({ isLoading: true, error: null });
  });

  audio.addEventListener("loadedmetadata", () => {
    updateState({
      duration: audio.duration,
      isLoading: false,
    });
  });

  audio.addEventListener("timeupdate", () => {
    updateState({ currentTime: audio.currentTime });
  });

  audio.addEventListener("play", () => {
    updateState({ isPlaying: true });
  });

  audio.addEventListener("pause", () => {
    updateState({ isPlaying: false });
  });

  audio.addEventListener("ended", () => {
    updateState({ isPlaying: false });
  });

  audio.addEventListener("volumechange", () => {
    updateState({ volume: audio.volume });
  });

  audio.addEventListener("error", () => {
    updateState({
      error: "Failed to load audio",
      isLoading: false,
    });
  });

  return audio;
};

const getOrCreateAudio = (audioSrc?: string) => {
  if (audioRef && (!audioSrc || audioState.currentSrc === audioSrc)) {
    return audioRef;
  }

  if (!audioSrc) {
    return audioRef;
  }

  return createAudio(audioSrc);
};

export function useAudio(src?: string) {
  const [state, setState] = useState<AudioState>(audioState);

  useEffect(() => {
    const listener = (nextState: AudioState) => setState(nextState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const play = useCallback(
    async (audioSrc?: string) => {
      try {
        const resolvedSrc = audioSrc || src || audioState.currentSrc;
        const audio = getOrCreateAudio(resolvedSrc);
        if (!audio) return;

        await audio.play();
        updateState({ isPlaying: true, error: null });
      } catch (error) {
        updateState({
          error: "Failed to play audio",
          isPlaying: false,
          isLoading: false,
        });
      }
    },
    [src]
  );

  const pause = useCallback(() => {
    if (audioRef) {
      audioRef.pause();
      updateState({ isPlaying: false });
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      updateState({ isPlaying: false, currentTime: 0 });
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef) {
      audioRef.currentTime = time;
      updateState({ currentTime: time });
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const nextVolume = Math.max(0, Math.min(1, volume));
    if (audioRef) {
      audioRef.volume = nextVolume;
    }
    updateState({ volume: nextVolume });
  }, []);

  const setMeta = useCallback((meta: { title?: string; subtitle?: string }) => {
    updateState({
      title: meta.title ?? audioState.title,
      subtitle: meta.subtitle ?? audioState.subtitle,
    });
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setMeta,
    toggle: state.isPlaying ? pause : () => play(),
  };
}

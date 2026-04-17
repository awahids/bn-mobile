import { useCallback } from "react";
import { useStore } from "@tanstack/react-store";
import { audioStore, updateAudioState } from "@/store/audio-store";

let audioRef: HTMLAudioElement | null = null;

const createAudio = (audioSrc: string) => {
  if (audioRef) {
    audioRef.pause();
  }

  const state = audioStore.state;
  const audio = new Audio(audioSrc);
  audio.volume = state.volume;
  audioRef = audio;

  updateAudioState({
    currentSrc: audioSrc,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    error: null,
    isPlaying: false,
  });

  audio.addEventListener("loadstart", () => {
    updateAudioState({ isLoading: true, error: null });
  });

  audio.addEventListener("loadedmetadata", () => {
    updateAudioState({
      duration: audio.duration,
      isLoading: false,
    });
  });

  audio.addEventListener("timeupdate", () => {
    updateAudioState({ currentTime: audio.currentTime });
  });

  audio.addEventListener("play", () => {
    updateAudioState({ isPlaying: true });
  });

  audio.addEventListener("pause", () => {
    updateAudioState({ isPlaying: false });
  });

  audio.addEventListener("ended", () => {
    updateAudioState({ isPlaying: false });
  });

  audio.addEventListener("volumechange", () => {
    updateAudioState({ volume: audio.volume });
  });

  audio.addEventListener("error", () => {
    updateAudioState({
      error: "Failed to load audio",
      isLoading: false,
    });
  });

  return audio;
};

const getOrCreateAudio = (audioSrc?: string) => {
  const state = audioStore.state;
  if (audioRef && (!audioSrc || state.currentSrc === audioSrc)) {
    return audioRef;
  }

  if (!audioSrc) {
    return audioRef;
  }

  return createAudio(audioSrc);
};

export function useAudio(src?: string) {
  const state = useStore(audioStore, (state) => state);

  const play = useCallback(
    async (audioSrc?: string) => {
      try {
        const state = audioStore.state;
        const resolvedSrc = audioSrc || src || state.currentSrc;
        const audio = getOrCreateAudio(resolvedSrc);
        if (!audio) return;

        await audio.play();
        updateAudioState({ isPlaying: true, error: null });
      } catch (error) {
        updateAudioState({
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
      updateAudioState({ isPlaying: false });
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      updateAudioState({ isPlaying: false, currentTime: 0 });
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef) {
      audioRef.currentTime = time;
      updateAudioState({ currentTime: time });
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const nextVolume = Math.max(0, Math.min(1, volume));
    if (audioRef) {
      audioRef.volume = nextVolume;
    }
    updateAudioState({ volume: nextVolume });
  }, []);

  const setMeta = useCallback((meta: { title?: string; subtitle?: string }) => {
    const state = audioStore.state;
    updateAudioState({
      title: meta.title ?? state.title,
      subtitle: meta.subtitle ?? state.subtitle,
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
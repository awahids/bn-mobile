import { Store } from '@tanstack/react-store'

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

export const audioStore = new Store<AudioState>({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isLoading: false,
  error: null,
  currentSrc: "",
  title: "",
  subtitle: "",
})

export const updateAudioState = (updates: Partial<AudioState>) => {
  audioStore.setState((state) => ({
    ...state,
    ...updates,
  }))
}

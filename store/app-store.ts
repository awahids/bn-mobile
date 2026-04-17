import { Store } from '@tanstack/react-store'

interface AppState {
  searchQuery: string;
  selectedSurah: number | null;
  audioPlayerVisible: boolean;
}

export const appStore = new Store<AppState>({
  searchQuery: "",
  selectedSurah: null,
  audioPlayerVisible: false,
})

export const setAppSearchQuery = (query: string) => {
  appStore.setState((state) => ({
    ...state,
    searchQuery: query,
  }))
}

export const setSelectedSurah = (surahId: number | null) => {
  appStore.setState((state) => ({
    ...state,
    selectedSurah: surahId,
  }))
}

export const setAudioPlayerVisible = (visible: boolean) => {
  appStore.setState((state) => ({
    ...state,
    audioPlayerVisible: visible,
  }))
}

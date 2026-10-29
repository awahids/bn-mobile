import { Store } from '@tanstack/react-store'

export interface LearningPreferences {
  /** Play pronunciation and recitation audio at all. */
  audioEnabled: boolean;
  /** Play the letter/rule audio automatically when moving to the next item. */
  autoPlayAudio: boolean;
  /** Quiz runs with a time limit. */
  challengeMode: boolean;
}

export const DEFAULT_PREFERENCES: LearningPreferences = {
  audioEnabled: true,
  autoPlayAudio: false,
  challengeMode: true,
}

const PREFERENCES_STORAGE_KEY = "bn_learning_preferences_v1"

export function sanitizePreferences(value: unknown): Partial<LearningPreferences> {
  if (!value || typeof value !== "object") return {}
  const raw = value as Record<string, unknown>
  const result: Partial<LearningPreferences> = {}
  for (const key of Object.keys(DEFAULT_PREFERENCES) as (keyof LearningPreferences)[]) {
    if (typeof raw[key] === "boolean") {
      result[key] = raw[key] as boolean
    }
  }
  return result
}

function readStoredPreferences(): LearningPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    return { ...DEFAULT_PREFERENCES, ...sanitizePreferences(raw ? JSON.parse(raw) : null) }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export const preferencesStore = new Store<LearningPreferences>(DEFAULT_PREFERENCES)

let hydrated = false

/** Loads stored preferences once on the client (the store starts with defaults for SSR). */
export function hydratePreferences() {
  if (hydrated || typeof window === "undefined") return
  hydrated = true
  preferencesStore.setState(() => readStoredPreferences())
}

export function updatePreferences(updates: Partial<LearningPreferences>) {
  preferencesStore.setState((state) => ({ ...state, ...updates }))
  try {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferencesStore.state))
  } catch {
    // Ignore storage write errors.
  }
}

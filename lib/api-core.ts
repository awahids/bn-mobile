/**
 * API Client Functions
 *
 * Centralized API client for Golang backend endpoints with token refresh support.
 */

import {
  clearAccessToken,
  emitAuthStateChanged,
  getAccessToken,
  setAccessToken,
} from "./auth-storage"

const DEFAULT_API_BASE_URL = "/api/v1"

function isHostWithoutProtocol(value: string): boolean {
  return (
    /^localhost(?::\d+)?(?:\/.*)?$/i.test(value) ||
    /^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:\/.*)?$/.test(value) ||
    /^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d+)?(?:\/.*)?$/i.test(value)
  )
}

function normalizeApiBaseUrl(rawBaseUrl: string): string {
  const baseUrl = rawBaseUrl.trim().replace(/\/+$/, "")
  if (!baseUrl) {
    return DEFAULT_API_BASE_URL
  }

  const runtimeProtocol =
    typeof window !== "undefined" ? window.location.protocol : "http:"
  if (baseUrl.startsWith("//")) {
    return `${runtimeProtocol}${baseUrl}`
  }
  if (baseUrl.startsWith("/")) {
    return baseUrl
  }
  if (baseUrl.startsWith("https://")) {
    return baseUrl
  }
  if (baseUrl.startsWith("http://")) {
    // Respect explicit backend URL even when protocol differs from page protocol.
    return baseUrl
  }
  if (isHostWithoutProtocol(baseUrl)) {
    return `${runtimeProtocol}//${baseUrl}`
  }

  return DEFAULT_API_BASE_URL
}

const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    DEFAULT_API_BASE_URL
)

// ==================== TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string | Record<string, any>
  details?: any[]
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: any[]
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface RequestConfig {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
}

interface AuthTokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

let refreshPromise: Promise<string | null> | null = null

function buildUrl(endpoint: string): string {
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint
  }
  if (!endpoint.startsWith("/")) {
    return `${API_BASE_URL}/${endpoint}`
  }
  return `${API_BASE_URL}${endpoint}`
}

function normalizeApiErrorMessage(
  response: Response,
  payload?: ApiResponse<any>
): string {
  if (!payload) {
    return `HTTP ${response.status}: ${response.statusText}`
  }
  if (typeof payload.error === "string" && payload.error.trim() !== "") {
    return payload.error
  }
  if (payload.message && payload.message.trim() !== "") {
    return payload.message
  }
  return `HTTP ${response.status}: ${response.statusText}`
}

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>
  } catch {
    throw new ApiError(
      response.status,
      `Failed to parse response: ${response.statusText}`
    )
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })

      const payload = await parseJsonResponse<AuthTokenResponse>(response)
      const token = payload?.data?.accessToken

      if (!response.ok || !token) {
        clearAccessToken()
        emitAuthStateChanged("token-cleared")
        return null
      }

      setAccessToken(token)
      emitAuthStateChanged("refresh")
      return token
    } catch {
      clearAccessToken()
      emitAuthStateChanged("token-cleared")
      return null
    }
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

async function apiRequest<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, requireAuth = true } = config
  const url = buildUrl(endpoint)

  const makeOptions = (token?: string): RequestInit => {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    const authToken = token || getAccessToken()
    if (requireAuth && authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: "include",
    }

    if (body !== undefined && method !== "GET") {
      requestOptions.body = JSON.stringify(body)
    }

    return requestOptions
  }

  const executeRequest = async (token?: string) => {
    const response = await fetch(url, makeOptions(token))
    if (response.status === 204) {
      return { response, payload: { success: true } as ApiResponse<T> }
    }
    const payload = await parseJsonResponse<T>(response)
    return { response, payload }
  }

  try {
    let { response, payload } = await executeRequest()

    if (response.status === 401 && requireAuth) {
      const refreshedToken = await refreshAccessToken()
      if (refreshedToken) {
        ; ({ response, payload } = await executeRequest(refreshedToken))
      }
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        normalizeApiErrorMessage(response, payload),
        undefined,
        payload?.details
      )
    }

    return payload.success && payload.data !== undefined
      ? payload.data
      : (payload as T)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(0, "Network error: Unable to connect to server")
    }

    throw new ApiError(
      500,
      `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }
}

async function get<T = any>(endpoint: string, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET", requireAuth })
}

async function post<T = any>(
  endpoint: string,
  body?: any,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "POST", body, requireAuth })
}

async function patch<T = any>(
  endpoint: string,
  body?: any,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "PATCH", body, requireAuth })
}

async function del<T = any>(endpoint: string, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: "DELETE", requireAuth })
}

// ==================== AUTH API ====================

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role?: string
  lastLoginAt?: string
}

export interface AuthLoginResponse {
  user: AuthUser
  tokens: AuthTokenResponse
}

interface RefreshOptions {
  emitEvent?: boolean
}

export const authApi = {
  loginWithGoogle: async (idToken: string): Promise<AuthLoginResponse> => {
    const data = await post<AuthLoginResponse>(
      "/auth/google",
      { idToken },
      false
    )
    if (data?.tokens?.accessToken) {
      setAccessToken(data.tokens.accessToken)
      emitAuthStateChanged("login")
    }
    return data
  },
  loginWithGoogleOAuthCode: async (
    code: string,
    redirectUri: string
  ): Promise<AuthLoginResponse> => {
    const data = await post<AuthLoginResponse>(
      "/auth/google/oauth",
      { code, redirectUri },
      false
    )
    if (data?.tokens?.accessToken) {
      setAccessToken(data.tokens.accessToken)
      emitAuthStateChanged("login")
    }
    return data
  },
  refresh: async (options: RefreshOptions = {}): Promise<AuthTokenResponse> => {
    const data = await post<AuthTokenResponse>("/auth/refresh", undefined, false)
    if (data?.accessToken) {
      setAccessToken(data.accessToken)
      if (options.emitEvent !== false) {
        emitAuthStateChanged("refresh")
      }
    }
    return data
  },
  me: (): Promise<AuthUser> => get<AuthUser>("/auth/me"),
  logout: async (): Promise<void> => {
    try {
      await post<void>("/auth/logout", undefined, false)
    } finally {
      clearAccessToken()
      emitAuthStateChanged("logout")
    }
  },
}

// ==================== USER API ====================

export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  avatarUrl?: string | null
  username?: string | null
  streak: number
  dailyProgress: number
  lastActive: Date
  preferences: Record<string, any>
}

export interface UpdateUserData {
  name?: string
  username?: string
  streak?: number
  dailyProgress?: number
  preferences?: Record<string, any>
}

export const userApi = {
  getProfile: (): Promise<User> => get<User>("/user"),
  updateProfile: (data: UpdateUserData): Promise<User> => patch<User>("/user", data),
}

// ==================== PROGRESS API ====================

export interface UserProgress {
  id: string
  userId: string
  module: "hijaiyah" | "quran" | "dhikr" | "quiz"
  itemId: string
  progress: number
  completed: boolean
  score: number
  timeSpent: number
  lastAccessed: Date
}

export interface CreateProgressData {
  module: "hijaiyah" | "quran" | "dhikr" | "quiz"
  itemId: string
  progress: number
  completed?: boolean
  score?: number
  timeSpent?: number
}

export const progressApi = {
  getProgress: (module?: string): Promise<UserProgress[]> => {
    const endpoint = module ? `/progress?module=${module}` : "/progress"
    return get<UserProgress[]>(endpoint)
  },
  getProgressItem: (module: string, itemId: string): Promise<UserProgress | null> =>
    get<UserProgress | null>(`/progress/${module}/${itemId}`),
  updateProgress: (data: CreateProgressData): Promise<UserProgress> =>
    post<UserProgress>("/progress", data),
}

// ==================== BOOKMARKS API ====================

export interface Bookmark {
  id: string
  userId: string
  type: "quran" | "dhikr"
  contentId: string
  note?: string | null
  createdAt: Date
}

export interface CreateBookmarkData {
  type: "quran" | "dhikr"
  contentId: string
  note?: string
}

export const bookmarksApi = {
  getBookmarks: (type?: string): Promise<Bookmark[]> => {
    const endpoint = type ? `/bookmarks?type=${type}` : "/bookmarks"
    return get<Bookmark[]>(endpoint)
  },
  createBookmark: (data: CreateBookmarkData): Promise<Bookmark> =>
    post<Bookmark>("/bookmarks", data),
  deleteBookmark: (id: string): Promise<void> => del<void>(`/bookmarks/${id}`),
}

// ==================== DHIKR API ====================

export interface DhikrCounter {
  id: string
  userId: string
  dhikrId: string
  count: number
  target: number
  date: string
  session: "morning" | "evening"
  completed: boolean
}

export interface CreateDhikrCounterData {
  dhikrId: string
  count: number
  target?: number
  date: string
  session: "morning" | "evening"
  completed?: boolean
}

export const dhikrApi = {
  getCounters: (date?: string): Promise<DhikrCounter[]> => {
    const endpoint = date ? `/dhikr/counters?date=${date}` : "/dhikr/counters"
    return get<DhikrCounter[]>(endpoint)
  },
  updateCounter: (data: CreateDhikrCounterData): Promise<DhikrCounter> =>
    post<DhikrCounter>("/dhikr/counters", data),
}

// ==================== QUIZ API ====================

export interface QuizAttempt {
  id: string
  userId: string
  category: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: any[]
  completedAt: Date
}

export interface CreateQuizAttemptData {
  category: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  questionId: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent?: number
}

export interface QuizStats {
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number
  categoriesAttempted: number
}

export const quizApi = {
  getAttempts: (category?: string): Promise<QuizAttempt[]> => {
    const endpoint = category ? `/quiz/attempts?category=${category}` : "/quiz/attempts"
    return get<QuizAttempt[]>(endpoint)
  },
  createAttempt: (data: CreateQuizAttemptData): Promise<QuizAttempt> =>
    post<QuizAttempt>("/quiz/attempts", data),
  getStats: async (): Promise<QuizStats> => {
    const raw = await get<any>("/quiz/stats")
    if (raw?.overall) {
      return {
        totalAttempts: raw.overall.totalAttempts ?? 0,
        averageScore: raw.overall.averageScore ?? 0,
        bestScore: raw.overall.bestScore ?? 0,
        totalTimeSpent: raw.overall.totalTimeSpent ?? 0,
        categoriesAttempted: raw.overall.categoriesAttempted ?? 0,
      }
    }
    return {
      totalAttempts: raw?.totalAttempts ?? 0,
      averageScore: raw?.averageScore ?? 0,
      bestScore: raw?.bestScore ?? 0,
      totalTimeSpent: raw?.totalTimeSpent ?? 0,
      categoriesAttempted: raw?.categoriesAttempted ?? 0,
    }
  },
}

// ==================== UTILITY API ====================

export interface PrayerTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  date: string
  location: {
    city?: string
    country?: string
    latitude?: number
    longitude?: number
    district?: string
    label?: string
  }
}

export const utilityApi = {
  getPrayerTimes: (coords?: { lat: number; lng: number }): Promise<PrayerTimes> => {
    const lat = coords?.lat ?? -6.2
    const lng = coords?.lng ?? 106.8167
    return get<PrayerTimes>(`/prayer-times?lat=${lat}&lng=${lng}`, false)
  },
  getAudioProxy: (url: string): Promise<Blob> => {
    return fetch(buildUrl(`/audio-proxy?url=${encodeURIComponent(url)}`), {
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        throw new ApiError(response.status, "Failed to fetch audio")
      }
      return response.blob()
    })
  },
}

// ==================== COMBINED API OBJECT ====================

export const api = {
  auth: authApi,
  user: userApi,
  progress: progressApi,
  bookmarks: bookmarksApi,
  dhikr: dhikrApi,
  quiz: quizApi,
  utility: utilityApi,
  request: apiRequest,
  get,
  post,
  patch,
  delete: del,
}

// ==================== ERROR HANDLING UTILITIES ====================

export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred"
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (
        isApiError(error) &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 429
      ) {
        throw error
      }

      if (attempt === maxRetries) {
        break
      }

      await new Promise((resolve) => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError
}

export default api

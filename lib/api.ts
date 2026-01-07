/**
 * API Client Functions
 * 
 * Centralized API client for all server endpoints with proper error handling,
 * type safety, and consistent response patterns. This replaces the scattered
 * fetch calls throughout the application with a unified interface.
 */

import { getSession } from 'next-auth/react'

// ==================== TYPES ====================

// API Response wrapper type
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any[]
}

// Error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: any[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Request configuration
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
}

// ==================== CORE API FUNCTIONS ====================

/**
 * Core API request function with error handling and authentication
 */
async function apiRequest<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = true
  } = config

  try {
    // Check authentication if required
    if (requireAuth) {
      const session = await getSession()
      if (!session) {
        throw new ApiError(401, 'Authentication required')
      }
    }

    // Prepare request headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include'
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body)
    }

    // Make the request
    const response = await fetch(endpoint, requestOptions)

    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      return { success: true } as T
    }

    // Parse JSON response
    let responseData: ApiResponse<T>
    try {
      responseData = await response.json()
    } catch (parseError) {
      throw new ApiError(
        response.status,
        `Failed to parse response: ${response.statusText}`
      )
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData.error || `HTTP ${response.status}: ${response.statusText}`,
        undefined,
        responseData.details
      )
    }

    // Return the data directly for successful responses
    return responseData.success && responseData.data !== undefined ? responseData.data : responseData as T

  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Network error: Unable to connect to server')
    }

    // Handle other errors
    throw new ApiError(500, `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Helper function for GET requests
 */
async function get<T = any>(endpoint: string, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', requireAuth })
}

/**
 * Helper function for POST requests
 */
async function post<T = any>(endpoint: string, body?: any, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, requireAuth })
}

/**
 * Helper function for PATCH requests
 */
async function patch<T = any>(endpoint: string, body?: any, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body, requireAuth })
}

/**
 * Helper function for DELETE requests
 */
async function del<T = any>(endpoint: string, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', requireAuth })
}

// ==================== USER API ====================

export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
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
  /**
   * Get current user profile
   */
  getProfile: (): Promise<User> => get<User>('/api/user'),

  /**
   * Update current user profile
   */
  updateProfile: (data: UpdateUserData): Promise<User> =>
    patch<User>('/api/user', data)
}

// ==================== PROGRESS API ====================

export interface UserProgress {
  id: string
  userId: string
  module: 'hijaiyah' | 'quran' | 'dhikr' | 'quiz'
  itemId: string
  progress: number
  completed: boolean
  score: number
  timeSpent: number
  lastAccessed: Date
}

export interface CreateProgressData {
  module: 'hijaiyah' | 'quran' | 'dhikr' | 'quiz'
  itemId: string
  progress: number
  completed?: boolean
  score?: number
  timeSpent?: number
}

export const progressApi = {
  /**
   * Get user progress, optionally filtered by module
   */
  getProgress: (module?: string): Promise<UserProgress[]> => {
    const endpoint = module ? `/api/progress?module=${module}` : '/api/progress'
    return get<UserProgress[]>(endpoint)
  },

  /**
   * Get specific progress item
   */
  getProgressItem: (module: string, itemId: string): Promise<UserProgress | null> =>
    get<UserProgress | null>(`/api/progress/${module}/${itemId}`),

  /**
   * Create or update progress
   */
  updateProgress: (data: CreateProgressData): Promise<UserProgress> =>
    post<UserProgress>('/api/progress', data)
}

// ==================== BOOKMARKS API ====================

export interface Bookmark {
  id: string
  userId: string
  type: 'quran' | 'dhikr'
  contentId: string
  note?: string | null
  createdAt: Date
}

export interface CreateBookmarkData {
  type: 'quran' | 'dhikr'
  contentId: string
  note?: string
}

export const bookmarksApi = {
  /**
   * Get user bookmarks, optionally filtered by type
   */
  getBookmarks: (type?: string): Promise<Bookmark[]> => {
    const endpoint = type ? `/api/bookmarks?type=${type}` : '/api/bookmarks'
    return get<Bookmark[]>(endpoint)
  },

  /**
   * Create a new bookmark
   */
  createBookmark: (data: CreateBookmarkData): Promise<Bookmark> =>
    post<Bookmark>('/api/bookmarks', data),

  /**
   * Delete a bookmark
   */
  deleteBookmark: (id: string): Promise<void> =>
    del<void>(`/api/bookmarks/${id}`)
}

// ==================== DHIKR API ====================

export interface DhikrCounter {
  id: string
  userId: string
  dhikrId: string
  count: number
  target: number
  date: string
  session: 'morning' | 'evening'
  completed: boolean
}

export interface CreateDhikrCounterData {
  dhikrId: string
  count: number
  target?: number
  date: string
  session: 'morning' | 'evening'
  completed?: boolean
}

export const dhikrApi = {
  /**
   * Get dhikr counters, optionally filtered by date
   */
  getCounters: (date?: string): Promise<DhikrCounter[]> => {
    const endpoint = date ? `/api/dhikr/counters?date=${date}` : '/api/dhikr/counters'
    return get<DhikrCounter[]>(endpoint)
  },

  /**
   * Create or update dhikr counter
   */
  updateCounter: (data: CreateDhikrCounterData): Promise<DhikrCounter> =>
    post<DhikrCounter>('/api/dhikr/counters', data)
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
  answers: any[]
}

export interface QuizStats {
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number
  categoriesAttempted: number
}

export const quizApi = {
  /**
   * Get quiz attempts, optionally filtered by category
   */
  getAttempts: (category?: string): Promise<QuizAttempt[]> => {
    const endpoint = category ? `/api/quiz/attempts?category=${category}` : '/api/quiz/attempts'
    return get<QuizAttempt[]>(endpoint)
  },

  /**
   * Create a new quiz attempt
   */
  createAttempt: (data: CreateQuizAttemptData): Promise<QuizAttempt> =>
    post<QuizAttempt>('/api/quiz/attempts', data),

  /**
   * Get quiz statistics
   */
  getStats: (): Promise<QuizStats> =>
    get<QuizStats>('/api/quiz/stats')
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
  }
}

export const utilityApi = {
  /**
   * Get prayer times for current location
   */
  getPrayerTimes: (coords?: { lat: number; lng: number }): Promise<PrayerTimes> => {
    const lat = coords?.lat ?? -6.2;
    const lng = coords?.lng ?? 106.8167;
    return get<PrayerTimes>(`/api/prayer-times?lat=${lat}&lng=${lng}`, false); // No auth required
  },

  /**
   * Proxy audio requests to handle CORS
   */
  getAudioProxy: (url: string): Promise<Blob> => {
    return fetch(`/api/audio-proxy?url=${encodeURIComponent(url)}`)
      .then(response => {
        if (!response.ok) {
          throw new ApiError(response.status, 'Failed to fetch audio')
        }
        return response.blob()
      })
  }
}

// ==================== COMBINED API OBJECT ====================

/**
 * Main API object with all endpoints organized by domain
 */
export const api = {
  user: userApi,
  progress: progressApi,
  bookmarks: bookmarksApi,
  dhikr: dhikrApi,
  quiz: quizApi,
  utility: utilityApi,

  // Direct access to core functions for custom requests
  request: apiRequest,
  get,
  post,
  patch,
  delete: del
}

// ==================== ERROR HANDLING UTILITIES ====================

/**
 * Check if an error is an API error
 */
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError
}

/**
 * Get user-friendly error message from any error
 */
export function getErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Handle API errors with optional retry logic
 */
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

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (isApiError(error) && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError
}

// Export default
export default api

/**
 * Storage Layer for Prisma Operations
 * 
 * This module provides a clean interface for all database operations
 * using Prisma ORM with MongoDB. It replaces the previous Drizzle-based
 * storage operations while maintaining the same API interface.
 */

import { prisma } from './prisma'
import type {
  User,
  UserProgress,
  Bookmark,
  DhikrCounter,
  QuizAttempt,
  Prisma
} from '@prisma/client'

// Type definitions for insert operations (without auto-generated fields)
export type InsertUser = Omit<User, 'id' | 'lastActive'> & {
  preferences?: Prisma.InputJsonValue
}
export type InsertUserProgress = Omit<UserProgress, 'id' | 'lastAccessed'>
export type InsertBookmark = Omit<Bookmark, 'id' | 'createdAt'>
export type InsertDhikrCounter = Omit<DhikrCounter, 'id'>
export type InsertQuizAttempt = Omit<QuizAttempt, 'id' | 'completedAt'> & {
  answers: Prisma.InputJsonValue
}

// User with relations type
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    progress: true
    bookmarks: true
    dhikrCounters: true
    quizAttempts: true
  }
}>

export class Storage {
  // ==================== USER OPERATIONS ====================

  /**
   * Get user by ID with optional relations
   */
  async getUser(id: string, includeRelations = false): Promise<User | UserWithRelations | null> {
    if (includeRelations) {
      return prisma.user.findUnique({
        where: { id },
        include: {
          progress: true,
          bookmarks: true,
          dhikrCounters: true,
          quizAttempts: true
        }
      })
    }

    return prisma.user.findUnique({
      where: { id }
    })
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username }
    })
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  /**
   * Create a new user
   */
  async createUser(data: InsertUser): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        preferences: data.preferences || {},
        lastActive: new Date()
      }
    })
  }

  /**
   * Update user data
   */
  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        preferences: data.preferences !== undefined ? data.preferences : undefined,
        lastActive: new Date()
      }
    })
  }

  /**
   * Delete user and all related data
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  // ==================== USER PROGRESS OPERATIONS ====================

  /**
   * Get user progress, optionally filtered by module
   */
  async getUserProgress(userId: string, module?: string): Promise<UserProgress[]> {
    return prisma.userProgress.findMany({
      where: {
        userId,
        ...(module && { module })
      },
      orderBy: {
        lastAccessed: 'desc'
      }
    })
  }

  /**
   * Get specific progress item
   */
  async getProgressByItem(userId: string, module: string, itemId: string): Promise<UserProgress | null> {
    return prisma.userProgress.findFirst({
      where: {
        userId,
        module,
        itemId
      }
    })
  }

  /**
   * Create or update progress
   */
  async upsertProgress(data: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getProgressByItem(data.userId, data.module, data.itemId)

    if (existing) {
      return prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          ...data,
          lastAccessed: new Date()
        }
      })
    } else {
      return prisma.userProgress.create({
        data: {
          ...data,
          lastAccessed: new Date()
        }
      })
    }
  }

  /**
   * Create new progress record
   */
  async createProgress(data: InsertUserProgress): Promise<UserProgress> {
    return prisma.userProgress.create({
      data: {
        ...data,
        lastAccessed: new Date()
      }
    })
  }

  /**
   * Update existing progress record
   */
  async updateProgress(id: string, data: Partial<InsertUserProgress>): Promise<UserProgress> {
    return prisma.userProgress.update({
      where: { id },
      data: {
        ...data,
        lastAccessed: new Date()
      }
    })
  }

  /**
   * Delete progress record
   */
  async deleteProgress(id: string): Promise<boolean> {
    try {
      await prisma.userProgress.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  // ==================== BOOKMARK OPERATIONS ====================

  /**
   * Get user bookmarks, optionally filtered by type
   */
  async getUserBookmarks(userId: string, type?: string): Promise<Bookmark[]> {
    return prisma.bookmark.findMany({
      where: {
        userId,
        ...(type && { type })
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Create a new bookmark
   */
  async createBookmark(data: InsertBookmark): Promise<Bookmark> {
    return prisma.bookmark.create({
      data: {
        ...data,
        createdAt: new Date()
      }
    })
  }

  /**
   * Update bookmark
   */
  async updateBookmark(id: string, data: Partial<InsertBookmark>): Promise<Bookmark> {
    return prisma.bookmark.update({
      where: { id },
      data
    })
  }

  /**
   * Delete bookmark
   */
  async deleteBookmark(id: string): Promise<boolean> {
    try {
      await prisma.bookmark.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if bookmark exists
   */
  async bookmarkExists(userId: string, type: string, contentId: string): Promise<boolean> {
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId, type, contentId }
    })
    return !!bookmark
  }

  // ==================== DHIKR COUNTER OPERATIONS ====================

  /**
   * Get dhikr counters for a specific date
   */
  async getDhikrCountersForDate(userId: string, date: string): Promise<DhikrCounter[]> {
    return prisma.dhikrCounter.findMany({
      where: { userId, date },
      orderBy: {
        dhikrId: 'asc'
      }
    })
  }

  /**
   * Get specific dhikr counter
   */
  async getDhikrCounter(
    userId: string,
    dhikrId: string,
    date: string,
    session: string
  ): Promise<DhikrCounter | null> {
    return prisma.dhikrCounter.findFirst({
      where: { userId, dhikrId, date, session }
    })
  }

  /**
   * Create or update dhikr counter
   */
  async upsertDhikrCounter(data: InsertDhikrCounter): Promise<DhikrCounter> {
    const existing = await this.getDhikrCounter(
      data.userId,
      data.dhikrId,
      data.date,
      data.session
    )

    if (existing) {
      return prisma.dhikrCounter.update({
        where: { id: existing.id },
        data
      })
    } else {
      return prisma.dhikrCounter.create({
        data
      })
    }
  }

  /**
   * Create new dhikr counter
   */
  async createDhikrCounter(data: InsertDhikrCounter): Promise<DhikrCounter> {
    return prisma.dhikrCounter.create({
      data
    })
  }

  /**
   * Update dhikr counter
   */
  async updateDhikrCounter(id: string, data: Partial<InsertDhikrCounter>): Promise<DhikrCounter> {
    return prisma.dhikrCounter.update({
      where: { id },
      data
    })
  }

  /**
   * Delete dhikr counter
   */
  async deleteDhikrCounter(id: string): Promise<boolean> {
    try {
      await prisma.dhikrCounter.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  // ==================== QUIZ ATTEMPT OPERATIONS ====================

  /**
   * Get user quiz attempts, optionally filtered by category
   */
  async getUserQuizAttempts(userId: string, category?: string): Promise<QuizAttempt[]> {
    return prisma.quizAttempt.findMany({
      where: {
        userId,
        ...(category && { category })
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
  }

  /**
   * Create new quiz attempt
   */
  async createQuizAttempt(data: InsertQuizAttempt): Promise<QuizAttempt> {
    return prisma.quizAttempt.create({
      data: {
        ...data,
        completedAt: new Date()
      }
    })
  }

  /**
   * Get quiz statistics for a user
   */
  async getQuizStats(userId: string): Promise<{
    totalAttempts: number
    averageScore: number
    bestScore: number
    totalTimeSpent: number
    categoriesAttempted: number
  }> {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId }
    })

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        categoriesAttempted: 0
      }
    }

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const bestScore = Math.max(...attempts.map(attempt => attempt.score))
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0)
    const categories = new Set(attempts.map(attempt => attempt.category))

    return {
      totalAttempts: attempts.length,
      averageScore: totalScore / attempts.length,
      bestScore,
      totalTimeSpent,
      categoriesAttempted: categories.size
    }
  }

  /**
   * Get quiz stats by category
   */
  async getQuizStatsByCategory(userId: string, category: string): Promise<{
    attempts: number
    averageScore: number
    bestScore: number
    totalTimeSpent: number
    lastAttempt: Date | null
  }> {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, category },
      orderBy: { completedAt: 'desc' }
    })

    if (attempts.length === 0) {
      return {
        attempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        lastAttempt: null
      }
    }

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const bestScore = Math.max(...attempts.map(attempt => attempt.score))
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0)

    return {
      attempts: attempts.length,
      averageScore: totalScore / attempts.length,
      bestScore,
      totalTimeSpent,
      lastAttempt: attempts[0].completedAt
    }
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Get database health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await prisma.user.findFirst()
      return true
    } catch {
      return false
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    users: number
    progress: number
    bookmarks: number
    dhikrCounters: number
    quizAttempts: number
  }> {
    const [users, progress, bookmarks, dhikrCounters, quizAttempts] = await Promise.all([
      prisma.user.count(),
      prisma.userProgress.count(),
      prisma.bookmark.count(),
      prisma.dhikrCounter.count(),
      prisma.quizAttempt.count()
    ])

    return {
      users,
      progress,
      bookmarks,
      dhikrCounters,
      quizAttempts
    }
  }

  /**
   * Clean up old data (optional maintenance operation)
   */
  async cleanupOldData(daysOld = 365): Promise<{
    deletedProgress: number
    deletedCounters: number
  }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const [deletedProgress, deletedCounters] = await Promise.all([
      prisma.userProgress.deleteMany({
        where: {
          lastAccessed: {
            lt: cutoffDate
          },
          completed: false,
          progress: 0
        }
      }),
      prisma.dhikrCounter.deleteMany({
        where: {
          date: {
            lt: cutoffDate.toISOString().split('T')[0]
          },
          count: 0
        }
      })
    ])

    return {
      deletedProgress: deletedProgress.count,
      deletedCounters: deletedCounters.count
    }
  }
}

// Export singleton instance
export const storage = new Storage()
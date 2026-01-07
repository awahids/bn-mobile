#!/usr/bin/env bun
/**
 * Data Migration Script: PostgreSQL (Drizzle) to MongoDB (Prisma)
 * 
 * This script migrates data from the existing PostgreSQL database using Drizzle ORM
 * to the new MongoDB database using Prisma ORM.
 */

import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'
import { users, userProgress, bookmarks, dhikrCounters, quizAttempts } from '../shared/schema'

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws

// Initialize clients
const prisma = new PrismaClient()

// PostgreSQL connection (from existing setup)
const oldDatabaseUrl = process.env.OLD_DATABASE_URL || process.env.DATABASE_URL_POSTGRES
if (!oldDatabaseUrl) {
  throw new Error('OLD_DATABASE_URL or DATABASE_URL_POSTGRES must be set for migration')
}

const pool = new Pool({ connectionString: oldDatabaseUrl })
const db = drizzle({ client: pool, schema: { users, userProgress, bookmarks, dhikrCounters, quizAttempts } })

interface MigrationStats {
  users: number
  userProgress: number
  bookmarks: number
  dhikrCounters: number
  quizAttempts: number
  errors: string[]
}

export async function migrateData(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    users: 0,
    userProgress: 0,
    bookmarks: 0,
    dhikrCounters: 0,
    quizAttempts: 0,
    errors: []
  }

  console.log('🚀 Starting data migration from PostgreSQL to MongoDB...')
  console.log('📊 Checking source database connection...')

  try {
    // Test PostgreSQL connection
    const testQuery = await db.select().from(users).limit(1)
    console.log('✅ PostgreSQL connection successful')
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error)
    stats.errors.push(`PostgreSQL connection failed: ${error}`)
    return stats
  }

  try {
    // Test MongoDB connection
    await prisma.$connect()
    console.log('✅ MongoDB connection successful')
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    stats.errors.push(`MongoDB connection failed: ${error}`)
    return stats
  }

  // Create user ID mapping for foreign key relationships
  const userIdMapping = new Map<string, string>()

  try {
    // 1. Migrate Users
    console.log('\n👥 Migrating users...')
    const oldUsers = await db.select().from(users)

    for (const user of oldUsers) {
      try {
        const newUser = await prisma.user.create({
          data: {
            username: user.username,
            email: user.email,
            streak: user.streak || 0,
            dailyProgress: user.dailyProgress || 0,
            lastActive: user.lastActive || new Date(),
            preferences: (user.preferences as Prisma.InputJsonValue) || {}
          }
        })

        // Map old ID to new MongoDB ObjectId
        userIdMapping.set(user.id, newUser.id)
        stats.users++

        if (stats.users % 10 === 0) {
          console.log(`   Migrated ${stats.users} users...`)
        }
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.username}:`, error)
        stats.errors.push(`User migration failed for ${user.username}: ${error}`)
      }
    }

    console.log(`✅ Migrated ${stats.users} users successfully`)

    // 2. Migrate User Progress
    console.log('\n📈 Migrating user progress...')
    const oldProgress = await db.select().from(userProgress)

    for (const progress of oldProgress) {
      try {
        const newUserId = userIdMapping.get(progress.userId)
        if (!newUserId) {
          console.warn(`⚠️  Skipping progress for unknown user ID: ${progress.userId}`)
          continue
        }

        await prisma.userProgress.create({
          data: {
            userId: newUserId,
            module: progress.module,
            itemId: progress.itemId,
            progress: progress.progress || 0,
            completed: progress.completed || false,
            score: progress.score || 0,
            timeSpent: progress.timeSpent || 0,
            lastAccessed: progress.lastAccessed || new Date()
          }
        })

        stats.userProgress++

        if (stats.userProgress % 50 === 0) {
          console.log(`   Migrated ${stats.userProgress} progress records...`)
        }
      } catch (error) {
        console.error(`❌ Failed to migrate progress record:`, error)
        stats.errors.push(`Progress migration failed: ${error}`)
      }
    }

    console.log(`✅ Migrated ${stats.userProgress} progress records successfully`)

    // 3. Migrate Bookmarks
    console.log('\n🔖 Migrating bookmarks...')
    const oldBookmarks = await db.select().from(bookmarks)

    for (const bookmark of oldBookmarks) {
      try {
        const newUserId = userIdMapping.get(bookmark.userId)
        if (!newUserId) {
          console.warn(`⚠️  Skipping bookmark for unknown user ID: ${bookmark.userId}`)
          continue
        }

        await prisma.bookmark.create({
          data: {
            userId: newUserId,
            type: bookmark.type,
            contentId: bookmark.contentId,
            note: bookmark.note,
            createdAt: bookmark.createdAt || new Date()
          }
        })

        stats.bookmarks++
      } catch (error) {
        console.error(`❌ Failed to migrate bookmark:`, error)
        stats.errors.push(`Bookmark migration failed: ${error}`)
      }
    }

    console.log(`✅ Migrated ${stats.bookmarks} bookmarks successfully`)

    // 4. Migrate Dhikr Counters
    console.log('\n📿 Migrating dhikr counters...')
    const oldCounters = await db.select().from(dhikrCounters)

    for (const counter of oldCounters) {
      try {
        const newUserId = userIdMapping.get(counter.userId)
        if (!newUserId) {
          console.warn(`⚠️  Skipping dhikr counter for unknown user ID: ${counter.userId}`)
          continue
        }

        await prisma.dhikrCounter.create({
          data: {
            userId: newUserId,
            dhikrId: counter.dhikrId,
            count: counter.count || 0,
            target: counter.target || 33,
            date: counter.date,
            session: counter.session,
            completed: counter.completed || false
          }
        })

        stats.dhikrCounters++
      } catch (error) {
        console.error(`❌ Failed to migrate dhikr counter:`, error)
        stats.errors.push(`Dhikr counter migration failed: ${error}`)
      }
    }

    console.log(`✅ Migrated ${stats.dhikrCounters} dhikr counters successfully`)

    // 5. Migrate Quiz Attempts
    console.log('\n🧠 Migrating quiz attempts...')
    const oldAttempts = await db.select().from(quizAttempts)

    for (const attempt of oldAttempts) {
      try {
        const newUserId = userIdMapping.get(attempt.userId)
        if (!newUserId) {
          console.warn(`⚠️  Skipping quiz attempt for unknown user ID: ${attempt.userId}`)
          continue
        }

        await prisma.quizAttempt.create({
          data: {
            userId: newUserId,
            category: attempt.category,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            timeSpent: attempt.timeSpent,
            answers: attempt.answers as Prisma.InputJsonValue,
            completedAt: attempt.completedAt || new Date()
          }
        })

        stats.quizAttempts++
      } catch (error) {
        console.error(`❌ Failed to migrate quiz attempt:`, error)
        stats.errors.push(`Quiz attempt migration failed: ${error}`)
      }
    }

    console.log(`✅ Migrated ${stats.quizAttempts} quiz attempts successfully`)

  } catch (error) {
    console.error('❌ Migration failed with error:', error)
    stats.errors.push(`General migration error: ${error}`)
  } finally {
    // Cleanup connections
    await prisma.$disconnect()
  }

  return stats
}

export async function validateMigration(): Promise<boolean> {
  console.log('\n🔍 Validating migration...')

  try {
    await prisma.$connect()

    // Check if data exists in MongoDB
    const userCount = await prisma.user.count()
    const progressCount = await prisma.userProgress.count()
    const bookmarkCount = await prisma.bookmark.count()
    const dhikrCount = await prisma.dhikrCounter.count()
    const quizCount = await prisma.quizAttempt.count()

    console.log('📊 MongoDB Data Summary:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Progress Records: ${progressCount}`)
    console.log(`   Bookmarks: ${bookmarkCount}`)
    console.log(`   Dhikr Counters: ${dhikrCount}`)
    console.log(`   Quiz Attempts: ${quizCount}`)

    // Basic validation - check if we have users and some data
    const isValid = userCount > 0

    if (isValid) {
      console.log('✅ Migration validation passed')

      // Test a few relationships
      const userWithData = await prisma.user.findFirst({
        include: {
          progress: true,
          bookmarks: true,
          dhikrCounters: true,
          quizAttempts: true
        }
      })

      if (userWithData) {
        console.log(`✅ Relationships working - User ${userWithData.username} has:`)
        console.log(`   Progress: ${userWithData.progress.length}`)
        console.log(`   Bookmarks: ${userWithData.bookmarks.length}`)
        console.log(`   Dhikr Counters: ${userWithData.dhikrCounters.length}`)
        console.log(`   Quiz Attempts: ${userWithData.quizAttempts.length}`)
      }
    } else {
      console.log('❌ Migration validation failed - no users found')
    }

    return isValid

  } catch (error) {
    console.error('❌ Validation failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// CLI execution
if (import.meta.main) {
  console.log('🔄 Starting migration process...')

  const stats = await migrateData()

  console.log('\n📋 Migration Summary:')
  console.log(`✅ Users: ${stats.users}`)
  console.log(`✅ Progress Records: ${stats.userProgress}`)
  console.log(`✅ Bookmarks: ${stats.bookmarks}`)
  console.log(`✅ Dhikr Counters: ${stats.dhikrCounters}`)
  console.log(`✅ Quiz Attempts: ${stats.quizAttempts}`)

  if (stats.errors.length > 0) {
    console.log(`\n❌ Errors (${stats.errors.length}):`)
    stats.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`)
    })
  }

  // Validate migration
  const isValid = await validateMigration()

  if (isValid && stats.errors.length === 0) {
    console.log('\n🎉 Migration completed successfully!')
    process.exit(0)
  } else {
    console.log('\n⚠️  Migration completed with issues. Please review the errors above.')
    process.exit(1)
  }
}
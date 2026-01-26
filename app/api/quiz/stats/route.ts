/**
 * Quiz Statistics API Route
 * 
 * Provides comprehensive quiz statistics for users including overall stats
 * and category-specific performance metrics.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { storage } from '@/lib/storage'

/**
 * GET /api/quiz/stats
 * Fetch comprehensive quiz statistics for the current user
 * Query params: category (optional) - if provided, returns stats for specific category
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (category) {
      // Get stats for specific category
      const categoryStats = await storage.getQuizStatsByCategory(
        session.user.id,
        category
      )

      return NextResponse.json({
        success: true,
        data: {
          category,
          ...categoryStats
        }
      })
    } else {
      // Get overall stats
      const overallStats = await storage.getQuizStats(session.user.id)

      // Get all attempts to calculate additional metrics
      const allAttempts = await storage.getUserQuizAttempts(session.user.id)

      // Calculate category breakdown
      const categoryBreakdown = allAttempts.reduce((acc, attempt) => {
        if (!acc[attempt.category]) {
          acc[attempt.category] = {
            attempts: 0,
            totalScore: 0,
            bestScore: 0,
            totalTime: 0
          }
        }

        acc[attempt.category].attempts++
        acc[attempt.category].totalScore += attempt.score
        acc[attempt.category].bestScore = Math.max(acc[attempt.category].bestScore, attempt.score)
        acc[attempt.category].totalTime += attempt.timeSpent

        return acc
      }, {} as Record<string, any>)

      // Calculate averages for each category
      Object.keys(categoryBreakdown).forEach(cat => {
        const stats = categoryBreakdown[cat]
        stats.averageScore = stats.totalScore / stats.attempts
        stats.averageTime = stats.totalTime / stats.attempts
      })

      // Calculate recent performance (last 10 attempts)
      const recentAttempts = allAttempts
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 10)

      const recentPerformance = recentAttempts.length > 0 ? {
        averageScore: recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length,
        trend: calculateTrend(recentAttempts.map(a => a.score))
      } : null

      return NextResponse.json({
        success: true,
        data: {
          overall: overallStats,
          categoryBreakdown,
          recentPerformance,
          lastAttempt: allAttempts.length > 0 ? allAttempts[0].completedAt : null
        }
      })
    }

  } catch (error) {
    console.error('GET /api/quiz/stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Calculate performance trend from recent scores
 */
function calculateTrend(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 3) return 'stable'

  const firstHalf = scores.slice(0, Math.floor(scores.length / 2))
  const secondHalf = scores.slice(Math.floor(scores.length / 2))

  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length

  const difference = secondAvg - firstAvg

  if (difference > 5) return 'improving'
  if (difference < -5) return 'declining'
  return 'stable'
}

/**
 * OPTIONS /api/quiz/stats
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
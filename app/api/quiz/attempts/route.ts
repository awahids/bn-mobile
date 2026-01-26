/**
 * Quiz Attempts API Route
 * 
 * Handles quiz attempt operations including fetching user attempts and creating new ones.
 * Supports filtering by category and tracks detailed attempt data.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { storage } from '@/lib/storage'
import { z } from 'zod'

// Validation schema for quiz attempt creation
const quizAttemptSchema = z.object({
  category: z.string().min(1),
  score: z.number().int().min(0).max(100),
  totalQuestions: z.number().int().min(1),
  timeSpent: z.number().int().min(0), // in seconds
  answers: z.array(z.object({
    questionId: z.string(),
    userAnswer: z.string(),
    correctAnswer: z.string(),
    isCorrect: z.boolean(),
    timeSpent: z.number().int().min(0).optional()
  }))
})

/**
 * GET /api/quiz/attempts
 * Fetch user quiz attempts, optionally filtered by category
 * Query params: category (optional)
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

    const attempts = await storage.getUserQuizAttempts(
      session.user.id,
      category || undefined
    )

    return NextResponse.json({
      success: true,
      data: attempts
    })

  } catch (error) {
    console.error('GET /api/quiz/attempts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quiz/attempts
 * Create a new quiz attempt
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = quizAttemptSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const attemptData = {
      ...validation.data,
      userId: session.user.id
    }

    // Validate that score matches the answers
    const correctAnswers = attemptData.answers.filter(answer => answer.isCorrect).length
    const expectedScore = Math.round((correctAnswers / attemptData.totalQuestions) * 100)

    if (Math.abs(attemptData.score - expectedScore) > 1) { // Allow 1% tolerance for rounding
      return NextResponse.json(
        { error: 'Score does not match the provided answers' },
        { status: 400 }
      )
    }

    // Create quiz attempt
    const attempt = await storage.createQuizAttempt(attemptData)

    return NextResponse.json({
      success: true,
      data: attempt
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/quiz/attempts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/quiz/attempts
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
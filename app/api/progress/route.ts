/**
 * Progress Tracking API Route
 * 
 * Handles user progress operations including fetching and updating progress data.
 * Supports filtering by module and creating new progress records.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { storage } from '@/lib/storage'
import { z } from 'zod'

// Validation schema for progress creation/update
const createProgressSchema = z.object({
  module: z.enum(['hijaiyah', 'quran', 'dhikr', 'quiz']),
  itemId: z.string().min(1),
  progress: z.number().int().min(0).max(100),
  completed: z.boolean().optional().default(false),
  score: z.number().int().min(0).optional().default(0),
  timeSpent: z.number().int().min(0).optional().default(0)
})

/**
 * GET /api/progress
 * Fetch user progress data, optionally filtered by module
 * Query params: module (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const module = searchParams.get('module')

    // Validate module if provided
    if (module && !['hijaiyah', 'quran', 'dhikr', 'quiz'].includes(module)) {
      return NextResponse.json(
        { error: 'Invalid module. Must be one of: hijaiyah, quran, dhikr, quiz' },
        { status: 400 }
      )
    }

    const progress = await storage.getUserProgress(
      session.user.id,
      module || undefined
    )

    return NextResponse.json({
      success: true,
      data: progress
    })

  } catch (error) {
    console.error('GET /api/progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/progress
 * Create or update progress record
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validation = createProgressSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const progressData = {
      ...validation.data,
      userId: session.user.id
    }

    // Use upsert to create or update existing progress
    const progress = await storage.upsertProgress(progressData)

    return NextResponse.json({
      success: true,
      data: progress
    })

  } catch (error) {
    console.error('POST /api/progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/progress
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
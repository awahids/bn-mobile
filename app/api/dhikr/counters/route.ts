/**
 * Dhikr Counters API Route
 * 
 * Handles dhikr counter operations including fetching and updating counter data.
 * Supports filtering by date and managing morning/evening sessions.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { storage } from '@/lib/storage'
import { z } from 'zod'

// Validation schema for dhikr counter creation/update
const dhikrCounterSchema = z.object({
  dhikrId: z.string().min(1),
  count: z.number().int().min(0),
  target: z.number().int().min(1).optional().default(33),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  session: z.enum(['morning', 'evening']),
  completed: z.boolean().optional()
})

/**
 * GET /api/dhikr/counters
 * Fetch dhikr counters, optionally filtered by date
 * Query params: date (optional, YYYY-MM-DD format)
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
    const date = searchParams.get('date')

    // Use today's date if not provided
    const targetDate = date || new Date().toISOString().split('T')[0]

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    const counters = await storage.getDhikrCountersForDate(
      session.user.id,
      targetDate
    )

    return NextResponse.json({
      success: true,
      data: counters
    })

  } catch (error) {
    console.error('GET /api/dhikr/counters error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dhikr/counters
 * Create or update dhikr counter
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
    const validation = dhikrCounterSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const counterData = {
      ...validation.data,
      userId: session.user.id,
      completed: validation.data.completed ?? (validation.data.count >= validation.data.target)
    }

    // Use upsert to create or update existing counter
    const counter = await storage.upsertDhikrCounter(counterData)

    return NextResponse.json({
      success: true,
      data: counter
    })

  } catch (error) {
    console.error('POST /api/dhikr/counters error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/dhikr/counters
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
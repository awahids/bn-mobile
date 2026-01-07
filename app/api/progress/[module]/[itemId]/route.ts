/**
 * Specific Progress Item API Route
 * 
 * Handles fetching progress for a specific module and item combination.
 * Used for checking individual item progress status.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { storage } from '@/lib/storage'

interface RouteParams {
  params: {
    module: string
    itemId: string
  }
}

/**
 * GET /api/progress/[module]/[itemId]
 * Fetch progress for a specific module and item
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { module, itemId } = params

    // Validate module
    if (!['hijaiyah', 'quran', 'dhikr', 'quiz'].includes(module)) {
      return NextResponse.json(
        { error: 'Invalid module. Must be one of: hijaiyah, quran, dhikr, quiz' },
        { status: 400 }
      )
    }

    // Validate itemId
    if (!itemId || itemId.trim() === '') {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const progress = await storage.getProgressByItem(
      session.user.id,
      module,
      decodeURIComponent(itemId)
    )

    if (!progress) {
      // Return default progress if not found
      return NextResponse.json({
        success: true,
        data: {
          userId: session.user.id,
          module,
          itemId: decodeURIComponent(itemId),
          progress: 0,
          completed: false,
          score: 0,
          timeSpent: 0,
          lastAccessed: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: progress
    })

  } catch (error) {
    console.error(`GET /api/progress/${params.module}/${params.itemId} error:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/progress/[module]/[itemId]
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
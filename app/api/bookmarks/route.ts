/**
 * Bookmarks API Route
 * 
 * Handles bookmark operations including fetching user bookmarks and creating new ones.
 * Supports filtering by type (quran, dhikr).
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { storage } from '@/lib/storage'
import { z } from 'zod'

// Validation schema for bookmark creation
const createBookmarkSchema = z.object({
  type: z.enum(['quran', 'dhikr']),
  contentId: z.string().min(1),
  note: z.string().max(500).optional()
})

/**
 * GET /api/bookmarks
 * Fetch user bookmarks, optionally filtered by type
 * Query params: type (optional)
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
    const type = searchParams.get('type')

    // Validate type if provided
    if (type && !['quran', 'dhikr'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be one of: quran, dhikr' },
        { status: 400 }
      )
    }

    const bookmarks = await storage.getUserBookmarks(
      session.user.id,
      type || undefined
    )

    return NextResponse.json({
      success: true,
      data: bookmarks
    })

  } catch (error) {
    console.error('GET /api/bookmarks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookmarks
 * Create a new bookmark
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
    const validation = createBookmarkSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const bookmarkData = {
      ...validation.data,
      userId: session.user.id,
      note: validation.data.note || null
    }

    // Check if bookmark already exists
    const exists = await storage.bookmarkExists(
      session.user.id,
      bookmarkData.type,
      bookmarkData.contentId
    )

    if (exists) {
      return NextResponse.json(
        { error: 'Bookmark already exists for this content' },
        { status: 409 }
      )
    }

    // Create bookmark
    const bookmark = await storage.createBookmark(bookmarkData)

    return NextResponse.json({
      success: true,
      data: bookmark
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/bookmarks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/bookmarks
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
/**
 * Individual Bookmark API Route
 * 
 * Handles operations on specific bookmarks, primarily deletion.
 * Ensures users can only delete their own bookmarks.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { storage } from '@/lib/storage'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * DELETE /api/bookmarks/[id]
 * Delete a specific bookmark
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Validate bookmark ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Bookmark ID is required' },
        { status: 400 }
      )
    }

    // Check if bookmark exists and belongs to the user
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    if (bookmark.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own bookmarks' },
        { status: 403 }
      )
    }

    // Delete the bookmark
    const deleted = await storage.deleteBookmark(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete bookmark' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bookmark deleted successfully'
    })

  } catch (error) {
    console.error(`DELETE /api/bookmarks/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/bookmarks/[id]
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
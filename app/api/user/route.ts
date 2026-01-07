/**
 * User Management API Route
 * 
 * Handles user profile operations including fetching and updating user data.
 * Requires authentication via NextAuth.js session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { storage } from '@/lib/storage'
import { z } from 'zod'

// Validation schema for user updates
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/).optional(),
  streak: z.number().int().min(0).optional(),
  dailyProgress: z.number().int().min(0).optional(),
  preferences: z.record(z.string(), z.any()).optional()
})

/**
 * GET /api/user
 * Fetch current user profile data
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

    const user = await storage.getUser(session.user.id, true)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive data before sending to client
    const { accounts, sessions, ...safeUser } = user as any

    return NextResponse.json({
      success: true,
      data: safeUser
    })

  } catch (error) {
    console.error('GET /api/user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user
 * Update current user profile data
 */
export async function PATCH(request: NextRequest) {
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
    const validation = updateUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const updateData = validation.data

    // Check if username is already taken (if updating username)
    if (updateData.username) {
      const existingUser = await storage.getUserByUsername(updateData.username)
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        )
      }
    }

    // Update user
    const updatedUser = await storage.updateUser(session.user.id, {
      ...updateData,
      preferences: updateData.preferences as any
    })

    // Remove sensitive data before sending to client
    const { accounts, sessions, ...safeUser } = updatedUser as any

    return NextResponse.json({
      success: true,
      data: safeUser
    })

  } catch (error) {
    console.error('PATCH /api/user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/user
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
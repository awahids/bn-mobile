import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Custom signout logic can be added here
    // For example, logging signout events, clearing additional data, etc.

    return NextResponse.json({
      success: true,
      message: 'Successfully signed out'
    })
  } catch (error) {
    console.error('Custom signout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
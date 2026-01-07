/**
 * Audio Proxy API Route
 * 
 * Provides a proxy for audio files to handle CORS issues and add caching headers.
 * Useful for serving audio content from external sources or with specific headers.
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/audio-proxy
 * Proxy audio requests with proper CORS and caching headers
 * Query params: url (required) - the audio file URL to proxy
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const audioUrl = searchParams.get('url')

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Audio URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    let url: URL
    try {
      url = new URL(audioUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Security check - only allow certain domains or local files
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      // Add other allowed domains here
    ]

    const isLocalFile = audioUrl.startsWith('/') || audioUrl.startsWith('./') || audioUrl.startsWith('../')
    const isDomainAllowed = allowedDomains.some(domain => url.hostname.includes(domain))

    if (!isLocalFile && !isDomainAllowed) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 403 }
      )
    }

    // For local files, serve directly from public directory
    if (isLocalFile) {
      const filePath = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`

      // Basic security check to prevent directory traversal
      if (filePath.includes('..') || filePath.includes('~')) {
        return NextResponse.json(
          { error: 'Invalid file path' },
          { status: 400 }
        )
      }

      // Return a redirect to the static file
      return NextResponse.redirect(new URL(filePath, request.url))
    }

    // For external URLs, fetch and proxy
    const response = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Hijaiyah-App/1.0'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch audio file' },
        { status: response.status }
      )
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer()

    // Determine content type
    const contentType = response.headers.get('content-type') || 'audio/mpeg'

    // Return the audio with proper headers
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('GET /api/audio-proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/audio-proxy
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
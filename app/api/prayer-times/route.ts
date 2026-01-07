/**
 * Prayer Times API Route
 * 
 * Provides Islamic prayer times for a given location and date.
 * Uses external API or calculation methods to determine accurate prayer times.
 */

import { NextRequest, NextResponse } from 'next/server'

// Prayer times calculation interface
interface PrayerTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  date: string
  location: {
    city?: string
    country?: string
    latitude: number
    longitude: number
  }
}

/**
 * GET /api/prayer-times
 * Get prayer times for a specific location and date
 * Query params: 
 * - lat (required): latitude
 * - lng (required): longitude
 * - date (optional): YYYY-MM-DD format, defaults to today
 * - method (optional): calculation method (1-12), defaults to 2 (ISNA)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const method = searchParams.get('method') || '2' // ISNA method

    // Validate required parameters
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Validate coordinates
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      )
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90, longitude between -180 and 180' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Use Aladhan API for prayer times calculation
    const apiUrl = `http://api.aladhan.com/v1/timings/${date}`
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      method: method
    })

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        'User-Agent': 'Hijaiyah-App/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Prayer times API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error('Failed to fetch prayer times from external API')
    }

    // Extract prayer times from response
    const timings = data.data.timings
    const prayerTimes: PrayerTimes = {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
      date: data.data.date.gregorian.date,
      location: {
        latitude,
        longitude,
        city: data.data.meta?.timezone || undefined,
        country: undefined
      }
    }

    return NextResponse.json({
      success: true,
      data: prayerTimes,
      meta: {
        method: data.data.meta.method.name,
        timezone: data.data.meta.timezone,
        calculationMethod: method
      }
    })

  } catch (error) {
    console.error('GET /api/prayer-times error:', error)

    // Fallback: return approximate prayer times based on simple calculation
    const fallbackTimes = calculateFallbackPrayerTimes(
      parseFloat(request.nextUrl.searchParams.get('lat') || '0'),
      parseFloat(request.nextUrl.searchParams.get('lng') || '0'),
      request.nextUrl.searchParams.get('date') || new Date().toISOString().split('T')[0]
    )

    return NextResponse.json({
      success: true,
      data: fallbackTimes,
      meta: {
        method: 'Fallback calculation',
        note: 'External API unavailable, using approximate times'
      }
    })
  }
}

/**
 * Fallback prayer times calculation (simplified)
 */
function calculateFallbackPrayerTimes(lat: number, lng: number, date: string): PrayerTimes {
  // This is a very simplified calculation for fallback purposes
  // In a real implementation, you would use a proper Islamic prayer times library

  const today = new Date(date)
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)

  // Approximate solar calculations (very simplified)
  const solarNoon = 12 - (lng / 15) // Rough solar noon

  return {
    fajr: formatTime(solarNoon - 1.5),
    sunrise: formatTime(solarNoon - 1),
    dhuhr: formatTime(solarNoon),
    asr: formatTime(solarNoon + 3),
    maghrib: formatTime(solarNoon + 6),
    isha: formatTime(solarNoon + 7.5),
    date,
    location: {
      latitude: lat,
      longitude: lng
    }
  }
}

/**
 * Format decimal hours to HH:MM format
 */
function formatTime(decimalHours: number): string {
  const hours = Math.floor(decimalHours)
  const minutes = Math.floor((decimalHours - hours) * 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * OPTIONS /api/prayer-times
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
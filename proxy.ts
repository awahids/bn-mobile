import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.[^/]+$/

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Allow all app routes; auth restrictions are handled per-feature in the UI.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|public|.*\\..*).*)',
  ],
}

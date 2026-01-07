/**
 * Navigation prefetch utilities for performance optimization
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Common routes that should be prefetched
export const COMMON_ROUTES = [
  '/',
  '/hijaiyah',
  '/quran',
  '/dhikr',
  '/quiz',
  '/progress',
  '/profile'
] as const;

/**
 * Hook to prefetch common routes on component mount
 * Useful for pages where users are likely to navigate to multiple routes
 */
export function usePrefetchCommonRoutes() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch common routes after a short delay to avoid blocking initial render
    const timeoutId = setTimeout(() => {
      COMMON_ROUTES.forEach(route => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [router]);
}

/**
 * Prefetch specific routes programmatically
 */
export function prefetchRoutes(routes: string[], router: ReturnType<typeof useRouter>) {
  routes.forEach(route => {
    router.prefetch(route);
  });
}

/**
 * Prefetch routes based on user behavior patterns
 */
export function usePrefetchByContext(context: 'home' | 'learning' | 'profile') {
  const router = useRouter();

  useEffect(() => {
    const routesToPrefetch = getRoutesByContext(context);

    const timeoutId = setTimeout(() => {
      prefetchRoutes(routesToPrefetch, router);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [context, router]);
}

function getRoutesByContext(context: string): string[] {
  switch (context) {
    case 'home':
      return ['/hijaiyah', '/quran', '/dhikr', '/quiz'];
    case 'learning':
      return ['/progress', '/', '/profile'];
    case 'profile':
      return ['/', '/progress'];
    default:
      return [];
  }
}
import { lazy, Suspense, ComponentType } from 'react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Lazy loading utility with Vite optimizations
 * Provides consistent loading states and error boundaries
 */

interface LazyLoadOptions {
  fallback?: React.ComponentType;
  delay?: number;
  retries?: number;
}

/**
 * Enhanced lazy loading with Vite chunk naming and preloading
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): ComponentType<React.ComponentProps<T>> {
  const {
    fallback: Fallback = DefaultSkeleton,
    delay = 0,
    retries = 3
  } = options;

  // Add retry logic for failed imports
  const importWithRetry = async (): Promise<{ default: T }> => {
    let lastError: Error;

    for (let i = 0; i < retries; i++) {
      try {
        // Add artificial delay if specified (useful for testing)
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        return await importFn();
      } catch (error) {
        lastError = error as Error;

        // Wait before retrying (exponential backoff)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError!;
  };

  const LazyComponent = lazy(importWithRetry);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<Fallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Default skeleton loading component
 */
function DefaultSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/**
 * Specific skeleton components for different component types
 */
export const LoadingSkeletons = {
  AudioPlayer: () => (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm">
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  ),

  WritingCanvas: () => (
    <div className="p-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-4 w-full mt-2" />
    </div>
  ),

  DhikrCounter: () => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-2 w-full" />
      <div className="flex items-center justify-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="text-center">
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  ),

  Chart: () => (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>
  ),

  Card: () => (
    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
};

/**
 * Preload a lazy component for better UX
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  // Preload on idle or after a short delay
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn());
  } else {
    setTimeout(() => importFn(), 100);
  }
}

/**
 * Hook for preloading components on hover/focus
 */
export function usePreloadOnHover(importFn: () => Promise<any>) {
  const preload = () => preloadComponent(importFn);

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}
/**
 * Lazy-loaded components with Vite chunk optimization
 * All heavy components are dynamically imported with proper chunk names
 */

import { createLazyComponent, LoadingSkeletons } from '@/lib/lazy-loading';

// Audio Player - Heavy component with audio processing
export const LazyAudioPlayer = createLazyComponent(
  () => import('@/components/features/learning/audio-player').then(mod => ({ default: mod.AudioPlayer })),
  {
    fallback: LoadingSkeletons.AudioPlayer,
  }
);

// Writing Canvas - Heavy component with canvas operations
export const LazyWritingCanvas = createLazyComponent(
  () => import('@/components/features/hijaiyah/writing-canvas').then(mod => ({ default: mod.WritingCanvas })),
  {
    fallback: LoadingSkeletons.WritingCanvas,
  }
);

// Dhikr Counter - Interactive component with animations
export const LazyDhikrCounter = createLazyComponent(
  () => import('@/components/features/dhikr/dhikr-counter').then(mod => ({ default: mod.DhikrCounter })),
  {
    fallback: LoadingSkeletons.DhikrCounter,
  }
);

// Bottom Navigation - Always visible but can be lazy loaded
export const LazyBottomNavigation = createLazyComponent(
  () => import('@/components/shared/bottom-navigation').then(mod => ({ default: mod.BottomNavigation })),
  {
    // The floating pill renders over content, so nothing needs to reserve space.
    fallback: () => null,
  }
);

// Preload functions for common components
export const preloadComponents = {
  audioPlayer: () => import('@/components/features/learning/audio-player'),
  writingCanvas: () => import('@/components/features/hijaiyah/writing-canvas'),
  dhikrCounter: () => import('@/components/features/dhikr/dhikr-counter'),
  bottomNavigation: () => import('@/components/shared/bottom-navigation'),
};
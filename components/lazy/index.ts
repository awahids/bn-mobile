/**
 * Lazy-loaded components with Vite chunk optimization
 * All heavy components are dynamically imported with proper chunk names
 */

import { createLazyComponent, LoadingSkeletons } from '@/lib/lazy-loading';
import React from 'react';

// Audio Player - Heavy component with audio processing
export const LazyAudioPlayer = createLazyComponent(
  () => import('@/components/audio-player').then(mod => ({ default: mod.AudioPlayer })),
  {
    fallback: LoadingSkeletons.AudioPlayer,
  }
);

// Writing Canvas - Heavy component with canvas operations
export const LazyWritingCanvas = createLazyComponent(
  () => import('@/components/writing-canvas').then(mod => ({ default: mod.WritingCanvas })),
  {
    fallback: LoadingSkeletons.WritingCanvas,
  }
);

// Dhikr Counter - Interactive component with animations
export const LazyDhikrCounter = createLazyComponent(
  () => import('@/components/dhikr-counter').then(mod => ({ default: mod.DhikrCounter })),
  {
    fallback: LoadingSkeletons.DhikrCounter,
  }
);

// Progress Ring - SVG-heavy component
export const LazyProgressRing = createLazyComponent(
  () => import('@/components/progress-ring').then(mod => ({ default: mod.ProgressRing })),
  {
    fallback: LoadingSkeletons.Chart,
  }
);

// Bottom Navigation - Always visible but can be lazy loaded
export const LazyBottomNavigation = createLazyComponent(
  () => import('@/components/bottom-navigation').then(mod => ({ default: mod.BottomNavigation })),
  {
    fallback: () => React.createElement('div', {
      className: 'h-16 bg-background border-t',
      style: { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }
    }),
  }
);

// Chart components - Heavy with recharts
export const LazyChartContainer = createLazyComponent(
  () => import('@/components/ui/chart').then(mod => ({ default: mod.ChartContainer })),
  {
    fallback: LoadingSkeletons.Chart,
  }
);

// Form components - Heavy with validation
export const LazyForm = createLazyComponent(
  () => import('@/components/ui/form').then(mod => ({ default: mod.Form })),
  {
    fallback: LoadingSkeletons.Card,
  }
);

// Calendar component - Heavy date picker
export const LazyCalendar = createLazyComponent(
  () => import('@/components/ui/calendar').then(mod => ({ default: mod.Calendar })),
  {
    fallback: LoadingSkeletons.Card,
  }
);

// Command palette - Heavy search component
export const LazyCommand = createLazyComponent(
  () => import('@/components/ui/command').then(mod => ({ default: mod.Command })),
  {
    fallback: LoadingSkeletons.Card,
  }
);

// Data table - Heavy table component
export const LazyDataTable = createLazyComponent(
  () => import('@/components/ui/table').then(mod => ({ default: mod.Table })),
  {
    fallback: LoadingSkeletons.Card,
  }
);

// Carousel - Heavy with animations
export const LazyCarousel = createLazyComponent(
  () => import('@/components/ui/carousel').then(mod => ({ default: mod.Carousel })),
  {
    fallback: LoadingSkeletons.Card,
  }
);

// Dialog components - Heavy modals
export const LazyDialog = createLazyComponent(
  () => import('@/components/ui/dialog').then(mod => ({ default: mod.Dialog })),
  {
    fallback: () => null, // Dialogs don't need fallback when closed
  }
);

export const LazyAlertDialog = createLazyComponent(
  () => import('@/components/ui/alert-dialog').then(mod => ({ default: mod.AlertDialog })),
  {
    fallback: () => null,
  }
);

// Sheet components - Heavy slide-out panels
export const LazySheet = createLazyComponent(
  () => import('@/components/ui/sheet').then(mod => ({ default: mod.Sheet })),
  {
    fallback: () => null,
  }
);

// Drawer component - Heavy mobile drawer
export const LazyDrawer = createLazyComponent(
  () => import('@/components/ui/drawer').then(mod => ({ default: mod.Drawer })),
  {
    fallback: () => null,
  }
);

// Preload functions for common components
export const preloadComponents = {
  audioPlayer: () => import('@/components/audio-player'),
  writingCanvas: () => import('@/components/writing-canvas'),
  dhikrCounter: () => import('@/components/dhikr-counter'),
  progressRing: () => import('@/components/progress-ring'),
  bottomNavigation: () => import('@/components/bottom-navigation'),
};
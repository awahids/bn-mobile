import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Performance-focused Vite configuration
 * Optimized for production builds with Bun runtime
 */

export const performanceConfig = defineConfig({
  // Build optimizations
  build: {
    // Target modern browsers for better performance
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],

    // Enable minification with esbuild (faster than terser)
    minify: 'esbuild',

    // Optimize CSS minification
    cssMinify: 'esbuild',

    // Enable source maps for production debugging
    sourcemap: 'hidden',

    // Optimize chunk splitting strategy
    rollupOptions: {
      output: {
        // Aggressive chunk splitting for better caching
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }

            // UI libraries
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }

            // State management
            if (id.includes('@tanstack/react-query') || id.includes('zustand')) {
              return 'vendor-state';
            }

            // Animation libraries
            if (id.includes('framer-motion') || id.includes('lottie')) {
              return 'vendor-animation';
            }

            // Utility libraries
            if (id.includes('date-fns') || id.includes('lodash') || id.includes('clsx')) {
              return 'vendor-utils';
            }

            // Other vendor code
            return 'vendor-misc';
          }

          // App chunks
          if (id.includes('/components/')) {
            // Heavy components
            if (id.includes('audio-player') || id.includes('writing-canvas') || id.includes('dhikr-counter')) {
              return 'components-heavy';
            }

            // UI components
            if (id.includes('/ui/')) {
              return 'components-ui';
            }

            // Other components
            return 'components-common';
          }

          // Data modules
          if (id.includes('/data/')) {
            return 'data-modules';
          }

          // Hooks
          if (id.includes('/hooks/')) {
            return 'hooks';
          }

          // Lib utilities
          if (id.includes('/lib/')) {
            return 'lib-utils';
          }
        },

        // Optimize chunk size limits
        maxParallelFileOps: 5,

        // Optimize file naming for caching
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];

          // Organize assets by type for better caching
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }

          if (/\.(mp3|wav|ogg|flac|aac)$/i.test(assetInfo.name || '')) {
            return `assets/audio/[name]-[hash][extname]`;
          }

          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }

          if (/\.css$/i.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash][extname]`;
          }

          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },

      // External dependencies (don't bundle these)
      external: [],

      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 500, // 500KB warning limit

    // Asset size limit
    assetsInlineLimit: 4096, // 4KB inline limit

    // CSS code splitting
    cssCodeSplit: true,

    // Report compressed size
    reportCompressedSize: true,

    // Write bundle to disk
    write: true,

    // Empty output directory
    emptyOutDir: true,
  },

  // Dependency optimization for faster builds
  optimizeDeps: {
    // Force optimization of these dependencies
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
    ],

    // Exclude large dependencies from optimization
    exclude: [
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
    ],

    // ESBuild options for dependency optimization
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true,
      },
    },
  },

  // ESBuild configuration for faster builds
  esbuild: {
    // Target modern JavaScript
    target: 'es2020',

    // Drop console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],

    // Optimize for size
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,

    // Legal comments
    legalComments: 'none',
  },

  // CSS optimization
  css: {
    // PostCSS configuration
    postcss: {
      plugins: [
        // Add autoprefixer for better browser support
        require('autoprefixer')({
          overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead'],
        }),

        // CSS nano for production minification
        ...(process.env.NODE_ENV === 'production' ? [
          require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifySelectors: true,
            }],
          }),
        ] : []),
      ],
    },

    // CSS modules configuration
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: process.env.NODE_ENV === 'production'
        ? '[hash:base64:5]'
        : '[name]__[local]__[hash:base64:5]',
    },
  },

  // Server configuration for development
  server: {
    // Enable HMR
    hmr: {
      overlay: true,
    },

    // Optimize for development
    force: false,

    // Pre-transform known dependencies
    warmup: {
      clientFiles: [
        './app/**/*.tsx',
        './components/**/*.tsx',
        './lib/**/*.ts',
      ],
    },
  },

  // Preview configuration
  preview: {
    // Optimize for production preview
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
});
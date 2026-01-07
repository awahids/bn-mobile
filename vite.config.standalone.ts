import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { performancePlugins } from './vite.plugins.standalone';

export default defineConfig({
  plugins: [
    react({
      // Enable JSX runtime optimization
      jsxRuntime: 'automatic',
    }),
    // Add performance optimization plugins
    ...performancePlugins,
  ],

  // Path resolution for better imports
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@/components': resolve(__dirname, 'components'),
      '@/lib': resolve(__dirname, 'lib'),
      '@/hooks': resolve(__dirname, 'hooks'),
      '@/app': resolve(__dirname, 'app'),
    },
  },

  // Build optimizations for Bun and Next.js
  build: {
    // Target modern browsers for better performance
    target: 'esnext',

    // Enable minification
    minify: 'esbuild',

    // Optimize chunk splitting for lazy loading
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'vendor-icons': ['lucide-react', 'react-icons'],
          'vendor-animation': ['framer-motion'],
          'vendor-query': ['@tanstack/react-query'],

          // App-specific chunks
          'components-heavy': [
            './components/audio-player',
            './components/writing-canvas',
            './components/dhikr-counter',
          ],
          'components-ui': [
            './components/ui/button',
            './components/ui/card',
            './components/ui/input',
            './components/ui/skeleton',
          ],
          'data-modules': [
            './client/src/data/hijaiyah',
            './client/src/data/dhikr',
            './client/src/data/quiz',
            './client/src/data/quran',
          ],
        },

        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },

        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }

          if (/\.(mp3|wav|ogg|flac|aac)$/i.test(assetInfo.name || '')) {
            return `assets/audio/[name]-[hash][extname]`;
          }

          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }

          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
    },

    // Optimize source maps for production
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : 'hidden',

    // Optimize CSS code splitting
    cssCodeSplit: true,

    // Report bundle size
    reportCompressedSize: true,

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Development server optimizations
  server: {
    // Enable HMR
    hmr: true,

    // Optimize dependency pre-bundling
    force: false,

    // CORS for API development
    cors: true,

    // Port configuration
    port: 3000,
    strictPort: false,

    // Host configuration
    host: true,
  },

  // Dependency optimization
  optimizeDeps: {
    // Include dependencies that should be pre-bundled
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-query',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],

    // Exclude dependencies from pre-bundling
    exclude: [
      // Large dependencies that benefit from lazy loading
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],

    // Force optimization of specific dependencies
    force: false,
  },

  // CSS optimizations
  css: {
    // Enable CSS modules
    modules: {
      localsConvention: 'camelCase',
    },

    // PostCSS configuration
    postcss: {
      plugins: [],
    },

    // CSS preprocessing
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Environment variables
  define: {
    // Enable development features
    __DEV__: process.env.NODE_ENV === 'development',

    // Build information
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },

  // Preview server configuration (for production builds)
  preview: {
    port: 3000,
    host: true,
    cors: true,
  },

  // Experimental features
  experimental: {
    // Enable render built-ins optimization
    renderBuiltUrl: true,
  },

  // Worker configuration for web workers
  worker: {
    format: 'es',
    plugins: [react()],
  },

  // JSON configuration
  json: {
    namedExports: true,
    stringify: false,
  },
});
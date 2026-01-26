/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for serverless deployment
  output: 'standalone',

  // Disable Turbopack when using Bun to avoid worker thread issues
  turbopack: process.env.BUN_RUNTIME !== 'bun' ? {} : false,

  // Suppress source map warnings in development
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Performance optimizations for Bun runtime
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'framer-motion',
      'react-icons'
    ],
    // Enable optimized CSS
    optimizeCss: true,
    // Disable memory-based workers when using Bun
    memoryBasedWorkersCount: process.env.BUN_RUNTIME !== 'bun',
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // Turbopack configuration for better Prisma compatibility
  turbopack: process.env.BUN_RUNTIME !== 'bun' ? {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    resolveAlias: {
      '@prisma/client': '@prisma/client'
    }
  } : false,

  // Compiler optimizations for Bun
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    // Enable SWC minification for better performance with Bun
    styledComponents: true,
  },

  // Webpack optimizations for Bun runtime
  webpack: (config, { isServer, dev }) => {
    // Prisma client configuration
    config.externals = config.externals || []
    if (isServer) {
      config.externals.push('@prisma/client')
    }

    // Optimize for Bun runtime
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Bun-specific optimizations
    if (process.env.BUN_RUNTIME === 'bun' || process.env.npm_config_user_agent?.includes('bun')) {
      // Disable source maps for Bun compatibility in development
      if (dev) {
        config.devtool = false;
      }

      // Disable worker threads for Bun
      config.optimization = {
        ...config.optimization,
        minimize: process.env.NODE_ENV === 'production',
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
            },
          },
        },
      };
    } else {
      // Standard webpack optimization for Node.js
      config.optimization = {
        ...config.optimization,
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
            },
          },
        },
      };
    }

    // Faster module resolution for Bun
    config.resolve.modules = ['node_modules', '.'];

    return config;
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // OAuth provider images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        pathname: '/**',
      },
      // Islamic content CDNs
      {
        protocol: 'https',
        hostname: 'cdn.islamic.network',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },

  // Static file serving
  trailingSlash: false,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      // Static asset caching with prefetch hints
      {
        source: '/audio/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Link', value: '</audio>; rel=prefetch' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Prefetch hints for common routes
      {
        source: '/',
        headers: [
          { key: 'Link', value: '</hijaiyah>; rel=prefetch, </quran>; rel=prefetch, </dhikr>; rel=prefetch, </quiz>; rel=prefetch' },
        ],
      },
    ];
  },
};

export default nextConfig;
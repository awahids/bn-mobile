/** @type {import('next').NextConfig} */
const INTERNAL_API_ORIGIN = (process.env.INTERNAL_API_ORIGIN || 'http://43.157.213.220:8080')
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '')

const nextConfig = {
  // Configure for serverless deployment
  output: 'standalone',

  // Disable Turbopack for Bun compatibility
  turbopack: false,

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
    // Disable memory-based workers for Bun compatibility
    memoryBasedWorkersCount: false,
  },

  // Server external packages
  serverExternalPackages: ['@prisma/client'],

  // Compiler optimizations for Bun
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    // Enable SWC minification for better performance with Bun
    styledComponents: true,
  },

  // Webpack optimizations for Bun runtime
  webpack: (config, { isServer }) => {
    // Optimize for Bun runtime
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Disable worker threads for Bun compatibility
    config.optimization = {
      ...config.optimization,
      // Disable parallel processing that uses worker threads
      minimize: process.env.NODE_ENV === 'production',
      // Enable module concatenation
      concatenateModules: true,
      // Optimize chunk splitting
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

    // Faster module resolution for Bun
    config.resolve.modules = ['node_modules', '.'];

    // Disable source maps for Bun compatibility
    if (process.env.BUN_RUNTIME === 'bun') {
      config.devtool = false;
    }

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

  // Proxy public API calls through Next.js to prevent browser mixed-content errors.
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${INTERNAL_API_ORIGIN}/api/v1/:path*`,
      },
    ]
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

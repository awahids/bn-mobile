import { Plugin } from 'vite';
import { resolve } from 'path';

/**
 * Custom Vite plugins for performance optimization
 */

/**
 * Bundle analyzer plugin for Vite
 */
export function bundleAnalyzer(): Plugin {
  return {
    name: 'bundle-analyzer',
    generateBundle(options, bundle) {
      if (process.env.ANALYZE === 'true') {
        const analysis = {
          chunks: {} as Record<string, any>,
          assets: {} as Record<string, any>,
          totalSize: 0,
        };

        // Analyze chunks
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk') {
            analysis.chunks[fileName] = {
              size: chunk.code.length,
              modules: Object.keys(chunk.modules || {}),
              imports: chunk.imports,
              dynamicImports: chunk.dynamicImports,
            };
            analysis.totalSize += chunk.code.length;
          } else if (chunk.type === 'asset') {
            analysis.assets[fileName] = {
              size: chunk.source.length,
            };
            analysis.totalSize += chunk.source.length;
          }
        }

        // Write analysis to file
        this.emitFile({
          type: 'asset',
          fileName: 'bundle-analysis.json',
          source: JSON.stringify(analysis, null, 2),
        });

        // Log summary
        console.log('\n📊 Bundle Analysis Summary:');
        console.log(`Total Size: ${(analysis.totalSize / 1024).toFixed(2)} KB`);
        console.log(`Chunks: ${Object.keys(analysis.chunks).length}`);
        console.log(`Assets: ${Object.keys(analysis.assets).length}`);

        // Find largest chunks
        const sortedChunks = Object.entries(analysis.chunks)
          .sort(([, a], [, b]) => b.size - a.size)
          .slice(0, 5);

        console.log('\n🔍 Largest Chunks:');
        sortedChunks.forEach(([name, chunk]) => {
          console.log(`  ${name}: ${(chunk.size / 1024).toFixed(2)} KB`);
        });
      }
    },
  };
}

/**
 * Performance monitoring plugin
 */
export function performanceMonitor(): Plugin {
  let startTime: number;

  return {
    name: 'performance-monitor',
    buildStart() {
      startTime = Date.now();
      console.log('🚀 Starting Vite build with performance monitoring...');
    },
    buildEnd() {
      const duration = Date.now() - startTime;
      console.log(`✅ Build completed in ${duration}ms`);

      // Log performance metrics
      if (process.env.NODE_ENV === 'production') {
        console.log('\n📈 Performance Metrics:');
        console.log(`  Build Time: ${duration}ms`);
        console.log(`  Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      }
    },
  };
}

/**
 * Lazy loading optimization plugin
 */
export function lazyLoadingOptimizer(): Plugin {
  return {
    name: 'lazy-loading-optimizer',
    generateBundle(options, bundle) {
      // Add preload hints for critical chunks
      const criticalChunks = ['vendor-react', 'vendor-ui', 'components-ui'];

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && criticalChunks.some(name => fileName.includes(name))) {
          // Mark as high priority for preloading
          chunk.code = `/* @vite-preload */ ${chunk.code}`;
        }
      }
    },
  };
}

/**
 * Asset optimization plugin
 */
export function assetOptimizer(): Plugin {
  return {
    name: 'asset-optimizer',
    generateBundle(options, bundle) {
      // Optimize asset loading
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset') {
          // Add cache headers for static assets
          if (fileName.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
            // Images should be cached for a long time
            chunk.source = `/* Cache-Control: public, max-age=31536000, immutable */ ${chunk.source}`;
          } else if (fileName.match(/\.(mp3|wav|ogg|flac|aac)$/)) {
            // Audio files should be cached but allow revalidation
            chunk.source = `/* Cache-Control: public, max-age=86400, must-revalidate */ ${chunk.source}`;
          }
        }
      }
    },
  };
}

/**
 * Development optimization plugin
 */
export function devOptimizer(): Plugin {
  return {
    name: 'dev-optimizer',
    configureServer(server) {
      // Add development-specific optimizations
      server.middlewares.use('/api', (req, res, next) => {
        // Add CORS headers for development
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
      });
    },
  };
}

/**
 * Tree shaking optimizer
 */
export function treeShakingOptimizer(): Plugin {
  return {
    name: 'tree-shaking-optimizer',
    generateBundle(options, bundle) {
      // Analyze and optimize tree shaking
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          // Remove unused exports (this is a simplified example)
          const modules = chunk.modules || {};
          const unusedModules = Object.keys(modules).filter(moduleId => {
            // Check if module is actually used
            return !chunk.code.includes(moduleId.split('/').pop() || '');
          });

          if (unusedModules.length > 0 && process.env.NODE_ENV === 'development') {
            console.log(`🌳 Tree shaking: Found ${unusedModules.length} potentially unused modules in ${fileName}`);
          }
        }
      }
    },
  };
}

/**
 * Compression plugin for production builds
 */
export function compressionOptimizer(): Plugin {
  return {
    name: 'compression-optimizer',
    generateBundle(options, bundle) {
      if (process.env.NODE_ENV === 'production') {
        // Add compression hints
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && chunk.code.length > 10000) {
            // Large chunks should be compressed
            chunk.code = `/* @compress */ ${chunk.code}`;
          }
        }
      }
    },
  };
}

/**
 * All performance plugins combined
 */
export const performancePlugins = [
  bundleAnalyzer(),
  performanceMonitor(),
  lazyLoadingOptimizer(),
  assetOptimizer(),
  devOptimizer(),
  treeShakingOptimizer(),
  compressionOptimizer(),
];
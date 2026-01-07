#!/usr/bin/env bun

/**
 * Bun Runtime Optimization Script
 * Configures Bun for optimal performance in different environments
 */

import { $ } from "bun";

interface BunConfig {
  environment: 'development' | 'production' | 'test';
  memoryLimit: string;
  workers: boolean;
  jit: boolean;
  hotReload: boolean;
}

class BunOptimizer {
  private config: BunConfig;

  constructor(environment: BunConfig['environment'] = 'development') {
    this.config = this.getOptimalConfig(environment);
  }

  private getOptimalConfig(env: BunConfig['environment']): BunConfig {
    const configs: Record<BunConfig['environment'], BunConfig> = {
      development: {
        environment: 'development',
        memoryLimit: '2gb',
        workers: true,
        jit: true,
        hotReload: true,
      },
      production: {
        environment: 'production',
        memoryLimit: '4gb',
        workers: true,
        jit: true,
        hotReload: false,
      },
      test: {
        environment: 'test',
        memoryLimit: '1gb',
        workers: false,
        jit: false,
        hotReload: false,
      },
    };

    return configs[env];
  }

  async optimizeRuntime(): Promise<void> {
    console.log(`🚀 Optimizing Bun runtime for ${this.config.environment} environment...`);

    // Set memory limits
    process.env.BUN_HEAP_SIZE = this.config.memoryLimit.replace('gb', '000');
    process.env.BUN_MAX_OLD_SPACE_SIZE = this.config.memoryLimit.replace('gb', '000');

    // Configure JIT
    process.env.BUN_JSC_useJIT = this.config.jit.toString();

    // Configure workers
    if (this.config.workers) {
      const cpuCount = navigator.hardwareConcurrency || 4;
      process.env.BUN_WORKERS = Math.min(cpuCount, 8).toString();
    }

    // Configure hot reload for development
    if (this.config.hotReload) {
      process.env.FAST_REFRESH = 'true';
      process.env.HOT_RELOAD = 'true';
    }

    console.log('✅ Bun runtime optimized successfully!');
    this.printConfig();
  }

  private printConfig(): void {
    console.log('\n📊 Current Bun Configuration:');
    console.log(`   Environment: ${this.config.environment}`);
    console.log(`   Memory Limit: ${this.config.memoryLimit}`);
    console.log(`   Workers: ${this.config.workers ? 'Enabled' : 'Disabled'}`);
    console.log(`   JIT: ${this.config.jit ? 'Enabled' : 'Disabled'}`);
    console.log(`   Hot Reload: ${this.config.hotReload ? 'Enabled' : 'Disabled'}`);
    console.log('');
  }

  async benchmarkPerformance(): Promise<void> {
    console.log('🔍 Running Bun performance benchmark...');

    const startTime = performance.now();

    // Test module resolution speed
    await import('react');
    await import('next');
    await import('@prisma/client');

    const moduleResolutionTime = performance.now() - startTime;

    // Test file system operations
    const fsStartTime = performance.now();
    const file = Bun.file('package.json');
    await file.text();
    const fsTime = performance.now() - fsStartTime;

    console.log(`📈 Performance Results:`);
    console.log(`   Module Resolution: ${moduleResolutionTime.toFixed(2)}ms`);
    console.log(`   File System: ${fsTime.toFixed(2)}ms`);
    console.log(`   Total Startup: ${(performance.now() - startTime).toFixed(2)}ms`);
  }

  async clearCaches(): Promise<void> {
    console.log('🧹 Clearing Bun caches for optimal performance...');

    try {
      // Clear Bun cache
      await $`rm -rf ~/.bun/install/cache/*`;

      // Clear Next.js cache
      await $`rm -rf .next/cache/*`;

      // Clear node_modules cache
      await $`rm -rf node_modules/.cache/*`;

      console.log('✅ Caches cleared successfully!');
    } catch (error) {
      console.warn('⚠️  Some caches could not be cleared:', error);
    }
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0] || 'optimize';
const environment = (args[1] as BunConfig['environment']) || 'development';

const optimizer = new BunOptimizer(environment);

switch (command) {
  case 'optimize':
    await optimizer.optimizeRuntime();
    break;
  case 'benchmark':
    await optimizer.benchmarkPerformance();
    break;
  case 'clear-cache':
    await optimizer.clearCaches();
    break;
  case 'all':
    await optimizer.clearCaches();
    await optimizer.optimizeRuntime();
    await optimizer.benchmarkPerformance();
    break;
  default:
    console.log('Usage: bun scripts/bun-optimize.ts [optimize|benchmark|clear-cache|all] [development|production|test]');
    process.exit(1);
}
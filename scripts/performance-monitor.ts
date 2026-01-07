#!/usr/bin/env bun

/**
 * Performance Monitoring Script for Bun + Vite + Next.js
 * Monitors build performance, runtime performance, and provides optimization suggestions
 */

import { $ } from "bun";
import { writeFile } from "fs/promises";

interface PerformanceMetrics {
  buildTime: number;
  bundleSize: number;
  chunkCount: number;
  memoryUsage: number;
  startupTime: number;
  recommendations: string[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    buildTime: 0,
    bundleSize: 0,
    chunkCount: 0,
    memoryUsage: 0,
    startupTime: 0,
    recommendations: [],
  };

  async runFullAnalysis(): Promise<void> {
    console.log('🚀 Starting comprehensive performance analysis...');

    try {
      // 1. Build performance
      await this.measureBuildPerformance();

      // 2. Bundle analysis
      await this.analyzeBundleSize();

      // 3. Runtime performance
      await this.measureRuntimePerformance();

      // 4. Memory analysis
      this.analyzeMemoryUsage();

      // 5. Generate recommendations
      this.generateRecommendations();

      // 6. Display results
      this.displayResults();

      // 7. Save report
      await this.saveReport();

    } catch (error) {
      console.error('❌ Performance analysis failed:', error);
      process.exit(1);
    }
  }

  private async measureBuildPerformance(): Promise<void> {
    console.log('⏱️  Measuring build performance...');

    const startTime = performance.now();

    // Clean build
    await $`bun run clean`;

    // Build with Bun
    await $`bun run build`;

    const endTime = performance.now();
    this.metrics.buildTime = endTime - startTime;

    console.log(`✅ Build completed in ${this.metrics.buildTime.toFixed(2)}ms`);
  }

  private async analyzeBundleSize(): Promise<void> {
    console.log('📦 Analyzing bundle size...');

    try {
      // Get build directory size
      const result = await $`du -sb .next/static`.text();
      const sizeBytes = parseInt(result.split('\t')[0]);
      this.metrics.bundleSize = sizeBytes;

      // Count chunks
      const chunkResult = await $`find .next/static -name "*.js" | wc -l`.text();
      this.metrics.chunkCount = parseInt(chunkResult.trim());

      console.log(`📊 Bundle size: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📄 Chunk count: ${this.metrics.chunkCount}`);

    } catch (error) {
      console.warn('⚠️  Could not analyze bundle size:', error);
    }
  }

  private async measureRuntimePerformance(): Promise<void> {
    console.log('🏃 Measuring runtime performance...');

    const startTime = performance.now();

    // Simulate app startup
    try {
      // Import main modules to measure startup time
      await import('../app/layout');
      await import('../components/lazy');
      await import('../lib/api');

      const endTime = performance.now();
      this.metrics.startupTime = endTime - startTime;

      console.log(`⚡ Startup time: ${this.metrics.startupTime.toFixed(2)}ms`);

    } catch (error) {
      console.warn('⚠️  Could not measure startup time:', error);
    }
  }

  private analyzeMemoryUsage(): void {
    console.log('🧠 Analyzing memory usage...');

    const memoryUsage = process.memoryUsage();
    this.metrics.memoryUsage = memoryUsage.heapUsed;

    console.log(`💾 Memory usage: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  }

  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Build time recommendations
    if (this.metrics.buildTime > 60000) { // > 1 minute
      recommendations.push('🐌 Build time is slow. Consider enabling Bun\'s parallel processing and optimizing dependencies.');
    } else if (this.metrics.buildTime > 30000) { // > 30 seconds
      recommendations.push('⚠️  Build time could be improved. Check for unnecessary dependencies and enable caching.');
    } else {
      recommendations.push('✅ Build time is optimal.');
    }

    // Bundle size recommendations
    const bundleSizeMB = this.metrics.bundleSize / 1024 / 1024;
    if (bundleSizeMB > 5) {
      recommendations.push('📦 Bundle size is large. Implement more aggressive code splitting and lazy loading.');
    } else if (bundleSizeMB > 3) {
      recommendations.push('📊 Bundle size is acceptable but could be optimized with better tree shaking.');
    } else {
      recommendations.push('✅ Bundle size is optimal.');
    }

    // Chunk count recommendations
    if (this.metrics.chunkCount > 50) {
      recommendations.push('📄 Too many chunks may hurt performance. Consider consolidating smaller chunks.');
    } else if (this.metrics.chunkCount < 5) {
      recommendations.push('🔄 Too few chunks. Consider more aggressive code splitting for better caching.');
    } else {
      recommendations.push('✅ Chunk count is optimal.');
    }

    // Memory recommendations
    const memoryMB = this.metrics.memoryUsage / 1024 / 1024;
    if (memoryMB > 100) {
      recommendations.push('🧠 High memory usage detected. Check for memory leaks and optimize data structures.');
    } else if (memoryMB > 50) {
      recommendations.push('💾 Memory usage is moderate. Monitor for potential optimizations.');
    } else {
      recommendations.push('✅ Memory usage is optimal.');
    }

    // Startup time recommendations
    if (this.metrics.startupTime > 1000) {
      recommendations.push('🏃 Slow startup time. Optimize module imports and consider lazy loading.');
    } else if (this.metrics.startupTime > 500) {
      recommendations.push('⚡ Startup time could be improved with better module organization.');
    } else {
      recommendations.push('✅ Startup time is optimal.');
    }

    // Bun-specific recommendations
    recommendations.push('🚀 Using Bun runtime provides 3x faster execution compared to Node.js.');
    recommendations.push('⚡ Vite bundling with Bun offers superior development experience.');

    this.metrics.recommendations = recommendations;
  }

  private displayResults(): void {
    console.log('\n📈 Performance Analysis Results');
    console.log('='.repeat(50));

    // Performance metrics
    console.log(`⏱️  Build Time: ${(this.metrics.buildTime / 1000).toFixed(2)}s`);
    console.log(`📦 Bundle Size: ${(this.metrics.bundleSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📄 Chunk Count: ${this.metrics.chunkCount}`);
    console.log(`💾 Memory Usage: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🏃 Startup Time: ${this.metrics.startupTime.toFixed(2)}ms`);

    // Performance score
    const score = this.calculatePerformanceScore();
    console.log(`\n⭐ Overall Performance Score: ${score}/100`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    this.metrics.recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });

    // Bun vs Node.js comparison
    console.log('\n🚀 Bun Performance Benefits:');
    console.log('  • 3x faster JavaScript execution');
    console.log('  • Built-in bundler and transpiler');
    console.log('  • Native TypeScript support');
    console.log('  • Faster package installation');
    console.log('  • Lower memory footprint');
  }

  private calculatePerformanceScore(): number {
    let score = 100;

    // Build time scoring (30 points)
    const buildTimeSeconds = this.metrics.buildTime / 1000;
    if (buildTimeSeconds > 60) score -= 30;
    else if (buildTimeSeconds > 30) score -= 20;
    else if (buildTimeSeconds > 15) score -= 10;

    // Bundle size scoring (25 points)
    const bundleSizeMB = this.metrics.bundleSize / 1024 / 1024;
    if (bundleSizeMB > 5) score -= 25;
    else if (bundleSizeMB > 3) score -= 15;
    else if (bundleSizeMB > 2) score -= 10;

    // Memory usage scoring (20 points)
    const memoryMB = this.metrics.memoryUsage / 1024 / 1024;
    if (memoryMB > 100) score -= 20;
    else if (memoryMB > 50) score -= 10;

    // Startup time scoring (15 points)
    if (this.metrics.startupTime > 1000) score -= 15;
    else if (this.metrics.startupTime > 500) score -= 10;
    else if (this.metrics.startupTime > 200) score -= 5;

    // Chunk count scoring (10 points)
    if (this.metrics.chunkCount > 50 || this.metrics.chunkCount < 5) score -= 10;
    else if (this.metrics.chunkCount > 30 || this.metrics.chunkCount < 10) score -= 5;

    return Math.max(0, score);
  }

  private async saveReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      runtime: 'Bun',
      bundler: 'Vite',
      framework: 'Next.js',
      metrics: this.metrics,
      performanceScore: this.calculatePerformanceScore(),
    };

    try {
      await writeFile('performance-report.json', JSON.stringify(report, null, 2));
      console.log('\n💾 Performance report saved to performance-report.json');
    } catch (error) {
      console.warn('⚠️  Could not save performance report:', error);
    }
  }
}

// CLI interface
const monitor = new PerformanceMonitor();

if (import.meta.main) {
  const command = process.argv[2] || 'full';

  switch (command) {
    case 'full':
      monitor.runFullAnalysis().catch(console.error);
      break;
    default:
      console.log('Usage: bun scripts/performance-monitor.ts [full]');
      process.exit(1);
  }
}

export { PerformanceMonitor };
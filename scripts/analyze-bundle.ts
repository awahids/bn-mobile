#!/usr/bin/env bun

/**
 * Bundle Analysis Script for Vite + Bun
 * Analyzes build output and provides optimization recommendations
 */

import { spawn } from "child_process";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { writeFile } from "fs/promises";

// Helper function to execute shell commands
async function exec(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

interface BundleAnalysis {
  totalSize: number;
  chunks: Array<{
    name: string;
    size: number;
    type: 'js' | 'css' | 'asset';
  }>;
  recommendations: string[];
}

class BundleAnalyzer {
  private buildDir = '.next';
  private analysis: BundleAnalysis = {
    totalSize: 0,
    chunks: [],
    recommendations: [],
  };

  async analyze(): Promise<void> {
    console.log('🔍 Analyzing bundle with Bun...');

    try {
      // Build the project first
      await this.buildProject();

      // Analyze the build output
      await this.analyzeBuildOutput();

      // Generate recommendations
      this.generateRecommendations();

      // Display results
      this.displayResults();

    } catch (error) {
      console.error('❌ Bundle analysis failed:', error);
      process.exit(1);
    }
  }

  private async buildProject(): Promise<void> {
    console.log('🏗️  Building project...');

    // Set environment variable for analysis
    process.env.ANALYZE = 'true';

    // Build with Next.js (compatible with both Bun and Node.js)
    await exec('next build');

    console.log('✅ Build completed');
  }

  private async analyzeBuildOutput(): Promise<void> {
    console.log('📊 Analyzing build output...');

    // Analyze Next.js build output
    await this.analyzeDirectory(join(this.buildDir, 'static'));

    // Sort chunks by size
    this.analysis.chunks.sort((a, b) => b.size - a.size);
  }

  private async analyzeDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          await this.analyzeDirectory(fullPath);
        } else if (entry.isFile()) {
          await this.analyzeFile(fullPath, entry.name);
        }
      }
    } catch (error) {
      // Directory might not exist, skip silently
    }
  }

  private async analyzeFile(filePath: string, fileName: string): Promise<void> {
    try {
      const stats = await stat(filePath);
      const size = stats.size;

      let type: 'js' | 'css' | 'asset' = 'asset';

      if (fileName.endsWith('.js') || fileName.endsWith('.mjs')) {
        type = 'js';
      } else if (fileName.endsWith('.css')) {
        type = 'css';
      }

      this.analysis.chunks.push({
        name: fileName,
        size,
        type,
      });

      this.analysis.totalSize += size;
    } catch (error) {
      // File might not be accessible, skip
    }
  }

  private generateRecommendations(): void {
    const { chunks } = this.analysis;
    const recommendations: string[] = [];

    // Check for large JavaScript chunks
    const largeJsChunks = chunks.filter(c => c.type === 'js' && c.size > 500 * 1024);
    if (largeJsChunks.length > 0) {
      recommendations.push(
        `🚨 Found ${largeJsChunks.length} large JavaScript chunks (>500KB). Consider code splitting.`
      );
    }

    // Check for large CSS files
    const largeCssChunks = chunks.filter(c => c.type === 'css' && c.size > 100 * 1024);
    if (largeCssChunks.length > 0) {
      recommendations.push(
        `🎨 Found ${largeCssChunks.length} large CSS files (>100KB). Consider CSS splitting or purging.`
      );
    }

    // Check total bundle size
    const totalMB = this.analysis.totalSize / (1024 * 1024);
    if (totalMB > 5) {
      recommendations.push(
        `📦 Total bundle size is ${totalMB.toFixed(2)}MB. Consider lazy loading more components.`
      );
    }

    // Check for duplicate dependencies
    const jsChunks = chunks.filter(c => c.type === 'js');
    const vendorChunks = jsChunks.filter(c => c.name.includes('vendor') || c.name.includes('node_modules'));
    if (vendorChunks.length > 3) {
      recommendations.push(
        `🔄 Found ${vendorChunks.length} vendor chunks. Consider optimizing chunk splitting strategy.`
      );
    }

    // Performance recommendations
    if (totalMB < 2) {
      recommendations.push('✅ Bundle size is optimal for fast loading.');
    } else if (totalMB < 5) {
      recommendations.push('⚠️  Bundle size is acceptable but could be optimized.');
    } else {
      recommendations.push('❌ Bundle size is too large and will impact performance.');
    }

    this.analysis.recommendations = recommendations;
  }

  private displayResults(): void {
    console.log('\n📈 Bundle Analysis Results:');
    console.log('='.repeat(50));

    // Total size
    const totalMB = this.analysis.totalSize / (1024 * 1024);
    console.log(`📦 Total Bundle Size: ${totalMB.toFixed(2)} MB`);
    console.log(`📄 Total Files: ${this.analysis.chunks.length}`);

    // Breakdown by type
    const jsTotalSize = this.analysis.chunks
      .filter(c => c.type === 'js')
      .reduce((sum, c) => sum + c.size, 0) / (1024 * 1024);

    const cssTotalSize = this.analysis.chunks
      .filter(c => c.type === 'css')
      .reduce((sum, c) => sum + c.size, 0) / (1024 * 1024);

    const assetTotalSize = this.analysis.chunks
      .filter(c => c.type === 'asset')
      .reduce((sum, c) => sum + c.size, 0) / (1024 * 1024);

    console.log(`\n📊 Breakdown:`);
    console.log(`  JavaScript: ${jsTotalSize.toFixed(2)} MB`);
    console.log(`  CSS: ${cssTotalSize.toFixed(2)} MB`);
    console.log(`  Assets: ${assetTotalSize.toFixed(2)} MB`);

    // Top 10 largest files
    console.log(`\n🔍 Largest Files:`);
    this.analysis.chunks.slice(0, 10).forEach((chunk, index) => {
      const sizeMB = (chunk.size / (1024 * 1024)).toFixed(2);
      const icon = chunk.type === 'js' ? '📜' : chunk.type === 'css' ? '🎨' : '📎';
      console.log(`  ${index + 1}. ${icon} ${chunk.name}: ${sizeMB} MB`);
    });

    // Recommendations
    console.log(`\n💡 Recommendations:`);
    this.analysis.recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });

    // Performance score
    const performanceScore = this.calculatePerformanceScore();
    console.log(`\n⭐ Performance Score: ${performanceScore}/100`);

    // Save detailed analysis
    this.saveAnalysis();
  }

  private calculatePerformanceScore(): number {
    let score = 100;
    const totalMB = this.analysis.totalSize / (1024 * 1024);

    // Deduct points for large bundle size
    if (totalMB > 5) score -= 30;
    else if (totalMB > 3) score -= 20;
    else if (totalMB > 2) score -= 10;

    // Deduct points for large individual chunks
    const largeChunks = this.analysis.chunks.filter(c => c.size > 500 * 1024);
    score -= largeChunks.length * 5;

    // Deduct points for too many chunks
    if (this.analysis.chunks.length > 50) score -= 10;

    return Math.max(0, score);
  }

  private async saveAnalysis(): Promise<void> {
    const analysisData = {
      timestamp: new Date().toISOString(),
      ...this.analysis,
      performanceScore: this.calculatePerformanceScore(),
    };

    try {
      await writeFile('bundle-analysis.json', JSON.stringify(analysisData, null, 2));
      console.log('\n💾 Detailed analysis saved to bundle-analysis.json');
    } catch (error) {
      console.warn('⚠️  Could not save analysis file:', error);
    }
  }
}

// CLI interface
const analyzer = new BundleAnalyzer();

if (import.meta.main) {
  analyzer.analyze().catch(console.error);
}

export { BundleAnalyzer };
#!/usr/bin/env bun

/**
 * Bun-compatible build script for Next.js
 * Handles Bun-specific compatibility issues
 */

import { spawn } from "child_process";

// Helper function to execute shell commands
async function exec(command: string, options: { env?: Record<string, string> } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      env: { ...process.env, ...options.env }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

class BunBuilder {
  async build(): Promise<void> {
    console.log('🚀 Building with Bun runtime...');

    try {
      // 1. Set environment variables for Bun compatibility
      process.env.BUN_RUNTIME = 'bun';
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'production';
      }

      // 2. Disable problematic features
      process.env.NEXT_TELEMETRY_DISABLED = '1';
      process.env.TURBOPACK = '0'; // Disable Turbopack for Bun

      // 3. Clean previous builds
      console.log('🧹 Cleaning previous builds...');
      await exec('rm -rf .next out dist');

      // 4. Generate Prisma client
      console.log('🔧 Generating Prisma client...');
      await exec('bun prisma generate');

      // 5. Run Next.js build with Bun
      console.log('📦 Building Next.js application...');
      await this.buildWithBun();

      console.log('✅ Build completed successfully with Bun!');

    } catch (error) {
      console.error('❌ Build failed:', error);

      // Fallback to Node.js build
      console.log('🔄 Falling back to Node.js build...');
      await this.buildWithNode();
    }
  }

  private async buildWithBun(): Promise<void> {
    // Use Bun to run Next.js build
    try {
      await exec('bun --bun next build', {
        env: {
          BUN_RUNTIME: 'bun',
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1',
          TURBOPACK: '0'
        }
      });
    } catch (error) {
      throw new Error(`Bun build failed: ${error}`);
    }
  }

  private async buildWithNode(): Promise<void> {
    // Fallback to Node.js
    process.env.BUN_RUNTIME = '';
    await exec('npx next build');
    console.log('✅ Fallback build completed with Node.js');
  }

  async dev(): Promise<void> {
    console.log('🚀 Starting development server with Bun...');

    try {
      // Set environment variables
      process.env.BUN_RUNTIME = 'bun';
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
      }

      // Generate Prisma client
      await exec('bun prisma generate');

      // Start development server
      await exec('bun --bun next dev');

    } catch (error) {
      console.error('❌ Development server failed:', error);

      // Fallback to Node.js
      console.log('🔄 Falling back to Node.js development server...');
      await exec('npx next dev');
    }
  }

  async start(): Promise<void> {
    console.log('🚀 Starting production server with Bun...');

    try {
      process.env.BUN_RUNTIME = 'bun';
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'production';
      }

      await exec('bun --bun next start');

    } catch (error) {
      console.error('❌ Production server failed:', error);

      // Fallback to Node.js
      console.log('🔄 Falling back to Node.js production server...');
      await exec('npx next start');
    }
  }
}

// CLI interface
const builder = new BunBuilder();
const command = process.argv[2] || 'build';

switch (command) {
  case 'build':
    await builder.build();
    break;
  case 'dev':
    await builder.dev();
    break;
  case 'start':
    await builder.start();
    break;
  default:
    console.log('Usage: bun scripts/build-with-bun.ts [build|dev|start]');
    process.exit(1);
}

export { BunBuilder };
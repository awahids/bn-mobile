import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite configuration for Next.js development integration
export default defineConfig({
  plugins: [
    react({
      // Configure for Next.js compatibility
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "components"),
      "@/lib": path.resolve(__dirname, "lib"),
      "@/app": path.resolve(__dirname, "app"),
      "@/shared": path.resolve(__dirname, "shared"),
    },
  },
  build: {
    // Configure for Next.js build output
    outDir: ".next/static",
    emptyOutDir: false,
    rollupOptions: {
      external: ['next', 'react', 'react-dom'],
    },
  },
  server: {
    // Configure for Next.js dev server integration
    port: 3001, // Different port from Next.js
    cors: true,
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
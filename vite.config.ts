import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from 'vitest/config';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // Pre-compress built assets for optimal delivery (gzip + brotli)
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    ...(process.env.ANALYZE
      ? [
          visualizer({
            template: 'treemap',
            filename: 'stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      // __dirname is not available in ESM; derive it from the current module URL
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  server: {
    // Expose dev server on LAN so phones can connect via <your-ip>:5173
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    // Also expose preview server on LAN for production-like testing
    host: true,
    port: 5173,
    strictPort: true,
  },
  build: {
    // Use Terser for slightly smaller JS output; slower than esbuild
    minify: 'terser',
    rollupOptions: {
      output: {
        // Name chunks predictably and split heavy vendor groups for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // group by common, heavy ecosystems to avoid one giant vendor chunk
          if (id.includes('/react/') || id.includes('/react-dom/'))
            return 'vendor-react';
          if (id.includes('/@tanstack/')) return 'vendor-tanstack';
          if (id.includes('/@radix-ui/')) return 'vendor-radix';
          if (id.includes('/recharts/')) return 'vendor-charts';
          if (id.includes('/react-day-picker/') || id.includes('/date-fns/'))
            return 'vendor-daypicker';
          if (
            id.includes('/zod/') ||
            id.includes('/clsx/') ||
            id.includes('/tailwind-merge/')
          )
            return 'vendor-utils';
          return 'vendor';
        },
      },
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: 'no-external',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});

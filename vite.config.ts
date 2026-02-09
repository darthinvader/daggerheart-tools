import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import reactBabel from '@vitejs/plugin-react';
import reactSwc from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    // SWC is ~20x faster for dev HMR; React Compiler only matters for production
    mode === 'production'
      ? reactBabel({
          babel: {
            plugins: ['babel-plugin-react-compiler'],
          },
        })
      : reactSwc(),
    tailwindcss(),
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
    port: 4173,
    strictPort: false,
  },
  build: {
    // Use esbuild for faster builds; marginal size difference vs terser
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2022',
    // Enable CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Name chunks predictably
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Manual chunk splitting for better caching
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          zod: ['zod'],
          icons: ['lucide-react'],
          radix: ['radix-ui'],
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
}));

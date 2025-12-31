import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // Enable automatic modulepreload for faster parallel chunk loading
    {
      name: 'ensure-modulepreload',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler: html => html,
      },
    },
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
    port: 4173,
    strictPort: false,
  },
  build: {
    // Use esbuild for faster builds; marginal size difference vs terser
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'esnext',
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
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-collapsible',
          ],
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

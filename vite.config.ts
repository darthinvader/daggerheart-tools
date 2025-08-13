import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';
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
  build: {
    rollupOptions: {
      output: {
        // Disabled custom manualChunks temporarily to debug runtime error:
        // "forwardRef of undefined" seen in the vendor-radix chunk on prod hosts.
        // Hypothesis: overly aggressive splitting isolates React internals / symbol hoisting
        // order so Radix gets an incomplete namespace import when executed early.
        // If removing manualChunks fixes the issue, we can reintroduce a safer
        // strategy (e.g., only group large, self-contained libs) or rely on default.
        // manualChunks(id) {
        //   if (!id.includes('node_modules')) return undefined;
        //   if (id.includes('/react-day-picker')) return 'vendor-daypicker';
        //   if (id.includes('/recharts')) return 'vendor-recharts';
        //   if (id.includes('/@radix-ui/')) return 'vendor-radix';
        //   if (id.includes('/@tanstack/')) return 'vendor-tanstack';
        //   if (id.includes('/lucide-react')) return 'vendor-icons';
        //   if (id.includes('/cmdk')) return 'vendor-cmdk';
        //   if (id.includes('/react/')) return 'vendor-react';
        //   return 'vendor';
        // },
      },
    },
  },
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
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});

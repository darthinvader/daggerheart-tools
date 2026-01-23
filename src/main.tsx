import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  AuthProvider,
  DeviceTypeProvider,
  ThemeProvider,
} from '@/components/providers';
import { queryClient } from '@/lib/api/query-client';

import './global-error-log';
import './index.css';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  defaultPendingMs: 100, // Show pending UI after 100ms
  defaultPendingMinMs: 200, // Keep pending visible for at least 200ms to avoid flicker
});

interface AppBootInfo {
  ts: number;
  routes: string[];
}

declare global {
  interface Window {
    __APP_BOOT__?: AppBootInfo;
  }
}

// Boot diagnostics: expose a marker to confirm script executed in production
if (typeof window !== 'undefined') {
  window.__APP_BOOT__ = {
    ts: Date.now(),
    routes: Object.keys(router.routesById),
  };
  // Keep log concise; helps verify hydration
  if (import.meta.env.DEV) {
    console.info('[app] boot', window.__APP_BOOT__);
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <DeviceTypeProvider>
            <RouterProvider router={router} />
          </DeviceTypeProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

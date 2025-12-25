import { createRoot } from 'react-dom/client';

import { StrictMode } from 'react';

import { RouterProvider, createRouter } from '@tanstack/react-router';

import { DeviceTypeProvider, ThemeProvider } from '@/components/providers';

import './global-error-log';
import './index.css';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

// Boot diagnostics: expose a marker to confirm script executed in production
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__APP_BOOT__ = {
    ts: Date.now(),
    routes: Object.keys(router.routesById),
  };
  // Keep log concise; helps verify hydration
  // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
  console.log('[app] boot', (window as any).__APP_BOOT__);
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <DeviceTypeProvider>
        <RouterProvider router={router} />
      </DeviceTypeProvider>
    </ThemeProvider>
  </StrictMode>
);

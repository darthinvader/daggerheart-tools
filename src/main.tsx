import { createRoot } from 'react-dom/client';

import { StrictMode } from 'react';

import { RouterProvider, createRouter } from '@tanstack/react-router';

import { ThemeProvider } from '@/components/theme-provider';

import './index.css';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

import * as React from 'react';

import { Outlet, createRootRoute } from '@tanstack/react-router';

import { MobileNavBar } from '@/components/mobile-nav';

function RootComponent() {
  const useDevTools = false;
  const Devtools = React.useMemo(
    () =>
      import.meta.env.DEV
        ? React.lazy(async () => ({
            default: (await import('@tanstack/react-router-devtools'))
              .TanStackRouterDevtools,
          }))
        : null,
    []
  );
  return (
    <>
      <main className="pb-[calc(4rem+max(env(safe-area-inset-bottom),0px)+24px)]">
        <Outlet />
      </main>
      <MobileNavBar />
      {Devtools && useDevTools ? (
        <React.Suspense fallback={null}>
          <Devtools position="bottom-right" />
        </React.Suspense>
      ) : null}
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

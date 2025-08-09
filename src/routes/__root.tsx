import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { MobileNavBar } from '@/components/mobile-nav';

function RootComponent() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <MobileNavBar />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

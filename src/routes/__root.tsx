import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { MobileNavBar } from '@/components/mobile-nav';

function RootComponent() {
  return (
    <>
      <main className="pb-[calc(4rem+max(env(safe-area-inset-bottom),0px)+24px)]">
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

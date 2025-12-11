import { Outlet, createRootRoute } from '@tanstack/react-router';

import { Navbar } from '@/components/navbar/navbar';

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  ),
});

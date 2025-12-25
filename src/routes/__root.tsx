import { Suspense, lazy } from 'react';

import { Outlet, createRootRoute } from '@tanstack/react-router';

const Navbar = lazy(() =>
  import('@/components/navbar/navbar').then(m => ({ default: m.Navbar }))
);

function NavbarSkeleton() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
      </div>
    </header>
  );
}

export const Route = createRootRoute({
  component: () => (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  ),
});

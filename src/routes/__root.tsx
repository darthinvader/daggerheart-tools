import { createRootRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const Navbar = lazy(() =>
  import('@/components/navbar/navbar').then(m => ({ default: m.Navbar }))
);

function NavbarSkeleton() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
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
      <footer className="text-muted-foreground border-t px-4 py-3 text-center text-xs">
        <p>
          Fan-made tool for friends. I&apos;m a small creator and don&apos;t
          want to infringe on Daggerheart copyrights. For official info, visit{' '}
          <a
            href="https://www.daggerheart.com"
            className="text-foreground underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            daggerheart.com
          </a>
          .
        </p>
      </footer>
    </>
  ),
});

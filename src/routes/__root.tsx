import {
  createRootRoute,
  type ErrorComponentProps,
  Outlet,
} from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { AriaLiveAnnouncer } from '@/components/ui/aria-live-announcer';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { Toaster } from '@/components/ui/sonner';

const Navbar = lazy(() =>
  import('@/components/navbar/navbar').then(m => ({ default: m.Navbar }))
);

function NavbarSkeleton() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
      </div>
    </header>
  );
}

/**
 * Skip-to-content link for keyboard accessibility.
 * Hidden by default, becomes visible when focused.
 */
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="bg-primary text-primary-foreground focus:ring-ring fixed top-4 left-4 z-[100] -translate-y-16 rounded-md px-4 py-2 font-medium transition-transform focus:translate-y-0 focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      Skip to main content
    </a>
  );
}

export const Route = createRootRoute({
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  component: () => (
    <AriaLiveAnnouncer>
      <SkipToContent />
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Toaster position="bottom-right" richColors closeButton />
      <footer className="text-muted-foreground border-t px-4 py-3 text-center text-xs">
        <p>
          Fan-made tool for friends. I&apos;m a small creator and don&apos;t
          want to infringe on Daggerheart copyrights. For official info, visit{' '}
          <a
            href="https://www.daggerheart.com"
            className="text-foreground underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            daggerheart.com
          </a>
          .
        </p>
      </footer>
    </AriaLiveAnnouncer>
  ),
});

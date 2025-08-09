import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { MobileNavBar } from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';

function RootComponent() {
  return (
    <>
      <div className="flex items-center gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/showcase" className="[&.active]:font-bold">
          Showcase
        </Link>
        <Link to="/characters/mobile" className="[&.active]:font-bold">
          Mobile Sheet
        </Link>
        <ModeToggle />
      </div>
      <hr />
      <main className="pb-20 sm:pb-0">
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

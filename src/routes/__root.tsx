import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="mb-4 flex gap-2 border-b p-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
        <Link
          to="/demonstration"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Demonstration
        </Link>
      </div>
      <Outlet />
    </>
  ),
});

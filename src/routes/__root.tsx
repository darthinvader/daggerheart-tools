import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      {/* This is where your Layout logic will go later */}
      <Outlet />
    </>
  ),
});

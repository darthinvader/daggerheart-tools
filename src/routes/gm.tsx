import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/gm')({
  component: GmLayout,
});

function GmLayout() {
  return <Outlet />;
}

// Schedule layout route — no auth required for viewing polls
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/schedule')({
  component: () => <Outlet />,
});

import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/rules')({
  component: RulesLayout,
});

function RulesLayout() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  );
}

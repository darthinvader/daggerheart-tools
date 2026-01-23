import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/references')({
  component: ReferencesLayout,
});

function ReferencesLayout() {
  return <Outlet />;
}

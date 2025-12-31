import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/character')({
  component: CharacterLayout,
});

function CharacterLayout() {
  return <Outlet />;
}

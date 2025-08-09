import { Outlet, createFileRoute } from '@tanstack/react-router';

function CharactersLayout() {
  // Layout-only parent for /characters and its children
  return <Outlet />;
}

export const Route = createFileRoute('/characters')({
  component: CharactersLayout,
});

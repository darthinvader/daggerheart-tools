/**
 * Homebrew Layout Route
 *
 * Layout wrapper for all homebrew routes.
 */
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/homebrew')({
  component: HomebrewLayout,
});

function HomebrewLayout() {
  return <Outlet />;
}

/**
 * Homebrew Layout Route
 *
 * Layout wrapper for all homebrew routes.
 */
import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
} from '@tanstack/react-router';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { requireAuth } from '@/lib/auth';

export const Route = createFileRoute('/homebrew')({
  beforeLoad: async () => {
    await requireAuth();
  },
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  component: HomebrewLayout,
});

function HomebrewLayout() {
  return <Outlet />;
}

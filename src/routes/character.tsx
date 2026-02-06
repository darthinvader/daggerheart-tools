import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
} from '@tanstack/react-router';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { requireAuth } from '@/lib/auth';

export const Route = createFileRoute('/character')({
  beforeLoad: async () => {
    await requireAuth();
  },
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  component: CharacterLayout,
});

function CharacterLayout() {
  return <Outlet />;
}

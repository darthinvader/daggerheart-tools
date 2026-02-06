import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
} from '@tanstack/react-router';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';

export const Route = createFileRoute('/rules')({
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  component: RulesLayout,
});

function RulesLayout() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  );
}

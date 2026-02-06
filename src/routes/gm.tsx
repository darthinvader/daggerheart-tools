import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
} from '@tanstack/react-router';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { requireAuth } from '@/lib/auth';

export const Route = createFileRoute('/gm')({
  beforeLoad: async () => {
    await requireAuth();
  },
  pendingComponent: GmLoadingState,
  pendingMs: 100,
  pendingMinMs: 200,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  component: GmLayout,
});

function GmLoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-muted mb-6 h-8 w-32 animate-pulse rounded" />
      <div className="bg-muted mb-4 h-5 w-64 animate-pulse rounded" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function GmLayout() {
  return <Outlet />;
}

import {
  createFileRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';

import { ReferencePageSkeleton } from '@/components/references';

export const Route = createFileRoute('/references')({
  component: ReferencesLayout,
  pendingComponent: ReferencesLoadingState,
  pendingMs: 100, // Show skeleton after 100ms to avoid flash
  pendingMinMs: 200, // Keep skeleton visible for at least 200ms to avoid flicker
});

function ReferencesLoadingState() {
  return <ReferencePageSkeleton />;
}

function ReferencesLayout() {
  // Also show skeleton overlay during child route transitions
  const isTransitioning = useRouterState({
    select: s => s.isTransitioning,
  });

  return (
    <div className="relative">
      <Outlet />
      {/* Overlay skeleton during route transitions */}
      {isTransitioning && (
        <div className="bg-background/80 absolute inset-0 z-50 backdrop-blur-sm">
          <ReferencePageSkeleton />
        </div>
      )}
    </div>
  );
}

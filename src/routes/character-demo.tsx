import { Suspense, lazy } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { Skeleton } from '@/components/ui/skeleton';

const CharacterSheetDemo = lazy(() =>
  import('@/components/demo/character-sheet-demo').then(m => ({
    default: m.CharacterSheetDemo,
  }))
);

function DemoSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export const Route = createFileRoute('/character-demo')({
  component: CharacterDemo,
});

function CharacterDemo() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<DemoSkeleton />}>
        <CharacterSheetDemo />
      </Suspense>
    </div>
  );
}

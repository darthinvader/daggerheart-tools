import { createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const CharacterSheet = lazy(() =>
  import('@/components/character-sheet').then(m => ({
    default: m.CharacterSheet,
  }))
);

function CharacterSheetSkeleton() {
  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/character/$characterId')({
  component: CharacterPage,
});

function CharacterPage() {
  const { characterId } = Route.useParams();

  return (
    <Suspense fallback={<CharacterSheetSkeleton />}>
      <CharacterSheet characterId={characterId} />
    </Suspense>
  );
}

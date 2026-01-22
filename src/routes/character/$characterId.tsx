import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { z } from 'zod';

import { Skeleton } from '@/components/ui/skeleton';

const CharacterSheet = lazy(() =>
  import('@/components/character-sheet').then(m => ({
    default: m.CharacterSheet,
  }))
);

const characterTabValues = [
  'quick',
  'overview',
  'identity',
  'combat',
  'items',
  'session',
] as const;

export type CharacterTab = (typeof characterTabValues)[number];

const searchSchema = z.object({
  tab: z.enum(characterTabValues).catch('quick'),
});

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
  validateSearch: searchSchema,
});

function CharacterPage() {
  const { characterId } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (newTab: string) => {
      void navigate({
        to: '.',
        search: { tab: newTab as CharacterTab },
        replace: true,
      });
    },
    [navigate]
  );

  return (
    <Suspense fallback={<CharacterSheetSkeleton />}>
      <CharacterSheet
        characterId={characterId}
        activeTab={tab}
        onTabChange={handleTabChange}
      />
    </Suspense>
  );
}

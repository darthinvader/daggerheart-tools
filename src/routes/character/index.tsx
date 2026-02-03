import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus, Trash2, User, Users } from 'lucide-react';

import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import {
  CharacterCard,
  RecycleBinCard,
} from '@/features/characters/character-cards';
import {
  useCharactersQuery,
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
  useEmptyRecyclingBinMutation,
  usePermanentlyDeleteCharacterMutation,
  useRestoreCharacterMutation,
} from '@/features/characters/use-characters-query';
import type { CharacterSummary } from '@/lib/api/characters';

export const Route = createFileRoute('/character/')({
  component: CharactersPage,
});

function EmptyState({
  onCreateNew,
  isAuthenticated,
}: {
  onCreateNew: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="bg-primary/10 mb-4 flex size-16 items-center justify-center rounded-full">
        <User className="text-primary size-8" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">No Characters Yet</h2>
      {isAuthenticated ? (
        <>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first character to begin your adventure in Daggerheart.
          </p>
          <Button onClick={onCreateNew} size="lg">
            <Plus className="mr-2 size-5" />
            Create Your First Character
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-3 max-w-md">
            You are not logged in. Sign in to create and save characters.
          </p>
          <Button size="lg" disabled>
            <Plus className="mr-2 size-5" />
            Create Your First Character
          </Button>
        </>
      )}
    </div>
  );
}

function CharactersLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-muted size-12 animate-pulse rounded-xl" />
        <div className="space-y-2">
          <div className="bg-muted h-8 w-48 animate-pulse rounded" />
          <div className="bg-muted h-5 w-64 animate-pulse rounded" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-muted h-40 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function CharactersError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
          Failed to load characters
        </h2>
        <p className="mb-4 text-sm text-red-600 dark:text-red-300">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <p className="mb-4 text-sm text-red-600 dark:text-red-300">
          Make sure the JSON server is running on port 3001.
        </p>
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

function CharactersContent({
  characters,
  createErrorMessage,
  isCreating,
  isCreateError,
  isDeleting,
  isRestoring,
  isPermanentlyDeleting,
  isEmptyingBin,
  isAuthenticated,
  onCreateNew,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
}: {
  characters: CharacterSummary[] | undefined;
  createErrorMessage: string;
  isCreating: boolean;
  isCreateError: boolean;
  isDeleting: boolean;
  isRestoring: boolean;
  isPermanentlyDeleting: boolean;
  isEmptyingBin: boolean;
  isAuthenticated: boolean;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyBin: () => void;
}) {
  const activeCharacters = (characters ?? []).filter(
    character => !character.deletedAt
  );
  const deletedCharacters = (characters ?? []).filter(
    character => character.deletedAt
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-2xl font-bold">
            <Users className="text-primary mr-2 inline-block size-6" />
            My Characters
          </span>
          <p className="text-muted-foreground mt-2">
            Create and manage your Daggerheart characters
          </p>
        </div>
        {characters && characters.length > 0 && (
          <Button
            onClick={onCreateNew}
            disabled={isCreating || !isAuthenticated}
            size="lg"
          >
            <Plus className="mr-2 size-5" />
            {isCreating ? 'Creating...' : 'New Character'}
          </Button>
        )}
      </div>

      {!isAuthenticated && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          You are not logged in. Sign in to create and manage characters.
        </div>
      )}

      {isCreateError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Failed to create character. {createErrorMessage}
        </div>
      )}

      {activeCharacters.length === 0 ? (
        <EmptyState
          onCreateNew={onCreateNew}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeCharacters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {deletedCharacters.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 flex size-8 items-center justify-center rounded-lg">
                <Trash2 className="text-destructive size-4" />
              </div>
              <h2 className="text-lg font-semibold">Recycling Bin</h2>
              <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                {deletedCharacters.length} deleted
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={onEmptyBin}
              disabled={isEmptyingBin || isPermanentlyDeleting}
            >
              <Trash2 className="mr-1 size-4" />
              {isEmptyingBin ? 'Emptying...' : 'Empty Bin'}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deletedCharacters.map(character => (
              <RecycleBinCard
                key={character.id}
                character={character}
                onRestore={onRestore}
                onPermanentDelete={onPermanentDelete}
                isRestoring={isRestoring}
                isDeleting={isPermanentlyDeleting}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CharactersPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { data: characters, isLoading, error, refetch } = useCharactersQuery();
  const createMutation = useCreateCharacterMutation();
  const deleteMutation = useDeleteCharacterMutation();
  const restoreMutation = useRestoreCharacterMutation();
  const permanentDeleteMutation = usePermanentlyDeleteCharacterMutation();
  const emptyBinMutation = useEmptyRecyclingBinMutation();
  const createErrorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : 'Unknown error';

  const handleCreateNew = () => {
    if (!isAuthenticated) return;
    createMutation.mutate(undefined, {
      onSuccess: data => {
        // Navigate to the new character sheet page
        navigate({
          to: '/character/$characterId',
          params: { characterId: data.id },
          search: { tab: 'quick' },
        });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

  const handlePermanentDelete = (id: string) => {
    if (
      confirm(
        'This will permanently delete this character. This cannot be undone. Are you sure?'
      )
    ) {
      permanentDeleteMutation.mutate(id);
    }
  };

  const handleEmptyBin = () => {
    if (
      confirm(
        'This will permanently delete ALL characters in the recycling bin. This cannot be undone. Are you sure?'
      )
    ) {
      emptyBinMutation.mutate();
    }
  };

  if (isLoading) {
    return <CharactersLoading />;
  }

  if (error) {
    return <CharactersError error={error} onRetry={refetch} />;
  }

  return (
    <CharactersContent
      characters={characters}
      createErrorMessage={createErrorMessage}
      isCreating={createMutation.isPending || isAuthLoading}
      isCreateError={createMutation.isError}
      isDeleting={deleteMutation.isPending}
      isRestoring={restoreMutation.isPending}
      isPermanentlyDeleting={permanentDeleteMutation.isPending}
      isEmptyingBin={emptyBinMutation.isPending}
      isAuthenticated={isAuthenticated}
      onCreateNew={handleCreateNew}
      onDelete={handleDelete}
      onRestore={handleRestore}
      onPermanentDelete={handlePermanentDelete}
      onEmptyBin={handleEmptyBin}
    />
  );
}

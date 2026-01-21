import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Plus, Trash2, Undo2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  useCharactersQuery,
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
  useRestoreCharacterMutation,
} from '@/features/characters/use-characters-query';
import type { CharacterSummary } from '@/lib/api/characters';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/character/')({
  component: CharactersPage,
});

function CharacterCard({
  character,
  onDelete,
  isDeleting,
}: {
  character: CharacterSummary;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-card border-border hover:border-primary/50 relative rounded-lg border p-4 transition-colors',
        isDeleting && 'opacity-50'
      )}
    >
      <Link
        to="/character/$characterId"
        params={{ characterId: character.id }}
        className="block"
      >
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{character.name}</h3>
              <p className="text-muted-foreground text-sm">
                Level {character.level} {character.ancestry}{' '}
                {character.className}
                {character.subclass && ` (${character.subclass})`}
              </p>
            </div>
          </div>
        </div>
        <div className="text-muted-foreground text-xs">
          {character.community && <span>Community: {character.community}</span>}
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 absolute top-2 right-2"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(character.id);
        }}
        disabled={isDeleting}
        aria-label="Delete character"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function RecycleBinCard({
  character,
  onRestore,
  isRestoring,
}: {
  character: CharacterSummary;
  onRestore: (id: string) => void;
  isRestoring: boolean;
}) {
  return (
    <div className="bg-muted/40 border-border relative rounded-lg border p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-muted-foreground font-semibold">
              {character.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              Level {character.level} {character.ancestry} {character.className}
              {character.subclass && ` (${character.subclass})`}
            </p>
          </div>
        </div>
      </div>
      <div className="text-muted-foreground text-xs">
        {character.community && <span>Community: {character.community}</span>}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => onRestore(character.id)}
        disabled={isRestoring}
      >
        <Undo2 className="mr-1 h-4 w-4" />
        Restore
      </Button>
    </div>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <User className="text-muted-foreground h-8 w-8" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">No Characters Yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create your first character to begin your adventure in Daggerheart.
      </p>
      <Button onClick={onCreateNew} size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Create Your First Character
      </Button>
    </div>
  );
}

function CharactersPage() {
  const navigate = useNavigate();
  const { data: characters, isLoading, error, refetch } = useCharactersQuery();
  const createMutation = useCreateCharacterMutation();
  const deleteMutation = useDeleteCharacterMutation();
  const restoreMutation = useRestoreCharacterMutation();
  const createErrorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : 'Unknown error';

  const handleCreateNew = () => {
    createMutation.mutate(undefined, {
      onSuccess: data => {
        // Navigate to the new character sheet page
        navigate({
          to: '/character/$characterId',
          params: { characterId: data.id },
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

  const activeCharacters = (characters ?? []).filter(
    character => !character.deletedAt
  );
  const deletedCharacters = (characters ?? []).filter(
    character => character.deletedAt
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Characters</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <h2 className="mb-2 font-semibold text-red-800 dark:text-red-200">
            Failed to load characters
          </h2>
          <p className="mb-4 text-sm text-red-600 dark:text-red-300">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <p className="mb-4 text-sm text-red-600 dark:text-red-300">
            Make sure the JSON server is running on port 3001.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Characters</h1>
        {characters && characters.length > 0 && (
          <Button
            onClick={handleCreateNew}
            disabled={createMutation.isPending}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'New Character'}
          </Button>
        )}
      </div>

      {createMutation.isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Failed to create character. {createErrorMessage}
        </div>
      )}

      {activeCharacters.length === 0 ? (
        <EmptyState onCreateNew={handleCreateNew} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeCharacters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {deletedCharacters.length > 0 && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-lg font-semibold">
              Recycling Bin
            </h2>
            <span className="text-muted-foreground text-xs">
              {deletedCharacters.length} deleted
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deletedCharacters.map(character => (
              <RecycleBinCard
                key={character.id}
                character={character}
                onRestore={handleRestore}
                isRestoring={restoreMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

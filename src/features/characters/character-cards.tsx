import { Link } from '@tanstack/react-router';
import { Trash2, Undo2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CharacterSummary } from '@/lib/api/characters';
import { cn } from '@/lib/utils';

export function CharacterCard({
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
        search={{ tab: 'quick' }}
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

export function RecycleBinCard({
  character,
  onRestore,
  onPermanentDelete,
  isRestoring,
  isDeleting,
}: {
  character: CharacterSummary;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  isRestoring: boolean;
  isDeleting: boolean;
}) {
  const isPending = isRestoring || isDeleting;
  return (
    <div
      className={cn(
        'bg-muted/40 border-border relative rounded-lg border p-4',
        isPending && 'opacity-50'
      )}
    >
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
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestore(character.id)}
          disabled={isPending}
        >
          <Undo2 className="mr-1 h-4 w-4" />
          Restore
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          onClick={() => onPermanentDelete(character.id)}
          disabled={isPending}
          aria-label="Permanently delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { Clock, Trash2, Undo2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { CharacterSummary } from '@/lib/api/characters';
import { cn } from '@/lib/utils';

const CLASS_COLORS: Record<string, string> = {
  bard: 'border-l-violet-500',
  druid: 'border-l-green-500',
  guardian: 'border-l-sky-500',
  ranger: 'border-l-emerald-500',
  rogue: 'border-l-slate-500',
  seraph: 'border-l-amber-500',
  sorcerer: 'border-l-red-500',
  warrior: 'border-l-orange-500',
  wizard: 'border-l-indigo-500',
};

function getClassBorderColor(className: string): string {
  const key = className.toLowerCase();
  return CLASS_COLORS[key] ?? 'border-l-primary';
}

function formatRelativeTime(dateString: string | undefined): string | null {
  if (!dateString) return null;
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export function CharacterCard({
  character,
  onDelete,
  isDeleting,
}: {
  character: CharacterSummary;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const classBorder = getClassBorderColor(character.className);
  const relativeTime = formatRelativeTime(character.updatedAt);

  return (
    <div
      className={cn(
        'bg-card border-border hover:border-primary/50 group relative rounded-lg border border-l-4 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
        classBorder,
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
            <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold sm:text-base">
                {character.name}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Level {character.level} {character.ancestry}{' '}
                {character.className}
                {character.subclass && ` (${character.subclass})`}
              </p>
            </div>
          </div>
        </div>
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {character.community && <span>Community: {character.community}</span>}
          {relativeTime && (
            <span className="ml-auto flex items-center gap-1">
              <Clock className="size-3" />
              {relativeTime}
            </span>
          )}
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
        'bg-muted/40 border-border rounded-lg border p-4',
        isPending && 'opacity-50'
      )}
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-muted-foreground truncate font-semibold">
            {character.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            Level {character.level} {character.ancestry} {character.className}
            {character.subclass && ` (${character.subclass})`}
          </p>
        </div>
      </div>
      <div className="text-muted-foreground text-xs">
        {character.community && <span>Community: {character.community}</span>}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 border-t pt-3">
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

import { Pin, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { NOTE_CATEGORY_MAP } from './constants';
import type { CharacterNote } from './types';

interface NoteListItemProps {
  note: CharacterNote;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function NoteListItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  onTogglePin,
}: NoteListItemProps) {
  const category = NOTE_CATEGORY_MAP[note.category];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
      className={cn(
        'group relative cursor-pointer rounded-md border p-3 transition-colors',
        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
      )}
    >
      {note.isPinned && (
        <Pin className="absolute top-2 right-2 h-3 w-3 rotate-45 text-amber-500" />
      )}

      <div className="mb-1 flex items-start justify-between gap-2">
        <h4 className="line-clamp-1 font-medium">{note.title || 'Untitled'}</h4>
      </div>

      <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
        {note.content || 'No content...'}
      </p>

      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {category.icon} {category.label}
        </Badge>

        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={e => {
              e.stopPropagation();
              onTogglePin();
            }}
          >
            <Pin
              className={cn(
                'h-3 w-3',
                note.isPinned && 'fill-amber-500 text-amber-500'
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive h-6 w-6"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

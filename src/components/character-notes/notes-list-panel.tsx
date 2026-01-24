import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { NOTE_CATEGORIES } from './constants';
import { NoteListItem } from './note-list-item';
import type { CharacterNote, NoteCategory } from './types';

interface NotesListPanelProps {
  notes: CharacterNote[];
  selectedId: string | null;
  searchQuery: string;
  categoryFilter: NoteCategory | 'all';
  hasSelection: boolean;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: NoteCategory | 'all') => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NotesListPanel({
  notes,
  selectedId,
  searchQuery,
  categoryFilter,
  hasSelection,
  onSearchChange,
  onCategoryChange,
  onSelect,
  onAdd,
  onDelete,
  onTogglePin,
}: NotesListPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        hasSelection ? 'hidden md:flex' : 'flex',
        'md:w-1/3 md:min-w-50 md:border-r md:pr-4'
      )}
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button size="icon" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={categoryFilter}
        onValueChange={v => onCategoryChange(v as NoteCategory | 'all')}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {NOTE_CATEGORIES.map(cat => (
            <SelectItem key={cat.value} value={cat.value}>
              <cat.icon className="size-4" /> {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            {searchQuery || categoryFilter !== 'all'
              ? 'No matching notes'
              : 'No notes yet'}
          </div>
        ) : (
          notes.map(note => (
            <NoteListItem
              key={note.id}
              note={note}
              isSelected={selectedId === note.id}
              onSelect={() => onSelect(note.id)}
              onDelete={() => onDelete(note.id)}
              onTogglePin={() => onTogglePin(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

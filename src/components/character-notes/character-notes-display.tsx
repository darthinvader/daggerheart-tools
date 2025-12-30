import { ChevronLeft, FileText, Plus, Search } from 'lucide-react';

import { useState } from 'react';

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
import { NoteEditor } from './note-editor';
import { NoteListItem } from './note-list-item';
import {
  createNote,
  filterNotesByCategory,
  searchNotes,
  sortNotes,
} from './notes-utils';
import type { CharacterNote, NoteCategory } from './types';

interface CharacterNotesDisplayProps {
  notes: CharacterNote[];
  onChange: (notes: CharacterNote[]) => void;
}

export function CharacterNotesDisplay({
  notes,
  onChange,
}: CharacterNotesDisplayProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NoteCategory | 'all'>(
    'all'
  );

  const selectedNote = notes.find(n => n.id === selectedId);

  const filteredNotes = sortNotes(
    searchNotes(filterNotesByCategory(notes, categoryFilter), searchQuery)
  );

  const handleAddNote = () => {
    const newNote = createNote('New Note');
    onChange([...notes, newNote]);
    setSelectedId(newNote.id);
  };

  const handleUpdateNote = (updated: CharacterNote) => {
    onChange(notes.map(n => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNote = (id: string) => {
    onChange(notes.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleTogglePin = (id: string) => {
    onChange(
      notes.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  return (
    <div className="flex h-80 flex-col gap-4 sm:h-96 md:h-125 md:flex-row">
      {/* List Panel */}
      <div
        className={cn(
          'flex flex-col gap-3',
          selectedNote ? 'hidden md:flex' : 'flex',
          'md:w-1/3 md:min-w-50 md:border-r md:pr-4'
        )}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button size="icon" onClick={handleAddNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={categoryFilter}
          onValueChange={v => setCategoryFilter(v as NoteCategory | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {NOTE_CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
            </div>
          ) : (
            filteredNotes.map(note => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={selectedId === note.id}
                onSelect={() => setSelectedId(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
                onTogglePin={() => handleTogglePin(note.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Editor Panel */}
      <div
        className={cn(
          'flex-1',
          selectedNote ? 'flex flex-col' : 'hidden md:flex'
        )}
      >
        {selectedNote ? (
          <div className="flex h-full flex-col">
            {/* Mobile back button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedId(null)}
              className="mb-2 self-start md:hidden"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to notes
            </Button>
            <NoteEditor note={selectedNote} onChange={handleUpdateNote} />
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
            <FileText className="mb-2 h-12 w-12 opacity-50" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

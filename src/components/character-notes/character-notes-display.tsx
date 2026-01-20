import { ChevronLeft, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { NoteEditor } from './note-editor';
import { NotesListPanel } from './notes-list-panel';
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
    <section className="bg-card hover:border-primary/20 flex h-full flex-col rounded-xl border shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h3 className="text-lg font-semibold">Character Notes</h3>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:p-6">
        <NotesListPanel
          notes={filteredNotes}
          selectedId={selectedId}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          hasSelection={!!selectedNote}
          onSearchChange={setSearchQuery}
          onCategoryChange={setCategoryFilter}
          onSelect={setSelectedId}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />

        <div
          className={cn(
            'flex-1',
            selectedNote ? 'flex flex-col' : 'hidden md:flex'
          )}
        >
          {selectedNote ? (
            <div className="flex h-full flex-col">
              <div className="mb-2 flex items-center justify-between md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedId(null)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to notes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
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
    </section>
  );
}

import { generateId } from '@/lib/utils';

import type { CharacterNote, NoteCategory } from './types';

export function createNote(
  title: string,
  content: string = '',
  category: NoteCategory = 'general'
): CharacterNote {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    content,
    category,
    createdAt: now,
    updatedAt: now,
    isPinned: false,
  };
}

export function sortNotes(notes: CharacterNote[]): CharacterNote[] {
  return [...notes].sort((a, b) => {
    // Pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by updated date (newest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function filterNotesByCategory(
  notes: CharacterNote[],
  category: NoteCategory | 'all'
): CharacterNote[] {
  if (category === 'all') return notes;
  return notes.filter(n => n.category === category);
}

export function searchNotes(
  notes: CharacterNote[],
  query: string
): CharacterNote[] {
  if (!query.trim()) return notes;
  const lowerQuery = query.toLowerCase();
  return notes.filter(
    n =>
      n.title.toLowerCase().includes(lowerQuery) ||
      n.content.toLowerCase().includes(lowerQuery)
  );
}

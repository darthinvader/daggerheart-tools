export interface CharacterNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export type NoteCategory =
  | 'general'
  | 'session'
  | 'npc'
  | 'location'
  | 'quest'
  | 'lore';

export interface CharacterNotesState {
  notes: CharacterNote[];
  selectedNoteId: string | null;
}

import type { NoteCategory } from './types';

export const NOTE_CATEGORIES: {
  value: NoteCategory;
  label: string;
  icon: string;
}[] = [
  { value: 'general', label: 'General', icon: '📝' },
  { value: 'session', label: 'Session', icon: '📅' },
  { value: 'npc', label: 'NPC', icon: '👤' },
  { value: 'location', label: 'Location', icon: '🗺️' },
  { value: 'quest', label: 'Quest', icon: '⚔️' },
  { value: 'lore', label: 'Lore', icon: '📚' },
];

export const NOTE_CATEGORY_MAP = Object.fromEntries(
  NOTE_CATEGORIES.map(c => [c.value, c])
) as Record<NoteCategory, (typeof NOTE_CATEGORIES)[number]>;

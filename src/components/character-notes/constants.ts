import type { LucideIcon } from 'lucide-react';

import { NoteCategoryIcons } from '@/lib/icons';

import type { NoteCategory } from './types';

export const NOTE_CATEGORIES: {
  value: NoteCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: 'general', label: 'General', icon: NoteCategoryIcons.general },
  { value: 'session', label: 'Session', icon: NoteCategoryIcons.session },
  { value: 'npc', label: 'NPC', icon: NoteCategoryIcons.npc },
  { value: 'location', label: 'Location', icon: NoteCategoryIcons.location },
  { value: 'quest', label: 'Quest', icon: NoteCategoryIcons.quest },
  { value: 'lore', label: 'Lore', icon: NoteCategoryIcons.lore },
];

export const NOTE_CATEGORY_MAP = Object.fromEntries(
  NOTE_CATEGORIES.map(c => [c.value, c])
) as Record<NoteCategory, (typeof NOTE_CATEGORIES)[number]>;

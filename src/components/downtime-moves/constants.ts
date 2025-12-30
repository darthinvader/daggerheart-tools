import type { DowntimeCategory, DowntimeMove } from './types';

export const DOWNTIME_CATEGORIES: {
  value: DowntimeCategory;
  label: string;
  icon: string;
}[] = [
  { value: 'recovery', label: 'Recovery', icon: '❤️‍🩹' },
  { value: 'crafting', label: 'Crafting', icon: '🔨' },
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'exploration', label: 'Exploration', icon: '🔍' },
  { value: 'training', label: 'Training', icon: '💪' },
];

export const STANDARD_DOWNTIME_MOVES: DowntimeMove[] = [
  {
    id: 'rest-recover',
    name: 'Rest and Recover',
    description:
      'Take time to heal wounds and clear stress. Recover additional HP equal to your Proficiency and clear 1 additional Stress.',
    category: 'recovery',
    defaultHoursRequired: 4,
  },
  {
    id: 'craft-item',
    name: 'Craft an Item',
    description:
      'Spend time creating equipment, potions, or other useful items using appropriate materials and skills.',
    category: 'crafting',
    defaultHoursRequired: 8,
  },
  {
    id: 'gather-information',
    name: 'Gather Information',
    description:
      'Speak with locals, research in libraries, or otherwise learn about the area, people, or upcoming challenges.',
    category: 'social',
    defaultHoursRequired: 2,
  },
  {
    id: 'make-connections',
    name: 'Make Connections',
    description:
      'Build relationships with NPCs, join organizations, or establish useful contacts for future adventures.',
    category: 'social',
    defaultHoursRequired: 4,
  },
  {
    id: 'explore-area',
    name: 'Explore the Area',
    description:
      'Scout the surroundings, map locations, or discover hidden places of interest.',
    category: 'exploration',
    defaultHoursRequired: 4,
  },
  {
    id: 'train-skill',
    name: 'Train a Skill',
    description:
      'Practice combat techniques, study magic, or otherwise improve your abilities through dedicated training.',
    category: 'training',
    defaultHoursRequired: 8,
  },
  {
    id: 'work-for-gold',
    name: 'Work for Gold',
    description:
      'Take on odd jobs or use your skills to earn gold during downtime.',
    category: 'social',
    defaultHoursRequired: 8,
  },
  {
    id: 'tend-wounds',
    name: 'Tend to Wounds',
    description:
      'Use medical knowledge or magic to help heal yourself or allies more effectively.',
    category: 'recovery',
    defaultHoursRequired: 2,
  },
];

export const DOWNTIME_CATEGORY_MAP = Object.fromEntries(
  DOWNTIME_CATEGORIES.map(c => [c.value, c])
) as Record<DowntimeCategory, (typeof DOWNTIME_CATEGORIES)[number]>;

import type { MulticlassConfig } from './types';

// Maximum total level is 10, split between classes
export const MAX_TOTAL_LEVEL = 10;
export const MIN_PRIMARY_LEVEL = 1;
export const MIN_SECONDARY_LEVEL = 1;

// Classes available for multiclassing
export const AVAILABLE_CLASSES = [
  'Bard',
  'Druid',
  'Guardian',
  'Ranger',
  'Rogue',
  'Seraph',
  'Sorcerer',
  'Warrior',
  'Wizard',
] as const;

export const DEFAULT_MULTICLASS_CONFIG: MulticlassConfig = {
  primaryClass: 'Warrior',
  secondaryClass: null,
  primaryLevel: 1,
  secondaryLevel: 0,
};

export const MULTICLASS_RULES = [
  'You can multiclass starting at level 2',
  'Primary class must be at least level 1',
  'Secondary class must be at least level 1 (if taken)',
  'Total level cannot exceed 10',
  'You gain the Foundation feature of your secondary class',
  'You can take cards from either class when leveling up',
];

import type {
  CompanionDamageDie,
  CompanionExperience,
  CompanionRange,
  CompanionTraining,
  RangerCompanion,
} from '@/lib/schemas/core';

// Default training state
export const DEFAULT_TRAINING: CompanionTraining = {
  intelligent: 0,
  lightInTheDark: false,
  creatureComfort: false,
  armored: false,
  vicious: 0,
  resilient: 0,
  bonded: false,
  aware: 0,
};

// Runtime companion state - training is required (with defaults applied)
export interface CompanionState extends Omit<RangerCompanion, 'training'> {
  training: CompanionTraining;
  // Runtime state - which stress slots are marked
  markedStress: number;
}

export const DEFAULT_COMPANION_STATE: CompanionState = {
  name: '',
  type: '',
  evasion: 10,
  experiences: [
    { name: '', bonus: 2 },
    { name: '', bonus: 2 },
  ],
  standardAttack: '',
  damageDie: 'd6',
  range: 'Melee',
  stressSlots: 2,
  training: DEFAULT_TRAINING,
  markedStress: 0,
};

export const EXAMPLE_EXPERIENCES = [
  'Ambusher',
  'Climber',
  'Fetcher',
  'Guardian',
  'Keen Senses',
  'Loyal Companion',
  'Mount',
  'Nimble',
  'Scout',
  'Stealthy',
  'Tracker',
  'Waterborne',
];

export type {
  CompanionDamageDie,
  CompanionExperience,
  CompanionRange,
  CompanionTraining,
  RangerCompanion,
};

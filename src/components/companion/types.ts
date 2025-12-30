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
  'Bold Distraction',
  'Expert Climber',
  'Fetch',
  'Friendly',
  'Guardian of the Forest',
  'Horrifying',
  'Intimidating',
  'Loyal Until the End',
  'Navigation',
  'Nimble',
  'Nobody Left Behind',
  'On High Alert',
  'Protective',
  'Royal Companion',
  'Scout',
  'Service Animal',
  'Trusted Mount',
  'Vigilant',
  'We Always Find Them',
  "You Can't Hit What You Can't Find",
];

export type {
  CompanionDamageDie,
  CompanionExperience,
  CompanionRange,
  CompanionTraining,
  RangerCompanion,
};

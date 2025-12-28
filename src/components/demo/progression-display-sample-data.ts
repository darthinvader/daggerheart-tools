export interface ProgressionState {
  currentLevel: number;
  currentTier: string;
  tierHistory: Record<string, number>;
  lifetimeHistory: Record<string, number>;
  experience?: number;
  experienceToNext?: number;
}

export const SAMPLE_NOVICE: ProgressionState = {
  currentLevel: 1,
  currentTier: '1',
  tierHistory: { '1': 0 },
  lifetimeHistory: { '1': 0 },
  experience: 150,
  experienceToNext: 300,
};

export const SAMPLE_ADVENTURER: ProgressionState = {
  currentLevel: 3,
  currentTier: '2-4',
  tierHistory: { '1': 1, '2-4': 2 },
  lifetimeHistory: { '1': 1, '2-4': 2 },
  experience: 800,
  experienceToNext: 1000,
};

export const SAMPLE_VETERAN: ProgressionState = {
  currentLevel: 6,
  currentTier: '5-7',
  tierHistory: { '1': 1, '2-4': 3, '5-7': 2 },
  lifetimeHistory: { '1': 1, '2-4': 3, '5-7': 2 },
  experience: 2400,
  experienceToNext: 3000,
};

export const SAMPLE_LEGEND: ProgressionState = {
  currentLevel: 9,
  currentTier: '8-10',
  tierHistory: { '1': 1, '2-4': 3, '5-7': 3, '8-10': 2 },
  lifetimeHistory: { '1': 1, '2-4': 3, '5-7': 3, '8-10': 2 },
  experience: 5500,
  experienceToNext: 6000,
};

export const SAMPLE_READY_TO_LEVEL: ProgressionState = {
  currentLevel: 2,
  currentTier: '2-4',
  tierHistory: { '1': 1, '2-4': 1 },
  lifetimeHistory: { '1': 1, '2-4': 1 },
  experience: 500,
  experienceToNext: 500,
};

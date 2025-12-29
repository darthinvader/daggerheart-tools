export interface ProgressionState {
  currentLevel: number;
  currentTier: string;
  tierHistory: Record<string, number>;
  experience?: number;
  experienceToNext?: number;
}

export const SAMPLE_NOVICE: ProgressionState = {
  currentLevel: 1,
  currentTier: '1',
  tierHistory: {},
  experience: 150,
  experienceToNext: 300,
};

export const SAMPLE_ADVENTURER: ProgressionState = {
  currentLevel: 3,
  currentTier: '2-4',
  tierHistory: { traits: 2 },
  experience: 800,
  experienceToNext: 1000,
};

export const SAMPLE_VETERAN: ProgressionState = {
  currentLevel: 6,
  currentTier: '5-7',
  tierHistory: { traits: 2, hp: 1 },
  experience: 2400,
  experienceToNext: 3000,
};

export const SAMPLE_LEGEND: ProgressionState = {
  currentLevel: 9,
  currentTier: '8-10',
  tierHistory: { traits: 2, subclass: 1 },
  experience: 5500,
  experienceToNext: 6000,
};

export const SAMPLE_READY_TO_LEVEL: ProgressionState = {
  currentLevel: 2,
  currentTier: '2-4',
  tierHistory: { traits: 1 },
  experience: 500,
  experienceToNext: 500,
};

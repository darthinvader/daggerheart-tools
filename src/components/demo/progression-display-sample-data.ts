export interface ProgressionState {
  currentLevel: number;
  currentTier: string;
  experience?: number;
  experienceToNext?: number;
}

export const SAMPLE_NOVICE: ProgressionState = {
  currentLevel: 1,
  currentTier: '1',
  experience: 150,
  experienceToNext: 300,
};

export const SAMPLE_ADVENTURER: ProgressionState = {
  currentLevel: 3,
  currentTier: '2-4',
  experience: 800,
  experienceToNext: 1000,
};

export const SAMPLE_VETERAN: ProgressionState = {
  currentLevel: 6,
  currentTier: '5-7',
  experience: 2400,
  experienceToNext: 3000,
};

export const SAMPLE_LEGEND: ProgressionState = {
  currentLevel: 9,
  currentTier: '8-10',
  experience: 5500,
  experienceToNext: 6000,
};

export const SAMPLE_READY_TO_LEVEL: ProgressionState = {
  currentLevel: 2,
  currentTier: '2-4',
  experience: 500,
  experienceToNext: 500,
};

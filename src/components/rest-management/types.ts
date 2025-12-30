export type RestType = 'short' | 'long';

export interface RestState {
  lastShortRest: string | null;
  lastLongRest: string | null;
  shortRestsToday: number;
}

export interface RestEffects {
  hopeRecovered: number;
  stressCleared: number;
  armorRepaired: number;
  hpRecovered: number;
  downtime: boolean;
}

export interface CharacterResources {
  hope: { current: number; max: number };
  stress: { current: number; max: number };
  hp: { current: number; max: number };
  armor: { current: number; max: number };
}

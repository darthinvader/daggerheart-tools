import { z } from 'zod';

export const DeathMoveTypeSchema = z.enum([
  'blaze_of_glory',
  'avoid_death',
  'risk_it_all',
]);
export type DeathMoveType = z.infer<typeof DeathMoveTypeSchema>;

export interface DeathMoveResult {
  moveType: DeathMoveType;
  survived: boolean;
  gainedScar: boolean;
  hopeDieRoll?: number;
  fearDieRoll?: number;
  hpCleared?: number;
  stressCleared?: number;
  description?: string;
}

export interface DeathMoveState {
  isUnconscious: boolean;
  deathMovePending: boolean;
  lastDeathMoveResult?: DeathMoveResult;
}

export const DEFAULT_DEATH_MOVE_STATE: DeathMoveState = {
  isUnconscious: false,
  deathMovePending: false,
};

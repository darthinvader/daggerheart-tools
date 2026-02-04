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
  /**
   * For Risk It All non-critical success: total value player can divide between HP and Stress.
   * Per SRD: "divide the Hope Die value between Hit Points and Stress however you'd prefer"
   */
  clearingValue?: number;
  /** Whether player needs to allocate clearingValue between HP and Stress */
  needsAllocation?: boolean;
  description?: string;
}

export interface DeathMoveState {
  isUnconscious: boolean;
  deathMovePending: boolean;
  isDead: boolean;
  lastDeathMoveResult?: DeathMoveResult;
}

export const DEFAULT_DEATH_MOVE_STATE: DeathMoveState = {
  isUnconscious: false,
  deathMovePending: false,
  isDead: false,
};

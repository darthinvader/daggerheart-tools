/**
 * Types for the SRD-compliant rest system.
 * Per SRD: Each PC can make up to 2 downtime moves during a rest.
 * Short rest: 1d4+Tier recovery moves
 * Long rest: Full recovery moves
 */

/** Type of rest being taken */
export type RestType = 'short' | 'long';

/** Categories of rest moves */
export type RestMoveCategory =
  | 'healing'
  | 'stress'
  | 'armor'
  | 'hope'
  | 'project';

/** A rest move that can be selected */
export interface RestMove {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description shown to user */
  description: string;
  /** What resource this affects */
  category: RestMoveCategory;
  /** Is this available in short rest? */
  shortRest: boolean;
  /** Is this available in long rest? */
  longRest: boolean;
  /** Whether this is a full clear (long rest) vs dice roll (short rest) */
  isFullClear: boolean;
  /** Whether this can target allies */
  canTargetAlly: boolean;
}

/**
 * Fear gain result from rest.
 * Per Daggerheart Chapter 3:
 * - Short Rest: GM gains 1d4 Fear
 * - Long Rest: GM gains (number of PCs + 1d4) Fear
 */
export interface FearGainResult {
  /** The d4 dice roll result */
  diceRoll: number;
  /** Party size bonus (only for long rest) */
  partyBonus: number;
  /** Total Fear gained */
  total: number;
  /** Type of rest that triggered the Fear gain */
  restType: RestType;
}

/** Result of executing a single rest move */
export interface RestMoveResult {
  /** The move that was executed */
  moveId: string;
  /** Display name of the move */
  moveName: string;
  /** Dice roll result (for short rest, 1d4) */
  diceRoll?: number;
  /** Tier bonus applied */
  tierBonus?: number;
  /** Total amount recovered/gained */
  amount: number;
  /** Whether this was a full clear */
  isFullClear: boolean;
  /** Target of the move (self or ally name) */
  target: string;
}

/** State of rest move selection */
export interface RestMoveSelection {
  /** First selected move */
  move1: RestMove | null;
  /** Second selected move */
  move2: RestMove | null;
  /** Target for move 1 (for ally-targetable moves) */
  target1: string;
  /** Target for move 2 */
  target2: string;
}

/** Full result of a rest */
export interface RestResult {
  /** Type of rest taken */
  restType: RestType;
  /** Results of each move */
  moveResults: RestMoveResult[];
  /** Timestamp */
  timestamp: string;
  /**
   * Fear gained by GM from this rest (optional, for GM tracking).
   * Per Chapter 3: Short Rest = 1d4, Long Rest = PCs + 1d4
   */
  fearGain?: FearGainResult;
}

/** Tracks when character last rested */
export interface RestState {
  /** ISO timestamp of last short rest */
  lastShortRest: string | null;
  /** ISO timestamp of last long rest */
  lastLongRest: string | null;
  /** Number of short rests today (resets on long rest) */
  shortRestsToday: number;
  /** Whether Tag Team has been used this session (resets on new session) */
  tagTeamUsedThisSession?: boolean;
}

/** Props for rest modal */
export interface RestModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Character's current tier (1-4) */
  tier: number;
  /** Character's current HP (for display) */
  currentHp: number;
  /** Character's max HP */
  maxHp: number;
  /** Character's current stress */
  currentStress: number;
  /** Character's max stress */
  maxStress: number;
  /** Character's current armor slots marked */
  currentArmorMarked: number;
  /** Character's total armor slots */
  totalArmorSlots: number;
  /** Callback when rest is completed with results */
  onRestComplete: (result: RestResult) => void;
  /** Whether user is doing "Prepare" with party members */
  preparingWithParty?: boolean;
  /** Number of short rests taken today (for 3-short-rest limit per SRD) */
  shortRestsToday?: number;
  /**
   * Number of PCs in the party (for Fear gain calculation).
   * Per Chapter 3: Long Rest Fear gain = partySize + 1d4
   */
  partySize?: number;
  /**
   * Whether to show and calculate Fear gain for GM.
   * When true, Fear gain will be calculated and shown in results.
   */
  showFearGain?: boolean;
  /** Current active effects on the character */
  activeEffects?: import('@/lib/schemas/equipment').ActiveEffect[];
  /** Callback when active effects change (e.g., cleared on rest) */
  onActiveEffectsChange?: (
    effects: import('@/lib/schemas/equipment').ActiveEffect[]
  ) => void;
}

import type { ConditionsState } from '@/components/conditions';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

export type TrackerKind = 'character' | 'adversary' | 'environment';

/** Domain card summary for battle tracker display */
export type BattleCard = {
  name: string;
  level: number;
  domain: string;
  type: string;
  description: string;
  hopeCost?: number;
  recallCost?: number;
  stressCost?: number;
};

export type CharacterTracker = {
  id: string;
  kind: 'character';
  name: string;
  evasion: number | null;
  hp: { current: number; max: number };
  stress: { current: number; max: number };
  conditions: ConditionsState;
  notes: string;
  /** ID of the source character if added from campaign */
  sourceCharacterId?: string;
  /** Character's class name */
  className?: string;
  /** Character's subclass name */
  subclassName?: string;
  /** Active domain cards in loadout */
  loadout?: BattleCard[];
  /** Armor score if available */
  armorScore?: number;
  /** Damage thresholds */
  thresholds?: {
    major: number;
    severe: number;
    massive?: number;
  };
  /** Whether to use massive threshold for this character */
  useMassiveThreshold?: boolean;
  /**
   * If true, this character is linked to a player's live character.
   * Stats are read-only (HP, stress, conditions sync from player).
   * DM can only edit notes.
   */
  isLinkedCharacter?: boolean;

  // Extended identity fields
  ancestry?: string;
  community?: string;
  pronouns?: string;

  // Character level & progression
  level?: number;
  tier?: number;
  proficiency?: number;

  // Resources
  hope?: { current: number; max: number };
  armorSlots?: { current: number; max: number };
  gold?: number;

  // Experiences (XP items)
  experiences?: Array<{ id: string; name: string; value: number }>;

  // Equipment summary
  primaryWeapon?: string;
  secondaryWeapon?: string;
  armor?: string;

  // Equipment details (for full display)
  equipment?: {
    primary?: {
      name: string;
      damage: string;
      range: string;
      traits?: string[];
      features?: string[];
    };
    secondary?: {
      name: string;
      damage?: string;
      range?: string;
      traits?: string[];
      features?: string[];
    };
    armor?: {
      name: string;
      feature?: string;
      features?: string[];
      thresholds?: { major: number; severe: number };
    };
  };

  // Core scores (6 stats)
  coreScores?: {
    agility?: number;
    strength?: number;
    finesse?: number;
    instinct?: number;
    presence?: number;
    knowledge?: number;
  };

  // Traits (mapped by trait name)
  traits?: Record<string, { value: number; bonus: number; marked: boolean }>;

  // Inventory items (stash)
  inventory?: Array<{
    name: string;
    quantity: number;
    tier?: string;
    description?: string;
    category?: string;
    features?: Array<{ name: string; description: string }>;
  }>;

  // Vault cards (stored domain cards)
  vaultCards?: BattleCard[];
};

export type AdversaryAttackOverride = {
  name?: string;
  modifier?: string | number;
  range?: string;
  damage?: string;
};

export type AdversaryThresholdsOverride = {
  major?: number | null;
  severe?: number | null;
  massive?: number | null;
};

export type AdversaryFeatureOverride = {
  id: string;
  name: string;
  type?: string;
  description: string;
  isCustom?: boolean;
};

export type AdversaryTracker = {
  id: string;
  kind: 'adversary';
  source: Adversary;
  hp: { current: number; max: number };
  stress: { current: number; max: number };
  conditions: ConditionsState;
  notes: string;
  difficultyOverride?: number;
  attackOverride?: AdversaryAttackOverride;
  thresholdsOverride?: AdversaryThresholdsOverride;
  featuresOverride?: AdversaryFeatureOverride[];
  lastAttackRoll?: { roll: number; total: number; timestamp: number };
  lastDamageRoll?: {
    dice: string;
    rolls: number[];
    total: number;
    timestamp: number;
  };
  /** Countdown tracker for adversary events */
  countdown?: number;
  /** Whether countdown is enabled (can be ticked down) */
  countdownEnabled?: boolean;
};

export type EnvironmentFeatureEntry = {
  id: string;
  name: string;
  description: string;
  type?: string;
  active: boolean;
};

export type EnvironmentTracker = {
  id: string;
  kind: 'environment';
  source: Environment;
  notes: string;
  features: EnvironmentFeatureEntry[];
  countdown?: number;
  /** Whether countdown is enabled (can be ticked down) */
  countdownEnabled?: boolean;
};

export type TrackerItem =
  | CharacterTracker
  | AdversaryTracker
  | EnvironmentTracker;

export type TrackerSelection = {
  kind: TrackerKind;
  id: string;
};

/** Extended spotlight history entry with timestamp and round info */
export type SpotlightHistoryEntry = {
  selection: TrackerSelection;
  timestamp: number;
  round?: number;
  entityName: string;
};

/** Roll history entry for tracking attack/damage rolls */
export type RollHistoryEntry = {
  id: string;
  type: 'attack' | 'damage';
  entityId: string;
  entityName: string;
  entityKind: TrackerKind;
  roll: number;
  total: number;
  dice: string;
  rolls?: number[];
  modifier?: string | number;
  isCritical?: boolean;
  isFumble?: boolean;
  timestamp: number;
  round?: number;
};

export type NewCharacterDraft = {
  name: string;
  evasion: string;
  hpMax: string;
  stressMax: string;
};

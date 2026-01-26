import type { ConditionsState } from '@/components/conditions';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

export type TrackerKind = 'character' | 'adversary' | 'environment';

export type CharacterTracker = {
  id: string;
  kind: 'character';
  name: string;
  evasion: number | null;
  hp: { current: number; max: number };
  stress: { current: number; max: number };
  conditions: ConditionsState;
  notes: string;
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
};

export type TrackerItem =
  | CharacterTracker
  | AdversaryTracker
  | EnvironmentTracker;

export type TrackerSelection = {
  kind: TrackerKind;
  id: string;
};

export type NewCharacterDraft = {
  name: string;
  evasion: string;
  hpMax: string;
  stressMax: string;
};

import type { Store } from '@tanstack/react-store';

import type {
  ConditionsDraft,
  CustomFeatures,
  ExperiencesDraft,
  ResourcesDraft,
  ThresholdsSettings,
  TraitsDraft,
} from '@/lib/schemas/character-state';

import type { ClassDraft } from '../class-storage';
import type { DomainsDraft } from '../domains-storage';
import type { EquipmentDraft } from '../equipment-storage';
import type { FeatureSelections } from '../features-storage';
import type { IdentityDraft } from '../identity-storage';
import type { InventoryDraft } from '../inventory-storage';
import type {
  CharacterProgressionDraft,
  LevelUpEntry,
} from '../progression-storage';

export interface CharacterState {
  id: string;
  identity: IdentityDraft;
  classDraft: ClassDraft;
  domains: DomainsDraft;
  equipment: EquipmentDraft;
  inventory: InventoryDraft;
  progression: CharacterProgressionDraft;
  resources: ResourcesDraft;
  traits: TraitsDraft;
  conditions: ConditionsDraft;
  features: FeatureSelections;
  customFeatures: CustomFeatures;
  thresholds: ThresholdsSettings | null;
  leveling: LevelUpEntry[];
  experience: number;
  experiences: ExperiencesDraft;
}

export type CharacterStore = Store<CharacterState>;

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

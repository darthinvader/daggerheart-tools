import {
  DEFAULT_DOMAINS,
  type DomainsDraft,
} from '@/features/characters/domains-storage';
import {
  DEFAULT_DESCRIPTION_DETAILS,
  DEFAULT_TRAITS,
} from '@/lib/schemas/character-state';
import { DEFAULT_CLASS_DRAFT } from '@/lib/schemas/class-selection';
import { DEFAULT_QUICK_VIEW_PREFERENCES } from '@/lib/schemas/quick-view';

import type { CharacterRecord } from './characters';

// Empty defaults for new characters
export const EMPTY_IDENTITY: CharacterRecord['identity'] = {
  name: 'New Character',
  pronouns: '',
  ancestry: '',
  community: '',
  description: '',
  calling: '',
  ancestryDetails: undefined,
  communityDetails: undefined,
  background: undefined,
  descriptionDetails: DEFAULT_DESCRIPTION_DETAILS,
  connections: [],
};

export const EMPTY_EQUIPMENT: CharacterRecord['equipment'] = {
  primaryWeapon: undefined,
  secondaryWeapon: undefined,
  armor: undefined,
  items: [],
  consumables: {},
};

export const EMPTY_INVENTORY: CharacterRecord['inventory'] = {
  slots: [],
  maxItems: 50,
  weightCapacity: undefined,
  currentWeight: 0,
  metadata: {},
};

export const EMPTY_RESOURCES: CharacterRecord['resources'] = {
  hp: { current: 6, max: 6 },
  stress: { current: 0, max: 6 },
  evasion: 10,
  hope: { current: 2, max: 6 },
  proficiency: 1,
  armorScore: { current: 0, max: 0 },
  gold: {
    handfuls: 0,
    bags: 0,
    chests: 0,
    coins: 0,
    showCoins: false,
    displayDenomination: 'handfuls',
  },
  autoCalculateHp: true,
  autoCalculateEvasion: true,
  autoCalculateArmorScore: true,
  autoCalculateThresholds: true,
};

export const EMPTY_PROGRESSION = {
  currentLevel: 1,
  currentTier: '1',
  availablePoints: 2,
  spentOptions: {},
};

export function createDefaultCharacter(id: string): CharacterRecord {
  const now = new Date().toISOString();
  return {
    id,
    isNewCharacter: true,
    identity: EMPTY_IDENTITY,
    classDraft: DEFAULT_CLASS_DRAFT,
    domains: DEFAULT_DOMAINS as DomainsDraft,
    equipment: EMPTY_EQUIPMENT,
    inventory: EMPTY_INVENTORY,
    progression: EMPTY_PROGRESSION,
    resources: EMPTY_RESOURCES,
    traits: DEFAULT_TRAITS,
    conditions: [],
    features: {},
    customFeatures: [],
    thresholds: null,
    leveling: [],
    experience: 0,
    experiences: { items: [] },
    companion: null,
    companionEnabled: false,
    scars: [],
    countdowns: [],
    sessions: [],
    currentSessionId: null,
    notes: [],
    downtimeActivities: [],
    quickView: DEFAULT_QUICK_VIEW_PREFERENCES,
    createdAt: now,
    updatedAt: now,
  };
}

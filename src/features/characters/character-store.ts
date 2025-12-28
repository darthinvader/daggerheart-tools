import { z } from 'zod';

import { Store } from '@tanstack/react-store';

import {
  ConditionsSchema,
  CustomFeaturesSchema,
  DEFAULT_RESOURCES,
  DEFAULT_TRAITS,
  ExperiencesSchema,
  LevelUpEntrySchema,
  ResourcesSchema,
  ThresholdsSettingsSchema,
  TraitStateSchema,
} from '@/lib/schemas/character-state';
import {
  CharacterProgressionSchema,
  getTierForLevel,
} from '@/lib/schemas/core';
import {
  EquipmentLoadoutSchema,
  InventorySchema,
} from '@/lib/schemas/equipment';
import { characterKeys as keys, storage } from '@/lib/storage';

import type { CharacterState } from './character-actions';
import { ClassDraftSchema, DEFAULT_CLASS } from './class-storage';
import { DEFAULT_DOMAINS, DomainsDraftSchema } from './domains-storage';
import { DEFAULT_EQUIPMENT } from './equipment-storage';
import { DEFAULT_IDENTITY, IdentityDraftSchema } from './identity-storage';
import { DEFAULT_INVENTORY } from './inventory-storage';

export { characterActions } from './character-actions';
export type { CharacterState, CharacterStore } from './character-actions';

const DEFAULT_PROGRESSION: CharacterState['progression'] = {
  currentLevel: 1,
  currentTier: '1',
  availablePoints: 2,
  spentOptions: {},
};

function createDefaultState(id: string): CharacterState {
  return {
    id,
    identity: DEFAULT_IDENTITY,
    classDraft: DEFAULT_CLASS,
    domains: DEFAULT_DOMAINS,
    equipment: DEFAULT_EQUIPMENT,
    inventory: DEFAULT_INVENTORY,
    progression: DEFAULT_PROGRESSION,
    resources: DEFAULT_RESOURCES,
    traits: DEFAULT_TRAITS,
    conditions: [],
    features: {},
    customFeatures: [],
    thresholds: null,
    leveling: [],
    experience: 0,
    experiences: [],
  };
}

function hydrateIdentity(id: string, state: CharacterState): void {
  try {
    state.identity = storage.read(
      keys.identity(id),
      DEFAULT_IDENTITY,
      IdentityDraftSchema
    );
  } catch {
    /* keep default */
  }
}

function hydrateClass(id: string, state: CharacterState): void {
  try {
    state.classDraft = storage.read(
      keys.class(id),
      DEFAULT_CLASS,
      ClassDraftSchema
    );
  } catch {
    /* keep default */
  }
}

function hydrateDomains(id: string, state: CharacterState): void {
  try {
    const raw = storage.read(keys.domains(id), DEFAULT_DOMAINS);
    state.domains = DomainsDraftSchema.parse(raw);
  } catch {
    /* keep default */
  }
}

function hydrateEquipment(id: string, state: CharacterState): void {
  try {
    state.equipment = storage.read(
      keys.equipment(id),
      DEFAULT_EQUIPMENT,
      EquipmentLoadoutSchema
    );
  } catch {
    /* keep default */
  }
}

function hydrateInventory(id: string, state: CharacterState): void {
  try {
    state.inventory = storage.read(
      keys.inventory(id),
      DEFAULT_INVENTORY,
      InventorySchema
    );
  } catch {
    /* keep default */
  }
}

function hydrateProgression(id: string, state: CharacterState): void {
  try {
    const level = storage.read<number>(keys.level(id), 1);
    const fallback = {
      currentLevel: level,
      currentTier: getTierForLevel(level),
      availablePoints: 2,
      spentOptions: {},
    };
    const raw = storage.read(keys.progression(id), fallback);
    const parsed = CharacterProgressionSchema.parse(raw);
    state.progression = {
      currentLevel: parsed.currentLevel,
      currentTier: parsed.currentTier,
      availablePoints: parsed.availablePoints,
      spentOptions: parsed.spentOptions,
    };
  } catch {
    /* keep default */
  }
}

function hydrateResources(id: string, state: CharacterState): void {
  try {
    const raw = storage.read<unknown>(keys.resources(id), DEFAULT_RESOURCES);
    const hasNumberHope = (
      v: unknown
    ): v is { hope: number } & Record<string, unknown> =>
      typeof (v as { hope?: unknown }).hope === 'number';
    let normalized: unknown = raw;
    if (hasNumberHope(raw)) {
      const { hope, ...rest } = raw;
      normalized = { ...rest, hope: { current: hope, max: 6 } };
    }
    state.resources = ResourcesSchema.parse(normalized);
  } catch {
    /* keep default */
  }
}

function hydrateTraits(id: string, state: CharacterState): void {
  try {
    const schema = z.record(z.string(), TraitStateSchema);
    state.traits = storage.read(keys.traits(id), DEFAULT_TRAITS, schema);
  } catch {
    /* keep default */
  }
}

function hydrateConditions(id: string, state: CharacterState): void {
  try {
    const raw = storage.read<unknown>(keys.conditions(id), []);
    if (Array.isArray(raw) && raw.every(v => typeof v === 'string')) {
      state.conditions = (raw as string[]).map(v => ({ name: v }));
    } else {
      state.conditions = ConditionsSchema.parse(raw);
    }
  } catch {
    state.conditions = [];
  }
}

function hydrateFeatures(id: string, state: CharacterState): void {
  try {
    state.features = storage.read(keys.features(id), {});
  } catch {
    /* keep default */
  }
}

function hydrateCustomFeatures(id: string, state: CharacterState): void {
  try {
    state.customFeatures = storage.read(
      keys.customFeatures(id),
      [],
      CustomFeaturesSchema
    );
  } catch {
    /* keep default */
  }
}

function hydrateThresholds(id: string, state: CharacterState): void {
  try {
    const raw = storage.read<unknown>(
      keys.thresholds(id),
      null as unknown as null
    );
    if (!raw) {
      state.thresholds = null;
      return;
    }
    const isOld = (v: unknown): v is { major: number; severe: number } =>
      typeof v === 'object' &&
      v !== null &&
      typeof (v as Record<string, unknown>).major === 'number' &&
      typeof (v as Record<string, unknown>).severe === 'number' &&
      !('auto' in v);
    if (isOld(raw)) {
      state.thresholds = {
        auto: false,
        autoMajor: false,
        values: {
          major: raw.major,
          severe: raw.severe,
          critical: 0,
          dsOverride: false,
          ds: 0,
        },
        enableCritical: false,
      };
    } else {
      const parsed = ThresholdsSettingsSchema.safeParse(raw);
      state.thresholds = parsed.success ? parsed.data : null;
    }
  } catch {
    state.thresholds = null;
  }
}

function hydrateLeveling(id: string, state: CharacterState): void {
  try {
    const raw = storage.read(keys.leveling(id), []);
    const parsed = z.array(LevelUpEntrySchema).safeParse(raw);
    state.leveling = parsed.success ? parsed.data : [];
  } catch {
    /* keep default */
  }
}

function hydrateExperience(id: string, state: CharacterState): void {
  try {
    state.experience = storage.read(keys.experience(id), 0);
  } catch {
    /* keep default */
  }
  try {
    state.experiences = storage.read(
      keys.experiences(id),
      [],
      ExperiencesSchema
    );
  } catch {
    /* keep default */
  }
}

function hydrateFromStorage(id: string): CharacterState {
  const state = createDefaultState(id);
  hydrateIdentity(id, state);
  hydrateClass(id, state);
  hydrateDomains(id, state);
  hydrateEquipment(id, state);
  hydrateInventory(id, state);
  hydrateProgression(id, state);
  hydrateResources(id, state);
  hydrateTraits(id, state);
  hydrateConditions(id, state);
  hydrateFeatures(id, state);
  hydrateCustomFeatures(id, state);
  hydrateThresholds(id, state);
  hydrateLeveling(id, state);
  hydrateExperience(id, state);
  return state;
}

function persistToStorage(state: CharacterState): void {
  const { id } = state;
  storage.write(keys.identity(id), state.identity);
  storage.write(keys.class(id), state.classDraft);
  storage.write(keys.domains(id), state.domains);
  storage.write(keys.equipment(id), state.equipment);
  storage.write(keys.inventory(id), state.inventory);
  storage.write(keys.level(id), state.progression.currentLevel);
  storage.write(keys.progression(id), state.progression);
  storage.write(keys.resources(id), state.resources);
  storage.write(keys.traits(id), state.traits);
  storage.write(keys.conditions(id), state.conditions);
  storage.write(keys.features(id), state.features);
  storage.write(keys.customFeatures(id), state.customFeatures);
  if (state.thresholds) storage.write(keys.thresholds(id), state.thresholds);
  storage.write(keys.leveling(id), state.leveling);
  storage.write(keys.experience(id), state.experience);
  storage.write(keys.experiences(id), state.experiences);
}

const storeCache = new Map<string, Store<CharacterState>>();

export function getCharacterStore(id: string): Store<CharacterState> {
  let store = storeCache.get(id);
  if (!store) {
    const initialState = hydrateFromStorage(id);
    store = new Store(initialState);
    store.subscribe(() => persistToStorage(store!.state));
    storeCache.set(id, store);
  }
  return store;
}

export function disposeCharacterStore(id: string): void {
  storeCache.delete(id);
}

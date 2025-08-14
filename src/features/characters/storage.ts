import { z } from 'zod';

import {
  AncestryNameSchema,
  ClassNameEnum,
  CommunityNameSchema,
  SubclassNameSchema,
} from '@/lib/schemas/core';
import {
  CharacterProgressionSchema,
  getTierForLevel,
} from '@/lib/schemas/core';
import {
  type EquipmentLoadout,
  EquipmentLoadoutSchema,
  type Inventory,
  InventorySchema,
} from '@/lib/schemas/equipment';
import { characterKeys as keys, storage } from '@/lib/storage';

// Domains draft (lite card shape to avoid importing all domain schemas)
const DomainCardSchemaLite = z
  .object({
    name: z.string(),
    level: z.number().int().min(1).max(10),
    domain: z.string(),
    type: z.string(),
    description: z.string().optional(),
    hopeCost: z.number().int().min(0).optional(),
    recallCost: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();
export const DomainsDraftSchema = z.object({
  loadout: z.array(DomainCardSchemaLite).default([]),
  vault: z.array(DomainCardSchemaLite).default([]),
  creationComplete: z.boolean().default(false),
});
export type DomainsDraft = z.infer<typeof DomainsDraftSchema>;
export const DEFAULT_DOMAINS: DomainsDraft = {
  loadout: [],
  vault: [],
  creationComplete: false,
};

// Identity
// Details to support richer ancestry/community editing: mixed and homebrew options
const AncestryFeatureLiteSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
const AncestryDetailsSchema = z
  .object({
    type: z.enum(['standard', 'mixed', 'homebrew']).default('standard'),
    mixed: z
      .object({
        name: z.string().optional(),
        primaryFrom: z.string().min(1),
        secondaryFrom: z.string().min(1),
      })
      .optional(),
    homebrew: z
      .object({
        name: z.string().min(1),
        description: z.string().optional().default(''),
        heightRange: z.string().optional(),
        lifespan: z.string().optional(),
        physicalCharacteristics: z.array(z.string()).optional(),
        primaryFeature: AncestryFeatureLiteSchema,
        secondaryFeature: AncestryFeatureLiteSchema,
      })
      .optional(),
  })
  .optional();

const CommunityDetailsSchema = z
  .object({
    type: z.enum(['standard', 'homebrew']).default('standard'),
    homebrew: z
      .object({
        name: z.string().min(1),
        description: z.string().optional().default(''),
        commonTraits: z.array(z.string()).default([]),
        feature: z.object({ name: z.string().min(1), description: z.string() }),
      })
      .optional(),
  })
  .optional();

export const IdentityDraftSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pronouns: z.string().min(1, 'Pronouns are required'),
  // Allow official or custom names
  ancestry: AncestryNameSchema,
  community: CommunityNameSchema,
  description: z.string().default(''),
  calling: z.string().default(''),
  // Rich details for UI; optional to preserve back-compat
  ancestryDetails: AncestryDetailsSchema,
  communityDetails: CommunityDetailsSchema,
});
export type IdentityDraft = z.infer<typeof IdentityDraftSchema>;
export const DEFAULT_IDENTITY: IdentityDraft = {
  name: '',
  pronouns: 'they/them',
  ancestry: 'Human',
  community: 'Wanderborne',
  description: '',
  calling: '',
};
export function readIdentityFromStorage(id: string): IdentityDraft {
  return storage.read(keys.identity(id), DEFAULT_IDENTITY, IdentityDraftSchema);
}
export function writeIdentityToStorage(id: string, value: IdentityDraft) {
  storage.write(keys.identity(id), value);
}

// Conditions (simple string tags)
export const ConditionsSchema = z.array(z.string().min(1).max(40));
export type ConditionsDraft = z.infer<typeof ConditionsSchema>;
export function readConditionsFromStorage(id: string): ConditionsDraft {
  return storage.read(keys.conditions(id), [], ConditionsSchema);
}
export function writeConditionsToStorage(id: string, value: ConditionsDraft) {
  storage.write(keys.conditions(id), value);
}

// Resources (hp, stress, hope, etc.)
const ScoreSchema = z.object({
  current: z.number().int().min(0),
  max: z.number().int().min(1),
});
export const ResourcesSchema = z.object({
  hp: ScoreSchema.default({ current: 10, max: 10 }),
  stress: ScoreSchema.default({ current: 0, max: 6 }),
  evasion: z.number().int().min(0).default(10),
  hope: ScoreSchema.default({ current: 2, max: 6 }),
  proficiency: z.number().int().min(1).default(1),
  gold: z
    .object({
      handfuls: z.number().int().min(0).default(1),
      bags: z.number().int().min(0).default(0),
      chests: z.number().int().min(0).default(0),
    })
    .default({ handfuls: 1, bags: 0, chests: 0 }),
});
export type ResourcesDraft = z.infer<typeof ResourcesSchema>;
export const DEFAULT_RESOURCES: ResourcesDraft = {
  hp: { current: 10, max: 10 },
  stress: { current: 0, max: 6 },
  evasion: 10,
  hope: { current: 2, max: 6 },
  proficiency: 1,
  gold: { handfuls: 1, bags: 0, chests: 0 },
};
export function readResourcesFromStorage(id: string): ResourcesDraft {
  const parsedUnknown = storage.read<unknown>(
    keys.resources(id),
    DEFAULT_RESOURCES
  );
  // Back-compat: earlier versions stored hope as a number
  const hasNumberHope = (
    v: unknown
  ): v is { hope: number } & Record<string, unknown> => {
    return typeof (v as { hope?: unknown }).hope === 'number';
  };
  let normalized: unknown = parsedUnknown;
  if (hasNumberHope(parsedUnknown)) {
    const { hope, ...rest } = parsedUnknown;
    normalized = { ...rest, hope: { current: hope, max: 6 } };
  }
  try {
    return ResourcesSchema.parse(normalized);
  } catch {
    return DEFAULT_RESOURCES;
  }
}
export function writeResourcesToStorage(id: string, value: ResourcesDraft) {
  storage.write(keys.resources(id), value);
}

// Traits
export const TraitStateSchema = z.object({
  value: z.number().int().default(0),
  marked: z.boolean().default(false),
});
export type TraitState = z.infer<typeof TraitStateSchema>;
export type TraitsDraft = Record<string, TraitState>;
export const DEFAULT_TRAITS: TraitsDraft = {
  Agility: { value: 0, marked: false },
  Strength: { value: 0, marked: false },
  Finesse: { value: 0, marked: false },
  Instinct: { value: 0, marked: false },
  Presence: { value: 0, marked: false },
  Knowledge: { value: 0, marked: false },
};
export function readTraitsFromStorage(id: string): TraitsDraft {
  const schema = z.record(z.string(), TraitStateSchema);
  return storage.read(keys.traits(id), DEFAULT_TRAITS, schema);
}
export function writeTraitsToStorage(id: string, value: TraitsDraft) {
  storage.write(keys.traits(id), value);
}

// Class selection
export const ClassDraftSchema = z.object({
  className: ClassNameEnum,
  subclass: SubclassNameSchema,
});
export type ClassDraft = z.infer<typeof ClassDraftSchema>;
export const DEFAULT_CLASS: ClassDraft = {
  className: 'Warrior',
  subclass: 'Call of the Brave',
};
export function readClassFromStorage(id: string): ClassDraft {
  return storage.read(keys.class(id), DEFAULT_CLASS, ClassDraftSchema);
}
export function writeClassToStorage(id: string, value: ClassDraft) {
  storage.write(keys.class(id), value);
}

// Domains read/write
export function readDomainsFromStorage(id: string): DomainsDraft {
  const parsed = storage.read(keys.domains(id), DEFAULT_DOMAINS);
  try {
    return DomainsDraftSchema.parse(parsed);
  } catch {
    return DEFAULT_DOMAINS;
  }
}
export function writeDomainsToStorage(id: string, value: DomainsDraft) {
  storage.write(keys.domains(id), value);
}

// Equipment (loadout): weapons, armor, items
export type EquipmentDraft = EquipmentLoadout;
export const DEFAULT_EQUIPMENT: EquipmentDraft = {
  primaryWeapon: undefined,
  secondaryWeapon: undefined,
  armor: undefined,
  items: [],
  consumables: {},
};
export function readEquipmentFromStorage(id: string): EquipmentDraft {
  const fallback = DEFAULT_EQUIPMENT;
  try {
    return storage.read(keys.equipment(id), fallback, EquipmentLoadoutSchema);
  } catch {
    return fallback;
  }
}
export function writeEquipmentToStorage(id: string, value: EquipmentDraft) {
  storage.write(keys.equipment(id), value);
}

// Inventory (bag/slots)
export type InventoryDraft = Inventory;
export const DEFAULT_INVENTORY: InventoryDraft = {
  slots: [],
  maxItems: 50,
  weightCapacity: undefined,
  currentWeight: 0,
  metadata: {},
};
export function readInventoryFromStorage(id: string): InventoryDraft {
  const fallback = DEFAULT_INVENTORY;
  try {
    return storage.read(keys.inventory(id), fallback, InventorySchema);
  } catch {
    return fallback;
  }
}
export function writeInventoryToStorage(id: string, value: InventoryDraft) {
  storage.write(keys.inventory(id), value);
}

// Level & progression
export function readLevelFromStorage(id: string): number {
  const n = storage.read<number>(keys.level(id), 1);
  return Number.isFinite(n) && n >= 1 && n <= 10 ? n : 1;
}
export function writeLevelToStorage(id: string, value: number) {
  const v = Math.max(1, Math.min(10, Math.floor(value)));
  storage.write(keys.level(id), v);
}

export type FeatureSelections = Record<string, string | number | boolean>;

export function readFeaturesFromStorage(id: string): FeatureSelections {
  return storage.read(keys.features(id), {} as FeatureSelections);
}
export function writeFeaturesToStorage(id: string, map: FeatureSelections) {
  storage.write(keys.features(id), map);
}

export type CharacterProgressionDraft = {
  currentLevel: number;
  currentTier: ReturnType<typeof getTierForLevel>;
  availablePoints: number;
  spentOptions: Record<string, number>;
};

export function readProgressionFromStorage(
  id: string
): CharacterProgressionDraft {
  const level = readLevelFromStorage(id);
  const fallback: CharacterProgressionDraft = {
    currentLevel: level,
    currentTier: getTierForLevel(level),
    availablePoints: 2,
    spentOptions: {},
  };
  try {
    const raw = storage.read(keys.progression(id), fallback);
    // Validate against schema shape but coerce to draft
    const parsed = CharacterProgressionSchema.parse(raw);
    return {
      currentLevel: parsed.currentLevel,
      currentTier: parsed.currentTier,
      availablePoints: parsed.availablePoints,
      spentOptions: parsed.spentOptions,
    };
  } catch {
    return fallback;
  }
}
export function writeProgressionToStorage(
  id: string,
  value: CharacterProgressionDraft
) {
  storage.write(keys.progression(id), value);
}

// Threshold overrides (editable by user). Persist per character.
export const ThresholdsSettingsSchema = z.object({
  auto: z.boolean().default(true),
  values: z
    .object({
      major: z.number().int().min(0),
      severe: z.number().int().min(0),
      // When true, use custom ds instead of severe * 2
      dsOverride: z.boolean().default(false),
      // Stored custom Double Severe value when override is enabled
      ds: z.number().int().min(0).default(0),
    })
    .refine(v => v.severe >= v.major, {
      message: 'Severe threshold must be greater than or equal to Major',
    }),
  enableCritical: z.boolean().default(false),
});
export type ThresholdsSettings = z.infer<typeof ThresholdsSettingsSchema>;

export function readThresholdsSettingsFromStorage(
  id: string
): ThresholdsSettings | null {
  // Back-compat: if old shape {major,severe}, map to manual settings
  const raw = storage.read<unknown>(
    keys.thresholds(id),
    null as unknown as null
  );
  if (!raw) return null;
  const isOld = (v: unknown): v is { major: number; severe: number } =>
    typeof v === 'object' &&
    v !== null &&
    typeof (v as Record<string, unknown>).major === 'number' &&
    typeof (v as Record<string, unknown>).severe === 'number';
  if (isOld(raw))
    return {
      auto: false,
      values: {
        major: raw.major,
        severe: raw.severe,
        dsOverride: false,
        ds: 0,
      },
      enableCritical: false,
    };
  try {
    const parsed = ThresholdsSettingsSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
    // Attempt soft migration for legacy shapes
    const legacy = raw as {
      auto?: boolean;
      values?: {
        major: number;
        severe: number;
        dsOverride?: boolean;
        ds?: number;
      };
      enableCritical?: boolean;
    };
    if (
      legacy &&
      legacy.values &&
      typeof legacy.values.major === 'number' &&
      typeof legacy.values.severe === 'number'
    ) {
      return {
        auto: legacy.auto ?? true,
        values: {
          major: legacy.values.major,
          severe: legacy.values.severe,
          dsOverride: legacy.values.dsOverride ?? false,
          ds: legacy.values.ds ?? 0,
        },
        enableCritical: legacy.enableCritical ?? false,
      };
    }
    return null;
  } catch {
    return null;
  }
}
export function writeThresholdsSettingsToStorage(
  id: string,
  value: ThresholdsSettings
) {
  storage.write(keys.thresholds(id), value);
}

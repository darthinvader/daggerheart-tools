import { z } from 'zod';

import { characterKeys as keys, storage } from '@/lib/storage';

// Barrel re-exports for split modules (keeps public API stable)
export * from '@/features/characters/identity-storage';
export * from '@/features/characters/class-storage';
export * from '@/features/characters/domains-storage';
export * from '@/features/characters/equipment-storage';
export * from '@/features/characters/inventory-storage';
export * from '@/features/characters/features-storage';
export * from '@/features/characters/progression-storage';

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
  bonus: z.number().int().default(0),
  marked: z.boolean().default(false),
});
export type TraitState = z.infer<typeof TraitStateSchema>;
export type TraitsDraft = Record<string, TraitState>;
export const DEFAULT_TRAITS: TraitsDraft = {
  Agility: { value: 0, bonus: 0, marked: false },
  Strength: { value: 0, bonus: 0, marked: false },
  Finesse: { value: 0, bonus: 0, marked: false },
  Instinct: { value: 0, bonus: 0, marked: false },
  Presence: { value: 0, bonus: 0, marked: false },
  Knowledge: { value: 0, bonus: 0, marked: false },
};
export function readTraitsFromStorage(id: string): TraitsDraft {
  const schema = z.record(z.string(), TraitStateSchema);
  return storage.read(keys.traits(id), DEFAULT_TRAITS, schema);
}
export function writeTraitsToStorage(id: string, value: TraitsDraft) {
  storage.write(keys.traits(id), value);
}
// Custom features (user-added)
export const CustomFeatureSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  level: z.number().int().min(1).max(10).default(1),
  tier: z
    .union([
      z.literal('1'),
      z.literal('2-4'),
      z.literal('5-7'),
      z.literal('8-10'),
    ])
    .optional(),
  unlockCondition: z.string().optional(),
});
export type CustomFeature = z.infer<typeof CustomFeatureSchema>;
export const CustomFeaturesSchema = z.array(CustomFeatureSchema);
export type CustomFeatures = CustomFeature[];

export function readCustomFeaturesFromStorage(id: string): CustomFeatures {
  const fallback: CustomFeatures = [];
  try {
    return storage.read(
      keys.customFeatures(id),
      fallback,
      CustomFeaturesSchema
    );
  } catch {
    return fallback;
  }
}
export function writeCustomFeaturesToStorage(id: string, list: CustomFeatures) {
  storage.write(keys.customFeatures(id), list);
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
      // Stored custom Major Damage (double severe) value when override is enabled
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

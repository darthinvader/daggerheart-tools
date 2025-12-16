import { z } from 'zod';

import type {
  ConditionsDraft,
  CustomFeatures,
  ExperiencesDraft,
  ResourcesDraft,
  ThresholdsSettings,
  TraitsDraft,
} from '@/lib/schemas/character-state';
import {
  ConditionsSchema,
  CustomFeaturesSchema,
  DEFAULT_RESOURCES,
  DEFAULT_TRAITS,
  ExperiencesSchema,
  ResourcesSchema,
  ThresholdsSettingsSchema,
  TraitStateSchema,
} from '@/lib/schemas/character-state';
import { characterKeys as keys, storage } from '@/lib/storage';

// Barrel re-exports for split modules (keeps public API stable)
export * from '@/features/characters/class-storage';
export * from '@/features/characters/domains-storage';
export * from '@/features/characters/equipment-storage';
export * from '@/features/characters/features-storage';
export * from '@/features/characters/identity-storage';
export * from '@/features/characters/inventory-storage';
export * from '@/features/characters/progression-storage';

// TanStack Store exports
export * from '@/features/characters/character-store';
export * from '@/features/characters/use-character-store';

// Re-export types and schemas from centralized lib/schemas/character-state
export {
  ConditionItemSchema,
  ConditionsSchema,
  CustomFeatureSchema,
  CustomFeaturesSchema,
  DEFAULT_RESOURCES,
  DEFAULT_TRAITS,
  ExperienceEntrySchema,
  ExperiencesSchema,
  LevelUpEntrySchema,
  ResourcesSchema,
  ThresholdsSettingsSchema,
  TraitStateSchema,
} from '@/lib/schemas/character-state';
export type {
  ConditionItem,
  ConditionsDraft,
  CustomFeature,
  CustomFeatures,
  ExperienceDraft,
  ExperiencesDraft,
  LevelUpEntry,
  ResourcesDraft,
  ThresholdsSettings,
  TraitsDraft,
  TraitState,
} from '@/lib/schemas/character-state';

// Conditions read/write
export function readConditionsFromStorage(id: string): ConditionsDraft {
  const raw = storage.read<unknown>(keys.conditions(id), []);
  if (Array.isArray(raw) && raw.every(v => typeof v === 'string')) {
    return (raw as string[]).map(v => ({ name: v }));
  }
  try {
    return ConditionsSchema.parse(raw);
  } catch {
    return [];
  }
}
export function writeConditionsToStorage(id: string, value: ConditionsDraft) {
  storage.write(keys.conditions(id), value);
}

// Resources read/write
export function readResourcesFromStorage(id: string): ResourcesDraft {
  const parsedUnknown = storage.read<unknown>(
    keys.resources(id),
    DEFAULT_RESOURCES
  );
  const hasNumberHope = (
    v: unknown
  ): v is { hope: number } & Record<string, unknown> =>
    typeof (v as { hope?: unknown }).hope === 'number';
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

// Traits read/write
export function readTraitsFromStorage(id: string): TraitsDraft {
  const schema = z.record(z.string(), TraitStateSchema);
  return storage.read(keys.traits(id), DEFAULT_TRAITS, schema);
}
export function writeTraitsToStorage(id: string, value: TraitsDraft) {
  storage.write(keys.traits(id), value);
}

// Experience read/write
export function readExperienceTotalFromStorage(id: string): number {
  return storage.read(keys.experience(id), 0);
}
export function writeExperienceTotalToStorage(id: string, value: number) {
  storage.write(keys.experience(id), Math.max(0, Math.floor(value)));
}
export function readExperiencesFromStorage(id: string): ExperiencesDraft {
  try {
    return storage.read(keys.experiences(id), [], ExperiencesSchema);
  } catch {
    return [];
  }
}
export function writeExperiencesToStorage(id: string, list: ExperiencesDraft) {
  storage.write(keys.experiences(id), list);
}

// Custom features read/write
export function readCustomFeaturesFromStorage(id: string): CustomFeatures {
  try {
    return storage.read(keys.customFeatures(id), [], CustomFeaturesSchema);
  } catch {
    return [];
  }
}
export function writeCustomFeaturesToStorage(id: string, list: CustomFeatures) {
  storage.write(keys.customFeatures(id), list);
}

// Thresholds read/write
export function readThresholdsSettingsFromStorage(
  id: string
): ThresholdsSettings | null {
  const raw = storage.read<unknown>(
    keys.thresholds(id),
    null as unknown as null
  );
  if (!raw) return null;
  const isOld = (v: unknown): v is { major: number; severe: number } =>
    typeof v === 'object' &&
    v !== null &&
    typeof (v as Record<string, unknown>).major === 'number' &&
    typeof (v as Record<string, unknown>).severe === 'number' &&
    !('auto' in v);
  if (isOld(raw)) {
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
  }
  try {
    const parsed = ThresholdsSettingsSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
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
      legacy?.values &&
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

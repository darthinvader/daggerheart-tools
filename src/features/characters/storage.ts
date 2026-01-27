import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { ThresholdsSettingsSchema } from '@/lib/schemas/character-state';
import { characterKeys as keys, storage } from '@/lib/storage';

// Barrel re-exports for split modules (keeps public API stable)
export * from '@/features/characters/class-storage';
export * from '@/features/characters/domains-storage';
export * from '@/features/characters/equipment-storage';
export * from '@/features/characters/features-storage';
export * from '@/features/characters/identity-storage';
export * from '@/features/characters/inventory-storage';
export * from '@/features/characters/progression-storage';

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
        autoMajor: true,
        values: {
          major: legacy.values.major,
          severe: legacy.values.severe,
          critical: 0,
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

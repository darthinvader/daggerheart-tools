import { z } from 'zod';

import { DomainsDraftSchema } from '@/features/characters/domains-storage';
import {
  ConditionsSchema,
  CustomFeaturesSchema,
  LevelUpEntrySchema,
  ResourcesSchema,
  ThresholdsSettingsSchema,
  TraitStateSchema,
} from '@/lib/schemas/character-state';
import { ClassDraftSchema } from '@/lib/schemas/class-selection';
import { QuickViewPreferencesSchema } from '@/lib/schemas/quick-view';
import { supabase } from '@/lib/supabase';

// Schema for ExperiencesState (matches component state format)
const ExperienceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
});

const ExperiencesStateSchema = z.object({
  items: z.array(ExperienceItemSchema),
});

import {
  ApiEquipmentSchema,
  ApiIdentitySchema,
  ApiInventorySchema,
  CharacterNoteSchema,
  CompanionStateSchema,
  CountdownSchema,
  DowntimeActivitySchema,
  ScarSchema,
  SessionEntrySchema,
} from './schemas';

// Re-export for convenience
export { createDefaultCharacter } from './defaults';

// Character record schema for API (relaxed validation for empty characters)
export const CharacterRecordSchema = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  isNewCharacter: z.boolean().nullish(),
  identity: ApiIdentitySchema,
  classDraft: ClassDraftSchema,
  domains: DomainsDraftSchema,
  equipment: ApiEquipmentSchema,
  inventory: ApiInventorySchema,
  progression: z.object({
    currentLevel: z.number(),
    currentTier: z.string(),
    availablePoints: z.number(),
    spentOptions: z.record(z.string(), z.boolean()),
  }),
  resources: ResourcesSchema,
  coreScores: z
    .object({
      evasion: z.number(),
      proficiency: z.number(),
      autoCalculateEvasion: z.boolean().optional(),
    })
    .nullish(),
  traits: z.record(z.string(), TraitStateSchema),
  conditions: ConditionsSchema,
  features: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  ),
  customFeatures: CustomFeaturesSchema,
  thresholds: ThresholdsSettingsSchema.nullable(),
  leveling: z.array(LevelUpEntrySchema),
  experience: z.number(),
  experiences: ExperiencesStateSchema,
  // Session state fields
  companion: CompanionStateSchema.nullish(),
  companionEnabled: z.boolean().nullish(),
  scars: z.array(ScarSchema).nullish(),
  extraHopeSlots: z.number().nullish(),
  companionHopeFilled: z.boolean().nullish(),
  countdowns: z.array(CountdownSchema).nullish(),
  sessions: z.array(SessionEntrySchema).nullish(),
  currentSessionId: z.string().nullable().optional(),
  notes: z.array(CharacterNoteSchema).nullish(),
  downtimeActivities: z.array(DowntimeActivitySchema).nullish(),
  quickView: QuickViewPreferencesSchema.nullish(),
  deletedAt: z.string().nullable().optional(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export type CharacterRecord = z.infer<typeof CharacterRecordSchema>;

// Summary for list view (lighter weight)
export interface CharacterSummary {
  id: string;
  name: string;
  ancestry: string;
  community: string;
  className: string;
  subclass: string;
  level: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function toCharacterSummary(char: CharacterRecord): CharacterSummary {
  return {
    id: char.id,
    name: char.identity.name || 'Unnamed Character',
    ancestry: char.identity.ancestry || '',
    community: char.identity.community || '',
    className: char.classDraft.className || '',
    subclass: char.classDraft.subclassName || '',
    level: char.progression.currentLevel,
    deletedAt: char.deletedAt ?? null,
    createdAt: char.createdAt ?? undefined,
    updatedAt: char.updatedAt ?? undefined,
  };
}

// Helper to convert snake_case DB row to camelCase CharacterRecord
function mapDbRowToCharacter(row: Record<string, unknown>): CharacterRecord {
  return {
    id: row.id as string,
    userId: row.user_id as string | null | undefined,
    isNewCharacter: row.is_new_character as boolean,
    identity: row.identity as CharacterRecord['identity'],
    classDraft: row.class_draft as CharacterRecord['classDraft'],
    domains: row.domains as CharacterRecord['domains'],
    equipment: row.equipment as CharacterRecord['equipment'],
    inventory: row.inventory as CharacterRecord['inventory'],
    progression: row.progression as CharacterRecord['progression'],
    resources: row.resources as CharacterRecord['resources'],
    coreScores: row.core_scores as CharacterRecord['coreScores'],
    traits: row.traits as CharacterRecord['traits'],
    conditions: row.conditions as CharacterRecord['conditions'],
    features: row.features as CharacterRecord['features'],
    customFeatures: row.custom_features as CharacterRecord['customFeatures'],
    thresholds: row.thresholds as CharacterRecord['thresholds'],
    leveling: row.leveling as CharacterRecord['leveling'],
    experience: row.experience as number,
    experiences: row.experiences as CharacterRecord['experiences'],
    companion: row.companion as CharacterRecord['companion'],
    companionEnabled: row.companion_enabled as boolean,
    scars: row.scars as CharacterRecord['scars'],
    extraHopeSlots: row.extra_hope_slots as number,
    companionHopeFilled: row.companion_hope_filled as boolean,
    countdowns: row.countdowns as CharacterRecord['countdowns'],
    sessions: row.sessions as CharacterRecord['sessions'],
    currentSessionId: row.current_session_id as string | null,
    notes: row.notes as CharacterRecord['notes'],
    downtimeActivities:
      row.downtime_activities as CharacterRecord['downtimeActivities'],
    quickView: row.quick_view as CharacterRecord['quickView'],
    deletedAt: row.deleted_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Helper to convert camelCase CharacterRecord to snake_case for DB
// eslint-disable-next-line complexity
function mapCharacterToDbRow(
  char: Partial<CharacterRecord>
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (char.id !== undefined) row.id = char.id;
  if (char.userId !== undefined) row.user_id = char.userId;
  if (char.isNewCharacter !== undefined)
    row.is_new_character = char.isNewCharacter;
  if (char.identity !== undefined) row.identity = char.identity;
  if (char.classDraft !== undefined) row.class_draft = char.classDraft;
  if (char.domains !== undefined) row.domains = char.domains;
  if (char.equipment !== undefined) row.equipment = char.equipment;
  if (char.inventory !== undefined) row.inventory = char.inventory;
  if (char.progression !== undefined) row.progression = char.progression;
  if (char.resources !== undefined) row.resources = char.resources;
  if (char.coreScores !== undefined) row.core_scores = char.coreScores;
  if (char.traits !== undefined) row.traits = char.traits;
  if (char.conditions !== undefined) row.conditions = char.conditions;
  if (char.features !== undefined) row.features = char.features;
  if (char.customFeatures !== undefined)
    row.custom_features = char.customFeatures;
  if (char.thresholds !== undefined) row.thresholds = char.thresholds;
  if (char.leveling !== undefined) row.leveling = char.leveling;
  if (char.experience !== undefined) row.experience = char.experience;
  if (char.experiences !== undefined) row.experiences = char.experiences;
  if (char.companion !== undefined) row.companion = char.companion;
  if (char.companionEnabled !== undefined)
    row.companion_enabled = char.companionEnabled;
  if (char.scars !== undefined) row.scars = char.scars;
  if (char.extraHopeSlots !== undefined)
    row.extra_hope_slots = char.extraHopeSlots;
  if (char.companionHopeFilled !== undefined)
    row.companion_hope_filled = char.companionHopeFilled;
  if (char.countdowns !== undefined) row.countdowns = char.countdowns;
  if (char.sessions !== undefined) row.sessions = char.sessions;
  if (char.currentSessionId !== undefined)
    row.current_session_id = char.currentSessionId;
  if (char.notes !== undefined) row.notes = char.notes;
  if (char.downtimeActivities !== undefined)
    row.downtime_activities = char.downtimeActivities;
  if (char.quickView !== undefined) row.quick_view = char.quickView;
  if (char.deletedAt !== undefined) row.deleted_at = char.deletedAt;

  return row;
}

// API Functions

export async function fetchAllCharacters(): Promise<CharacterRecord[]> {
  // Get current user to filter characters
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch characters: ${error.message}`);
  }

  return (data ?? []).map(row =>
    CharacterRecordSchema.parse(mapDbRowToCharacter(row))
  );
}

export async function fetchCharacter(id: string): Promise<CharacterRecord> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch character ${id}: ${error.message}`);
  }

  return CharacterRecordSchema.parse(mapDbRowToCharacter(data));
}

export async function createCharacter(
  character: CharacterRecord
): Promise<CharacterRecord> {
  // Get current user to assign character ownership
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dbRow = mapCharacterToDbRow({
    ...character,
    userId: user?.id ?? null,
  });

  const { data, error } = await supabase
    .from('characters')
    .insert(dbRow)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create character: ${error.message}`);
  }

  return CharacterRecordSchema.parse(mapDbRowToCharacter(data));
}

export async function updateCharacter(
  id: string,
  updates: Partial<CharacterRecord>
): Promise<CharacterRecord> {
  const dbRow = mapCharacterToDbRow(updates);

  const { data, error } = await supabase
    .from('characters')
    .update(dbRow)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update character ${id}: ${error.message}`);
  }

  return CharacterRecordSchema.parse(mapDbRowToCharacter(data));
}

export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete character ${id}: ${error.message}`);
  }
}

export async function restoreCharacter(id: string): Promise<void> {
  const { error } = await supabase
    .from('characters')
    .update({ deleted_at: null })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to restore character ${id}: ${error.message}`);
  }
}

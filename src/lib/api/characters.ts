import { z } from 'zod';

import { DomainsDraftSchema } from '@/features/characters/domains-storage';
import {
  ConditionsSchema,
  CustomFeaturesSchema,
  ExperiencesSchema,
  LevelUpEntrySchema,
  ResourcesSchema,
  ThresholdsSettingsSchema,
  TraitStateSchema,
} from '@/lib/schemas/character-state';
import { ClassDraftSchema } from '@/lib/schemas/class-selection';

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

const API_BASE = 'http://localhost:3001';

// Character record schema for API (relaxed validation for empty characters)
export const CharacterRecordSchema = z.object({
  id: z.string(),
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
    .optional(),
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
  experiences: ExperiencesSchema,
  // Session state fields
  companion: CompanionStateSchema.optional(),
  companionEnabled: z.boolean().optional(),
  scars: z.array(ScarSchema).optional(),
  extraHopeSlots: z.number().optional(),
  companionHopeFilled: z.boolean().optional(),
  countdowns: z.array(CountdownSchema).optional(),
  sessions: z.array(SessionEntrySchema).optional(),
  currentSessionId: z.string().nullable().optional(),
  notes: z.array(CharacterNoteSchema).optional(),
  downtimeActivities: z.array(DowntimeActivitySchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
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
    createdAt: char.createdAt,
    updatedAt: char.updatedAt,
  };
}

// API Functions

export async function fetchAllCharacters(): Promise<CharacterRecord[]> {
  const res = await fetch(`${API_BASE}/characters`);
  if (!res.ok) throw new Error('Failed to fetch characters');
  const data = await res.json();
  return z.array(CharacterRecordSchema).parse(data);
}

export async function fetchCharacter(id: string): Promise<CharacterRecord> {
  const res = await fetch(`${API_BASE}/characters/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch character ${id}`);
  const data = await res.json();
  return CharacterRecordSchema.parse(data);
}

export async function createCharacter(
  character: CharacterRecord
): Promise<CharacterRecord> {
  const res = await fetch(`${API_BASE}/characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(character),
  });
  if (!res.ok) throw new Error('Failed to create character');
  const data = await res.json();
  return CharacterRecordSchema.parse(data);
}

export async function updateCharacter(
  id: string,
  updates: Partial<CharacterRecord>
): Promise<CharacterRecord> {
  const payload = { ...updates, updatedAt: new Date().toISOString() };

  const res = await fetch(`${API_BASE}/characters/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to update character ${id}`);
  }

  const data = await res.json();

  return CharacterRecordSchema.parse(data);
}

export async function deleteCharacter(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/characters/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete character ${id}`);
}

import { z } from 'zod';

import {
  AncestryNameEnum,
  ClassNameEnum,
  CommunityNameEnum,
  SubclassNameSchema,
} from '@/lib/schemas/core';
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
export const IdentityDraftSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pronouns: z.string().min(1, 'Pronouns are required'),
  ancestry: AncestryNameEnum,
  community: CommunityNameEnum,
  description: z.string().default(''),
  calling: z.string().default(''),
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
});
export type ResourcesDraft = z.infer<typeof ResourcesSchema>;
export const DEFAULT_RESOURCES: ResourcesDraft = {
  hp: { current: 10, max: 10 },
  stress: { current: 0, max: 6 },
  evasion: 10,
  hope: { current: 2, max: 6 },
  proficiency: 1,
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

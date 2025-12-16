import { z } from 'zod';

import {
  BackgroundSchema,
  ConnectionSchema,
  DescriptionDetailsSchema,
} from '@/lib/schemas/character-state';
import { AncestryNameSchema, CommunityNameSchema } from '@/lib/schemas/core';
import { characterKeys as keys, storage } from '@/lib/storage';

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
  ancestry: AncestryNameSchema,
  community: CommunityNameSchema,
  description: z.string().default(''),
  calling: z.string().default(''),
  ancestryDetails: AncestryDetailsSchema,
  communityDetails: CommunityDetailsSchema,
  background: BackgroundSchema.optional(),
  descriptionDetails: DescriptionDetailsSchema.optional(),
  connections: z.array(ConnectionSchema).optional(),
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

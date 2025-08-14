import { z } from 'zod';

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
  // Allow official or custom names
  ancestry: AncestryNameSchema,
  community: CommunityNameSchema,
  description: z.string().default(''),
  calling: z.string().default(''),
  // Rich details for UI; optional to preserve back-compat
  ancestryDetails: AncestryDetailsSchema,
  communityDetails: CommunityDetailsSchema,
  // Background (freeform or Q&A list)
  background: z
    .union([
      z.string(),
      z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .default([]),
    ])
    .optional(),
  // Structured physical description
  descriptionDetails: z
    .object({
      eyes: z.string().optional(),
      hair: z.string().optional(),
      skin: z.string().optional(),
      body: z.string().optional(),
      clothing: z.string().optional(),
      mannerisms: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
  // Connections (Q&A with optional player ref)
  connections: z
    .array(
      z.object({
        prompt: z.string(),
        answer: z.string(),
        withPlayer: z
          .object({ id: z.string().optional(), name: z.string().optional() })
          .optional(),
      })
    )
    .optional(),
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

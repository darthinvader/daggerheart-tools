import { z } from 'zod';

import {
  BackgroundSchema,
  ConnectionSchema,
  DescriptionDetailsSchema,
} from '@/lib/schemas/character-state';
import {
  AncestryNameSchema,
  CommunityNameSchema,
  NameDescriptionSchema,
} from '@/lib/schemas/core';
// Identity
// Details to support richer ancestry/community editing: mixed and homebrew options
// Use NameDescriptionSchema with min(1) validation for features
const AncestryFeatureLiteSchema = NameDescriptionSchema.extend({
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
        feature: NameDescriptionSchema.extend({
          name: z.string().min(1),
        }),
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

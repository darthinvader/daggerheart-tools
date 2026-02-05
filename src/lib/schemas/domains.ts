import { z } from 'zod';

import {
  DomainNameSchema,
  FeatureStatModifiersSchema,
  MetadataSchema,
  unionWithString,
} from './core';

// Per RAW (page 26): "There are three types of domain cards: abilities, spells, and grimoires.
// Grimoires are unique to the Codex domain and are a collection of smaller spells bundled together."
export const DomainCardTypeEnum = z.enum(['Spell', 'Ability', 'Grimoire']);
export const DomainCardTypeSchema = unionWithString(DomainCardTypeEnum);

export const DomainCardSchema = z
  .object({
    name: z.string(),
    level: z.number().int().min(1).max(10),
    domain: DomainNameSchema,
    type: DomainCardTypeSchema,
    // Per SRD: recallCost is the standard field for domain card recall/equip cost
    // hopeCost is kept for backward compatibility with legacy data
    recallCost: z.number().int().min(0).optional(),
    hopeCost: z.number().int().min(0).optional(),
    stressCost: z.number().int().min(0).optional(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    // Optional explicit modifiers for auto-calculation
    modifiers: FeatureStatModifiersSchema.optional(),
    metadata: MetadataSchema,
  })
  .refine(
    v => typeof v.recallCost === 'number' || typeof v.hopeCost === 'number',
    {
      message:
        'Domain card must include recallCost (preferred) or hopeCost (legacy)',
    }
  );

export const DomainCardCollectionSchema = z.array(DomainCardSchema);

export type DomainCard = z.infer<typeof DomainCardSchema>;
export type DomainCardCollection = z.infer<typeof DomainCardCollectionSchema>;
// DomainName type is exported from core.ts
export type DomainCardType = z.infer<typeof DomainCardTypeSchema>;

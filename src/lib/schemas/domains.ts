import { z } from 'zod';

import { DomainNameSchema, MetadataSchema, unionWithString } from './core';

export const DomainCardTypeEnum = z.enum(['Spell', 'Ability']);
export const DomainCardTypeSchema = unionWithString(DomainCardTypeEnum);

export const DomainCardSchema = z
  .object({
    name: z.string(),
    level: z.number().int().min(1).max(10),
    domain: DomainNameSchema,
    type: DomainCardTypeSchema,
    // Rulebook phrasing uses Hope as the spend; allow hopeCost while staying backward-compatible with recallCost
    hopeCost: z.number().int().min(0).optional(),
    recallCost: z.number().int().min(0).optional(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    metadata: MetadataSchema,
  })
  .refine(
    v => typeof v.hopeCost === 'number' || typeof v.recallCost === 'number',
    { message: 'Domain card must include hopeCost (preferred) or recallCost' }
  );

export const DomainCardCollectionSchema = z.array(DomainCardSchema);

export type DomainCard = z.infer<typeof DomainCardSchema>;
export type DomainCardCollection = z.infer<typeof DomainCardCollectionSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
export type DomainCardType = z.infer<typeof DomainCardTypeSchema>;

import { z } from 'zod';

import { DomainNameSchema, MetadataSchema, unionWithString } from './core';

export const DomainCardTypeEnum = z.enum(['Spell', 'Ability']);
export const DomainCardTypeSchema = unionWithString(DomainCardTypeEnum);

export const DomainCardSchema = z.object({
  name: z.string(),
  level: z.number().int().min(1).max(10),
  domain: DomainNameSchema,
  type: DomainCardTypeSchema,
  recallCost: z.number().int().min(0),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  metadata: MetadataSchema,
});

export const DomainCardCollectionSchema = z.array(DomainCardSchema);

export type DomainCard = z.infer<typeof DomainCardSchema>;
export type DomainCardCollection = z.infer<typeof DomainCardCollectionSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
export type DomainCardType = z.infer<typeof DomainCardTypeSchema>;

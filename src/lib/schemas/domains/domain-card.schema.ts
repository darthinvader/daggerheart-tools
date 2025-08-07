import { z } from 'zod';

import { DomainNameEnum } from '../core/enums';

// Domain card types from the SRD
export const DomainCardTypeEnum = z.enum(['Spell', 'Ability']);

// Schema for individual domain cards with full details
export const DomainCardSchema = z.object({
  name: z.string(),
  level: z.number().int().min(1).max(10),
  domain: DomainNameEnum,
  type: DomainCardTypeEnum,
  recallCost: z.number().int().min(0),
  description: z.string(),
});

// Schema for domain card collections on character sheets
export const DomainCardCollectionSchema = z.array(DomainCardSchema);

export type DomainCard = z.infer<typeof DomainCardSchema>;
export type DomainCardCollection = z.infer<typeof DomainCardCollectionSchema>;
export type DomainName = z.infer<typeof DomainNameEnum>;
export type DomainCardType = z.infer<typeof DomainCardTypeEnum>;

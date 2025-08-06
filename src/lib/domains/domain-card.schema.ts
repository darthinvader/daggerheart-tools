import { z } from 'zod';

// Domain card types from the SRD
export const DomainCardTypeEnum = z.enum(['Spell', 'Ability']);

// Domain names from the SRD
export const DomainNameEnum = z.enum([
  'Arcana',
  'Blade',
  'Bone',
  'Codex',
  'Grace',
  'Sage',
  'Midnight',
  'Splendor',
  'Valor',
  'Chaos',
  'Moon',
  'Sun',
  'Blood',
  'Fate',
]);

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

// Schema for domain card reference (lighter weight)
export const DomainCardReferenceSchema = z.object({
  name: z.string(),
  level: z.number().int().min(1).max(10),
  domain: DomainNameEnum,
});

// Schema for domains on character sheets (legacy support)
export const CharacterDomainSchema = z.object({
  name: DomainNameEnum,
  cards: z.array(z.string()), // Just card names for backward compatibility
});

export type DomainCard = z.infer<typeof DomainCardSchema>;
export type DomainCardCollection = z.infer<typeof DomainCardCollectionSchema>;
export type DomainCardReference = z.infer<typeof DomainCardReferenceSchema>;
export type CharacterDomain = z.infer<typeof CharacterDomainSchema>;
export type DomainName = z.infer<typeof DomainNameEnum>;
export type DomainCardType = z.infer<typeof DomainCardTypeEnum>;

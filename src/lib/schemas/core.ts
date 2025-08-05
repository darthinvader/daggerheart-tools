/**
 * Core Daggerheart Type Definitions and Base Schemas
 */
import { z } from 'zod';

// Core game primitives
export const RangeBandSchema = z.enum([
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
  'Out of Range',
]);

export const DamageTypeSchema = z.enum(['phy', 'mag']);
export const TierSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);
export const LevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

export const TraitNameSchema = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
]);

export const TraitValueSchema = z.number().int().min(-10).max(50);

// Character identity
const CORE_CLASSES = [
  'Bard',
  'Druid',
  'Guardian',
  'Ranger',
  'Rogue',
  'Seraph',
  'Sorcerer',
  'Warrior',
  'Wizard',
] as const;
const CORE_DOMAINS = [
  'Arcana',
  'Blade',
  'Bone',
  'Codex',
  'Grace',
  'Midnight',
  'Sage',
  'Splendor',
  'Valor',
] as const;
const CORE_ANCESTRIES = [
  'Clank',
  'Drakona',
  'Dwarf',
  'Elf',
  'Faerie',
  'Faun',
  'Firbolg',
  'Fungril',
  'Galapa',
  'Giant',
  'Goblin',
  'Halfling',
  'Human',
  'Infernis',
  'Katari',
  'Orc',
  'Ribbet',
  'Simiah',
  'Mixed',
] as const;
const CORE_COMMUNITIES = [
  'Highborne',
  'Loreborne',
  'Orderborne',
  'Ridgeborne',
  'Seaborne',
  'Slyborne',
  'Underborne',
  'Wanderborne',
  'Wildborne',
] as const;

export const ClassNameSchema = z.union([
  z.enum(CORE_CLASSES),
  z.string().min(1),
]);
export const DomainNameSchema = z.union([
  z.enum(CORE_DOMAINS),
  z.string().min(1),
]);
export const AncestryNameSchema = z.union([
  z.enum(CORE_ANCESTRIES),
  z.string().min(1),
]);
export const CommunityNameSchema = z.union([
  z.enum(CORE_COMMUNITIES),
  z.string().min(1),
]);

// Trait system
export const TraitsSchema = z.object({
  Agility: TraitValueSchema,
  Strength: TraitValueSchema,
  Finesse: TraitValueSchema,
  Instinct: TraitValueSchema,
  Presence: TraitValueSchema,
  Knowledge: TraitValueSchema,
});

// SRD trait validation
export const SRDTraitsSchema = TraitsSchema.refine(
  traits => {
    const values = Object.values(traits).sort((a, b) => b - a);
    const standardArray = [2, 1, 1, 0, 0, -1];
    return JSON.stringify(values) === JSON.stringify(standardArray);
  },
  {
    message:
      'Trait distribution must follow SRD standard array: [2, 1, 1, 0, 0, -1]',
  }
);

// Type exports
export type RangeBand = z.infer<typeof RangeBandSchema>;
export type DamageType = z.infer<typeof DamageTypeSchema>;
export type Tier = z.infer<typeof TierSchema>;
export type Level = z.infer<typeof LevelSchema>;
export type TraitName = z.infer<typeof TraitNameSchema>;
export type TraitValue = z.infer<typeof TraitValueSchema>;
export type ClassName = z.infer<typeof ClassNameSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
export type AncestryName = z.infer<typeof AncestryNameSchema>;
export type CommunityName = z.infer<typeof CommunityNameSchema>;
export type Traits = z.infer<typeof TraitsSchema>;
export type SRDTraits = z.infer<typeof SRDTraitsSchema>;

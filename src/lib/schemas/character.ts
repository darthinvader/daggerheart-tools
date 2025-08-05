/**
 * Character Schema and Resource Management
 * 
 * Main character definition with resources, equipment, and game state.
 * Supports both SRD-compliant and homebrew character creation.
 * 
 * @author Proper Software Architecture Team
 */

import { z } from 'zod';
import {
  TraitsSchema,
  SRDTraitsSchema,
  LevelSchema,
  TierSchema,
  AncestryNameSchema,
  CommunityNameSchema,
  ClassNameSchema
} from './core';
import { WeaponSchema, ArmorSchema } from './equipment';

///////////////////////////
// Character Resources   //
///////////////////////////

export const HitPointsSchema = z.object({
  maxSlots: z.number().min(1).int(),
  marked: z.number().min(0).int(),
  temporaryBonus: z.number().int().default(0)
}).refine(data => data.marked <= data.maxSlots + Math.max(0, data.temporaryBonus), {
  message: "Marked hit points cannot exceed maximum + temporary bonus"
});

export const StressTrackSchema = z.object({
  maxSlots: z.number().min(1).int(),
  marked: z.number().min(0).int(),
  temporaryBonus: z.number().int().default(0)
}).refine(data => data.marked <= data.maxSlots + Math.max(0, data.temporaryBonus), {
  message: "Marked stress cannot exceed maximum + temporary bonus"
});

export const HopeStateSchema = z.object({
  current: z.number().min(0).max(6).int(),
  maximum: z.literal(6),
  sessionGenerated: z.number().min(0).int().default(0)
});

///////////////////////////
// Character Schema      //
///////////////////////////

const BasePlayerCharacterSchema = z.object({
  // Core Identity
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  pronouns: z.string().optional(),
  description: z.string().optional(),

  // Core Stats (more flexible for homebrew)
  level: LevelSchema,
  tier: TierSchema,
  evasion: z.number().min(0).max(50).int(), // Extended for homebrew
  proficiency: z.number().min(0).max(20).int(), // Extended for homebrew

  // Character Building
  traits: TraitsSchema,
  ancestry: AncestryNameSchema,
  community: CommunityNameSchema,
  className: ClassNameSchema,

  // Resources
  hitPoints: HitPointsSchema,
  stress: StressTrackSchema,
  hope: HopeStateSchema,

  // Equipment
  primaryWeapon: WeaponSchema.optional(),
  secondaryWeapon: WeaponSchema.optional(),
  armor: ArmorSchema.optional(),

  // Dynamic State
  conditions: z.array(z.string()).default([]),
  temporaryEffects: z.array(z.string()).default([]),

  // Homebrew support
  homebrewMode: z.boolean().default(false),
  rulesVersion: z.string().default("SRD-1.0"),

  // Extensibility
  tags: z.array(z.string()).optional(),
  data: z.record(z.string(), z.unknown()).optional()
}).refine((character) => {
  // Equipment validation: cannot have secondary weapon if primary is two-handed
  if (character.primaryWeapon?.burden === "Two-Handed" && character.secondaryWeapon) {
    return false;
  }
  return true;
}, {
  message: "Cannot equip secondary weapon when primary weapon is two-handed"
});

// SRD-compliant character schema with strict validation
export const SRDPlayerCharacterSchema = BasePlayerCharacterSchema.extend({
  homebrewMode: z.literal(false),
  traits: SRDTraitsSchema, // Use strict SRD trait validation
  evasion: z.number().min(6).max(20).int(), // SRD bounds
  proficiency: z.number().min(0).max(6).int() // SRD bounds
}).refine((character) => {
  // Cross-field validation: tier must match level (SRD rule)
  const expectedTier = character.level === 1 ? 1 :
    character.level <= 4 ? 2 :
      character.level <= 7 ? 3 : 4;
  return character.tier === expectedTier;
}, {
  message: "Character tier must match level (1=T1, 2-4=T2, 5-7=T3, 8-10=T4)"
});

// Flexible schema for homebrew content
export const PlayerCharacterSchema = BasePlayerCharacterSchema;

///////////////////////////
// Type Exports          //
///////////////////////////

export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
export type SRDPlayerCharacter = z.infer<typeof SRDPlayerCharacterSchema>;
export type HitPoints = z.infer<typeof HitPointsSchema>;
export type StressTrack = z.infer<typeof StressTrackSchema>;
export type HopeState = z.infer<typeof HopeStateSchema>;

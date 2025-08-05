/**
 * Character Schema and Resource Management
 */
import { z } from 'zod';

import {
  AncestryNameSchema,
  ClassNameSchema,
  CommunityNameSchema,
  LevelSchema,
  SRDTraitsSchema,
  TierSchema,
  TraitsSchema,
} from './core';
import { ArmorSchema, WeaponSchema } from './equipment';

// Character resources
export const HitPointsSchema = z
  .object({
    maxSlots: z.number().min(1).int(),
    marked: z.number().min(0).int(),
    temporaryBonus: z.number().int().default(0),
  })
  .refine(
    data => data.marked <= data.maxSlots + Math.max(0, data.temporaryBonus),
    { message: 'Marked hit points cannot exceed maximum + temporary bonus' }
  );

export const StressTrackSchema = z
  .object({
    maxSlots: z.number().min(1).int(),
    marked: z.number().min(0).int(),
    temporaryBonus: z.number().int().default(0),
  })
  .refine(
    data => data.marked <= data.maxSlots + Math.max(0, data.temporaryBonus),
    { message: 'Marked stress cannot exceed maximum + temporary bonus' }
  );

export const HopeStateSchema = z.object({
  current: z.number().min(0).max(6).int(),
  maximum: z.literal(6),
  sessionGenerated: z.number().min(0).int().default(0),
});

// Main character schema with conditional validation
export const PlayerCharacterSchema = z
  .object({
    // Core identity
    id: z.string().min(1),
    name: z.string().min(1).max(100),
    pronouns: z.string().optional(),
    description: z.string().optional(),

    // Core stats
    level: LevelSchema,
    tier: TierSchema,
    evasion: z.number().min(0).max(50).int(),
    proficiency: z.number().min(0).max(20).int(),

    // Character building
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

    // Dynamic state
    conditions: z.array(z.string()).default([]),
    temporaryEffects: z.array(z.string()).default([]),

    // Mode and versioning
    homebrewMode: z.boolean().default(false),
    rulesVersion: z.string().default('SRD-1.0'),

    // Extensibility
    tags: z.array(z.string()).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .refine(
    character => {
      // Equipment validation: no secondary weapon with two-handed primary
      if (
        character.primaryWeapon?.burden === 'Two-Handed' &&
        character.secondaryWeapon
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Cannot equip secondary weapon when primary weapon is two-handed',
    }
  )
  .refine(
    character => {
      // SRD mode validations
      if (!character.homebrewMode) {
        // Validate traits follow SRD rules
        const traitValidation = SRDTraitsSchema.safeParse(character.traits);
        if (!traitValidation.success) return false;

        // Validate tier matches level
        const expectedTier =
          character.level === 1
            ? 1
            : character.level <= 4
              ? 2
              : character.level <= 7
                ? 3
                : 4;
        if (character.tier !== expectedTier) return false;

        // Validate stat bounds for SRD
        if (character.evasion < 6 || character.evasion > 20) return false;
        if (character.proficiency < 0 || character.proficiency > 6)
          return false;
      }
      return true;
    },
    {
      message:
        'Character violates SRD rules (check traits, tier/level match, and stat bounds)',
    }
  );

// Convenience schema for SRD validation
export const SRDPlayerCharacterSchema = PlayerCharacterSchema.refine(
  character => !character.homebrewMode,
  { message: 'Character must not be in homebrew mode for SRD validation' }
);

// Type exports
export type PlayerCharacter = z.infer<typeof PlayerCharacterSchema>;
export type SRDPlayerCharacter = z.infer<typeof SRDPlayerCharacterSchema>;
export type HitPoints = z.infer<typeof HitPointsSchema>;
export type StressTrack = z.infer<typeof StressTrackSchema>;
export type HopeState = z.infer<typeof HopeStateSchema>;

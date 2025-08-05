/**
 * Validation Utilities and Factory Functions
 * 
 * Provides validation, character creation, and utility functions
 * for both SRD-compliant and homebrew character management.
 * 
 * @author Proper Software Architecture Team
 */

import { z } from 'zod';
import {
  TraitsSchema,
  SRDTraitsSchema
} from './core';
import type {
  Traits,
  TraitName,
  Level,
  Tier,
  AncestryName,
  CommunityName,
  ClassName
} from './core';
import {
  PlayerCharacterSchema,
  SRDPlayerCharacterSchema
} from './character';
import type { PlayerCharacter } from './character';

///////////////////////////
// Validation Utilities  //
///////////////////////////

export class CharacterValidator {
  static validate(
    character: unknown
  ): { success: true; data: PlayerCharacter } | { success: false; error: z.ZodError } {
    return PlayerCharacterSchema.safeParse(character);
  }

  static validateSRD(
    character: unknown
  ): { success: true; data: PlayerCharacter } | { success: false; error: z.ZodError } {
    return SRDPlayerCharacterSchema.safeParse(character);
  }

  static validatePartial(
    character: unknown
  ): { success: true; data: Partial<PlayerCharacter> } | { success: false; error: z.ZodError } {
    return PlayerCharacterSchema.partial().safeParse(character);
  }

  static getValidationErrors(character: unknown, srdMode = false): string[] {
    const schema = srdMode ? SRDPlayerCharacterSchema : PlayerCharacterSchema;
    const result = schema.safeParse(character);
    if (result.success) return [];

    return result.error.issues.map(issue =>
      `${issue.path.join('.')}: ${issue.message}`
    );
  }
}

///////////////////////////
// Factory Functions     //
///////////////////////////

export class CharacterFactory {
  static createDefaultTraits(): Traits {
    return TraitsSchema.parse({
      Agility: 0, Strength: 0, Finesse: 0,
      Instinct: 0, Presence: 0, Knowledge: 0
    });
  }

  static createSRDTraits(
    distribution: [number, number, number, number, number, number]
  ): Traits {
    const [agility, strength, finesse, instinct, presence, knowledge] = distribution;
    return SRDTraitsSchema.parse({
      Agility: agility, Strength: strength, Finesse: finesse,
      Instinct: instinct, Presence: presence, Knowledge: knowledge
    });
  }

  static createHomebrewTraits(traits: Record<TraitName, number>): Traits {
    return TraitsSchema.parse(traits);
  }

  static createBasicCharacter(params: {
    name: string;
    level: Level;
    ancestry: AncestryName;
    community: CommunityName;
    className: ClassName;
    traits?: Traits;
    homebrewMode?: boolean;
  }): PlayerCharacter {
    const { name, level, ancestry, community, className, traits, homebrewMode = false } = params;

    const tier = CharacterUtilities.deriveTier(level);

    return PlayerCharacterSchema.parse({
      id: crypto.randomUUID(),
      name,
      level,
      tier,
      evasion: 10,
      proficiency: Math.ceil(level / 2),
      traits: traits || CharacterFactory.createDefaultTraits(),
      ancestry,
      community,
      className,
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      homebrewMode,
      rulesVersion: homebrewMode ? "Homebrew" : "SRD-1.0"
    });
  }

  static createHomebrewCharacter(params: {
    name: string;
    level: number;
    tier: number;
    evasion: number;
    proficiency: number;
    traits: Record<string, number>;
    ancestry: string;
    community: string;
    className: string;
  }): PlayerCharacter {
    return PlayerCharacterSchema.parse({
      id: crypto.randomUUID(),
      homebrewMode: true,
      rulesVersion: "Homebrew",
      hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
      stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
      hope: { current: 2, maximum: 6, sessionGenerated: 0 },
      conditions: [],
      temporaryEffects: [],
      ...params
    });
  }
}

///////////////////////////
// Utility Functions     //
///////////////////////////

export class CharacterUtilities {
  static deriveTier(level: Level): Tier {
    if (level === 1) return 1;
    if (level <= 4) return 2;
    if (level <= 7) return 3;
    return 4;
  }

  static calculateEvasion(character: PlayerCharacter): number {
    let evasion = character.evasion;

    if (character.armor) {
      // Apply armor modifiers
      for (const feature of character.armor.features) {
        if (feature === "Flexible") evasion += 1;
        if (feature === "Heavy") evasion -= 1;
      }
    }

    return Math.max(0, evasion);
  }

  static canUseDeathMove(character: PlayerCharacter): boolean {
    return character.hitPoints.marked === character.hitPoints.maxSlots - 1;
  }
}

/**
 * Simple validation utilities and character creation
 *
 * No unnecessary classes, no over-engineering, just what you actually need.
 */
import type { PlayerCharacter } from './character';
import { PlayerCharacterSchema, SRDPlayerCharacterSchema } from './character';
import type { Level, Tier, Traits } from './core';

// Simple validation functions - no pointless class wrapper
export function validateCharacter(character: unknown) {
  return PlayerCharacterSchema.safeParse(character);
}

export function validateSRDCharacter(character: unknown) {
  return SRDPlayerCharacterSchema.safeParse(character);
}

export function getValidationErrors(
  character: unknown,
  srdMode = false
): string[] {
  const schema = srdMode ? SRDPlayerCharacterSchema : PlayerCharacterSchema;
  const result = schema.safeParse(character);
  return result.success
    ? []
    : result.error.issues.map(
        issue => `${issue.path.join('.')}: ${issue.message}`
      );
}

// Character creation without unnecessary factory bloat
export function createDefaultTraits(): Traits {
  return {
    Agility: 0,
    Strength: 0,
    Finesse: 0,
    Instinct: 0,
    Presence: 0,
    Knowledge: 0,
  };
}

export function createSRDTraits(
  distribution: [number, number, number, number, number, number]
): Traits {
  const [agility, strength, finesse, instinct, presence, knowledge] =
    distribution;
  return {
    Agility: agility,
    Strength: strength,
    Finesse: finesse,
    Instinct: instinct,
    Presence: presence,
    Knowledge: knowledge,
  };
}

export function createBasicCharacter(params: {
  name: string;
  level: Level;
  ancestry: string;
  community: string;
  className: string;
  traits?: Traits;
  homebrewMode?: boolean;
}): PlayerCharacter {
  const {
    name,
    level,
    ancestry,
    community,
    className,
    traits,
    homebrewMode = false,
  } = params;

  return {
    id: crypto.randomUUID(),
    name,
    level,
    tier: deriveTier(level),
    evasion: 10,
    proficiency: Math.ceil(level / 2),
    traits: traits || createDefaultTraits(),
    ancestry,
    community,
    className,
    hitPoints: { maxSlots: 20, marked: 0, temporaryBonus: 0 },
    stress: { maxSlots: 6, marked: 0, temporaryBonus: 0 },
    hope: { current: 2, maximum: 6, sessionGenerated: 0 },
    conditions: [],
    temporaryEffects: [],
    homebrewMode,
    rulesVersion: homebrewMode ? 'Homebrew' : 'SRD-1.0',
  };
}

// Simple utility functions
export function deriveTier(level: Level): Tier {
  if (level === 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
}

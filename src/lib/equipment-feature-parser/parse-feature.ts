/**
 * Equipment Feature Parser
 *
 * Parses equipment feature descriptions to extract stat modifiers that can be
 * applied to character auto-calculations.
 *
 * Supported patterns:
 * - "+X to Evasion" / "−X to Evasion"
 * - "+X to Armor Score"
 * - "+X to [Trait]" (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
 * - "+X to Severe/Major damage threshold"
 * - "+X to Proficiency" / "−X Proficiency"
 * - "+X to attack rolls"
 * - "+X to Spellcast Rolls"
 * - "You gain a +X bonus to your [Trait]."
 * - "−X to all character traits and Evasion"
 * - Combined patterns: "+X to Armor Score; −Y to Evasion"
 */

import { CHARACTER_TRAITS } from '@/lib/character-stats-engine/types';
import { normalizeMinusSigns } from '@/lib/utils';

import type {
  EquipmentFeature,
  ModifiableStat,
  ParsedFeatureEffect,
  StatModifier,
} from './types';

/**
 * Parse a numeric modifier from a matched string like "+1", "−2", "-1"
 */
function parseModifierValue(match: string): number {
  const normalized = normalizeMinusSigns(match.trim());
  // Extract sign and number
  const signMatch = normalized.match(/^([+-])?(\d+)/);
  if (!signMatch) return 0;

  const sign = signMatch[1] === '-' ? -1 : 1;
  const value = parseInt(signMatch[2], 10);
  return sign * value;
}

/**
 * Map stat name from description to ModifiableStat type
 */
function mapStatName(statText: string): ModifiableStat | null {
  const normalized = statText.trim().toLowerCase();

  // Direct mappings
  const statMap: Record<string, ModifiableStat> = {
    evasion: 'evasion',
    proficiency: 'proficiency',
    'armor score': 'armorScore',
    'major damage threshold': 'majorThreshold',
    'severe damage threshold': 'severeThreshold',
    'attack rolls': 'attackRolls',
    'spellcast rolls': 'spellcastRolls',
  };

  if (statMap[normalized]) {
    return statMap[normalized];
  }

  // Check for trait names
  for (const trait of CHARACTER_TRAITS) {
    if (normalized === trait.toLowerCase()) {
      return trait;
    }
  }

  return null;
}

/**
 * Parse modifiers from the pattern: "+X to [Stat]" or "−X to [Stat]"
 * Examples: "+1 to Evasion", "−1 to Finesse", "+2 to Armor Score"
 */
function parseToPattern(description: string): StatModifier[] {
  const modifiers: StatModifier[] = [];
  const normalized = normalizeMinusSigns(description);

  // Pattern: [+/-]X to [Stat Name]
  // Captures: modifier value, stat name
  const pattern =
    /([+-]?\d+)\s*to\s+(Evasion|Proficiency|Armor Score|Major damage threshold|Severe damage threshold|attack rolls|Spellcast Rolls|Agility|Strength|Finesse|Instinct|Presence|Knowledge)/gi;

  let match;
  while ((match = pattern.exec(normalized)) !== null) {
    const value = parseModifierValue(match[1]);
    const stat = mapStatName(match[2]);

    if (stat && value !== 0) {
      modifiers.push({ stat, value });
    }
  }

  return modifiers;
}

/**
 * Parse modifiers from the pattern: "You gain a +X bonus to your [Trait]."
 * Examples: "You gain a +1 bonus to your Agility."
 */
function parseBonusPattern(description: string): StatModifier[] {
  const modifiers: StatModifier[] = [];
  const normalized = normalizeMinusSigns(description);

  // Pattern: gain a [+/-]X bonus to your [Trait]
  const pattern =
    /gain\s+a\s+([+-]?\d+)\s*bonus\s+to\s+(?:your\s+)?(Agility|Strength|Finesse|Instinct|Presence|Knowledge|Evasion|Proficiency)/gi;

  let match;
  while ((match = pattern.exec(normalized)) !== null) {
    const value = parseModifierValue(match[1]);
    const stat = mapStatName(match[2]);

    if (stat && value !== 0) {
      modifiers.push({ stat, value });
    }
  }

  return modifiers;
}

/**
 * Parse modifiers from standalone patterns: "−X Proficiency", "+X Proficiency"
 * Examples: "−1 Proficiency", "+1 Proficiency"
 */
function parseStandalonePattern(description: string): StatModifier[] {
  const modifiers: StatModifier[] = [];
  const normalized = normalizeMinusSigns(description);

  // Pattern: [+/-]X [Stat] (without "to")
  const pattern =
    /([+-]\d+)\s+(Proficiency|Evasion|Agility|Strength|Finesse|Instinct|Presence|Knowledge)(?:[,.\s]|$)/gi;

  let match;
  while ((match = pattern.exec(normalized)) !== null) {
    const value = parseModifierValue(match[1]);
    const stat = mapStatName(match[2]);

    if (stat && value !== 0) {
      modifiers.push({ stat, value });
    }
  }

  return modifiers;
}

/**
 * Parse the "all character traits and Evasion" pattern
 * Example: "−1 to all character traits and Evasion"
 */
function parseAllTraitsPattern(description: string): StatModifier[] {
  const modifiers: StatModifier[] = [];
  const normalized = normalizeMinusSigns(description);

  // Pattern: [+/-]X to all character traits
  const pattern = /([+-]?\d+)\s*to\s+all\s+character\s+traits/gi;

  let match;
  while ((match = pattern.exec(normalized)) !== null) {
    const value = parseModifierValue(match[1]);

    if (value !== 0) {
      // Add modifier for each trait
      for (const trait of CHARACTER_TRAITS) {
        modifiers.push({
          stat: trait,
          value,
          appliesToAllTraits: true,
        });
      }

      // Check if "and Evasion" is also present
      if (/and\s+Evasion/i.test(normalized)) {
        modifiers.push({
          stat: 'evasion',
          value,
          appliesToAllTraits: true,
        });
      }
    }
  }

  return modifiers;
}

/**
 * Parse a single equipment feature description and extract all stat modifiers.
 */
export function parseFeatureDescription(description: string): StatModifier[] {
  if (!description) return [];

  // Collect all modifiers from different patterns
  const allModifiers: StatModifier[] = [];

  // Try each pattern type
  allModifiers.push(...parseAllTraitsPattern(description));

  // Only parse other patterns if we didn't find "all traits" pattern
  // (to avoid double-counting)
  if (allModifiers.length === 0) {
    allModifiers.push(...parseToPattern(description));
    allModifiers.push(...parseBonusPattern(description));
    allModifiers.push(...parseStandalonePattern(description));
  }

  // Deduplicate by stat (keep the value from most specific pattern)
  const seenStats = new Set<string>();
  return allModifiers.filter(mod => {
    const key = mod.stat;
    if (seenStats.has(key)) return false;
    seenStats.add(key);
    return true;
  });
}

/**
 * Parse a complete equipment feature object and return structured effect data.
 */
export function parseFeature(feature: EquipmentFeature): ParsedFeatureEffect {
  const modifiers = parseFeatureDescription(feature.description);

  return {
    featureName: feature.name,
    description: feature.description,
    modifiers,
  };
}

/**
 * Parse all features from an array and return all effects.
 */
export function parseFeatures(
  features: EquipmentFeature[]
): ParsedFeatureEffect[] {
  return features.map(parseFeature);
}

/**
 * Check if a feature has any parseable stat modifiers.
 */
export function hasStatModifiers(feature: EquipmentFeature): boolean {
  return parseFeatureDescription(feature.description).length > 0;
}

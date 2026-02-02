/**
 * Equipment Stats Aggregator
 *
 * Aggregates normalized equipment modifiers into a single stats object.
 * This module ONLY works with normalized data from normalize-equipment.ts.
 *
 * The normalization layer handles all the complexity of:
 * - Legacy armor fields vs feature parsing
 * - Explicit statModifiers vs parsed features
 * - Equipment type detection
 */

import {
  hasAnyModifiers,
  type NormalizedModifiers,
  normalizeEquipment,
} from './normalize-equipment';
import type { AggregatedEquipmentStats, CharacterTrait } from './types';

const INITIAL_TRAITS: Record<CharacterTrait, number> = {
  Agility: 0,
  Strength: 0,
  Finesse: 0,
  Instinct: 0,
  Presence: 0,
  Knowledge: 0,
};

/**
 * Create an empty aggregated stats object.
 */
export function createEmptyAggregatedStats(): AggregatedEquipmentStats {
  return {
    evasion: 0,
    proficiency: 0,
    armorScore: 0,
    majorThreshold: 0,
    severeThreshold: 0,
    attackRolls: 0,
    spellcastRolls: 0,
    traits: { ...INITIAL_TRAITS },
    parsedFeatures: [],
  };
}

/**
 * Add normalized modifiers to aggregated stats.
 */
function addModifiers(
  stats: AggregatedEquipmentStats,
  mods: NormalizedModifiers
): void {
  stats.evasion += mods.evasion;
  stats.proficiency += mods.proficiency;
  stats.armorScore += mods.armorScore;
  stats.majorThreshold += mods.majorThreshold;
  stats.severeThreshold += mods.severeThreshold;
  stats.attackRolls += mods.attackRolls;
  stats.spellcastRolls += mods.spellcastRolls;

  for (const trait of Object.keys(mods.traits) as CharacterTrait[]) {
    stats.traits[trait] += mods.traits[trait];
  }

  // Track source for display
  if (hasAnyModifiers(mods)) {
    stats.parsedFeatures.push({
      featureName: mods.equipmentName ?? 'Equipment',
      description: `Source: ${mods.source}`,
      modifiers: [],
    });
  }
}

/**
 * Check if a primary weapon is Two-Handed.
 */
function isPrimaryTwoHanded(primaryWeapon: unknown): boolean {
  if (!primaryWeapon || typeof primaryWeapon !== 'object') return false;
  const weapon = primaryWeapon as Record<string, unknown>;
  return weapon.burden === 'Two-Handed';
}

/**
 * Aggregate stat modifiers from all equipped items.
 *
 * Each equipment item is normalized first, then aggregated.
 * The normalization handles all equipment-type-specific logic.
 *
 * NOTE: If the primary weapon is Two-Handed, secondary weapon bonuses are skipped.
 *
 * @param armor - The equipped armor (if any)
 * @param primaryWeapon - The equipped primary weapon (if any)
 * @param secondaryWeapon - The equipped secondary weapon (if any)
 * @param wheelchair - The equipped combat wheelchair (if any)
 * @returns Aggregated stat modifiers from all equipment
 */
export function aggregateEquipmentStats(
  armor?: unknown,
  primaryWeapon?: unknown,
  secondaryWeapon?: unknown,
  wheelchair?: unknown
): AggregatedEquipmentStats {
  const stats = createEmptyAggregatedStats();

  // Normalize each equipment piece and aggregate
  addModifiers(stats, normalizeEquipment(armor));
  addModifiers(stats, normalizeEquipment(primaryWeapon));

  // Skip secondary weapon bonuses if primary is Two-Handed
  if (!isPrimaryTwoHanded(primaryWeapon)) {
    addModifiers(stats, normalizeEquipment(secondaryWeapon));
  }

  addModifiers(stats, normalizeEquipment(wheelchair));

  return stats;
}

/**
 * Aggregate from pre-normalized modifiers.
 * Use when you've already normalized the equipment.
 */
export function aggregateNormalizedModifiers(
  ...modifiers: NormalizedModifiers[]
): AggregatedEquipmentStats {
  const stats = createEmptyAggregatedStats();

  for (const mods of modifiers) {
    addModifiers(stats, mods);
  }

  return stats;
}

/** Format a stat modifier for display */
function formatModifier(label: string, value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${label}: ${sign}${value}`;
}

/** Stat labels for summary display */
const STAT_LABELS: Array<{
  key: keyof AggregatedEquipmentStats;
  label: string;
}> = [
  { key: 'evasion', label: 'Evasion' },
  { key: 'proficiency', label: 'Proficiency' },
  { key: 'armorScore', label: 'Armor Score' },
  { key: 'majorThreshold', label: 'Major Threshold' },
  { key: 'severeThreshold', label: 'Severe Threshold' },
  { key: 'attackRolls', label: 'Attack Rolls' },
  { key: 'spellcastRolls', label: 'Spellcast Rolls' },
];

/**
 * Get a human-readable summary of equipment stat modifiers.
 * Useful for tooltips or debug displays.
 */
export function getEquipmentStatsSummary(
  stats: AggregatedEquipmentStats
): string[] {
  const lines: string[] = [];

  // Add simple stat modifiers
  for (const { key, label } of STAT_LABELS) {
    const value = stats[key];
    if (typeof value === 'number' && value !== 0) {
      lines.push(formatModifier(label, value));
    }
  }

  // Add trait modifiers
  for (const [trait, value] of Object.entries(stats.traits)) {
    if (value !== 0) {
      lines.push(formatModifier(trait, value));
    }
  }

  return lines;
}

// Re-export normalization utilities for convenience
export {
  createEmptyModifiers,
  hasAnyModifiers,
  type NormalizedModifiers,
  normalizeEquipment,
} from './normalize-equipment';

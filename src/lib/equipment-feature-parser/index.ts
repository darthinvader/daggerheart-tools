/**
 * Equipment Feature Parser
 *
 * This module provides utilities for parsing equipment feature descriptions
 * and extracting stat modifiers that can be applied to character auto-calculations.
 *
 * Architecture:
 * 1. normalize-equipment.ts - Converts raw equipment to unified modifier format
 * 2. aggregate-stats.ts - Aggregates normalized modifiers into final stats
 * 3. equipment-stats-utils.ts - High-level API for use in components
 *
 * The normalization layer is the SINGLE source of truth for how modifiers are extracted:
 * - Armor: Uses legacy fields (evasionModifier, agilityModifier), NOT feature text
 * - Weapons/Wheelchair: Uses explicit statModifiers if present, otherwise parses features
 *
 * @example
 * ```ts
 * import { getEquipmentFeatureModifiers } from '@/lib/equipment-feature-parser';
 *
 * const stats = getEquipmentFeatureModifiers(equipment);
 * // stats.evasion, stats.armorScore, stats.traits.Finesse, etc.
 * ```
 */

export * from './aggregate-stats';
export * from './equipment-stats-utils';
export * from './normalize-equipment';
export * from './parse-feature';
export * from './types';

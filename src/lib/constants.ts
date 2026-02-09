/**
 * Shared game constants used across multiple features.
 */

/** Available tiers (1-4) used for adversaries, environments, equipment, and items. */
export const TIERS = ['1', '2', '3', '4'] as const;
export type Tier = (typeof TIERS)[number];

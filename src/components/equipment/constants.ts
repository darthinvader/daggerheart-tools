/**
 * Shared constants for equipment components.
 * Centralizes configuration to avoid duplication and ensure consistency.
 */

/** Preset slot types for custom equipment with their icons */
export const SLOT_PRESETS = [
  { name: 'Ring', icon: '💍' },
  { name: 'Necklace', icon: '📿' },
  { name: 'Cloak', icon: '🧥' },
  { name: 'Belt', icon: '🎗️' },
  { name: 'Boots', icon: '👢' },
  { name: 'Gloves', icon: '🧤' },
  { name: 'Bracers', icon: '⌚' },
  { name: 'Circlet', icon: '👑' },
  { name: 'Amulet', icon: '🔮' },
  { name: 'Trinket', icon: '✨' },
  { name: 'Custom', icon: '🎲' },
] as const;

export type SlotPreset = (typeof SLOT_PRESETS)[number];
export type SlotPresetName = SlotPreset['name'];

/** Available equipment tiers (1-4) */
export const TIERS = ['1', '2', '3', '4'] as const;
export type Tier = (typeof TIERS)[number];

/** Weapon traits that determine which stat is used for attacks */
export const TRAITS = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Spellcast',
] as const;
export type Trait = (typeof TRAITS)[number];

/** Weapon range categories */
export const RANGES = [
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
] as const;
export type Range = (typeof RANGES)[number];

/** Weapon burden (one or two hands) */
export const BURDENS = ['One-Handed', 'Two-Handed'] as const;
export type Burden = (typeof BURDENS)[number];

/** Damage types with display labels */
export const DAMAGE_TYPES = [
  { value: 'phy', label: '⚔️ Physical' },
  { value: 'mag', label: '✨ Magic' },
] as const;

/** Available dice types for damage rolls */
export const DICE_TYPES = [4, 6, 8, 10, 12, 20] as const;
export type DiceType = (typeof DICE_TYPES)[number];

/** Standard armor categories */
export const ARMOR_TYPES = [
  'Gambeson',
  'Leather',
  'Chainmail',
  'Full Plate',
  'Custom',
] as const;
export type ArmorType = (typeof ARMOR_TYPES)[number];

/** Default damage values for new homebrew weapons */
export const DEFAULT_DAMAGE = {
  diceType: 8,
  count: 1,
  modifier: 0,
  type: 'phy',
} as const;

import {
  Axe,
  Crosshair,
  EquipmentSlotIcons,
  Grip,
  Hand,
  HandMetal,
  type LucideIcon,
  MapPin,
  Sparkles,
  Star,
  Sword,
  Target,
} from '@/lib/icons';
import type {
  CombatWheelchair,
  SpecialArmor,
  StandardArmor,
} from '@/lib/schemas/equipment';

/**
 * Shared constants for equipment components.
 * Centralizes configuration to avoid duplication and ensure consistency.
 */

/** Type guard for standard armor */
export function isStandardArmor(
  armor: StandardArmor | SpecialArmor
): armor is StandardArmor {
  return armor.isStandard === true;
}

/** Type guard for combat wheelchair */
export function isCombatWheelchair(
  weapon: unknown
): weapon is CombatWheelchair {
  return typeof weapon === 'object' && weapon !== null && 'frameType' in weapon;
}

/** Preset slot types for custom equipment with their icon components */
export const SLOT_PRESETS = [
  { name: 'Ring', iconKey: 'ring' as const },
  { name: 'Necklace', iconKey: 'necklace' as const },
  { name: 'Cloak', iconKey: 'cloak' as const },
  { name: 'Belt', iconKey: 'necklace' as const },
  { name: 'Boots', iconKey: 'boots' as const },
  { name: 'Gloves', iconKey: 'gloves' as const },
  { name: 'Bracers', iconKey: 'bracers' as const },
  { name: 'Circlet', iconKey: 'circlet' as const },
  { name: 'Amulet', iconKey: 'amulet' as const },
  { name: 'Trinket', iconKey: 'trinket' as const },
  { name: 'Custom', iconKey: 'custom' as const },
] as const;

/** Get the icon component for a slot preset */
export function getSlotIcon(
  iconKey: keyof typeof EquipmentSlotIcons
): LucideIcon {
  return EquipmentSlotIcons[iconKey];
}

export type SlotPreset = (typeof SLOT_PRESETS)[number];
export type SlotPresetName = SlotPreset['name'];

export { type Tier, TIERS } from '@/lib/constants';

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
  { value: 'phy', label: 'Physical' },
  { value: 'mag', label: 'Magic' },
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

/** Icon mappings for damage types */
export const DAMAGE_TYPE_ICONS = {
  phy: Sword,
  mag: Sparkles,
} as const;

/** Get damage type icon component */
export function getDamageIcon(type: 'phy' | 'mag'): LucideIcon {
  return DAMAGE_TYPE_ICONS[type] ?? Sword;
}

/** Icon mappings for weapon ranges */
export const RANGE_ICONS = {
  Melee: HandMetal,
  'Very Close': Axe,
  Close: Target,
  Far: Crosshair,
  'Very Far': Star,
} as const;

/** Get range icon component */
export function getRangeIcon(range: string): LucideIcon {
  return RANGE_ICONS[range as keyof typeof RANGE_ICONS] ?? MapPin;
}

/** Icon mappings for weapon burden */
export const BURDEN_ICONS = {
  'One-Handed': Hand,
  'Two-Handed': Grip,
} as const;

/** Get burden icon component */
export function getBurdenIcon(burden: string): LucideIcon {
  return BURDEN_ICONS[burden as keyof typeof BURDEN_ICONS] ?? Hand;
}

/** Format damage dice for display */
export function formatDamage(damage: {
  count: number;
  diceType: number;
  modifier: number;
}): string {
  const base = `${damage.count}d${damage.diceType}`;
  const mod =
    damage.modifier > 0
      ? `+${damage.modifier}`
      : damage.modifier < 0
        ? String(damage.modifier)
        : '';
  return `${base}${mod}`;
}

/** Default equipment state for new characters */
export const DEFAULT_EQUIPMENT_STATE = {
  primaryWeapon: null,
  primaryWeaponMode: 'standard' as const,
  homebrewPrimaryWeapon: { type: 'Primary' as const, features: [] },
  primaryWeaponActivated: true,

  secondaryWeapon: null,
  secondaryWeaponMode: 'standard' as const,
  homebrewSecondaryWeapon: { type: 'Secondary' as const, features: [] },
  secondaryWeaponActivated: true,

  armor: null,
  armorMode: 'standard' as const,
  homebrewArmor: { features: [] },
  armorActivated: true,

  useCombatWheelchair: false,
  combatWheelchair: null,
  wheelchairMode: 'standard' as const,
  homebrewWheelchair: {
    type: 'Primary' as const,
    features: [],
    wheelchairFeatures: [],
    frameType: 'Light' as const,
  },
  wheelchairActivated: true,

  customSlots: [],
};

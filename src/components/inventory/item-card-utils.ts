import type { EquipmentTier, Rarity } from '@/lib/schemas/equipment';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  LOCATION_CONFIG,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';

export interface ItemCardConfigs {
  categoryConfig: (typeof CATEGORY_CONFIG)[ItemCategory] | null;
  rarityConfig: (typeof RARITY_CONFIG)[Rarity];
  tierConfig: (typeof TIER_CONFIG)[EquipmentTier];
  locationConfig: (typeof LOCATION_CONFIG)[keyof typeof LOCATION_CONFIG] | null;
}

export function getItemConfigs(
  category: ItemCategory | undefined,
  rarity: Rarity,
  tier: EquipmentTier,
  location: keyof typeof LOCATION_CONFIG
): ItemCardConfigs {
  return {
    categoryConfig: category ? CATEGORY_CONFIG[category] : null,
    rarityConfig: RARITY_CONFIG[rarity],
    tierConfig: TIER_CONFIG[tier],
    locationConfig: LOCATION_CONFIG[location] ?? null,
  };
}

const EQUIPPABLE_CATEGORIES = new Set<ItemCategory>([
  'Relic',
  'Weapon Modification',
  'Armor Modification',
]);

export function isEquippableCategory(
  category: ItemCategory | undefined
): boolean {
  return category != null && EQUIPPABLE_CATEGORIES.has(category);
}

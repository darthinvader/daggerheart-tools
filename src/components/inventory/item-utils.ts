import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';

import {
  CATEGORY_CONFIG,
  type ItemCategory,
  RARITY_CONFIG,
  TIER_CONFIG,
} from './constants';

export function getItemEmoji(item: {
  category?: string;
  type?: string;
}): string {
  const category = item.category as ItemCategory;
  if (category && CATEGORY_CONFIG[category]) {
    return CATEGORY_CONFIG[category].emoji;
  }
  return '📦';
}

export function getItemDetails(item: AnyItem) {
  const category = (item as { category?: string }).category as ItemCategory;
  const catConfig = category ? CATEGORY_CONFIG[category] : null;
  const rarityConfig = RARITY_CONFIG[item.rarity as Rarity];
  const tierConfig = TIER_CONFIG[item.tier as EquipmentTier];
  return { category, catConfig, rarityConfig, tierConfig };
}

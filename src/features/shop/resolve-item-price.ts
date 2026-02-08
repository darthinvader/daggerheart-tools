import type { Item } from '@/lib/schemas/equipment';

import type { EstimatedCost } from '../characters/logic/cost';
import { estimateItemCost } from '../characters/logic/cost';
import { costToHandfuls } from './gold-math';

export interface ShopPricingConfig {
  priceMultiplier?: number;
  categoryMultipliers?: Record<string, number>;
  itemPriceOverrides?: Record<string, number>;
}

export interface ResolvedPrice {
  /** Final price in handfuls */
  handfuls: number;
  /** How the price was determined */
  source: 'override' | 'estimated';
  /** The raw EstimatedCost before multipliers (only for 'estimated') */
  baseCost?: EstimatedCost;
}

/**
 * Resolve the final price for an item given campaign shop settings.
 *
 * Priority:
 *   1. itemPriceOverrides[item.name] — direct GM override (already in handfuls)
 *   2. estimateItemCost × categoryMultiplier × priceMultiplier
 */
export function resolveItemPrice(
  item: Item,
  config: ShopPricingConfig = {}
): ResolvedPrice {
  const {
    priceMultiplier = 1,
    categoryMultipliers = {},
    itemPriceOverrides = {},
  } = config;

  // 1. Direct override — returned as-is (GM already set the final price).
  //    Not rounded so coin-precision (decimal handfuls) is preserved.
  const overridePrice = itemPriceOverrides[item.name];
  if (overridePrice !== undefined) {
    return {
      handfuls: Math.max(0, overridePrice),
      source: 'override',
    };
  }

  // 2. Heuristic estimate × multipliers
  const baseCost = estimateItemCost(item);
  const baseHandfuls = costToHandfuls(baseCost);

  const category = (item as Item & { category?: string }).category ?? '';
  const categoryMul = categoryMultipliers[category] ?? 1;

  const finalHandfuls = Math.max(
    0,
    Math.round(baseHandfuls * categoryMul * priceMultiplier)
  );

  return { handfuls: finalHandfuls, source: 'estimated', baseCost };
}

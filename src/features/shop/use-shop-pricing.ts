import { useMemo } from 'react';

import type { AnyItem, Item } from '@/lib/schemas/equipment';

import type { ResolvedPrice, ShopPricingConfig } from './resolve-item-price';
import { resolveItemPrice } from './resolve-item-price';

/**
 * Memoised pricing lookup for a list of items.
 * Returns a Map<itemName, ResolvedPrice> for O(1) access.
 */
export function useShopPricing(
  items: AnyItem[],
  config: ShopPricingConfig = {}
) {
  return useMemo(() => {
    const prices = new Map<string, ResolvedPrice>();
    for (const item of items) {
      if (!prices.has(item.name)) {
        prices.set(item.name, resolveItemPrice(item as Item, config));
      }
    }
    return prices;
  }, [items, config]);
}

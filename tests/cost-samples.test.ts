import { describe, expect, it } from 'vitest';

import { estimateItemCost } from '@/features/characters/logic/cost';
import {
  CONSUMABLES,
  POTIONS,
  RECIPES,
  RELICS,
  UTILITY_ITEMS,
  WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';

const ALL: any[] = [
  ...UTILITY_ITEMS,
  ...WEAPON_MODIFICATIONS,
  ...RELICS,
  ...RECIPES,
  ...POTIONS,
  ...CONSUMABLES,
];

function byName(name: string) {
  return ALL.find(i => i.name === name);
}

describe('estimateItemCost samples', () => {
  it('prints sample costs', () => {
    const names = [
      'Premium Bedroll',
      'Piper Whistle',
      'Portal Seed',
      'Stride Relic',
      'Mythic Dust Recipe',
      'Bloodstone',
      'Phoenix Feather',
    ];
    for (const n of names) {
      const it = byName(n);
      expect(it, `Item not found: ${n}`).toBeTruthy();
      const c = estimateItemCost(it);

      console.log(`${n}: H=${c.handfuls}, B=${c.bags}, C=${c.chests}`);
      expect(c.handfuls).toBeGreaterThanOrEqual(0);
      expect(c.bags).toBeGreaterThanOrEqual(0);
      expect(c.chests).toBeGreaterThanOrEqual(0);
    }
  });
});

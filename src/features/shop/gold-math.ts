import type { Gold } from '@/lib/schemas/character-state';

import type { EstimatedCost } from '../characters/logic/cost';
import { normalizeHandfuls } from '../characters/logic/cost';

// =====================================================================================
// Gold ↔ Coins conversion
// =====================================================================================

/** Convert a Gold object to total coins (1 handful = 10 coins, 1 bag = 100, 1 chest = 1000). */
export function goldToCoins(gold: Gold): number {
  return (
    (gold.coins ?? 0) +
    gold.handfuls * 10 +
    gold.bags * 100 +
    gold.chests * 1000
  );
}

/** Convert total coins back to a Gold-compatible object. */
export function coinsToGold(
  totalCoins: number
): Pick<Gold, 'handfuls' | 'bags' | 'chests' | 'coins'> {
  const safe = Math.max(0, Math.round(totalCoins));
  const coins = safe % 10;
  const remaining = Math.floor(safe / 10);
  const { handfuls, bags, chests } = normalizeHandfuls(remaining);
  return { coins, handfuls, bags, chests };
}

// =====================================================================================
// EstimatedCost ↔ handfuls bridge
// =====================================================================================

/** Flatten an EstimatedCost to a single handful value for arithmetic. */
export function costToHandfuls(cost: EstimatedCost): number {
  return cost.handfuls + cost.bags * 10 + cost.chests * 100;
}

// =====================================================================================
// Affordability & subtraction
// =====================================================================================

/** Check whether the player can afford a price (in handfuls). */
export function canAfford(gold: Gold, priceHandfuls: number): boolean {
  const totalHandfuls =
    gold.handfuls +
    gold.bags * 10 +
    gold.chests * 100 +
    Math.floor((gold.coins ?? 0) / 10);
  return totalHandfuls >= priceHandfuls;
}

/**
 * Subtract a price (in handfuls) from a Gold object, returning a new Gold.
 * Preserves `showCoins` and `displayDenomination` from the original.
 * Returns undefined if insufficient funds.
 */
export function subtractGold(
  gold: Gold,
  priceHandfuls: number
): Gold | undefined {
  const totalCoins = goldToCoins(gold);
  const costCoins = priceHandfuls * 10;
  if (totalCoins < costCoins) return undefined;

  const remaining = coinsToGold(totalCoins - costCoins);
  return {
    ...remaining,
    showCoins: gold.showCoins,
    displayDenomination: gold.displayDenomination,
  };
}

// =====================================================================================
// Display formatting
// =====================================================================================

/** Convert handfuls to a breakdown of {chests, bags, handfuls, coins}. */
export function handfulsToGoldParts(totalHandfuls: number): {
  chests: number;
  bags: number;
  handfuls: number;
  coins: number;
} {
  const safe = Math.max(0, totalHandfuls);
  const totalCoins = Math.round(safe * 10);
  const coins = totalCoins % 10;
  const wholeHandfuls = Math.floor(totalCoins / 10);
  const { handfuls, bags, chests } = normalizeHandfuls(wholeHandfuls);
  return { chests, bags, handfuls, coins };
}

/** Convert denomination parts back to a total handful count. */
export function goldPartsToHandfuls(parts: {
  chests?: number;
  bags?: number;
  handfuls?: number;
  coins?: number;
}): number {
  return (
    (parts.coins ?? 0) * 0.1 +
    (parts.handfuls ?? 0) +
    (parts.bags ?? 0) * 10 +
    (parts.chests ?? 0) * 100
  );
}

/** Format a price (in handfuls) as a human-readable string. */
export function formatGoldAmount(handfuls: number): string {
  const { chests, bags, handfuls: h, coins } = handfulsToGoldParts(handfuls);
  const parts: string[] = [];
  if (chests > 0) parts.push(`${chests} chest${chests > 1 ? 's' : ''}`);
  if (bags > 0) parts.push(`${bags} bag${bags > 1 ? 's' : ''}`);
  if (h > 0) parts.push(`${h} handful${h > 1 ? 's' : ''}`);
  if (coins > 0) parts.push(`${coins} coin${coins > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(', ') : '0 handfuls';
}

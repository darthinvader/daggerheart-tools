import type { Item } from '@/lib/schemas/equipment';

export type EstimatedCost = { handfuls: number; bags: number; chests: number };

// Conversion: 10 handfuls = 1 bag, 10 bags = 1 chest (scales well for UI).
function normalizeHandfuls(totalHandfuls: number): EstimatedCost {
  const safe = Math.max(0, Math.round(totalHandfuls));
  const bags = Math.floor(safe / 10);
  const handfuls = safe % 10;
  const chests = Math.floor(bags / 10);
  return { handfuls, bags: bags % 10, chests };
}

// Simple heuristic: base by tier and rarity, add-ons for category details and features.
export function estimateItemCost(item: Item): EstimatedCost {
  // Base by tier (T1=1, T2=3, T3=6, T4=10 handfuls)
  const tierNum = Number(item.tier) || 1;
  const tierBase = [0, 1, 3, 6, 10][Math.min(4, Math.max(1, tierNum))];

  // Rarity multiplier
  const rarityMul = (() => {
    switch (item.rarity) {
      case 'Uncommon':
        return 1.5;
      case 'Rare':
        return 3;
      case 'Legendary':
        return 10;
      default:
        return 1;
    }
  })();

  // Feature weight: small bump per feature, extra if a feature mentions dice or advantage-like text
  const featureCount = item.features?.length ?? 0;
  const featurePotency = (item.features || []).reduce((sum, f) => {
    const txt = `${f.name} ${f.description}`.toLowerCase();
    const strong = /\badvantage\b|\bextra die\b|\bdouble\b|\bincrease\b/.test(
      txt
    )
      ? 0.5
      : 0;
    return sum + strong;
  }, 0);
  const featureBonus = featureCount * 0.5 + featurePotency; // base + potency

  // Category signals
  const cat = (item as unknown as { category?: string }).category;
  let categoryBase = 0;
  if (cat === 'Relic') categoryBase += 12; // Relics are special
  if (cat === 'Recipe') categoryBase += 3; // Recipes have inherent value
  if (cat === 'Weapon Modification' || cat === 'Armor Modification')
    categoryBase += 2;

  // Consumables: slight discount; potions can add based on healing/trait
  const isConsumable =
    (item as unknown as { category?: string }).category === 'Consumable';
  const potionType = (item as unknown as { potionType?: unknown }).potionType;
  if (isConsumable && !potionType) categoryBase -= 0.5;

  // Charges reduce unit price a bit compared to unlimited tools
  const charges = (item as unknown as { charges?: number }).charges;
  const chargeAdj =
    typeof charges === 'number' && charges > 0
      ? Math.max(-0.5, -0.1 * Math.log2(charges))
      : 0;

  // Weight: heavier utility may be more valuable to craft; tiny bump for medium-heavy items
  const weightAdj = (() => {
    const w = (item as unknown as { weight?: number | string }).weight as
      | number
      | undefined;
    if (typeof w === 'number') {
      if (w >= 8) return 0.8;
      if (w >= 4) return 0.4;
      if (w >= 2) return 0.2;
    }
    return 0;
  })();

  // Potion specifics
  const potionAdj = (() => {
    const heal = (item as unknown as { healingAmount?: number })
      .healingAmount as number | undefined;
    const traitBonus = (item as unknown as { traitBonus?: { bonus?: number } })
      .traitBonus as { bonus?: number } | undefined;
    let adj = 0;
    if (typeof heal === 'number') adj += Math.min(5, Math.max(0, heal / 5)); // scale healing modestly
    if (traitBonus?.bonus) adj += Math.min(3, traitBonus.bonus * 0.8);
    return adj;
  })();

  // Recipe complexity
  const recipeAdj = (() => {
    const mats = (item as unknown as { materials?: unknown[] }).materials as
      | unknown[]
      | undefined;
    const downtime = (item as unknown as { downtimeRequired?: boolean })
      .downtimeRequired as boolean | undefined;
    const count = Array.isArray(mats) ? mats.length : 0;
    return count * 0.4 + (downtime ? 1.2 : 0);
  })();

  // Relic bonuses
  const relicAdj = (() => {
    const xp = (item as unknown as { experienceBonus?: { bonus?: number } })
      .experienceBonus;
    const trait = (item as unknown as { traitBonus?: { bonus?: number } })
      .traitBonus;
    let adj = 0;
    if (xp?.bonus) adj += Math.min(4, xp.bonus * 0.5);
    if (trait?.bonus) adj += Math.min(4, trait.bonus * 0.6);
    return adj;
  })();

  // Respect explicit cost if provided: treat as handfuls directly
  if (typeof item.cost === 'number' && item.cost >= 0) {
    return normalizeHandfuls(item.cost);
  }

  const handfuls = Math.round(
    (tierBase +
      categoryBase +
      featureBonus +
      chargeAdj +
      weightAdj +
      potionAdj +
      recipeAdj +
      relicAdj) *
      rarityMul
  );
  return normalizeHandfuls(handfuls);
}

import type { Item } from '@/lib/schemas/equipment';

export type EstimatedCost = { handfuls: number; bags: number; chests: number };

// Type for item with optional extended properties
type ItemExtended = Item & {
  category?: string;
  subcategory?: string;
  charges?: number;
  weight?: number | string;
  healingAmount?: number;
  potionType?: unknown;
  traitBonus?: { bonus?: number };
  experienceBonus?: { bonus?: number };
  materials?: unknown[];
  downtimeRequired?: boolean;
};

// Conversion: 10 handfuls = 1 bag, 10 bags = 1 chest (scales well for UI).
export function normalizeHandfuls(totalHandfuls: number): EstimatedCost {
  const safe = Math.max(0, Math.round(totalHandfuls));
  const bags = Math.floor(safe / 10);
  const handfuls = safe % 10;
  const chests = Math.floor(bags / 10);
  return { handfuls, bags: bags % 10, chests };
}

// Tier base values: T1=1, T2=3, T3=6, T4=10 handfuls
function getTierBase(tier: string | number | undefined): number {
  const tierNum = Number(tier) || 1;
  return [0, 1, 3, 6, 10][Math.min(4, Math.max(1, tierNum))];
}

// Rarity multiplier
function getRarityMultiplier(rarity: string | undefined): number {
  switch (rarity) {
    case 'Uncommon':
      return 1.5;
    case 'Rare':
      return 3;
    case 'Legendary':
      return 10;
    default:
      return 1;
  }
}

// Feature weight: small bump per feature, extra for powerful text
function getFeatureBonus(features: Item['features']): number {
  const featureCount = features?.length ?? 0;
  const featurePotency = (features ?? []).reduce((sum, f) => {
    const txt = `${f.name} ${f.description}`.toLowerCase();
    const strong = /\badvantage\b|\bextra die\b|\bdouble\b|\bincrease\b/.test(
      txt
    )
      ? 0.5
      : 0;
    return sum + strong;
  }, 0);
  return featureCount * 0.5 + featurePotency;
}

// Category-based adjustments
function getCategoryBase(item: ItemExtended): number {
  const cat = item.category;
  let base = 0;
  if (cat === 'Relic') base += 12;
  if (cat === 'Recipe') base += 3;
  if (cat === 'Weapon Modification' || cat === 'Armor Modification') base += 2;
  if (cat === 'Consumable' && !item.potionType) base -= 0.5;
  return base;
}

// Charges reduce unit price slightly
function getChargeAdjustment(charges: number | undefined): number {
  return typeof charges === 'number' && charges > 0
    ? Math.max(-0.5, -0.1 * Math.log2(charges))
    : 0;
}

// Weight adjustment for heavier items
function getWeightAdjustment(weight: number | string | undefined): number {
  if (typeof weight === 'number') {
    if (weight >= 8) return 0.8;
    if (weight >= 4) return 0.4;
    if (weight >= 2) return 0.2;
  }
  return 0;
}

// Potion-specific value adjustments
function getPotionAdjustment(item: ItemExtended): number {
  let adj = 0;
  if (typeof item.healingAmount === 'number') {
    adj += Math.min(5, Math.max(0, item.healingAmount / 5));
  }
  if (item.traitBonus?.bonus) {
    adj += Math.min(3, item.traitBonus.bonus * 0.8);
  }
  return adj;
}

// Recipe complexity adjustment
function getRecipeAdjustment(item: ItemExtended): number {
  const count = Array.isArray(item.materials) ? item.materials.length : 0;
  return count * 0.4 + (item.downtimeRequired ? 1.2 : 0);
}

// Relic bonus adjustment
function getRelicAdjustment(item: ItemExtended): number {
  let adj = 0;
  if (item.experienceBonus?.bonus) {
    adj += Math.min(4, item.experienceBonus.bonus * 0.5);
  }
  if (item.traitBonus?.bonus) {
    adj += Math.min(4, item.traitBonus.bonus * 0.6);
  }
  return adj;
}

// Simple heuristic: base by tier and rarity, add-ons for category details and features.
export function estimateItemCost(item: Item): EstimatedCost {
  // Respect explicit cost if provided
  if (typeof item.cost === 'number' && item.cost >= 0) {
    return normalizeHandfuls(item.cost);
  }

  const extendedItem = item as ItemExtended;
  const tierBase = getTierBase(item.tier);
  const rarityMul = getRarityMultiplier(item.rarity);
  const featureBonus = getFeatureBonus(item.features);
  const categoryBase = getCategoryBase(extendedItem);
  const chargeAdj = getChargeAdjustment(extendedItem.charges);
  const weightAdj = getWeightAdjustment(extendedItem.weight);
  const potionAdj = getPotionAdjustment(extendedItem);
  const recipeAdj = getRecipeAdjustment(extendedItem);
  const relicAdj = getRelicAdjustment(extendedItem);

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

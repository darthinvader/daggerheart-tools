import type {
  ArmorModification,
  Consumable,
  Item,
  Potion,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

export type HomebrewBase = {
  name: string;
  tier: '1' | '2' | '3' | '4';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  description?: string;
  isConsumable: boolean;
  maxQuantity: number;
  weight?: string;
  cost?: number | '';
};

export type HomebrewCategory =
  | 'Utility'
  | 'Consumable'
  | 'Potion'
  | 'Relic'
  | 'Weapon Modification'
  | 'Armor Modification'
  | 'Recipe';

export type UtilityState = {
  usageType: string;
  charges: number | '';
  recharge: string;
};

export type ConsumableState = {
  effect: string;
  duration: string;
  targetType: string;
};

export type PotionState = {
  potionType: string;
  healingAmount: string;
  traitBonusTrait: string;
  traitBonusAmount: number | '';
  traitBonusDuration: string;
};

export type RelicState = {
  relicTrait: string;
  relicTraitBonus: number | '';
  relicXPTrack: string;
  relicXPBonus: number | '';
};

export type ModificationState = {
  modType: string;
  compatible: string;
  modTraitChange: string;
  modFeatureName: string;
  modFeatureDesc: string;
};

export type RecipeState = {
  craftedItem: string;
  materials: string;
  downtime: boolean;
  instructions: string;
};

export type BuildHomebrewItemParams = {
  category: HomebrewCategory;
  base: HomebrewBase;
  utility?: UtilityState;
  consumable?: ConsumableState;
  potion?: PotionState;
  relic?: RelicState;
  modification?: ModificationState;
  recipe?: RecipeState;
};

export function buildHomebrewItem({
  category,
  base,
  utility,
  consumable,
  potion,
  relic,
  modification,
  recipe,
}: BuildHomebrewItemParams): Item | null {
  const name = base.name.trim();
  if (!name) return null;

  const normalizedBase: Partial<Item> = {
    name,
    tier: base.tier,
    rarity: base.rarity,
    description: base.description?.trim() || undefined,
    features: [],
    maxQuantity: Math.max(1, Number(base.maxQuantity) || 1),
    isConsumable: !!base.isConsumable,
    metadata: { homebrew: true, createdAt: Date.now() },
  };
  if (base.weight) normalizedBase.weight = base.weight;
  if (base.cost !== '' && !Number.isNaN(Number(base.cost))) {
    normalizedBase.cost = Number(base.cost);
  }

  switch (category) {
    case 'Utility': {
      const u: UtilityItem = {
        ...normalizedBase,
        category: 'Utility',
        usageType: utility?.usageType || 'unlimited',
        charges:
          utility?.charges === '' ? undefined : Number(utility?.charges) || 0,
        rechargePeriod: utility?.recharge || undefined,
        metadata: normalizedBase.metadata as never,
      } as unknown as UtilityItem;
      return u as unknown as Item;
    }
    case 'Consumable': {
      const c: Consumable = {
        ...normalizedBase,
        category: 'Consumable',
        isConsumable: true,
        effect: consumable?.effect || 'Effect',
        duration: consumable?.duration || undefined,
        targetType: consumable?.targetType || undefined,
        metadata: normalizedBase.metadata as never,
      } as unknown as Consumable;
      return c as unknown as Item;
    }
    case 'Potion': {
      const p: Potion = {
        ...normalizedBase,
        category: 'Consumable',
        subcategory: 'Potion',
        isConsumable: true,
        potionType: (potion?.potionType || 'Health') as never,
        healingAmount: potion?.healingAmount || undefined,
        traitBonus:
          potion?.traitBonusTrait &&
          potion?.traitBonusAmount &&
          potion?.traitBonusDuration
            ? {
                trait: potion.traitBonusTrait as never,
                bonus: Number(potion.traitBonusAmount) || 1,
                duration: potion.traitBonusDuration as never,
              }
            : undefined,
        effect: consumable?.effect || undefined,
        duration: consumable?.duration || undefined,
        targetType: consumable?.targetType || undefined,
        metadata: normalizedBase.metadata as never,
      } as unknown as Potion;
      return p as unknown as Item;
    }
    case 'Relic': {
      const r: Relic = {
        ...normalizedBase,
        category: 'Relic',
        rarity: 'Legendary',
        traitBonus:
          relic?.relicTrait && relic?.relicTraitBonus !== ''
            ? {
                trait: relic.relicTrait as never,
                bonus: Number(relic.relicTraitBonus) || 1,
              }
            : undefined,
        experienceBonus:
          relic?.relicXPTrack && relic?.relicXPBonus !== ''
            ? {
                experience: relic.relicXPTrack,
                bonus: Number(relic.relicXPBonus) || 1,
              }
            : undefined,
        metadata: normalizedBase.metadata as never,
      } as unknown as Relic;
      return r as unknown as Item;
    }
    case 'Weapon Modification': {
      const w: WeaponModification = {
        ...normalizedBase,
        category: 'Weapon Modification',
        modificationType: (modification?.modType || 'enhancement') as never,
        compatibleWeapons: modification?.compatible
          ? modification.compatible
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
        traitChange: modification?.modTraitChange
          ? {
              trait: modification.modTraitChange as never,
              description: 'Modified',
            }
          : undefined,
        featureAdded:
          modification?.modFeatureName || modification?.modFeatureDesc
            ? {
                name: modification?.modFeatureName || 'Feature',
                description: modification?.modFeatureDesc || '',
              }
            : undefined,
        metadata: normalizedBase.metadata as never,
      } as unknown as WeaponModification;
      return w as unknown as Item;
    }
    case 'Armor Modification': {
      const a: ArmorModification = {
        ...normalizedBase,
        category: 'Armor Modification',
        modificationType: (modification?.modType || 'enhancement') as never,
        compatibleArmor: modification?.compatible
          ? modification.compatible
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
        featureAdded:
          modification?.modFeatureName || modification?.modFeatureDesc
            ? {
                name: modification?.modFeatureName || 'Feature',
                description: modification?.modFeatureDesc || '',
              }
            : undefined,
        metadata: normalizedBase.metadata as never,
      } as unknown as ArmorModification;
      return a as unknown as Item;
    }
    case 'Recipe': {
      const rc = {
        ...normalizedBase,
        category: 'Recipe' as const,
        craftedItem: recipe?.craftedItem || 'Unknown',
        materials: recipe?.materials
          ? recipe.materials
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
        downtimeRequired: !!recipe?.downtime,
        instructions: recipe?.instructions || 'Mix and craft',
        metadata: normalizedBase.metadata as never,
      } as const;
      return rc as unknown as Item;
    }
  }
}

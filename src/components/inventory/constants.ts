import type { LucideIcon } from 'lucide-react';

import {
  Award,
  Backpack,
  Circle,
  CircleDot,
  FlaskConical,
  Gem,
  Link2,
  Medal,
  Package,
  Scroll,
  Shield,
  Sparkles,
  Star,
  Sword,
  Trophy,
  Wrench,
} from '@/lib/icons';
import type { EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import type { ItemCategory } from '@/lib/schemas/homebrew';

// Re-export ItemCategory for convenience
export type { ItemCategory } from '@/lib/schemas/homebrew';

export type CategoryConfig = {
  icon: LucideIcon;
  color: string;
  bgColor: string;
};
export type RarityConfig = {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
};
export type TierConfig = { icon: LucideIcon; label: string; color: string };

export const CATEGORY_CONFIG: Record<ItemCategory, CategoryConfig> = {
  Utility: {
    icon: Wrench,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
  },
  Consumable: {
    icon: FlaskConical,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/40',
  },
  Relic: {
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/40',
  },
  'Weapon Modification': {
    icon: Sword,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
  },
  'Armor Modification': {
    icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  Recipe: {
    icon: Scroll,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/40',
  },
};

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  Common: {
    icon: Circle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
  },
  Uncommon: {
    icon: CircleDot,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
  },
  Rare: {
    icon: Gem,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-400 dark:border-blue-600',
  },
  Legendary: {
    icon: Gem,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-400 dark:border-purple-600',
  },
};

export const TIER_CONFIG: Record<EquipmentTier, TierConfig> = {
  '1': {
    icon: Medal,
    label: 'Tier 1',
    color: 'text-amber-700 dark:text-amber-400',
  },
  '2': {
    icon: Award,
    label: 'Tier 2',
    color: 'text-slate-500 dark:text-slate-400',
  },
  '3': {
    icon: Trophy,
    label: 'Tier 3',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  '4': {
    icon: Gem,
    label: 'Tier 4',
    color: 'text-cyan-500 dark:text-cyan-400',
  },
};

export const LOCATION_CONFIG: Record<
  string,
  { icon: LucideIcon; label: string }
> = {
  backpack: { icon: Backpack, label: 'Backpack' },
  belt: { icon: Link2, label: 'Belt' },
  equipped: { icon: Star, label: 'Equipped' },
  stored: { icon: Package, label: 'Stored' },
};

export const ALL_CATEGORIES: ItemCategory[] = [
  'Utility',
  'Consumable',
  'Relic',
  'Weapon Modification',
  'Armor Modification',
  'Recipe',
];

export const ALL_RARITIES: Rarity[] = [
  'Common',
  'Uncommon',
  'Rare',
  'Legendary',
];

export const ALL_TIERS: EquipmentTier[] = ['1', '2', '3', '4'];

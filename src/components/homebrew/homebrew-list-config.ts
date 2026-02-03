/**
 * Configuration for HomebrewList category filters and grouping.
 * Extracted to reduce cyclomatic complexity of the main component.
 */
import {
  BookOpen,
  Home,
  Layers,
  Map,
  Package,
  Shield,
  Skull,
  Sword,
  Users,
} from 'lucide-react';

import type { HomebrewContentType } from '@/lib/schemas/homebrew';

// Content type configuration for icons, colors, and labels
export const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  { icon: typeof Skull; color: string; bgColor: string; label: string }
> = {
  adversary: {
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Adversaries',
  },
  environment: {
    icon: Map,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: 'Environments',
  },
  domain_card: {
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: 'Domain Cards',
  },
  class: {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Classes',
  },
  subclass: {
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    label: 'Subclasses',
  },
  ancestry: {
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: 'Ancestries',
  },
  community: {
    icon: Home,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    label: 'Communities',
  },
  equipment: {
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: 'Equipment',
  },
  item: {
    icon: Package,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    label: 'Items',
  },
};

export const CONTENT_TYPES: HomebrewContentType[] = [
  'adversary',
  'environment',
  'class',
  'subclass',
  'ancestry',
  'community',
  'domain_card',
  'equipment',
  'item',
];

// Tier colors
export const tierColors: Record<string, string> = {
  '1': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  '2': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  '3': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  '4': 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

// Role colors for adversaries
export const roleColors: Record<string, string> = {
  Solo: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
  Bruiser:
    'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  Horde:
    'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Minion:
    'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30',
  Leader:
    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  Support: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30',
  Ranged:
    'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  Skulk:
    'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  Social: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
  Standard:
    'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
};

// Domain colors
export const domainColors: Record<string, string> = {
  Arcana:
    'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30',
  Blade: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  Bone: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Codex: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  Grace: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
  Midnight:
    'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
  Sage: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  Splendor:
    'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  Valor:
    'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
};

// Equipment category colors
export const equipmentCategoryColors: Record<string, string> = {
  'Primary Weapon':
    'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  'Secondary Weapon':
    'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  Armor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  'Combat Wheelchair':
    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
};

export interface CategoryFilterConfig {
  tierOptions?: string[];
  roleOptions?: string[];
  domainOptions?: string[];
  levelOptions?: string[];
  categoryOptions?: string[];
}

export interface GroupConfig {
  key: string;
  label: string;
  colorClass: string;
}

/** Category-specific filter options */
export const CATEGORY_FILTER_CONFIG: Partial<
  Record<HomebrewContentType, CategoryFilterConfig>
> = {
  adversary: {
    tierOptions: ['all', '1', '2', '3', '4'],
    roleOptions: [
      'all',
      'Solo',
      'Bruiser',
      'Leader',
      'Support',
      'Ranged',
      'Skulk',
      'Horde',
      'Minion',
      'Social',
      'Standard',
    ],
  },
  environment: {
    tierOptions: ['all', '1', '2', '3', '4'],
  },
  domain_card: {
    domainOptions: [
      'all',
      'Arcana',
      'Blade',
      'Bone',
      'Codex',
      'Grace',
      'Midnight',
      'Sage',
      'Splendor',
      'Valor',
    ],
    levelOptions: ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  equipment: {
    categoryOptions: [
      'all',
      'Primary Weapon',
      'Secondary Weapon',
      'Armor',
      'Combat Wheelchair',
    ],
    tierOptions: ['all', '1', '2', '3', '4'],
  },
  item: {
    tierOptions: ['all', '1', '2', '3', '4'],
  },
};

/** Group configurations for each content type */
const ADVERSARY_GROUPS: GroupConfig[] = [
  { key: 'Solo', label: 'Solo', colorClass: roleColors['Solo'] },
  { key: 'Bruiser', label: 'Bruiser', colorClass: roleColors['Bruiser'] },
  { key: 'Leader', label: 'Leader', colorClass: roleColors['Leader'] },
  { key: 'Support', label: 'Support', colorClass: roleColors['Support'] },
  { key: 'Ranged', label: 'Ranged', colorClass: roleColors['Ranged'] },
  { key: 'Skulk', label: 'Skulk', colorClass: roleColors['Skulk'] },
  { key: 'Horde', label: 'Horde', colorClass: roleColors['Horde'] },
  { key: 'Minion', label: 'Minion', colorClass: roleColors['Minion'] },
  { key: 'Social', label: 'Social', colorClass: roleColors['Social'] },
  { key: 'Standard', label: 'Standard', colorClass: roleColors['Standard'] },
];

const TIER_GROUPS: GroupConfig[] = [
  { key: '1', label: 'Tier 1', colorClass: tierColors['1'] },
  { key: '2', label: 'Tier 2', colorClass: tierColors['2'] },
  { key: '3', label: 'Tier 3', colorClass: tierColors['3'] },
  { key: '4', label: 'Tier 4', colorClass: tierColors['4'] },
];

const DOMAIN_GROUPS: GroupConfig[] = [
  { key: 'Arcana', label: 'Arcana', colorClass: domainColors['Arcana'] },
  { key: 'Blade', label: 'Blade', colorClass: domainColors['Blade'] },
  { key: 'Bone', label: 'Bone', colorClass: domainColors['Bone'] },
  { key: 'Codex', label: 'Codex', colorClass: domainColors['Codex'] },
  { key: 'Grace', label: 'Grace', colorClass: domainColors['Grace'] },
  { key: 'Midnight', label: 'Midnight', colorClass: domainColors['Midnight'] },
  { key: 'Sage', label: 'Sage', colorClass: domainColors['Sage'] },
  { key: 'Splendor', label: 'Splendor', colorClass: domainColors['Splendor'] },
  { key: 'Valor', label: 'Valor', colorClass: domainColors['Valor'] },
];

const EQUIPMENT_GROUPS: GroupConfig[] = [
  {
    key: 'Primary Weapon',
    label: 'Primary Weapons',
    colorClass: equipmentCategoryColors['Primary Weapon'],
  },
  {
    key: 'Secondary Weapon',
    label: 'Secondary Weapons',
    colorClass: equipmentCategoryColors['Secondary Weapon'],
  },
  {
    key: 'Armor',
    label: 'Armor',
    colorClass: equipmentCategoryColors['Armor'],
  },
  {
    key: 'Combat Wheelchair',
    label: 'Combat Wheelchairs',
    colorClass: equipmentCategoryColors['Combat Wheelchair'],
  },
];

/** Get the group configurations for a content type */
export function getGroupConfigs(
  category: HomebrewContentType
): GroupConfig[] | null {
  switch (category) {
    case 'adversary':
      return ADVERSARY_GROUPS;
    case 'environment':
    case 'item':
      return TIER_GROUPS;
    case 'domain_card':
      return DOMAIN_GROUPS;
    case 'equipment':
      return EQUIPMENT_GROUPS;
    default:
      return null; // Alphabetical grouping will be generated dynamically
  }
}

/** Get the grouping key for an item based on its category */
export function getItemGroupKey(
  item: { name: string; content?: Record<string, unknown> },
  category: HomebrewContentType
): string {
  const content = item.content as Record<string, unknown> | undefined;

  switch (category) {
    case 'adversary': {
      const role = content?.role as string | undefined;
      return role ?? 'Standard';
    }
    case 'environment':
    case 'item': {
      const tier = content?.tier;
      return String(tier ?? '1');
    }
    case 'domain_card': {
      const domain = content?.domain as string | undefined;
      return domain ?? 'Arcana';
    }
    case 'equipment': {
      const cat = content?.category as string | undefined;
      const type = content?.type as string | undefined;
      if (cat === 'Weapon' || !cat) {
        return type === 'Secondary' ? 'Secondary Weapon' : 'Primary Weapon';
      }
      return cat;
    }
    default: {
      // Alphabetical grouping
      const firstChar = item.name.charAt(0).toUpperCase();
      return /[A-Z]/.test(firstChar) ? firstChar : '#';
    }
  }
}

/**
 * Get the grouping key for an OfficialItem (flat structure with direct properties).
 * Used by OfficialContentBrowser.
 */
export function getOfficialItemGroupKey(
  item: {
    name: string;
    role?: string;
    tier?: string;
    domain?: string;
    category?: string;
    rawData?: unknown;
  },
  category: string
): string {
  switch (category) {
    case 'adversary':
      return item.role ?? 'Standard';
    case 'environment':
    case 'item':
      return item.tier ?? '1';
    case 'domain_card':
      return item.domain ?? 'Arcana';
    case 'equipment': {
      const cat = item.category ?? 'Primary Weapon';
      if (cat === 'Weapon') {
        const rawData = item.rawData as { type?: string } | undefined;
        return rawData?.type === 'Secondary'
          ? 'Secondary Weapon'
          : 'Primary Weapon';
      }
      return cat;
    }
    default: {
      // Alphabetical grouping
      const firstChar = item.name.charAt(0).toUpperCase();
      return /[A-Z]/.test(firstChar) ? firstChar : '#';
    }
  }
}

import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';
import { z } from 'zod';
import { DomainIcons, getIcon } from '@/lib/icons';

import { DomainNameSchema, MetadataSchema } from './core';

// Domain icon mapping for visual engagement
// Returns Lucide icon components instead of emoji strings
export const getDomainIcon = (domain: string): ComponentType<LucideProps> =>
  getIcon(DomainIcons, domain);

// Legacy export for backward compatibility (components should use getDomainIcon)
export const DOMAIN_ICONS = DomainIcons;

// Domain color theme mapping
export const DOMAIN_COLORS: Record<string, string> = {
  Arcana: 'text-violet-500',
  Blade: 'text-slate-400',
  Bone: 'text-stone-400',
  Codex: 'text-amber-500',
  Grace: 'text-pink-400',
  Midnight: 'text-indigo-400',
  Sage: 'text-teal-500',
  Splendor: 'text-yellow-400',
  Valor: 'text-red-500',
  Chaos: 'text-fuchsia-500',
  Moon: 'text-blue-300',
  Sun: 'text-orange-400',
  Blood: 'text-rose-600',
  Fate: 'text-emerald-400',
};

export const DOMAIN_BG_COLORS: Record<string, string> = {
  Arcana: 'bg-violet-500/10 border-violet-500/30',
  Blade: 'bg-slate-400/10 border-slate-400/30',
  Bone: 'bg-stone-400/10 border-stone-400/30',
  Codex: 'bg-amber-500/10 border-amber-500/30',
  Grace: 'bg-pink-400/10 border-pink-400/30',
  Midnight: 'bg-indigo-400/10 border-indigo-400/30',
  Sage: 'bg-teal-500/10 border-teal-500/30',
  Splendor: 'bg-yellow-400/10 border-yellow-400/30',
  Valor: 'bg-red-500/10 border-red-500/30',
  Chaos: 'bg-fuchsia-500/10 border-fuchsia-500/30',
  Moon: 'bg-blue-300/10 border-blue-300/30',
  Sun: 'bg-orange-400/10 border-orange-400/30',
  Blood: 'bg-rose-600/10 border-rose-600/30',
  Fate: 'bg-emerald-400/10 border-emerald-400/30',
};

// Card type colors (per RAW page 26: abilities, spells, and grimoires)
export const CARD_TYPE_COLORS: Record<string, string> = {
  Spell: 'text-purple-400',
  Ability: 'text-cyan-400',
  Grimoire: 'text-amber-400',
};

export type LoadoutMode = 'class-domains' | 'all-domains' | 'homebrew';

// Loadout rules per character level/tier
// Per RAW: Max 5 active cards in loadout at any time, vault is unlimited
// The tier affects card level limits, not loadout size
// maxActiveCards can be adjusted for homebrew or special class features
export const LoadoutRulesSchema = z.object({
  maxActiveCards: z.number().int().min(1).default(5),
  maxVaultCards: z.number().int().min(0).optional(),
  maxRecallCost: z.number().int().min(0).optional(),
  allowedDomains: z.array(DomainNameSchema).optional(),
  maxCardLevel: z.number().int().min(1).max(10).default(1),
});

export type LoadoutRules = z.infer<typeof LoadoutRulesSchema>;

// Default loadout rules by tier
// Per RAW (page 102): "You can have a maximum of five active domain cards in
// your loadout at any one time." The vault holds all inactive cards (no limit).
// At level 1, you start with 2 cards. You gain 1 card per level + subclass cards.
export const LOADOUT_RULES_BY_TIER: Record<string, LoadoutRules> = {
  '1': {
    maxActiveCards: 5,
    maxCardLevel: 1,
  },
  '2-4': {
    maxActiveCards: 5,
    maxCardLevel: 4,
  },
  '5-7': {
    maxActiveCards: 5,
    maxCardLevel: 7,
  },
  '8-10': {
    maxActiveCards: 5,
    maxCardLevel: 10,
  },
};

// Lite card schema for storage (avoids heavy validation)
export const DomainCardLiteSchema = z.object({
  name: z.string(),
  level: z.number().int().min(1).max(10),
  domain: z.string(),
  type: z.string(),
  description: z.string(),
  hopeCost: z.number().int().min(0).optional(),
  recallCost: z.number().int().min(0).optional(),
  stressCost: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
  isHomebrew: z.boolean().optional(),
  metadata: MetadataSchema.optional(),
});

export type DomainCardLite = z.infer<typeof DomainCardLiteSchema>;

// Homebrew domain card schema - extends lite schema with required isHomebrew flag
export const HomebrewDomainCardSchema = DomainCardLiteSchema.extend({
  isHomebrew: z.literal(true).default(true),
});

export type HomebrewDomainCard = z.infer<typeof HomebrewDomainCardSchema>;

// Loadout selection state
export const LoadoutSelectionSchema = z.object({
  mode: z
    .enum(['class-domains', 'all-domains', 'homebrew'])
    .default('class-domains'),
  activeCards: z.array(DomainCardLiteSchema).default([]),
  vaultCards: z.array(DomainCardLiteSchema).default([]),
  homebrewCards: z.array(HomebrewDomainCardSchema).default([]),
  classDomains: z.array(DomainNameSchema).default([]),
  expandedDomainAccess: z.boolean().default(false),
  creationComplete: z.boolean().default(false),
});

export type LoadoutSelection = z.infer<typeof LoadoutSelectionSchema>;

export const DEFAULT_LOADOUT: LoadoutSelection = {
  mode: 'class-domains',
  activeCards: [],
  vaultCards: [],
  homebrewCards: [],
  classDomains: [],
  expandedDomainAccess: false,
  creationComplete: false,
};

// Validation helpers
export function validateLoadoutSelection(
  selection: unknown
): selection is LoadoutSelection {
  try {
    LoadoutSelectionSchema.parse(selection);
    return true;
  } catch {
    return false;
  }
}

export function getLoadoutRulesForTier(tier: string): LoadoutRules {
  return LOADOUT_RULES_BY_TIER[tier] ?? LOADOUT_RULES_BY_TIER['1'];
}

export function isCardAllowedInLoadout(
  card: DomainCardLite,
  rules: LoadoutRules,
  classDomains: string[],
  expandedAccess: boolean
): boolean {
  if (card.level > rules.maxCardLevel) return false;

  if (rules.maxRecallCost !== undefined) {
    const cost = card.recallCost ?? card.hopeCost ?? 0;
    if (cost > rules.maxRecallCost) return false;
  }

  if (!expandedAccess && rules.allowedDomains) {
    if (!rules.allowedDomains.includes(card.domain)) return false;
  }

  if (!expandedAccess && classDomains.length > 0) {
    if (!classDomains.includes(card.domain)) return false;
  }

  return true;
}

export function countTotalRecallCost(cards: DomainCardLite[]): number {
  return cards.reduce(
    (sum, card) => sum + (card.recallCost ?? card.hopeCost ?? 0),
    0
  );
}

export function getCardsByDomain(
  cards: DomainCardLite[],
  domain: string
): DomainCardLite[] {
  return cards.filter(card => card.domain === domain);
}

export function getCardsByLevel(
  cards: DomainCardLite[],
  maxLevel: number
): DomainCardLite[] {
  return cards.filter(card => card.level <= maxLevel);
}

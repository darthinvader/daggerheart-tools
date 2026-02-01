/**
 * Official Content Browser
 *
 * Displays official Daggerheart content (adversaries, environments, classes, etc.)
 * with options to view details and fork into homebrew.
 * Styled to match reference page designs.
 */
import {
  AlertTriangle,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Filter,
  GitFork,
  Heart,
  Home,
  Layers,
  Package,
  Search,
  Shield,
  Skull,
  Sparkles,
  Sword,
  Swords,
  Target,
  TreePine,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateHomebrewContent } from '@/features/homebrew';
import { ADVERSARIES } from '@/lib/data/adversaries';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';
import { COMMUNITIES } from '@/lib/data/characters/communities';
import { ALL_CLASSES } from '@/lib/data/classes';
import { getAllDomainCards } from '@/lib/data/domains';
import { ENVIRONMENTS } from '@/lib/data/environments';
import {
  ALL_ARMOR,
  ALL_COMBAT_WHEELCHAIRS,
  ALL_CONSUMABLES,
  ALL_PRIMARY_WEAPONS,
  ALL_RELICS,
  ALL_SECONDARY_WEAPONS,
  ALL_UTILITY_ITEMS,
} from '@/lib/data/equipment';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { DomainCard } from '@/lib/schemas/domains';
import type { Environment } from '@/lib/schemas/environments';
import type { HomebrewContentType } from '@/lib/schemas/homebrew';
import { getCardCosts } from '@/lib/utils/card-costs';

import { HomebrewFormDialog } from './homebrew-form-dialog';

type OfficialContentType =
  | 'all'
  | 'adversary'
  | 'environment'
  | 'class'
  | 'subclass'
  | 'ancestry'
  | 'community'
  | 'domain_card'
  | 'equipment'
  | 'item';

interface OfficialItem {
  id: string;
  name: string;
  type: OfficialContentType;
  description?: string;
  tier?: string;
  level?: number;
  domain?: string;
  difficulty?: string | number;
  role?: string;
  category?: string;
  rawData: unknown;
}

// Color gradients matching reference pages
const TYPE_GRADIENTS: Record<OfficialContentType, string> = {
  all: 'from-gray-500 to-slate-600',
  adversary: 'from-red-500 via-rose-500 to-orange-500',
  environment: 'from-emerald-500 via-teal-500 to-sky-500',
  class: 'from-blue-500 via-indigo-500 to-purple-500',
  subclass: 'from-indigo-500 via-purple-500 to-pink-500',
  ancestry: 'from-amber-500 via-orange-500 to-rose-500',
  community: 'from-teal-500 via-cyan-500 to-blue-500',
  domain_card: 'from-violet-500 via-purple-500 to-fuchsia-500',
  equipment: 'from-orange-500 via-amber-500 to-yellow-500',
  item: 'from-cyan-500 via-sky-500 to-blue-500',
};

const TYPE_CONFIG: Record<
  OfficialContentType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  all: {
    icon: Package,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    label: 'All',
  },
  adversary: {
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Adversaries',
  },
  environment: {
    icon: TreePine,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: 'Environments',
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
  domain_card: {
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: 'Domain Cards',
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

// Tier colors matching references
const tierColors: Record<string, string> = {
  '1': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  '2': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  '3': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  '4': 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

// Role colors for adversaries
const roleColors: Record<string, string> = {
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

// Level colors for domain cards
const levelColors: Record<number, string> = {
  1: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  2: 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
  3: 'bg-violet-500/20 text-violet-700 dark:text-violet-300',
  4: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  5: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
  6: 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300',
  7: 'bg-red-500/20 text-red-700 dark:text-red-300',
  8: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
  9: 'bg-pink-500/20 text-pink-700 dark:text-pink-300',
  10: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
};

// Helper: format thresholds
function formatThresholds(thresholds: Adversary['thresholds']): string {
  if (typeof thresholds === 'string') return thresholds;
  const parts = [];
  if (thresholds.major != null) parts.push(thresholds.major);
  if (thresholds.severe != null) parts.push(thresholds.severe);
  if (thresholds.massive != null) parts.push(thresholds.massive);
  return parts.join('/') || '-';
}

// Helper: format feature
function formatFeature(
  feature: string | { name: string; type?: string; description: string }
): string {
  if (typeof feature === 'string') return feature;
  const type = feature.type ? `${feature.type}: ` : '';
  return `${feature.name} — ${type}${feature.description}`;
}

// Helper: build unified list of all official content with raw data
function buildOfficialContent(): OfficialItem[] {
  const items: OfficialItem[] = [];

  ADVERSARIES.forEach(adv => {
    items.push({
      id: `adv-${adv.name}`,
      name: adv.name,
      type: 'adversary',
      description: adv.description,
      tier: adv.tier,
      difficulty: adv.difficulty,
      role: adv.role,
      rawData: adv,
    });
  });

  ENVIRONMENTS.forEach(env => {
    items.push({
      id: `env-${env.name}`,
      name: env.name,
      type: 'environment',
      description: env.description,
      tier: env.tier,
      difficulty: env.difficulty,
      rawData: env,
    });
  });

  ALL_CLASSES.forEach(cls => {
    items.push({
      id: `class-${cls.name}`,
      name: cls.name,
      type: 'class',
      description: cls.description,
      domain: cls.domains?.join(', '),
      rawData: cls,
    });
    cls.subclasses.forEach(sub => {
      items.push({
        id: `subclass-${cls.name}-${sub.name}`,
        name: `${sub.name} (${cls.name})`,
        type: 'subclass',
        description: sub.description,
        domain:
          'domain' in sub ? (sub as { domain?: string }).domain : undefined,
        rawData: { ...sub, parentClass: cls.name },
      });
    });
  });

  ANCESTRIES.forEach(anc => {
    items.push({
      id: `ancestry-${anc.name}`,
      name: anc.name,
      type: 'ancestry',
      description: anc.description,
      rawData: anc,
    });
  });

  COMMUNITIES.forEach(comm => {
    items.push({
      id: `community-${comm.name}`,
      name: comm.name,
      type: 'community',
      description: comm.description,
      rawData: comm,
    });
  });

  getAllDomainCards().forEach(card => {
    items.push({
      id: `domain-${card.name}`,
      name: card.name,
      type: 'domain_card',
      description: card.description,
      level: card.level,
      domain: card.domain,
      rawData: card,
    });
  });

  [...ALL_PRIMARY_WEAPONS, ...ALL_SECONDARY_WEAPONS].forEach(weapon => {
    items.push({
      id: `equip-${weapon.name}`,
      name: weapon.name,
      type: 'equipment',
      description: weapon.features?.[0]?.description,
      tier: weapon.tier,
      category: 'Weapon',
      rawData: weapon,
    });
  });

  ALL_ARMOR.forEach(armor => {
    items.push({
      id: `armor-${armor.name}`,
      name: armor.name,
      type: 'equipment',
      description: armor.features?.[0]?.description,
      tier: armor.tier,
      category: 'Armor',
      rawData: armor,
    });
  });

  ALL_COMBAT_WHEELCHAIRS.forEach(wheelchair => {
    items.push({
      id: `wheelchair-${wheelchair.name}`,
      name: wheelchair.name,
      type: 'equipment',
      description: wheelchair.features?.[0]?.description,
      tier: wheelchair.tier,
      category: 'Combat Wheelchair',
      rawData: wheelchair,
    });
  });

  [...ALL_CONSUMABLES, ...ALL_RELICS, ...ALL_UTILITY_ITEMS].forEach(item => {
    items.push({
      id: `item-${item.name}`,
      name: item.name,
      type: 'item',
      description: item.features?.[0]?.description,
      tier: item.tier,
      rawData: item,
    });
  });

  return items;
}

// ========== DETAIL VIEWS (matching reference sidebars) ==========

function AdversaryDetail({ adv }: { adv: Adversary }) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          <Skull className="size-3" />
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{adv.description}</p>
      </div>

      {/* Motives & Tactics */}
      {adv.motivesAndTactics && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
            <Brain className="size-3" />
            Motives & Tactics
          </div>
          <p className="text-muted-foreground text-sm">
            {adv.motivesAndTactics}
          </p>
        </div>
      )}

      {/* Core Stats */}
      <div className="bg-muted/40 text-muted-foreground grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm">
        <div className="col-span-2 mb-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <Target className="size-3" />
            Core Stats
          </div>
        </div>
        <div>
          <span className="font-semibold">Difficulty</span> {adv.difficulty}
        </div>
        <div>
          <span className="font-semibold">Thresholds</span>{' '}
          {formatThresholds(adv.thresholds)}
        </div>
        <div>
          <Heart className="mr-1 inline size-3" />
          <span className="font-semibold">HP</span> {adv.hp}
        </div>
        <div>
          <AlertTriangle className="mr-1 inline size-3" />
          <span className="font-semibold">Stress</span> {adv.stress}
        </div>
      </div>

      {/* Attack */}
      {adv.attack && (
        <div className="rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/10 to-rose-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
            <Swords className="size-3" />
            Attack
          </div>
          <p className="text-sm">
            <span className="font-semibold">{adv.attack.modifier}</span>{' '}
            {adv.attack.name} · {adv.attack.range} · {adv.attack.damage}
          </p>
        </div>
      )}

      {/* Experiences */}
      {adv.experiences && adv.experiences.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            <Brain className="size-3" />
            Experiences
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {adv.experiences.map((exp, i) => (
              <li key={i}>
                {typeof exp === 'string' ? exp : `${exp.name} +${exp.bonus}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {adv.features && adv.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {adv.features.map((feat, i) => (
              <li key={i}>{formatFeature(feat)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EnvironmentDetail({ env }: { env: Environment }) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
          <TreePine className="size-3" />
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{env.description}</p>
      </div>

      {/* Scene Stats */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
          <Target className="size-3" />
          Scene Stats
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Difficulty</span> {env.difficulty}
          </div>
          <div>
            <span className="font-semibold">Type</span> {env.type}
          </div>
        </div>
      </div>

      {/* Impulses */}
      {env.impulses.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <Brain className="size-3" />
            Impulses
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {env.impulses.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Potential Adversaries */}
      {env.potentialAdversaries.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
            <Swords className="size-3" />
            Potential Adversaries
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {env.potentialAdversaries.map((adv, i) => (
              <li key={i}>{adv}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {env.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {env.features.map((feat, i) => (
              <li key={i}>{formatFeature(feat)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DomainCardDetail({ card }: { card: DomainCard }) {
  // Use the shared card costs utility for consistent display
  const costs = getCardCosts(card);
  const hopeCosts = costs.activationCosts.filter(c => c.type === 'Hope');
  const stressCosts = costs.activationCosts.filter(c => c.type === 'Stress');

  return (
    <div className="space-y-4">
      {/* Card Info */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
          <Sparkles className="size-3" />
          Card Details
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
            <div className="text-muted-foreground text-xs">Level</div>
            <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
              {card.level}
            </div>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
            <div className="text-muted-foreground text-xs">Domain</div>
            <div className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              {card.domain}
            </div>
          </div>
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
            <div className="text-muted-foreground text-xs">Type</div>
            <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
              {card.type}
            </div>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          <Zap className="size-3" />
          Costs
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="min-w-20 flex-1 rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
            <div className="text-muted-foreground text-xs">Recall Cost</div>
            <div className="text-lg font-bold text-sky-700 dark:text-sky-400">
              {costs.recallCost}
            </div>
          </div>
          {hopeCosts.length > 0 && (
            <div className="min-w-20 flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="text-muted-foreground text-xs">
                Activation (Hope)
              </div>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                {hopeCosts
                  .map(c => (c.amount === 'any' ? 'X' : c.amount))
                  .join(' + ')}
              </div>
            </div>
          )}
          {stressCosts.length > 0 && (
            <div className="min-w-20 flex-1 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <div className="text-muted-foreground text-xs">
                Activation (Stress)
              </div>
              <div className="text-lg font-bold text-red-700 dark:text-red-400">
                {stressCosts.reduce(
                  (sum, c) => sum + (c.amount === 'any' ? 0 : c.amount),
                  0
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
          <BookOpen className="size-3" />
          Effect
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {card.description}
        </p>
      </div>

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Class Detail - Full information display
function ClassDetail({ raw }: { raw: unknown }) {
  const cls = raw as {
    name: string;
    description: string;
    domains?: string[];
    startingHitPoints?: number;
    startingEvasion?: number;
    hopeFeature?: { name: string; description: string; hopeCost: number };
    classFeatures?: Array<{ name: string; description: string; type?: string }>;
    classItems?: string[];
    backgroundQuestions?: string[];
    connections?: string[];
    subclasses?: Array<{
      name: string;
      description: string;
      spellcastTrait?: string;
      features?: Array<{
        name: string;
        description: string;
        type?: string;
        level?: number;
        availability?: {
          tier: string;
          minLevel: number;
          unlockCondition?: string;
        };
      }>;
    }>;
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{cls.description}</p>
        {cls.domains && cls.domains.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {cls.domains.map(d => (
              <Badge key={d} variant="outline">
                {d}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Base Stats */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
          <Target className="size-3" />
          Base Stats
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <div className="text-muted-foreground text-sm">Hit Points</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {cls.startingHitPoints ?? '?'}
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="text-muted-foreground text-sm">Evasion</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {cls.startingEvasion ?? '?'}
            </div>
          </div>
        </div>
      </div>

      {/* Hope Feature */}
      {cls.hopeFeature && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-yellow-700 uppercase dark:text-yellow-300">
            <Sparkles className="size-3" />
            Hope Feature
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                {cls.hopeFeature.name}
              </span>
              <Badge className="border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300">
                {cls.hopeFeature.hopeCost} Hope
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {cls.hopeFeature.description}
            </p>
          </div>
        </div>
      )}

      {/* Class Features */}
      {cls.classFeatures && cls.classFeatures.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            <Sparkles className="size-3" />
            Class Features
          </div>
          <div className="space-y-2">
            {cls.classFeatures.map((feat, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{feat.name}</span>
                  {feat.type && (
                    <Badge variant="outline" className="text-xs">
                      {feat.type}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Items */}
      {cls.classItems && cls.classItems.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Package className="size-3" />
            Class Items
          </div>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            {cls.classItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subclasses */}
      {cls.subclasses && cls.subclasses.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-700 uppercase dark:text-indigo-300">
              <Layers className="size-3" />
              Subclasses
            </div>
            <Badge variant="outline">{cls.subclasses.length}</Badge>
          </div>
          <div className="space-y-4">
            {cls.subclasses.map((sub, i) => (
              <div key={i} className="bg-muted/30 rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold">{sub.name}</span>
                  {sub.spellcastTrait && (
                    <Badge variant="outline" className="text-xs">
                      Spellcast: {sub.spellcastTrait}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3 text-sm">
                  {sub.description}
                </p>
                {sub.features && sub.features.length > 0 && (
                  <div className="space-y-2">
                    {sub.features.map((feat, j) => (
                      <div
                        key={j}
                        className="bg-background/50 rounded border-l-2 border-l-indigo-500/50 p-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">
                            {feat.name}
                          </span>
                          {feat.level != null && (
                            <Badge
                              variant="outline"
                              className="py-0 text-[10px]"
                            >
                              Lvl {feat.level}
                            </Badge>
                          )}
                          {feat.type && (
                            <Badge
                              variant="outline"
                              className="py-0 text-[10px]"
                            >
                              {feat.type}
                            </Badge>
                          )}
                          {feat.availability && (
                            <Badge
                              variant="secondary"
                              className="py-0 text-[10px]"
                            >
                              {feat.availability.unlockCondition ??
                                `Tier ${feat.availability.tier}`}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Questions */}
      {cls.backgroundQuestions && cls.backgroundQuestions.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
            Background Questions
          </div>
          <ul className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
            {cls.backgroundQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Connections */}
      {cls.connections && cls.connections.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
            Connections
          </div>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            {cls.connections.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Subclass Detail - Full information display
function SubclassDetail({ raw }: { raw: unknown }) {
  const sub = raw as {
    name: string;
    description: string;
    parentClass?: string;
    spellcastTrait?: string;
    features?: Array<{
      name: string;
      description: string;
      type?: string;
      level?: number;
      availability?: {
        tier: string;
        minLevel: number;
        unlockCondition?: string;
      };
    }>;
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{sub.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sub.parentClass && (
            <Badge variant="outline">{sub.parentClass}</Badge>
          )}
          {sub.spellcastTrait && (
            <Badge variant="secondary">Spellcast: {sub.spellcastTrait}</Badge>
          )}
        </div>
      </div>

      {/* Features */}
      {sub.features && sub.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <div className="space-y-2">
            {sub.features.map((feat, i) => (
              <div
                key={i}
                className="bg-muted/50 rounded-lg border-l-4 border-l-violet-500/50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{feat.name}</span>
                  {feat.level != null && (
                    <Badge
                      className={`py-0 text-xs ${levelColors[feat.level] ?? ''}`}
                    >
                      Level {feat.level}
                    </Badge>
                  )}
                  {feat.type && (
                    <Badge variant="outline" className="text-xs">
                      {feat.type}
                    </Badge>
                  )}
                  {feat.availability && (
                    <Badge variant="secondary" className="text-xs">
                      {feat.availability.unlockCondition ??
                        `Tier ${feat.availability.tier}`}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Ancestry Detail - Full information display
function AncestryDetail({ raw }: { raw: unknown }) {
  const anc = raw as {
    name: string;
    description: string;
    heightRange?: string;
    lifespan?: string;
    physicalCharacteristics?: string[];
    primaryFeature?: { name: string; description: string; type?: string };
    secondaryFeature?: { name: string; description: string; type?: string };
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{anc.description}</p>
        {(anc.heightRange || anc.lifespan) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {anc.heightRange && (
              <Badge variant="outline">{anc.heightRange}</Badge>
            )}
            {anc.lifespan && <Badge variant="outline">{anc.lifespan}</Badge>}
          </div>
        )}
      </div>

      {/* Physical Characteristics */}
      {anc.physicalCharacteristics &&
        anc.physicalCharacteristics.length > 0 && (
          <div className="bg-card rounded-lg border p-4">
            <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
              <Users className="size-3" />
              Physical Characteristics
            </div>
            <div className="flex flex-wrap gap-2">
              {anc.physicalCharacteristics.map((char, i) => (
                <Badge key={i} variant="outline" className="bg-muted/50">
                  {char}
                </Badge>
              ))}
            </div>
          </div>
        )}

      {/* Primary Feature */}
      {anc.primaryFeature && (
        <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            Primary Feature
          </div>
          <h4 className="mb-2 font-semibold">{anc.primaryFeature.name}</h4>
          <p className="text-muted-foreground text-sm">
            {anc.primaryFeature.description}
          </p>
        </div>
      )}

      {/* Secondary Feature */}
      {anc.secondaryFeature && (
        <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
            Secondary Feature
          </div>
          <h4 className="mb-2 font-semibold">{anc.secondaryFeature.name}</h4>
          <p className="text-muted-foreground text-sm">
            {anc.secondaryFeature.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Community Detail - Full information display
function CommunityDetail({ raw }: { raw: unknown }) {
  const comm = raw as {
    name: string;
    description: string;
    commonTraits?: string[];
    feature?: { name: string; description: string };
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{comm.description}</p>
      </div>

      {/* Common Traits */}
      {comm.commonTraits && comm.commonTraits.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <Home className="size-3" />
            Common Traits
          </div>
          <div className="flex flex-wrap gap-2">
            {comm.commonTraits.map((trait, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border-teal-500/30 bg-teal-500/10 text-teal-700 capitalize dark:text-teal-300"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Community Feature */}
      {comm.feature && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
            Community Feature
          </div>
          <h4 className="mb-2 font-semibold">{comm.feature.name}</h4>
          <p className="text-muted-foreground text-sm">
            {comm.feature.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Equipment Detail - Full information display
function EquipmentDetail({ raw }: { raw: unknown }) {
  const equip = raw as {
    name: string;
    tier?: string;
    type?: string;
    trait?: string;
    range?: string;
    burden?: number;
    damage?: {
      diceType?: string;
      count?: number;
      modifier?: number;
      type?: string;
    };
    features?: Array<{ name: string; description: string }>;
    slots?: number;
    baseScore?: number;
  };

  const formatDamage = () => {
    if (!equip.damage) return null;
    const { count = 1, diceType, modifier = 0, type } = equip.damage;
    let dmg = `${count}${diceType}`;
    if (modifier > 0) dmg += ` + ${modifier}`;
    if (modifier < 0) dmg += ` - ${Math.abs(modifier)}`;
    if (type) dmg += ` ${type}`;
    return dmg;
  };

  const damageString = formatDamage();

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="bg-muted/40 grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm">
        {equip.tier && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Tier</div>
            <div className="font-semibold">{equip.tier}</div>
          </div>
        )}
        {equip.type && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Type</div>
            <div className="font-semibold">{equip.type}</div>
          </div>
        )}
        {equip.trait && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Trait</div>
            <div className="font-semibold">{equip.trait}</div>
          </div>
        )}
        {equip.range && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Range</div>
            <div className="font-semibold">{equip.range}</div>
          </div>
        )}
        {equip.burden != null && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Burden</div>
            <div className="font-semibold">{equip.burden}</div>
          </div>
        )}
        {equip.slots != null && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Slots</div>
            <div className="font-semibold">{equip.slots}</div>
          </div>
        )}
        {equip.baseScore != null && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Base Score</div>
            <div className="font-semibold">{equip.baseScore}</div>
          </div>
        )}
      </div>

      {/* Damage */}
      {damageString && (
        <div className="rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/10 to-rose-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
            <Swords className="size-3" />
            Damage
          </div>
          <div className="text-lg font-bold text-red-700 dark:text-red-400">
            {damageString}
          </div>
        </div>
      )}

      {/* Features */}
      {equip.features && equip.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <div className="space-y-2">
            {equip.features.map((feat, i) => (
              <div
                key={i}
                className="bg-muted/50 rounded border-l-4 border-l-amber-500/50 p-3"
              >
                <div className="font-medium">{feat.name}</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Item Detail - Full information display
function ItemDetail({ raw }: { raw: unknown }) {
  const item = raw as {
    name: string;
    tier?: string;
    rarity?: string;
    effect?: string;
    features?: Array<{ name: string; description: string }>;
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      {(item.tier || item.rarity) && (
        <div className="bg-muted/40 flex flex-wrap gap-3 rounded-lg border p-4 text-sm">
          {item.tier && (
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Tier</div>
              <div className="font-semibold">{item.tier}</div>
            </div>
          )}
          {item.rarity && (
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Rarity</div>
              <div className="font-semibold capitalize">{item.rarity}</div>
            </div>
          )}
        </div>
      )}

      {/* Effect */}
      {item.effect && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
            Effect
          </div>
          <p className="text-sm">{item.effect}</p>
        </div>
      )}

      {/* Features */}
      {item.features && item.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <div className="space-y-2">
            {item.features.map((feat, i) => (
              <div
                key={i}
                className="bg-muted/50 rounded border-l-4 border-l-amber-500/50 p-3"
              >
                <div className="font-medium">{feat.name}</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== CARDS (minified, matching reference styling) ==========

function AdversaryCard({
  item,
  onView,
  onFork,
}: {
  item: OfficialItem;
  onView: () => void;
  onFork: () => void;
}) {
  const adv = item.rawData as Adversary;
  const tierBadge = tierColors[adv.tier] ?? '';
  const roleBadge = roleColors[adv.role] ?? '';

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onView}
    >
      <div className={`h-1 bg-gradient-to-r ${TYPE_GRADIENTS.adversary}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Skull className="text-muted-foreground size-4" />
            {item.name}
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={e => {
              e.stopPropagation();
              onFork();
            }}
            title="Fork"
          >
            <GitFork className="size-3" />
          </Button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="outline" className={`py-0 text-xs ${tierBadge}`}>
            T{adv.tier}
          </Badge>
          <Badge variant="outline" className={`py-0 text-xs ${roleBadge}`}>
            {adv.role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-muted/40 text-muted-foreground grid grid-cols-2 gap-1 rounded border p-2 text-xs">
          <div>
            <Target className="mr-1 inline size-3" />
            {adv.difficulty}
          </div>
          <div>
            <Layers className="mr-1 inline size-3" />
            {formatThresholds(adv.thresholds)}
          </div>
          <div>
            <Heart className="mr-1 inline size-3" />
            {adv.hp} HP
          </div>
          <div>
            <AlertTriangle className="mr-1 inline size-3" />
            {adv.stress} Stress
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EnvironmentCard({
  item,
  onView,
  onFork,
}: {
  item: OfficialItem;
  onView: () => void;
  onFork: () => void;
}) {
  const env = item.rawData as Environment;
  const tierBadge = tierColors[env.tier] ?? '';

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onView}
    >
      <div className={`h-1 bg-gradient-to-r ${TYPE_GRADIENTS.environment}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TreePine className="text-muted-foreground size-4" />
            {item.name}
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={e => {
              e.stopPropagation();
              onFork();
            }}
            title="Fork"
          >
            <GitFork className="size-3" />
          </Button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="outline" className={`py-0 text-xs ${tierBadge}`}>
            T{env.tier}
          </Badge>
          <Badge variant="outline" className="py-0 text-xs">
            {env.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-2 text-xs">
          {env.description}
        </CardDescription>
        <div className="text-muted-foreground mt-2 flex gap-3 text-xs">
          <span>
            <Target className="mr-1 inline size-3" />
            {env.difficulty}
          </span>
          <span>
            <Sparkles className="mr-1 inline size-3" />
            {env.features.length} features
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DomainCardCard({
  item,
  onView,
  onFork,
}: {
  item: OfficialItem;
  onView: () => void;
  onFork: () => void;
}) {
  const card = item.rawData as DomainCard;
  const lvlColor = levelColors[card.level] ?? '';
  const costs = getCardCosts(card);
  const hopeCosts = costs.activationCosts.filter(c => c.type === 'Hope');
  const stressCosts = costs.activationCosts.filter(c => c.type === 'Stress');

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onView}
    >
      <div className={`h-1 bg-gradient-to-r ${TYPE_GRADIENTS.domain_card}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base leading-tight">
            <Sparkles className="text-muted-foreground size-4" />
            <span className="line-clamp-1">{item.name}</span>
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={e => {
              e.stopPropagation();
              onFork();
            }}
            title="Fork"
          >
            <GitFork className="size-3" />
          </Button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge className={`py-0 text-xs ${lvlColor}`}>Lvl {card.level}</Badge>
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-500/10 py-0 text-xs text-purple-700 dark:text-purple-300"
          >
            {card.domain}
          </Badge>
          <Badge
            variant="outline"
            className="border-cyan-500/30 bg-cyan-500/10 py-0 text-xs text-cyan-700 dark:text-cyan-300"
          >
            {card.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 text-xs">
          {card.description}
        </CardDescription>
        <div className="bg-muted/40 mt-2 flex flex-wrap items-center gap-2 rounded border p-2 text-xs">
          <div className="flex items-center gap-1">
            <Zap className="size-3 text-sky-600" />
            <span className="font-medium">{costs.recallCost} Recall</span>
          </div>
          {hopeCosts.length > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="size-3 text-amber-600" />
              <span className="font-medium">
                {hopeCosts
                  .map(c => (c.amount === 'any' ? 'X' : c.amount))
                  .join('+')}{' '}
                Hope
              </span>
            </div>
          )}
          {stressCosts.length > 0 && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="size-3 text-red-600" />
              <span className="font-medium">
                {stressCosts.reduce(
                  (sum, c) => sum + (c.amount === 'any' ? 0 : c.amount),
                  0
                )}{' '}
                Stress
              </span>
            </div>
          )}
        </div>
        {card.tags && card.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="py-0 text-[10px]">
                {tag}
              </Badge>
            ))}
            {card.tags.length > 3 && (
              <Badge variant="secondary" className="py-0 text-[10px]">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClassCard({
  item,
  onView,
  onFork,
}: {
  item: OfficialItem;
  onView: () => void;
  onFork: () => void;
}) {
  const cls = item.rawData as {
    name: string;
    description: string;
    domains?: string[];
    startingHitPoints?: number;
    startingEvasion?: number;
    subclasses?: unknown[];
  };

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onView}
    >
      <div className={`h-1 bg-gradient-to-r ${TYPE_GRADIENTS.class}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="text-muted-foreground size-4" />
            {item.name}
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={e => {
              e.stopPropagation();
              onFork();
            }}
            title="Fork"
          >
            <GitFork className="size-3" />
          </Button>
        </div>
        {cls.domains && (
          <div className="mt-1 flex flex-wrap gap-1">
            {cls.domains.slice(0, 2).map(d => (
              <Badge key={d} variant="outline" className="py-0 text-xs">
                {d}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-2 text-xs">
          {cls.description}
        </CardDescription>
        <div className="bg-muted/40 text-muted-foreground mt-2 grid grid-cols-3 gap-1 rounded border p-2 text-xs">
          <div>
            <span className="font-semibold">
              {cls.startingHitPoints ?? '?'}
            </span>{' '}
            HP
          </div>
          <div>
            <span className="font-semibold">{cls.startingEvasion ?? '?'}</span>{' '}
            Eva
          </div>
          <div>
            <span className="font-semibold">{cls.subclasses?.length ?? 0}</span>{' '}
            Sub
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenericCard({
  item,
  config,
  onView,
  onFork,
}: {
  item: OfficialItem;
  config: (typeof TYPE_CONFIG)[OfficialContentType];
  onView: () => void;
  onFork: () => void;
}) {
  const Icon = config.icon;

  return (
    <Card
      className="hover:border-primary/50 group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onView}
    >
      <div className={`h-1 bg-gradient-to-r ${TYPE_GRADIENTS[item.type]}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="text-muted-foreground size-4" />
            <span className="line-clamp-1">{item.name}</span>
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={e => {
              e.stopPropagation();
              onFork();
            }}
            title="Fork"
          >
            <GitFork className="size-3" />
          </Button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {item.tier && (
            <Badge
              variant="outline"
              className={`py-0 text-xs ${tierColors[item.tier] ?? ''}`}
            >
              T{item.tier}
            </Badge>
          )}
          {item.level != null && (
            <Badge className={`py-0 text-xs ${levelColors[item.level] ?? ''}`}>
              Lvl {item.level}
            </Badge>
          )}
          {item.domain && (
            <Badge variant="outline" className="py-0 text-xs">
              {item.domain}
            </Badge>
          )}
          {item.category && (
            <Badge variant="outline" className="py-0 text-xs">
              {item.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      {item.description && (
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2 text-xs">
            {item.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}

// Route to correct card component
function OfficialItemCard({
  item,
  config,
  onView,
  onFork,
}: {
  item: OfficialItem;
  config: (typeof TYPE_CONFIG)[OfficialContentType];
  onView: () => void;
  onFork: () => void;
}) {
  switch (item.type) {
    case 'adversary':
      return <AdversaryCard item={item} onView={onView} onFork={onFork} />;
    case 'environment':
      return <EnvironmentCard item={item} onView={onView} onFork={onFork} />;
    case 'domain_card':
      return <DomainCardCard item={item} onView={onView} onFork={onFork} />;
    case 'class':
      return <ClassCard item={item} onView={onView} onFork={onFork} />;
    default:
      return (
        <GenericCard
          item={item}
          config={config}
          onView={onView}
          onFork={onFork}
        />
      );
  }
}

// ========== VIEW DIALOG ==========

function OfficialViewDialog({
  item,
  open,
  onOpenChange,
  onFork,
}: {
  item: OfficialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFork: () => void;
}) {
  if (!item) return null;
  const config = TYPE_CONFIG[item.type];
  const gradient = TYPE_GRADIENTS[item.type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r p-6 ${gradient}`}>
          <div className="rounded-xl bg-black/25 p-4">
            <DialogHeader className="space-y-0">
              <DialogTitle className="text-xl font-bold text-white drop-shadow">
                {item.name}
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Official {config.label.slice(0, -1)}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {item.tier && (
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  Tier {item.tier}
                </Badge>
              )}
              {item.level != null && (
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  Level {item.level}
                </Badge>
              )}
              {item.domain && (
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  {item.domain}
                </Badge>
              )}
              {item.role && (
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  {item.role}
                </Badge>
              )}
              {item.difficulty != null && (
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  Difficulty {item.difficulty}
                </Badge>
              )}
              {item.category && (
                <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                  {item.category}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[50vh] p-6">
          {item.type === 'adversary' && (
            <AdversaryDetail adv={item.rawData as Adversary} />
          )}
          {item.type === 'environment' && (
            <EnvironmentDetail env={item.rawData as Environment} />
          )}
          {item.type === 'domain_card' && (
            <DomainCardDetail card={item.rawData as DomainCard} />
          )}
          {item.type === 'class' && <ClassDetail raw={item.rawData} />}
          {item.type === 'subclass' && <SubclassDetail raw={item.rawData} />}
          {item.type === 'ancestry' && <AncestryDetail raw={item.rawData} />}
          {item.type === 'community' && <CommunityDetail raw={item.rawData} />}
          {item.type === 'equipment' && <EquipmentDetail raw={item.rawData} />}
          {item.type === 'item' && <ItemDetail raw={item.rawData} />}
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onFork}>
            <GitFork className="mr-2 size-4" />
            Fork to Homebrew
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========== MAIN COMPONENT ==========

export function OfficialContentBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<OfficialContentType>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['adversary'])
  );
  const [viewingItem, setViewingItem] = useState<OfficialItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [forkingItem, setForkingItem] = useState<OfficialItem | null>(null);
  const [isForkOpen, setIsForkOpen] = useState(false);

  const createMutation = useCreateHomebrewContent();
  const allOfficialContent = useMemo<OfficialItem[]>(
    () => buildOfficialContent(),
    []
  );

  const filteredContent = useMemo(() => {
    let items = allOfficialContent;
    if (typeFilter !== 'all')
      items = items.filter(item => item.type === typeFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }
    return items;
  }, [allOfficialContent, typeFilter, searchQuery]);

  const groupedContent = useMemo(() => {
    const groups: Record<OfficialContentType, OfficialItem[]> = {
      all: [],
      adversary: [],
      environment: [],
      class: [],
      subclass: [],
      ancestry: [],
      community: [],
      domain_card: [],
      equipment: [],
      item: [],
    };
    filteredContent.forEach(item => {
      groups[item.type].push(item);
    });
    return groups;
  }, [filteredContent]);

  const typesToShow: OfficialContentType[] =
    typeFilter === 'all'
      ? [
          'adversary',
          'environment',
          'class',
          'subclass',
          'ancestry',
          'community',
          'domain_card',
          'equipment',
          'item',
        ]
      : [typeFilter];

  const toggleSection = (type: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const collapseAll = useCallback(() => setExpandedSections(new Set()), []);
  const expandAll = useCallback(
    () => setExpandedSections(new Set(typesToShow)),
    [typesToShow]
  );

  const handleView = useCallback((item: OfficialItem) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);
  const handleFork = useCallback((item: OfficialItem) => {
    setForkingItem(item);
    setIsForkOpen(true);
    setIsViewOpen(false);
  }, []);

  const handleForkSubmit = useCallback(
    async (data: {
      content: unknown;
      visibility: 'public' | 'private' | 'campaign_only';
    }) => {
      if (!forkingItem) return;
      const homebrewType =
        forkingItem.type === 'all'
          ? 'adversary'
          : (forkingItem.type as HomebrewContentType);
      const content = data.content as { name: string };
      await createMutation.mutateAsync({
        contentType: homebrewType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: data.content as any,
        name: content.name,
        description: '',
        tags: ['forked-from-official'],
        visibility: data.visibility,
        campaignLinks: [],
      });
      setIsForkOpen(false);
      setForkingItem(null);
    },
    [forkingItem, createMutation]
  );

  const forkContentType =
    forkingItem?.type === 'all'
      ? 'adversary'
      : (forkingItem?.type as HomebrewContentType | undefined);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search official content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={v => setTypeFilter(v as OfficialContentType)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="adversary">Adversaries</SelectItem>
            <SelectItem value="environment">Environments</SelectItem>
            <SelectItem value="class">Classes</SelectItem>
            <SelectItem value="subclass">Subclasses</SelectItem>
            <SelectItem value="ancestry">Ancestries</SelectItem>
            <SelectItem value="community">Communities</SelectItem>
            <SelectItem value="domain_card">Domain Cards</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="item">Items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {filteredContent.length} official items found
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <ChevronDown className="mr-1 size-3" />
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronUp className="mr-1 size-3" />
            Collapse All
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {typesToShow.map(type => {
          const items = groupedContent[type];
          if (items.length === 0) return null;
          const config = TYPE_CONFIG[type];
          const Icon = config.icon;
          const isExpanded = expandedSections.has(type);

          return (
            <Collapsible
              key={type}
              open={isExpanded}
              onOpenChange={() => toggleSection(type)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-between border ${config.bgColor}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`size-5 ${config.color}`} />
                    <span className="font-semibold">{config.label}</span>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {items.slice(0, 50).map(item => (
                    <OfficialItemCard
                      key={item.id}
                      item={item}
                      config={config}
                      onView={() => handleView(item)}
                      onFork={() => handleFork(item)}
                    />
                  ))}
                  {items.length > 50 && (
                    <p className="text-muted-foreground col-span-full text-center text-sm">
                      Showing first 50 of {items.length} items. Use search to
                      find more.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Search className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground">
            No official content matches your search.
          </p>
        </div>
      )}

      <OfficialViewDialog
        item={viewingItem}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onFork={() => viewingItem && handleFork(viewingItem)}
      />

      {forkContentType && (
        <HomebrewFormDialog
          open={isForkOpen}
          onOpenChange={setIsForkOpen}
          contentType={forkContentType}
          initialData={{
            id: '',
            ownerId: '',
            contentType: forkContentType,
            name: forkingItem?.name ?? '',
            description: forkingItem?.description ?? '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content: forkingItem?.rawData as any,
            visibility: 'private',
            tags: [],
            campaignLinks: [],
            forkCount: 0,
            viewCount: 0,
            starCount: 0,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          onSubmit={handleForkSubmit}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
}

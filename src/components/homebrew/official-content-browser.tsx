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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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

import {
  AdversaryDetail,
  AncestryDetail,
  ClassDetail,
  CommunityDetail,
  DomainCardDetail,
  EnvironmentDetail,
  EquipmentDetail,
  formatThresholds,
  ItemDetail,
  levelColors,
  SubclassDetail,
} from './content-detail-views';
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

// Domain colors for domain cards
const domainColors: Record<string, string> = {
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

// Order for category tabs
const CATEGORY_ORDER: OfficialContentType[] = [
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

// Detail components are now imported from './content-detail-views'

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
  // Category tab state
  const [activeCategory, setActiveCategory] =
    useState<OfficialContentType>('adversary');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states (reset when changing category)
  const [tierFilter, setTierFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState('all');

  // View/fork dialog states
  const [viewingItem, setViewingItem] = useState<OfficialItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [forkingItem, setForkingItem] = useState<OfficialItem | null>(null);
  const [isForkOpen, setIsForkOpen] = useState(false);

  const createMutation = useCreateHomebrewContent();
  const allOfficialContent = useMemo<OfficialItem[]>(
    () => buildOfficialContent(),
    []
  );

  // Get items for current category
  const categoryItems = useMemo(() => {
    return allOfficialContent.filter(item => item.type === activeCategory);
  }, [allOfficialContent, activeCategory]);

  // Reset filters when category changes
  const handleCategoryChange = useCallback((type: OfficialContentType) => {
    setActiveCategory(type);
    setSearchQuery('');
    setTierFilter('all');
    setRoleFilter('all');
    setDomainFilter('all');
    setLevelFilter('all');
    setEquipmentCategoryFilter('all');
  }, []);

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

  // Get current category config
  const currentConfig = TYPE_CONFIG[activeCategory];
  const CurrentIcon = currentConfig.icon;

  // Get category-specific filter options
  const categoryFilters = useMemo(() => {
    switch (activeCategory) {
      case 'adversary':
        return {
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
        };
      case 'environment':
        return { tierOptions: ['all', '1', '2', '3', '4'] };
      case 'domain_card':
        return {
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
          levelOptions: [
            'all',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
          ],
        };
      case 'equipment':
        return {
          categoryOptions: [
            'all',
            'Primary Weapon',
            'Secondary Weapon',
            'Armor',
            'Combat Wheelchair',
          ],
          tierOptions: ['all', '1', '2', '3', '4'],
        };
      case 'item':
        return { tierOptions: ['all', '1', '2', '3', '4'] };
      default:
        return {};
    }
  }, [activeCategory]);

  // Apply category-specific filters
  const filteredCategoryItems = useMemo(() => {
    let items = categoryItems;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Apply tier filter
    if (tierFilter !== 'all') {
      items = items.filter(item => item.tier === tierFilter);
    }

    // Apply role filter (adversaries)
    if (roleFilter !== 'all' && activeCategory === 'adversary') {
      items = items.filter(item => item.role === roleFilter);
    }

    // Apply domain filter (domain cards)
    if (domainFilter !== 'all' && activeCategory === 'domain_card') {
      items = items.filter(item => item.domain === domainFilter);
    }

    // Apply level filter (domain cards)
    if (levelFilter !== 'all' && activeCategory === 'domain_card') {
      items = items.filter(item => String(item.level) === levelFilter);
    }

    // Apply equipment category filter
    if (equipmentCategoryFilter !== 'all' && activeCategory === 'equipment') {
      items = items.filter(item => {
        const cat = item.category ?? 'Primary Weapon';
        if (cat === 'Weapon') {
          const rawData = item.rawData as { type?: string };
          const actualCat =
            rawData.type === 'Secondary'
              ? 'Secondary Weapon'
              : 'Primary Weapon';
          return actualCat === equipmentCategoryFilter;
        }
        return cat === equipmentCategoryFilter;
      });
    }

    return items;
  }, [
    categoryItems,
    searchQuery,
    tierFilter,
    roleFilter,
    domainFilter,
    levelFilter,
    equipmentCategoryFilter,
    activeCategory,
  ]);

  // Group items for display
  const groupedDisplayItems = useMemo(() => {
    const items = filteredCategoryItems;
    const groups = new Map<string, OfficialItem[]>();

    for (const item of items) {
      let groupKey: string;
      switch (activeCategory) {
        case 'adversary':
          groupKey = item.role ?? 'Standard';
          break;
        case 'environment':
          groupKey = item.tier ?? '1';
          break;
        case 'domain_card':
          groupKey = item.domain ?? 'Arcana';
          break;
        case 'equipment': {
          const cat = item.category ?? 'Primary Weapon';
          if (cat === 'Weapon') {
            const rawData = item.rawData as { type?: string };
            groupKey =
              rawData.type === 'Secondary'
                ? 'Secondary Weapon'
                : 'Primary Weapon';
          } else {
            groupKey = cat;
          }
          break;
        }
        case 'item':
          groupKey = item.tier ?? '1';
          break;
        default: {
          // Alphabetical grouping
          const firstChar = item.name.charAt(0).toUpperCase();
          groupKey = /[A-Z]/.test(firstChar) ? firstChar : '#';
        }
      }

      const existing = groups.get(groupKey) ?? [];
      existing.push(item);
      groups.set(groupKey, existing);
    }

    // Sort items within each group
    for (const [key, groupItems] of groups) {
      groups.set(
        key,
        groupItems.sort((a, b) => a.name.localeCompare(b.name))
      );
    }

    return groups;
  }, [filteredCategoryItems, activeCategory]);

  // Get ordered groups
  const orderedGroups = useMemo(() => {
    const getGroupConfigs = (): {
      key: string;
      label: string;
      colorClass: string;
    }[] => {
      switch (activeCategory) {
        case 'adversary':
          return [
            { key: 'Solo', label: 'Solo', colorClass: roleColors['Solo'] },
            {
              key: 'Bruiser',
              label: 'Bruiser',
              colorClass: roleColors['Bruiser'],
            },
            {
              key: 'Leader',
              label: 'Leader',
              colorClass: roleColors['Leader'],
            },
            {
              key: 'Support',
              label: 'Support',
              colorClass: roleColors['Support'],
            },
            {
              key: 'Ranged',
              label: 'Ranged',
              colorClass: roleColors['Ranged'],
            },
            { key: 'Skulk', label: 'Skulk', colorClass: roleColors['Skulk'] },
            { key: 'Horde', label: 'Horde', colorClass: roleColors['Horde'] },
            {
              key: 'Minion',
              label: 'Minion',
              colorClass: roleColors['Minion'],
            },
            {
              key: 'Social',
              label: 'Social',
              colorClass: roleColors['Social'],
            },
            {
              key: 'Standard',
              label: 'Standard',
              colorClass: roleColors['Standard'],
            },
          ];
        case 'environment':
        case 'item':
          return [
            { key: '1', label: 'Tier 1', colorClass: tierColors['1'] },
            { key: '2', label: 'Tier 2', colorClass: tierColors['2'] },
            { key: '3', label: 'Tier 3', colorClass: tierColors['3'] },
            { key: '4', label: 'Tier 4', colorClass: tierColors['4'] },
          ];
        case 'domain_card':
          return [
            {
              key: 'Arcana',
              label: 'Arcana',
              colorClass: domainColors['Arcana'],
            },
            { key: 'Blade', label: 'Blade', colorClass: domainColors['Blade'] },
            { key: 'Bone', label: 'Bone', colorClass: domainColors['Bone'] },
            { key: 'Codex', label: 'Codex', colorClass: domainColors['Codex'] },
            { key: 'Grace', label: 'Grace', colorClass: domainColors['Grace'] },
            {
              key: 'Midnight',
              label: 'Midnight',
              colorClass: domainColors['Midnight'],
            },
            { key: 'Sage', label: 'Sage', colorClass: domainColors['Sage'] },
            {
              key: 'Splendor',
              label: 'Splendor',
              colorClass: domainColors['Splendor'],
            },
            { key: 'Valor', label: 'Valor', colorClass: domainColors['Valor'] },
          ];
        case 'equipment':
          return [
            {
              key: 'Primary Weapon',
              label: 'Primary Weapons',
              colorClass:
                'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
            },
            {
              key: 'Secondary Weapon',
              label: 'Secondary Weapons',
              colorClass:
                'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
            },
            {
              key: 'Armor',
              label: 'Armor',
              colorClass:
                'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
            },
            {
              key: 'Combat Wheelchair',
              label: 'Combat Wheelchairs',
              colorClass:
                'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
            },
          ];
        default:
          // Alphabetical - generate from actual data
          return Array.from(groupedDisplayItems.keys())
            .sort((a, b) =>
              a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)
            )
            .map(letter => ({
              key: letter,
              label: letter,
              colorClass: 'bg-muted/50',
            }));
      }
    };

    return getGroupConfigs().filter(g => groupedDisplayItems.has(g.key));
  }, [activeCategory, groupedDisplayItems]);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-1 pb-2">
          {CATEGORY_ORDER.map(type => {
            const config = TYPE_CONFIG[type];
            const Icon = config.icon;
            const count = allOfficialContent.filter(
              i => i.type === type
            ).length;
            const isActive = activeCategory === type;

            return (
              <Button
                key={type}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(type)}
                className={`flex shrink-0 items-center gap-1.5 transition-all ${
                  isActive ? 'shadow-sm' : config.bgColor
                }`}
              >
                <Icon className={`size-4 ${isActive ? '' : config.color}`} />
                <span className="hidden sm:inline">{config.label}</span>
                <Badge
                  variant={isActive ? 'secondary' : 'outline'}
                  className="ml-1 text-xs"
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Search and Category-Specific Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={`Search ${currentConfig.label.toLowerCase()}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category-specific filters */}
        {'tierOptions' in categoryFilters && categoryFilters.tierOptions && (
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              {categoryFilters.tierOptions.map(t => (
                <SelectItem key={t} value={t}>
                  {t === 'all' ? 'All Tiers' : `Tier ${t}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {'roleOptions' in categoryFilters && categoryFilters.roleOptions && (
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {categoryFilters.roleOptions.map(r => (
                <SelectItem key={r} value={r}>
                  {r === 'all' ? 'All Roles' : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {'domainOptions' in categoryFilters &&
          categoryFilters.domainOptions && (
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                {categoryFilters.domainOptions.map(d => (
                  <SelectItem key={d} value={d}>
                    {d === 'all' ? 'All Domains' : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

        {'levelOptions' in categoryFilters && categoryFilters.levelOptions && (
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {categoryFilters.levelOptions.map(l => (
                <SelectItem key={l} value={l}>
                  {l === 'all' ? 'All Levels' : `Level ${l}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {'categoryOptions' in categoryFilters &&
          categoryFilters.categoryOptions && (
            <Select
              value={equipmentCategoryFilter}
              onValueChange={setEquipmentCategoryFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {categoryFilters.categoryOptions.map(c => (
                  <SelectItem key={c} value={c}>
                    {c === 'all'
                      ? 'All Types'
                      : c === 'Primary Weapon'
                        ? 'Primary'
                        : c === 'Secondary Weapon'
                          ? 'Secondary'
                          : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <CurrentIcon className={`size-4 ${currentConfig.color}`} />
        <span className="text-muted-foreground text-sm">
          {filteredCategoryItems.length} {currentConfig.label.toLowerCase()}
          {searchQuery ||
          tierFilter !== 'all' ||
          roleFilter !== 'all' ||
          domainFilter !== 'all' ||
          levelFilter !== 'all' ||
          equipmentCategoryFilter !== 'all'
            ? ' matching filters'
            : ''}
        </span>
      </div>

      {/* Grouped Content Display */}
      {filteredCategoryItems.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Search className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground">
            No {currentConfig.label.toLowerCase()} match your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orderedGroups.map(group => {
            const groupItems = groupedDisplayItems.get(group.key) ?? [];
            if (groupItems.length === 0) return null;

            return (
              <div key={group.key} className="scroll-mt-24">
                {/* Group Header */}
                <div
                  className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 ${group.colorClass}`}
                >
                  <span className="text-lg font-bold">{group.label}</span>
                  <Badge variant="secondary">{groupItems.length}</Badge>
                </div>

                {/* Items Grid */}
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  }}
                >
                  {groupItems.map(item => (
                    <OfficialItemCard
                      key={item.id}
                      item={item}
                      config={currentConfig}
                      onView={() => handleView(item)}
                      onFork={() => handleFork(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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

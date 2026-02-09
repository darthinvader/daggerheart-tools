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
import { ScrollArea } from '@/components/ui/scroll-area';
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
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
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
import { roleColors, tierColors } from './homebrew-list-config';
import {
  CategoryTabsSection,
  ContentEmptyState,
  FilterBarSection,
  GroupedContentGrid,
  ResultsCountSection,
} from './official-content-browser-sections';
import {
  type OfficialContentType,
  type OfficialItem,
  useOfficialContentFilter,
} from './use-official-content-filter';

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
      difficulty:
        typeof env.difficulty === 'number'
          ? env.difficulty
          : parseInt(String(env.difficulty), 10) || undefined,
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

// ========== SHARED CARD PARTS ==========

function ForkButton({ onFork }: { onFork: () => void }) {
  return (
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
          <ForkButton onFork={onFork} />
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
          <ForkButton onFork={onFork} />
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
          <ForkButton onFork={onFork} />
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
          <ForkButton onFork={onFork} />
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
          <ForkButton onFork={onFork} />
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
  // Build all official content
  const allOfficialContent = useMemo<OfficialItem[]>(
    () => buildOfficialContent(),
    []
  );

  // Use extracted filter hook
  const {
    activeCategory,
    handleCategoryChange,
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    roleFilter,
    setRoleFilter,
    domainFilter,
    setDomainFilter,
    levelFilter,
    setLevelFilter,
    equipmentCategoryFilter,
    setEquipmentCategoryFilter,
    categoryFilters,
    filteredCategoryItems,
    groupedDisplayItems,
    orderedGroups,
  } = useOfficialContentFilter({ allItems: allOfficialContent });

  // View/fork dialog states
  const [viewingItem, setViewingItem] = useState<OfficialItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [forkingItem, setForkingItem] = useState<OfficialItem | null>(null);
  const [isForkOpen, setIsForkOpen] = useState(false);

  const createMutation = useCreateHomebrewContent();

  const handleView = useCallback((item: OfficialItem) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);
  const handleFork = useCallback((item: OfficialItem) => {
    setForkingItem(item);
    setIsForkOpen(true);
    setIsViewOpen(false);
  }, []);

  const handleViewDialogFork = useCallback(() => {
    if (viewingItem) handleFork(viewingItem);
  }, [viewingItem, handleFork]);

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
        content: data.content as HomebrewContent['content'],
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

  const hasActiveFilters = useMemo(
    () =>
      !!searchQuery ||
      tierFilter !== 'all' ||
      roleFilter !== 'all' ||
      domainFilter !== 'all' ||
      levelFilter !== 'all' ||
      equipmentCategoryFilter !== 'all',
    [
      searchQuery,
      tierFilter,
      roleFilter,
      domainFilter,
      levelFilter,
      equipmentCategoryFilter,
    ]
  );

  const resolvedCategoryFilters = useMemo(
    () => ({
      tierOptions:
        'tierOptions' in categoryFilters
          ? categoryFilters.tierOptions
          : undefined,
      roleOptions:
        'roleOptions' in categoryFilters
          ? categoryFilters.roleOptions
          : undefined,
      domainOptions:
        'domainOptions' in categoryFilters
          ? categoryFilters.domainOptions
          : undefined,
      levelOptions:
        'levelOptions' in categoryFilters
          ? categoryFilters.levelOptions
          : undefined,
      categoryOptions:
        'categoryOptions' in categoryFilters
          ? categoryFilters.categoryOptions
          : undefined,
    }),
    [categoryFilters]
  );

  const forkDialogInitialData = useMemo(
    () =>
      forkContentType && forkingItem
        ? ({
            id: '',
            ownerId: '',
            contentType: forkContentType,
            name: forkingItem.name,
            description: forkingItem.description ?? '',
            content: forkingItem.rawData as HomebrewContent['content'],
            visibility: 'private' as const,
            tags: [] as string[],
            campaignLinks: [] as string[],
            forkCount: 0,
            viewCount: 0,
            starCount: 0,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as HomebrewContent)
        : null,
    [forkContentType, forkingItem]
  );

  return (
    <div className="space-y-4">
      <CategoryTabsSection
        categoryOrder={CATEGORY_ORDER}
        allContent={allOfficialContent}
        activeCategory={activeCategory}
        typeConfig={TYPE_CONFIG}
        onCategoryChange={handleCategoryChange}
      />

      <FilterBarSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={`Search ${currentConfig.label.toLowerCase()}...`}
        categoryFilters={resolvedCategoryFilters}
        tierFilter={tierFilter}
        onTierChange={setTierFilter}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        domainFilter={domainFilter}
        onDomainChange={setDomainFilter}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        equipmentCategoryFilter={equipmentCategoryFilter}
        onEquipmentCategoryChange={setEquipmentCategoryFilter}
      />

      <ResultsCountSection
        Icon={CurrentIcon}
        iconColor={currentConfig.color}
        count={filteredCategoryItems.length}
        label={currentConfig.label.toLowerCase()}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredCategoryItems.length === 0 ? (
        <ContentEmptyState label={currentConfig.label.toLowerCase()} />
      ) : (
        <GroupedContentGrid
          orderedGroups={orderedGroups}
          groupedItems={groupedDisplayItems}
          config={currentConfig}
          onViewItem={handleView}
          onForkItem={handleFork}
          renderCard={(item, config, onView, onFork) => (
            <OfficialItemCard
              key={item.id}
              item={item}
              config={config}
              onView={onView}
              onFork={onFork}
            />
          )}
        />
      )}

      <OfficialViewDialog
        item={viewingItem}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onFork={handleViewDialogFork}
      />

      {forkContentType && forkDialogInitialData && (
        <HomebrewFormDialog
          open={isForkOpen}
          onOpenChange={setIsForkOpen}
          contentType={forkContentType}
          initialData={forkDialogInitialData}
          onSubmit={handleForkSubmit}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
}

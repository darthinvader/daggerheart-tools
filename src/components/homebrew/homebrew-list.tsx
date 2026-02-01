/**
 * Homebrew Content List
 *
 * Tabbed grid display for homebrew content with category-specific filtering.
 */
import {
  Beaker,
  BookOpen,
  Grid,
  Home,
  Layers,
  List,
  Map,
  Package,
  Plus,
  Search,
  Shield,
  Skull,
  SortAsc,
  Sword,
  Users,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCampaigns } from '@/features/campaigns/use-campaign-query';
import { useCharactersQuery } from '@/features/characters/use-characters-query';
import {
  useAddHomebrewToCollection,
  useCreateHomebrewCollection,
  useHomebrewCollections,
  useLinkHomebrewToCampaign,
  useLinkHomebrewToCharacter,
  useMyHomebrewStars,
  useToggleHomebrewStar,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
import { getContentTypeLabel } from '@/lib/schemas/homebrew';

import { HomebrewCampaignDialog } from './homebrew-campaign-dialog';
import { HomebrewCard } from './homebrew-card';
import { HomebrewCharacterDialog } from './homebrew-character-dialog';
import { HomebrewCollectionDialog } from './homebrew-collection-dialog';

// Content type configuration for icons, colors, and labels
const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
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

const CONTENT_TYPES: HomebrewContentType[] = [
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

// Domain colors
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

type SortOption = 'name' | 'created' | 'updated' | 'popular' | 'stars';
type ViewMode = 'grid' | 'list';

interface HomebrewListProps {
  items: HomebrewContent[];
  isLoading?: boolean;
  currentUserId?: string;
  linkedItemIds?: Set<string>;
  onView?: (item: HomebrewContent) => void;
  onEdit?: (item: HomebrewContent) => void;
  onDelete?: (item: HomebrewContent) => void;
  onFork?: (item: HomebrewContent) => void;
  onLinkToCampaign?: (item: HomebrewContent) => void;
  onCreate?: (type: HomebrewContentType) => void;
  showCreateButton?: boolean;
  emptyMessage?: string;
}

export function HomebrewList({
  items,
  isLoading = false,
  currentUserId,
  linkedItemIds,
  onView,
  onEdit,
  onDelete,
  onFork,
  onLinkToCampaign,
  onCreate,
  showCreateButton = true,
  emptyMessage: _emptyMessage = 'No homebrew content found.',
}: HomebrewListProps) {
  // Category tab state
  const [activeCategory, setActiveCategory] =
    useState<HomebrewContentType>('adversary');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Category-specific filters
  const [tierFilter, setTierFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState('all');

  // Dialog states
  const [collectionTarget, setCollectionTarget] =
    useState<HomebrewContent | null>(null);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [campaignTarget, setCampaignTarget] = useState<HomebrewContent | null>(
    null
  );
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [characterTarget, setCharacterTarget] =
    useState<HomebrewContent | null>(null);
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false);

  const homebrewIds = useMemo(() => items.map(item => item.id), [items]);
  const { data: starredIds = [] } = useMyHomebrewStars(
    currentUserId ? homebrewIds : []
  );
  const starredSet = useMemo(() => new Set(starredIds), [starredIds]);
  const toggleStar = useToggleHomebrewStar();

  const { data: collections = [] } = useHomebrewCollections(!!currentUserId);
  const createCollection = useCreateHomebrewCollection();
  const addToCollection = useAddHomebrewToCollection();
  const linkToCampaign = useLinkHomebrewToCampaign();
  const linkToCharacter = useLinkHomebrewToCharacter();

  const { data: campaigns = [] } = useCampaigns();
  const { data: characters = [] } = useCharactersQuery();

  const gmCampaigns = useMemo(
    () => campaigns.filter(campaign => campaign.gmId === currentUserId),
    [campaigns, currentUserId]
  );

  // Get current category config
  const currentConfig = CONTENT_TYPE_CONFIG[activeCategory];
  const CurrentIcon = currentConfig.icon;

  // Reset filters when category changes
  const handleCategoryChange = useCallback((type: HomebrewContentType) => {
    setActiveCategory(type);
    setSearch('');
    setTierFilter('all');
    setRoleFilter('all');
    setDomainFilter('all');
    setLevelFilter('all');
    setEquipmentCategoryFilter('all');
  }, []);

  // Get items for current category
  const categoryItems = useMemo(() => {
    return items.filter(item => item.contentType === activeCategory);
  }, [items, activeCategory]);

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

  // Helper to get content property (handles nested content structure)
  const getContentProp = useCallback(
    (item: HomebrewContent, prop: string): string | number | undefined => {
      const content = item.content as Record<string, unknown> | undefined;
      if (!content) return undefined;
      return content[prop] as string | number | undefined;
    },
    []
  );

  // Apply filters and sorting
  const filteredCategoryItems = useMemo(() => {
    let result = [...categoryItems];

    // Apply search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          (item.tags?.some(t => t.toLowerCase().includes(query)) ?? false)
      );
    }

    // Apply tier filter
    if (tierFilter !== 'all') {
      result = result.filter(item => {
        const tier = getContentProp(item, 'tier');
        return String(tier) === tierFilter;
      });
    }

    // Apply role filter (adversaries)
    if (roleFilter !== 'all' && activeCategory === 'adversary') {
      result = result.filter(item => {
        const role = getContentProp(item, 'role');
        return role === roleFilter;
      });
    }

    // Apply domain filter (domain cards)
    if (domainFilter !== 'all' && activeCategory === 'domain_card') {
      result = result.filter(item => {
        const domain = getContentProp(item, 'domain');
        return domain === domainFilter;
      });
    }

    // Apply level filter (domain cards)
    if (levelFilter !== 'all' && activeCategory === 'domain_card') {
      result = result.filter(item => {
        const level = getContentProp(item, 'level');
        return String(level) === levelFilter;
      });
    }

    // Apply equipment category filter
    if (equipmentCategoryFilter !== 'all' && activeCategory === 'equipment') {
      result = result.filter(item => {
        const content = item.content as Record<string, unknown> | undefined;
        const type = content?.type as string | undefined;
        const cat = content?.category as string | undefined;

        if (cat === 'Weapon' || !cat) {
          const actualCat =
            type === 'Secondary' ? 'Secondary Weapon' : 'Primary Weapon';
          return actualCat === equipmentCategoryFilter;
        }
        return cat === equipmentCategoryFilter;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        case 'popular':
          return (b.viewCount ?? 0) - (a.viewCount ?? 0);
        case 'stars':
          return (b.starCount ?? 0) - (a.starCount ?? 0);
        case 'updated':
        default:
          return (
            new Date(b.updatedAt ?? 0).getTime() -
            new Date(a.updatedAt ?? 0).getTime()
          );
      }
    });

    return result;
  }, [
    categoryItems,
    search,
    tierFilter,
    roleFilter,
    domainFilter,
    levelFilter,
    equipmentCategoryFilter,
    activeCategory,
    sortBy,
    getContentProp,
  ]);

  // Group items for display
  const groupedDisplayItems = useMemo((): Record<string, HomebrewContent[]> => {
    const groups: Record<string, HomebrewContent[]> = {};

    for (const item of filteredCategoryItems) {
      let groupKey: string;
      switch (activeCategory) {
        case 'adversary': {
          const role = getContentProp(item, 'role');
          groupKey = (role as string) ?? 'Standard';
          break;
        }
        case 'environment': {
          const tier = getContentProp(item, 'tier');
          groupKey = String(tier ?? '1');
          break;
        }
        case 'domain_card': {
          const domain = getContentProp(item, 'domain');
          groupKey = (domain as string) ?? 'Arcana';
          break;
        }
        case 'equipment': {
          const content = item.content as Record<string, unknown> | undefined;
          const cat = content?.category as string | undefined;
          const type = content?.type as string | undefined;
          if (cat === 'Weapon' || !cat) {
            groupKey =
              type === 'Secondary' ? 'Secondary Weapon' : 'Primary Weapon';
          } else {
            groupKey = cat;
          }
          break;
        }
        case 'item': {
          const tier = getContentProp(item, 'tier');
          groupKey = String(tier ?? '1');
          break;
        }
        default: {
          // Alphabetical grouping
          const firstChar = item.name.charAt(0).toUpperCase();
          groupKey = /[A-Z]/.test(firstChar) ? firstChar : '#';
        }
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    }

    return groups;
  }, [filteredCategoryItems, activeCategory, getContentProp]);

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
        default: {
          // Alphabetical - generate from actual data
          const keys = Object.keys(groupedDisplayItems);
          return keys
            .sort((a, b) =>
              a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)
            )
            .map(letter => ({
              key: letter,
              label: letter,
              colorClass: 'bg-muted/50',
            }));
        }
      }
    };

    return getGroupConfigs().filter(g => g.key in groupedDisplayItems);
  }, [activeCategory, groupedDisplayItems]);

  const handleCreateClick = useCallback(() => {
    onCreate?.(activeCategory);
  }, [onCreate, activeCategory]);

  const handleToggleStar = useCallback(
    (item: HomebrewContent) => {
      toggleStar.mutate({
        homebrewId: item.id,
        isStarred: starredSet.has(item.id),
      });
    },
    [starredSet, toggleStar]
  );

  const handleAddToCollection = useCallback((item: HomebrewContent) => {
    setCollectionTarget(item);
    setCollectionDialogOpen(true);
  }, []);

  const handleLinkToCampaign = useCallback((item: HomebrewContent) => {
    setCampaignTarget(item);
    setCampaignDialogOpen(true);
  }, []);

  const handleAddToCharacter = useCallback((item: HomebrewContent) => {
    setCharacterTarget(item);
    setCharacterDialogOpen(true);
  }, []);

  const renderCard = useCallback(
    (item: HomebrewContent) => (
      <HomebrewCard
        content={item}
        isOwner={item.ownerId === currentUserId}
        isStarred={starredSet.has(item.id)}
        isLinkedToCampaign={linkedItemIds?.has(item.id) ?? false}
        onView={onView ? () => onView(item) : undefined}
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
        onFork={onFork ? () => onFork(item) : undefined}
        onLinkToCampaign={
          onLinkToCampaign
            ? () => onLinkToCampaign(item)
            : currentUserId
              ? () => handleLinkToCampaign(item)
              : undefined
        }
        onAddToCharacter={
          currentUserId ? () => handleAddToCharacter(item) : undefined
        }
        onToggleStar={currentUserId ? () => handleToggleStar(item) : undefined}
        onAddToCollection={
          currentUserId ? () => handleAddToCollection(item) : undefined
        }
        canInteract={!!currentUserId}
      />
    ),
    [
      currentUserId,
      starredSet,
      linkedItemIds,
      onView,
      onEdit,
      onDelete,
      onFork,
      onLinkToCampaign,
      handleLinkToCampaign,
      handleAddToCharacter,
      handleToggleStar,
      handleAddToCollection,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-1 pb-2">
          {CONTENT_TYPES.map(type => {
            const config = CONTENT_TYPE_CONFIG[type];
            const Icon = config.icon;
            const count = items.filter(i => i.contentType === type).length;
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

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${currentConfig.label.toLowerCase()}...`}
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

        {/* Sort and View Mode */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Select
            value={sortBy}
            onValueChange={v => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-40">
              <SortAsc className="mr-2 size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="created">Recently Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="stars">Most Starred</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            value={viewMode}
            onValueChange={v => setViewMode(v as ViewMode)}
          >
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-2">
                <Grid className="size-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-2">
                <List className="size-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Create Button + Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CurrentIcon className={`size-4 ${currentConfig.color}`} />
          <span className="text-muted-foreground text-sm">
            {filteredCategoryItems.length} {currentConfig.label.toLowerCase()}
            {search ||
            tierFilter !== 'all' ||
            roleFilter !== 'all' ||
            domainFilter !== 'all' ||
            levelFilter !== 'all' ||
            equipmentCategoryFilter !== 'all'
              ? ' matching filters'
              : ''}
          </span>
        </div>

        {showCreateButton && onCreate && (
          <Button
            onClick={handleCreateClick}
            size="sm"
            className={`gap-1.5 ${currentConfig.bgColor} hover:opacity-90`}
            variant="outline"
          >
            <Plus className={`size-4 ${currentConfig.color}`} />
            <span>
              Create{' '}
              {activeCategory === 'domain_card'
                ? 'Domain Card'
                : getContentTypeLabel(activeCategory)}
            </span>
          </Button>
        )}
      </div>

      {/* Content Display */}
      {filteredCategoryItems.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Beaker className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground">
            {categoryItems.length === 0
              ? `No ${currentConfig.label.toLowerCase()} yet.`
              : 'No items match your filters.'}
          </p>
          {showCreateButton && onCreate && categoryItems.length === 0 && (
            <Button
              onClick={handleCreateClick}
              size="sm"
              className="gap-1.5"
              variant="outline"
            >
              <Plus className="size-4" />
              Create your first{' '}
              {activeCategory === 'domain_card'
                ? 'domain card'
                : getContentTypeLabel(activeCategory).toLowerCase()}
            </Button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredCategoryItems.map(item => (
            <div key={item.id}>{renderCard(item)}</div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {orderedGroups.map(group => {
            const groupItems = groupedDisplayItems[group.key] ?? [];
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
                    <div key={item.id}>{renderCard(item)}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {collectionTarget && (
        <HomebrewCollectionDialog
          open={collectionDialogOpen}
          onOpenChange={open => {
            setCollectionDialogOpen(open);
            if (!open) setCollectionTarget(null);
          }}
          homebrewName={collectionTarget.name}
          collections={collections}
          onCreateCollection={async (name, description) =>
            createCollection.mutateAsync({ name, description })
          }
          onAddToCollection={async collectionId => {
            await addToCollection.mutateAsync({
              collectionId,
              homebrewId: collectionTarget.id,
            });
          }}
          isSubmitting={createCollection.isPending || addToCollection.isPending}
        />
      )}

      {campaignTarget && (
        <HomebrewCampaignDialog
          open={campaignDialogOpen}
          onOpenChange={open => {
            setCampaignDialogOpen(open);
            if (!open) setCampaignTarget(null);
          }}
          homebrewName={campaignTarget.name}
          campaigns={gmCampaigns}
          onLink={async campaignId => {
            await linkToCampaign.mutateAsync({
              homebrewId: campaignTarget.id,
              campaignId,
            });
          }}
          isSubmitting={linkToCampaign.isPending}
        />
      )}

      {characterTarget && (
        <HomebrewCharacterDialog
          open={characterDialogOpen}
          onOpenChange={open => {
            setCharacterDialogOpen(open);
            if (!open) setCharacterTarget(null);
          }}
          homebrewName={characterTarget.name}
          characters={characters}
          onLink={async characterId => {
            await linkToCharacter.mutateAsync({
              homebrewId: characterTarget.id,
              characterId,
            });
          }}
          isSubmitting={linkToCharacter.isPending}
        />
      )}
    </div>
  );
}

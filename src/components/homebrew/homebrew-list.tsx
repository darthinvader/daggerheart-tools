/**
 * Homebrew Content List
 *
 * Grid/list display for homebrew content with filtering and sorting.
 */
import {
  Beaker,
  BookOpen,
  Filter,
  Grid,
  Home,
  Layers,
  List,
  Map,
  Package,
  Search,
  Shield,
  Skull,
  SortAsc,
  Sword,
  Users,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// Content type configuration for icons and colors
const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  adversary: { icon: Skull, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  environment: {
    icon: Map,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  domain_card: {
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  class: { icon: Shield, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  subclass: {
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  ancestry: {
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  community: { icon: Home, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
  equipment: {
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  item: { icon: Package, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
};

const CONTENT_TYPES: HomebrewContentType[] = [
  'adversary',
  'environment',
  'domain_card',
  'class',
  'subclass',
  'ancestry',
  'community',
  'equipment',
  'item',
];

type SortOption = 'name' | 'created' | 'updated' | 'popular' | 'stars';
type ViewMode = 'grid' | 'list';

interface HomebrewListProps {
  items: HomebrewContent[];
  isLoading?: boolean;
  currentUserId?: string;
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
  onView,
  onEdit,
  onDelete,
  onFork,
  onLinkToCampaign,
  onCreate,
  showCreateButton = true,
  emptyMessage = 'No homebrew content found.',
}: HomebrewListProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<HomebrewContentType | 'all'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          (item.tags?.some(t => t.toLowerCase().includes(query)) ?? false)
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter(item => item.contentType === typeFilter);
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
  }, [items, search, typeFilter, sortBy]);

  const handleCreateClick = useCallback(
    (type: HomebrewContentType) => {
      onCreate?.(type);
    },
    [onCreate]
  );

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

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search homebrew..."
              className="pl-9"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={v => setTypeFilter(v as HomebrewContentType | 'all')}
          >
            <SelectTrigger className="w-40">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Beaker className="size-4" />
                  All Types
                </div>
              </SelectItem>
              {CONTENT_TYPES.map(type => {
                const config = CONTENT_TYPE_CONFIG[type];
                const Icon = config.icon;
                return (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${config.color}`} />
                      {getContentTypeLabel(type)}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={v => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-48">
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

      {/* Create Button */}
      {showCreateButton && onCreate && (
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map(type => {
            const config = CONTENT_TYPE_CONFIG[type];
            const Icon = config.icon;
            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleCreateClick(type)}
                className={`gap-1 ${config.bgColor} hover:${config.bgColor}`}
              >
                <Icon className={`size-3 ${config.color}`} />
                {getContentTypeLabel(type)}
              </Button>
            );
          })}
        </div>
      )}

      {/* Content Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Beaker className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground">
            {items.length === 0 ? emptyMessage : 'No items match your filters.'}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-3'
          }
        >
          {filteredItems.map(item => (
            <HomebrewCard
              key={item.id}
              content={item}
              isOwner={item.ownerId === currentUserId}
              isStarred={starredSet.has(item.id)}
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
              onToggleStar={
                currentUserId ? () => handleToggleStar(item) : undefined
              }
              onAddToCollection={
                currentUserId ? () => handleAddToCollection(item) : undefined
              }
              canInteract={!!currentUserId}
            />
          ))}
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

      {/* Results count */}
      <div className="text-muted-foreground text-center text-sm">
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
}

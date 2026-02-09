/**
 * Homebrew Content List
 *
 * Tabbed grid display for homebrew content with category-specific filtering.
 */
import { useCallback, useMemo, useState } from 'react';

import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

import { CONTENT_TYPE_CONFIG, CONTENT_TYPES } from './homebrew-list-config';
import {
  HomebrewContentDisplaySection,
  HomebrewDialogsSection,
  HomebrewEmptyStateSection,
  HomebrewLoadingState,
  HomebrewToolbarHeader,
} from './homebrew-list-sections';
import {
  CategoryTabs,
  FilterToolbar,
  type ViewMode,
} from './homebrew-list-toolbar';
import { useHomebrewCardRenderer } from './use-homebrew-card-renderer';
import { useHomebrewContentFilter } from './use-homebrew-content-filter';
import { useHomebrewDialogs } from './use-homebrew-dialogs';
import { useHomebrewListData } from './use-homebrew-list-data';

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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filtering, sorting, and grouping logic (extracted to hook)
  const {
    search,
    setSearch,
    sortBy,
    setSortBy,
    filterState,
    handleFilterChange,
    resetFilters,
    filteredCategoryItems,
    groupedDisplayItems,
    orderedGroups,
    categoryFilters,
  } = useHomebrewContentFilter({ items, activeCategory });

  // Dialog states (extracted to hook)
  const {
    collectionDialog,
    openCollectionDialog,
    setCollectionDialogOpen,
    campaignDialog,
    openCampaignDialog,
    setCampaignDialogOpen,
    characterDialog,
    openCharacterDialog,
    setCharacterDialogOpen,
  } = useHomebrewDialogs();

  // Data fetching and mutations (extracted to hook)
  const {
    starredSet,
    handleToggleStar,
    collections,
    createCollection,
    addToCollection,
    linkToCampaign,
    linkToCharacter,
    gmCampaigns,
    characters,
  } = useHomebrewListData({ items, currentUserId });

  // Get current category config
  const currentConfig = CONTENT_TYPE_CONFIG[activeCategory];
  const CurrentIcon = currentConfig.icon;

  // Compute item counts per category for tabs
  const itemCounts = useMemo(() => {
    const counts: Record<HomebrewContentType, number> = {} as Record<
      HomebrewContentType,
      number
    >;
    for (const type of CONTENT_TYPES) {
      counts[type] = items.filter(i => i.contentType === type).length;
    }
    return counts;
  }, [items]);

  // Reset filters when category changes
  const handleCategoryChange = useCallback(
    (type: HomebrewContentType) => {
      setActiveCategory(type);
      resetFilters();
    },
    [resetFilters]
  );

  const handleCreateClick = useCallback(() => {
    onCreate?.(activeCategory);
  }, [onCreate, activeCategory]);

  // Dialog action handlers
  const handleCreateCollection = useCallback(
    async (name: string, description = '') =>
      createCollection.mutateAsync({ name, description }),
    [createCollection]
  );

  const handleAddToCollection = useCallback(
    async (collectionId: string) => {
      await addToCollection.mutateAsync({
        collectionId,
        homebrewId: collectionDialog.target!.id,
      });
    },
    [addToCollection, collectionDialog.target]
  );

  const handleLinkToCampaign = useCallback(
    async (campaignId: string) => {
      await linkToCampaign.mutateAsync({
        homebrewId: campaignDialog.target!.id,
        campaignId,
      });
    },
    [linkToCampaign, campaignDialog.target]
  );

  const handleLinkToCharacter = useCallback(
    async (characterId: string) => {
      await linkToCharacter.mutateAsync({
        homebrewId: characterDialog.target!.id,
        characterId,
      });
    },
    [linkToCharacter, characterDialog.target]
  );

  const isCollectionSubmitting =
    createCollection.isPending || addToCollection.isPending;

  // Card renderer (extracted to hook)
  const renderCard = useHomebrewCardRenderer({
    currentUserId,
    starredSet,
    linkedItemIds,
    onView,
    onEdit,
    onDelete,
    onFork,
    onLinkToCampaign,
    openCampaignDialog,
    openCharacterDialog,
    handleToggleStar,
    openCollectionDialog,
  });

  if (isLoading) {
    return <HomebrewLoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        itemCounts={itemCounts}
        onCategoryChange={handleCategoryChange}
      />

      {/* Toolbar */}
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilters={categoryFilters}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder={`Search ${currentConfig.label.toLowerCase()}...`}
      />

      {/* Create Button + Results Count */}
      <HomebrewToolbarHeader
        Icon={CurrentIcon}
        iconColor={currentConfig.color}
        filteredCount={filteredCategoryItems.length}
        categoryLabel={currentConfig.label}
        search={search}
        filterState={filterState}
        showCreateButton={showCreateButton && !!onCreate}
        bgColor={currentConfig.bgColor}
        activeCategory={activeCategory}
        onCreateClick={handleCreateClick}
      />

      {/* Content Display */}
      {filteredCategoryItems.length === 0 ? (
        <HomebrewEmptyStateSection
          categoryItemsCount={itemCounts[activeCategory]}
          categoryLabel={currentConfig.label}
          activeCategory={activeCategory}
          showCreateButton={showCreateButton}
          onCreate={onCreate}
        />
      ) : (
        <HomebrewContentDisplaySection
          viewMode={viewMode}
          filteredItems={filteredCategoryItems}
          groupedItems={groupedDisplayItems}
          orderedGroups={orderedGroups}
          renderCard={renderCard}
        />
      )}

      <HomebrewDialogsSection
        collectionDialogOpen={collectionDialog.open}
        collectionDialogTarget={collectionDialog.target}
        setCollectionDialogOpen={setCollectionDialogOpen}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onAddToCollection={handleAddToCollection}
        isCollectionSubmitting={isCollectionSubmitting}
        campaignDialogOpen={campaignDialog.open}
        campaignDialogTarget={campaignDialog.target}
        setCampaignDialogOpen={setCampaignDialogOpen}
        campaigns={gmCampaigns}
        onLinkToCampaign={handleLinkToCampaign}
        isCampaignSubmitting={linkToCampaign.isPending}
        characterDialogOpen={characterDialog.open}
        characterDialogTarget={characterDialog.target}
        setCharacterDialogOpen={setCharacterDialogOpen}
        characters={characters}
        onLinkToCharacter={handleLinkToCharacter}
        isCharacterSubmitting={linkToCharacter.isPending}
      />
    </div>
  );
}

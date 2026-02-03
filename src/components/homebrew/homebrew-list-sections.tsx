/**
 * HomebrewList Section Components
 *
 * Extracted section components for HomebrewList to reduce complexity.
 */
import { Beaker, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CharacterSummary } from '@/lib/api/characters';
import type { Campaign } from '@/lib/schemas/campaign';
import type {
  HomebrewCollection,
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
import { getContentTypeLabel } from '@/lib/schemas/homebrew';

import { HomebrewCampaignDialog } from './homebrew-campaign-dialog';
import { HomebrewCharacterDialog } from './homebrew-character-dialog';
import { HomebrewCollectionDialog } from './homebrew-collection-dialog';

// ─────────────────────────────────────────────────────────────────────────────
// Loading State
// ─────────────────────────────────────────────────────────────────────────────

export function HomebrewLoadingState() {
  return (
    <div className="flex h-48 items-center justify-center">
      <div className="text-muted-foreground animate-pulse">Loading...</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar Header (count + create button)
// ─────────────────────────────────────────────────────────────────────────────

interface FilterState {
  tier: string;
  role: string;
  domain: string;
  level: string;
  equipmentCategory: string;
}

interface ToolbarHeaderProps {
  Icon: LucideIcon;
  iconColor: string;
  filteredCount: number;
  categoryLabel: string;
  search: string;
  filterState: FilterState;
  showCreateButton: boolean;
  bgColor: string;
  activeCategory: HomebrewContentType;
  onCreateClick: () => void;
}

export function HomebrewToolbarHeader({
  Icon,
  iconColor,
  filteredCount,
  categoryLabel,
  search,
  filterState,
  showCreateButton,
  bgColor,
  activeCategory,
  onCreateClick,
}: ToolbarHeaderProps) {
  const hasFilters =
    search ||
    filterState.tier !== 'all' ||
    filterState.role !== 'all' ||
    filterState.domain !== 'all' ||
    filterState.level !== 'all' ||
    filterState.equipmentCategory !== 'all';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${iconColor}`} />
        <span className="text-muted-foreground text-sm">
          {filteredCount} {categoryLabel.toLowerCase()}
          {hasFilters ? ' matching filters' : ''}
        </span>
      </div>

      {showCreateButton && (
        <Button
          onClick={onCreateClick}
          size="sm"
          className={`gap-1.5 ${bgColor} hover:opacity-90`}
          variant="outline"
        >
          <Plus className={`size-4 ${iconColor}`} />
          <span>
            Create{' '}
            {activeCategory === 'domain_card'
              ? 'Domain Card'
              : getContentTypeLabel(activeCategory)}
          </span>
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State Section
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateSectionProps {
  categoryItemsCount: number;
  categoryLabel: string;
  activeCategory: HomebrewContentType;
  showCreateButton: boolean;
  onCreate?: (type: HomebrewContentType) => void;
}

export function HomebrewEmptyStateSection({
  categoryItemsCount,
  categoryLabel,
  activeCategory,
  showCreateButton,
  onCreate,
}: EmptyStateSectionProps) {
  const handleCreateClick = () => onCreate?.(activeCategory);

  return (
    <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <Beaker className="text-muted-foreground size-8" />
      </div>
      <p className="text-muted-foreground">
        {categoryItemsCount === 0
          ? `No ${categoryLabel.toLowerCase()} yet.`
          : 'No items match your filters.'}
      </p>
      {showCreateButton && onCreate && categoryItemsCount === 0 && (
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Display Section
// ─────────────────────────────────────────────────────────────────────────────

interface GroupInfo {
  key: string;
  label: string;
  colorClass: string;
}

interface ContentDisplaySectionProps {
  viewMode: 'grid' | 'list';
  filteredItems: HomebrewContent[];
  groupedItems: Record<string, HomebrewContent[]>;
  orderedGroups: GroupInfo[];
  renderCard: (item: HomebrewContent) => ReactNode;
}

export function HomebrewContentDisplaySection({
  viewMode,
  filteredItems,
  groupedItems,
  orderedGroups,
  renderCard,
}: ContentDisplaySectionProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {filteredItems.map(item => (
          <div key={item.id}>{renderCard(item)}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orderedGroups.map(group => {
        const groupItems = groupedItems[group.key] ?? [];
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {groupItems.map(item => (
                <div key={item.id}>{renderCard(item)}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialogs Section
// ─────────────────────────────────────────────────────────────────────────────

interface DialogsSectionProps {
  // Collection dialog
  collectionDialogOpen: boolean;
  collectionDialogTarget: HomebrewContent | null;
  setCollectionDialogOpen: (open: boolean) => void;
  collections: HomebrewCollection[];
  onCreateCollection: (
    name: string,
    description?: string
  ) => Promise<HomebrewCollection>;
  onAddToCollection: (collectionId: string) => Promise<void>;
  isCollectionSubmitting: boolean;
  // Campaign dialog
  campaignDialogOpen: boolean;
  campaignDialogTarget: HomebrewContent | null;
  setCampaignDialogOpen: (open: boolean) => void;
  campaigns: Campaign[];
  onLinkToCampaign: (campaignId: string) => Promise<void>;
  isCampaignSubmitting: boolean;
  // Character dialog
  characterDialogOpen: boolean;
  characterDialogTarget: HomebrewContent | null;
  setCharacterDialogOpen: (open: boolean) => void;
  characters: CharacterSummary[];
  onLinkToCharacter: (characterId: string) => Promise<void>;
  isCharacterSubmitting: boolean;
}

export function HomebrewDialogsSection({
  collectionDialogOpen,
  collectionDialogTarget,
  setCollectionDialogOpen,
  collections,
  onCreateCollection,
  onAddToCollection,
  isCollectionSubmitting,
  campaignDialogOpen,
  campaignDialogTarget,
  setCampaignDialogOpen,
  campaigns,
  onLinkToCampaign,
  isCampaignSubmitting,
  characterDialogOpen,
  characterDialogTarget,
  setCharacterDialogOpen,
  characters,
  onLinkToCharacter,
  isCharacterSubmitting,
}: DialogsSectionProps) {
  return (
    <>
      {collectionDialogTarget && (
        <HomebrewCollectionDialog
          open={collectionDialogOpen}
          onOpenChange={setCollectionDialogOpen}
          homebrewName={collectionDialogTarget.name}
          collections={collections}
          onCreateCollection={onCreateCollection}
          onAddToCollection={onAddToCollection}
          isSubmitting={isCollectionSubmitting}
        />
      )}

      {campaignDialogTarget && (
        <HomebrewCampaignDialog
          open={campaignDialogOpen}
          onOpenChange={setCampaignDialogOpen}
          homebrewName={campaignDialogTarget.name}
          campaigns={campaigns}
          onLink={onLinkToCampaign}
          isSubmitting={isCampaignSubmitting}
        />
      )}

      {characterDialogTarget && (
        <HomebrewCharacterDialog
          open={characterDialogOpen}
          onOpenChange={setCharacterDialogOpen}
          homebrewName={characterDialogTarget.name}
          characters={characters}
          onLink={onLinkToCharacter}
          isSubmitting={isCharacterSubmitting}
        />
      )}
    </>
  );
}

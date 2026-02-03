/**
 * Collections Tab Content for Campaign Homebrew
 *
 * Extracted from HomebrewTabContent to reduce complexity.
 */
import { Beaker, Folder } from 'lucide-react';

import { HomebrewList } from '@/components/homebrew';
import { Button } from '@/components/ui/button';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

interface HomebrewCollection {
  id: string;
  name: string;
  description?: string | null;
}

interface CollectionsTabContentProps {
  isLoading: boolean;
  collections: HomebrewCollection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string) => void;
  selectedCollection: HomebrewCollection | null;
  isItemsLoading: boolean;
  items: HomebrewContent[];
  linkedIds: Set<string>;
  currentUserId?: string;
  onView: (item: HomebrewContent) => void;
  onEdit: (item: HomebrewContent) => void;
  onToggleLink: (item: HomebrewContent) => void;
  onCreate: (type: HomebrewContentType) => void;
}

/**
 * Displays the Collections tab with a sidebar of collections and content grid.
 */
export function CollectionsTabContent({
  isLoading,
  collections,
  selectedCollectionId,
  onSelectCollection,
  selectedCollection,
  isItemsLoading,
  items,
  linkedIds,
  currentUserId,
  onView,
  onEdit,
  onToggleLink,
  onCreate,
}: CollectionsTabContentProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-48 items-center justify-center">
        Loading collections...
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <Folder className="text-muted-foreground size-8" />
        </div>
        <p className="text-muted-foreground">
          You don&apos;t have any collections yet.
        </p>
      </div>
    );
  }

  // Add linked indicator to items
  const itemsWithLinkIndicator = items.map(item => ({
    ...item,
    tags: linkedIds.has(item.id)
      ? ['✓ Linked', ...(item.tags ?? [])]
      : item.tags,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      {/* Collection Selector */}
      <CollectionSelector
        collections={collections}
        selectedId={selectedCollectionId}
        onSelect={onSelectCollection}
      />

      {/* Collection Content */}
      <div>
        {selectedCollection && (
          <h3 className="mb-4 text-lg font-medium">
            {selectedCollection.name}
          </h3>
        )}
        <CollectionItems
          isLoading={isItemsLoading}
          items={itemsWithLinkIndicator}
          linkedIds={linkedIds}
          currentUserId={currentUserId}
          onView={onView}
          onEdit={onEdit}
          onToggleLink={onToggleLink}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
}

// =====================================================================================
// Sub-components
// =====================================================================================

interface CollectionSelectorProps {
  collections: HomebrewCollection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function CollectionSelector({
  collections,
  selectedId,
  onSelect,
}: CollectionSelectorProps) {
  return (
    <div className="bg-muted/50 space-y-2 rounded-lg p-4">
      <h3 className="mb-3 text-sm font-medium">Your Collections</h3>
      {collections.map(collection => (
        <Button
          key={collection.id}
          variant={collection.id === selectedId ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onSelect(collection.id)}
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{collection.name}</span>
            {collection.description && (
              <span className="text-muted-foreground text-xs">
                {collection.description}
              </span>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}

interface CollectionItemsProps {
  isLoading: boolean;
  items: HomebrewContent[];
  linkedIds: Set<string>;
  currentUserId?: string;
  onView: (item: HomebrewContent) => void;
  onEdit: (item: HomebrewContent) => void;
  onToggleLink: (item: HomebrewContent) => void;
  onCreate: (type: HomebrewContentType) => void;
}

function CollectionItems({
  isLoading,
  items,
  linkedIds,
  currentUserId,
  onView,
  onEdit,
  onToggleLink,
  onCreate,
}: CollectionItemsProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-48 items-center justify-center">
        Loading collection items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <Beaker className="text-muted-foreground size-8" />
        </div>
        <p className="text-muted-foreground">
          This collection doesn&apos;t have any items yet.
        </p>
      </div>
    );
  }

  return (
    <HomebrewList
      items={items}
      isLoading={false}
      currentUserId={currentUserId}
      linkedItemIds={linkedIds}
      onView={onView}
      onEdit={onEdit}
      onLinkToCampaign={onToggleLink}
      onCreate={onCreate}
      showCreateButton={false}
      emptyMessage="No items in this collection."
    />
  );
}

/**
 * Homebrew Tab Content for Campaign Detail
 *
 * Displays and manages homebrew content linked to a campaign.
 * Uses a tabbed interface similar to My Homebrew for browsing all user content.
 */
import {
  Beaker,
  Folder,
  Globe,
  Link2,
  Lock,
  Plus,
  Star,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import {
  HomebrewFormDialog,
  HomebrewList,
  HomebrewViewDialog,
} from '@/components/homebrew';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TabsContent as InnerTabsContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import {
  useCampaignHomebrewContent,
  useCollectionItems,
  useCreateHomebrewContent,
  useHomebrewCollections,
  useHomebrewContentBatch,
  useLinkHomebrewToCampaign,
  useMyHomebrewContent,
  useStarredHomebrewContent,
  useUnlinkHomebrewFromCampaign,
  useUpdateHomebrewContent,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

interface HomebrewTabContentProps {
  campaignId: string;
}

type InnerTab =
  | 'linked'
  | 'all'
  | 'public'
  | 'private'
  | 'quicklist'
  | 'collections';

export function HomebrewTabContent({ campaignId }: HomebrewTabContentProps) {
  const { user } = useAuth();
  const { data: campaignResult, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(campaignId);
  const { data: myResult, isLoading: loadingMy } = useMyHomebrewContent();
  const { data: starredData, isLoading: isStarredLoading } =
    useStarredHomebrewContent();
  const { data: collections = [], isLoading: isCollectionsLoading } =
    useHomebrewCollections();

  const campaignHomebrew = campaignResult?.items ?? [];
  const myHomebrew = myResult?.items ?? [];
  const starredItems = starredData?.items ?? [];

  // Track which homebrew IDs are linked to this campaign
  const linkedIds = useMemo(
    () => new Set(campaignHomebrew.map(item => item.id)),
    [campaignHomebrew]
  );

  // Visible collections (exclude quicklist)
  const visibleCollections = useMemo(
    () => collections.filter(collection => !collection.isQuicklist),
    [collections]
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  // Derive effective selected collection ID
  const effectiveCollectionId = useMemo(() => {
    if (
      selectedCollectionId &&
      visibleCollections.some(c => c.id === selectedCollectionId)
    ) {
      return selectedCollectionId;
    }
    return visibleCollections[0]?.id ?? null;
  }, [selectedCollectionId, visibleCollections]);

  const selectedCollection = useMemo(
    () => visibleCollections.find(c => c.id === effectiveCollectionId) ?? null,
    [visibleCollections, effectiveCollectionId]
  );

  const { data: collectionItems = [], isLoading: isCollectionItemsLoading } =
    useCollectionItems(effectiveCollectionId ?? undefined);
  const collectionItemIds = useMemo(
    () => collectionItems.map(item => item.homebrewId),
    [collectionItems]
  );
  const {
    data: collectionContent = [],
    isLoading: isCollectionContentLoading,
  } = useHomebrewContentBatch(collectionItemIds, !!effectiveCollectionId);
  const orderedCollectionContent = useMemo(() => {
    if (collectionItemIds.length === 0) return [];
    const contentMap = new Map(collectionContent.map(item => [item.id, item]));
    return collectionItemIds
      .map(id => contentMap.get(id))
      .filter((item): item is HomebrewContent => Boolean(item));
  }, [collectionItemIds, collectionContent]);

  const createMutation = useCreateHomebrewContent();
  const updateMutation = useUpdateHomebrewContent();
  const linkMutation = useLinkHomebrewToCampaign();
  const unlinkMutation = useUnlinkHomebrewFromCampaign();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);
  const [selectedType, setSelectedType] =
    useState<HomebrewContentType>('adversary');
  const [editingItem, setEditingItem] = useState<HomebrewContent | null>(null);
  const [innerTab, setInnerTab] = useState<InnerTab>('linked');
  const [showCampaignInfo, setShowCampaignInfo] = useState(() => {
    return localStorage.getItem('hideCampaignHomebrewInfo') !== 'true';
  });

  const handleCreate = (type: HomebrewContentType) => {
    setSelectedType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = (item: HomebrewContent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: HomebrewContent) => {
    setSelectedType(item.contentType);
    setEditingItem(item);
    setIsFormOpen(true);
    // Close view dialog if open
    setIsViewOpen(false);
  };

  const handleFormSubmit = async (payload: {
    content: HomebrewContent['content'];
    visibility: HomebrewVisibility;
  }) => {
    const typedFormData = payload.content as {
      name: string;
    } & HomebrewContent['content'];
    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        updates: {
          content: typedFormData,
          name: typedFormData.name,
          visibility: payload.visibility,
        },
      });
    } else {
      // Create new and immediately link to campaign
      await createMutation.mutateAsync({
        contentType: selectedType,
        content: typedFormData,
        name: typedFormData.name,
        description: '',
        tags: [],
        visibility: payload.visibility,
        campaignLinks: [campaignId],
      });
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleLink = useCallback(
    async (item: HomebrewContent) => {
      await linkMutation.mutateAsync({
        homebrewId: item.id,
        campaignId,
      });
    },
    [campaignId, linkMutation]
  );

  const handleUnlink = useCallback(
    async (item: HomebrewContent) => {
      if (confirm(`Remove "${item.name}" from this campaign?`)) {
        await unlinkMutation.mutateAsync({
          homebrewId: item.id,
          campaignId,
        });
      }
    },
    [campaignId, unlinkMutation]
  );

  // Helper to render a homebrew list for browsing tabs (not the Linked tab)
  // Uses onLinkToCampaign for items not yet linked
  const renderBrowseList = (
    items: HomebrewContent[],
    isLoading: boolean,
    emptyMessage: string,
    sourceList: HomebrewContent[]
  ) => (
    <HomebrewList
      items={items.map(item => ({
        ...item,
        // Add visual indicator for linked items via tags
        tags: linkedIds.has(item.id)
          ? ['✓ Linked', ...(item.tags ?? [])]
          : item.tags,
      }))}
      isLoading={isLoading}
      currentUserId={user?.id}
      linkedItemIds={linkedIds}
      onView={item => {
        const originalItem = sourceList.find(h => h.id === item.id);
        if (originalItem) handleView(originalItem);
      }}
      onEdit={item => {
        const originalItem = sourceList.find(h => h.id === item.id);
        if (originalItem) handleEdit(originalItem);
      }}
      onLinkToCampaign={item => {
        const originalItem = sourceList.find(h => h.id === item.id);
        if (!originalItem) return;
        // If already linked, unlink; otherwise link
        if (linkedIds.has(item.id)) {
          handleUnlink(originalItem);
        } else {
          handleLink(originalItem);
        }
      }}
      onCreate={handleCreate}
      showCreateButton
      emptyMessage={emptyMessage}
    />
  );

  return (
    <TabsContent value="homebrew" className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <Beaker className="text-primary size-6" />
            Campaign Homebrew
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse and link homebrew content to this campaign
          </p>
        </div>
        <Button onClick={() => handleCreate('adversary')}>
          <Plus className="mr-2 size-4" /> Create New
        </Button>
      </div>

      {/* Info Card */}
      {showCampaignInfo && (
        <Card className="relative border-purple-500/20 bg-linear-to-r from-purple-500/5 to-purple-500/10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 size-7"
            onClick={() => {
              setShowCampaignInfo(false);
              localStorage.setItem('hideCampaignHomebrewInfo', 'true');
            }}
          >
            <X className="size-4" />
          </Button>
          <CardHeader className="pr-10 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="size-5 text-purple-500" />
              How Campaign Homebrew Works
            </CardTitle>
            <CardDescription className="text-base">
              Content linked to this campaign will be available to players when
              building characters. Custom adversaries and environments can be
              used in the battle tracker. Players will see homebrew options
              alongside official content.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Inner Tabs */}
      <Tabs
        value={innerTab}
        onValueChange={v => setInnerTab(v as InnerTab)}
        className="space-y-4"
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="linked" className="gap-2">
            <Link2 className="size-4 text-green-500" />
            <span className="hidden sm:inline">Linked</span>
            <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
              {campaignHomebrew.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Beaker className="size-4" />
            <span className="hidden sm:inline">All</span>
            <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
              {myHomebrew.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="public" className="gap-2">
            <Globe className="size-4 text-green-500" />
            <span className="hidden sm:inline">Public</span>
          </TabsTrigger>
          <TabsTrigger value="private" className="gap-2">
            <Lock className="size-4 text-amber-500" />
            <span className="hidden sm:inline">Private</span>
          </TabsTrigger>
          <TabsTrigger value="quicklist" className="gap-2">
            <Star className="size-4 text-amber-500" />
            <span className="hidden sm:inline">Quicklist</span>
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-2">
            <Folder className="size-4 text-blue-500" />
            <span className="hidden sm:inline">Collections</span>
          </TabsTrigger>
        </TabsList>

        {/* Linked Tab - Content already linked to campaign */}
        <InnerTabsContent value="linked">
          <HomebrewList
            items={campaignHomebrew}
            isLoading={loadingCampaign}
            currentUserId={user?.id}
            linkedItemIds={linkedIds}
            onView={handleView}
            onEdit={handleEdit}
            onLinkToCampaign={handleUnlink}
            onCreate={handleCreate}
            showCreateButton
            emptyMessage="No homebrew content linked to this campaign yet. Browse other tabs to find and link content."
          />
        </InnerTabsContent>

        {/* All Tab - All user's homebrew with link indicator */}
        <InnerTabsContent value="all">
          <div className="mb-4">
            <p className="text-muted-foreground text-sm">
              All your homebrew content. Items with &quot;✓ Linked&quot; are
              linked to this campaign. Use &quot;Link to Campaign&quot; to
              toggle.
            </p>
          </div>
          {renderBrowseList(
            myHomebrew,
            loadingMy,
            "You haven't created any homebrew content yet.",
            myHomebrew
          )}
        </InnerTabsContent>

        {/* Public Tab */}
        <InnerTabsContent value="public">
          {renderBrowseList(
            myHomebrew.filter(c => c.visibility === 'public'),
            loadingMy,
            'No public homebrew content.',
            myHomebrew
          )}
        </InnerTabsContent>

        {/* Private Tab */}
        <InnerTabsContent value="private">
          {renderBrowseList(
            myHomebrew.filter(c => c.visibility === 'private'),
            loadingMy,
            'No private homebrew content.',
            myHomebrew
          )}
        </InnerTabsContent>

        {/* Quicklist Tab */}
        <InnerTabsContent value="quicklist">
          {renderBrowseList(
            starredItems,
            isStarredLoading,
            'No items in your quicklist yet.',
            starredItems
          )}
        </InnerTabsContent>

        {/* Collections Tab */}
        <InnerTabsContent value="collections">
          {isCollectionsLoading ? (
            <div className="text-muted-foreground flex h-48 items-center justify-center">
              Loading collections...
            </div>
          ) : visibleCollections.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                <Folder className="text-muted-foreground size-8" />
              </div>
              <p className="text-muted-foreground">
                You don&apos;t have any collections yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              {/* Collection Selector */}
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <h3 className="mb-3 text-sm font-medium">Your Collections</h3>
                {visibleCollections.map(collection => (
                  <Button
                    key={collection.id}
                    variant={
                      collection.id === effectiveCollectionId
                        ? 'secondary'
                        : 'ghost'
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedCollectionId(collection.id)}
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">
                        {collection.name}
                      </span>
                      {collection.description && (
                        <span className="text-muted-foreground text-xs">
                          {collection.description}
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Collection Content */}
              <div>
                {selectedCollection && (
                  <h3 className="mb-4 text-lg font-medium">
                    {selectedCollection.name}
                  </h3>
                )}
                {isCollectionItemsLoading || isCollectionContentLoading ? (
                  <div className="text-muted-foreground flex h-48 items-center justify-center">
                    Loading collection items...
                  </div>
                ) : orderedCollectionContent.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
                    <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                      <Beaker className="text-muted-foreground size-8" />
                    </div>
                    <p className="text-muted-foreground">
                      This collection doesn&apos;t have any items yet.
                    </p>
                  </div>
                ) : (
                  <HomebrewList
                    items={orderedCollectionContent.map(item => ({
                      ...item,
                      tags: linkedIds.has(item.id)
                        ? ['✓ Linked', ...(item.tags ?? [])]
                        : item.tags,
                    }))}
                    isLoading={false}
                    currentUserId={user?.id}
                    linkedItemIds={linkedIds}
                    onView={item => {
                      const originalItem = orderedCollectionContent.find(
                        h => h.id === item.id
                      );
                      if (originalItem) handleView(originalItem);
                    }}
                    onEdit={item => {
                      const originalItem = orderedCollectionContent.find(
                        h => h.id === item.id
                      );
                      if (originalItem) handleEdit(originalItem);
                    }}
                    onLinkToCampaign={item => {
                      const originalItem = orderedCollectionContent.find(
                        h => h.id === item.id
                      );
                      if (!originalItem) return;
                      if (linkedIds.has(item.id)) {
                        handleUnlink(originalItem);
                      } else {
                        handleLink(originalItem);
                      }
                    }}
                    onCreate={handleCreate}
                    showCreateButton={false}
                    emptyMessage="No items in this collection."
                  />
                )}
              </div>
            </div>
          )}
        </InnerTabsContent>
      </Tabs>

      {/* View Dialog (Read-only) */}
      <HomebrewViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        content={viewingItem}
        isOwner={viewingItem?.ownerId === user?.id}
        onEdit={() => {
          if (viewingItem) handleEdit(viewingItem);
        }}
        onFork={undefined}
      />

      {/* Create/Edit Dialog */}
      <HomebrewFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contentType={selectedType}
        initialData={editingItem ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        defaultVisibility="campaign_only"
      />
    </TabsContent>
  );
}

/**
 * Homebrew Dashboard - My Homebrew Content
 *
 * Main page for viewing and managing personal homebrew content.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Beaker,
  BookOpen,
  Folder,
  Globe,
  Home,
  Layers,
  Loader2,
  Lock,
  Map as MapIcon,
  Package,
  Plus,
  Shield,
  Skull,
  Star,
  Sword,
  Trash2,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  HomebrewFormDialog,
  HomebrewList,
  HomebrewViewDialog,
} from '@/components/homebrew';
import { OfficialContentBrowser } from '@/components/homebrew/official-content-browser';
import { useAuth } from '@/components/providers';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCollectionItems,
  useCreateHomebrewCollection,
  useCreateHomebrewContent,
  useDeletedHomebrewContent,
  useDeleteHomebrewContent,
  useEmptyRecycleBin,
  useHomebrewCollections,
  useHomebrewContentBatch,
  useMyHomebrewContentInfinite,
  usePermanentlyDeleteHomebrewContent,
  useRestoreHomebrewContent,
  useStarredHomebrewContent,
  useUpdateHomebrewContent,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';

export const Route = createFileRoute('/homebrew/')({
  component: HomebrewDashboard,
});

// Icon mapping for content types with colors - exported for use in other components
export const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  adversary: {
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Adversary',
  },
  environment: {
    icon: MapIcon,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: 'Environment',
  },
  domain_card: {
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: 'Domain Card',
  },
  class: {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Class',
  },
  subclass: {
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    label: 'Subclass',
  },
  ancestry: {
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: 'Ancestry',
  },
  community: {
    icon: Home,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    label: 'Community',
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
    label: 'Item',
  },
};

function HomebrewDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use infinite scroll for content
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMyHomebrewContentInfinite();

  // Flatten paginated results
  const pages = data?.pages;
  const myContent = useMemo<HomebrewContent[]>(() => {
    if (!pages) return [];
    return pages.flatMap(page => page.items);
  }, [pages]);

  // Tab counts computed from content
  const tabCounts = useMemo(() => {
    const publicCount = myContent.filter(c => c.visibility === 'public').length;
    const privateCount = myContent.filter(
      c => c.visibility === 'private'
    ).length;
    const linkedCount = myContent.filter(
      c => c.campaignLinks && c.campaignLinks.length > 0
    ).length;
    return {
      all: myContent.length,
      public: publicCount,
      private: privateCount,
      linked: linkedCount,
    };
  }, [myContent]);
  const { data: starredData, isLoading: isStarredLoading } =
    useStarredHomebrewContent();
  const starredItems = starredData?.items ?? [];
  const { data: deletedData, isLoading: isDeletedLoading } =
    useDeletedHomebrewContent();
  const deletedItems = deletedData?.items ?? [];
  const createMutation = useCreateHomebrewContent();
  const updateMutation = useUpdateHomebrewContent();
  const deleteMutation = useDeleteHomebrewContent();
  const restoreMutation = useRestoreHomebrewContent();
  const permanentDeleteMutation = usePermanentlyDeleteHomebrewContent();
  const emptyRecycleBinMutation = useEmptyRecycleBin();

  const { data: collections = [], isLoading: isCollectionsLoading } =
    useHomebrewCollections();
  const createCollectionMutation = useCreateHomebrewCollection();
  const visibleCollections = useMemo(
    () => collections.filter(collection => !collection.isQuicklist),
    [collections]
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  // Derive effective selected ID: use state if valid, otherwise default to first
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
    () =>
      visibleCollections.find(
        collection => collection.id === effectiveCollectionId
      ) ?? null,
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<HomebrewContent | null>(null);
  const [selectedType, setSelectedType] =
    useState<HomebrewContentType>('adversary');
  const [editingItem, setEditingItem] = useState<HomebrewContent | null>(null);

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreate = useCallback((type: HomebrewContentType) => {
    setSelectedType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((item: HomebrewContent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  }, []);

  const handleEdit = useCallback((item: HomebrewContent) => {
    setSelectedType(item.contentType);
    setEditingItem(item);
    setIsFormOpen(true);
    // Close view dialog if open
    setIsViewOpen(false);
  }, []);

  const handleDelete = useCallback(
    async (item: HomebrewContent) => {
      if (
        confirm(
          `Are you sure you want to delete "${item.name}"? It will be moved to the Recycle Bin.`
        )
      ) {
        await deleteMutation.mutateAsync(item.id);
      }
    },
    [deleteMutation]
  );

  const handleRestore = useCallback(
    async (item: HomebrewContent) => {
      await restoreMutation.mutateAsync(item.id);
    },
    [restoreMutation]
  );

  const handlePermanentDelete = useCallback(
    async (item: HomebrewContent) => {
      if (
        confirm(
          `Are you sure you want to permanently delete "${item.name}"? This cannot be undone.`
        )
      ) {
        await permanentDeleteMutation.mutateAsync(item.id);
      }
    },
    [permanentDeleteMutation]
  );

  const handleEmptyRecycleBin = useCallback(async () => {
    if (
      confirm(
        `Are you sure you want to permanently delete all ${deletedItems.length} items in the recycle bin? This cannot be undone.`
      )
    ) {
      await emptyRecycleBinMutation.mutateAsync();
    }
  }, [emptyRecycleBinMutation, deletedItems.length]);

  const handleFork = useCallback(
    (item: HomebrewContent) => {
      const sourceId = item.forkedFrom ?? item.id;
      navigate({ to: '/homebrew/new', search: { forkFrom: sourceId } });
    },
    [navigate]
  );

  const handleFormSubmit = useCallback(
    async (payload: {
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
        await createMutation.mutateAsync({
          contentType: selectedType,
          content: typedFormData,
          name: typedFormData.name,
          description: '',
          tags: [],
          visibility: payload.visibility,
          campaignLinks: [],
        });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    },
    [editingItem, selectedType, createMutation, updateMutation]
  );

  const handleCreateCollection = useCallback(async () => {
    if (!newCollectionName.trim()) return;
    await createCollectionMutation.mutateAsync({
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim() || undefined,
    });
    setNewCollectionName('');
    setNewCollectionDescription('');
    setIsCreateCollectionOpen(false);
  }, [newCollectionName, newCollectionDescription, createCollectionMutation]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Beaker className="text-primary size-8" />
            </div>
            <CardTitle className="text-2xl">Sign In Required</CardTitle>
            <CardDescription className="text-base">
              Please sign in to access your homebrew content.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button size="lg" onClick={() => navigate({ to: '/login' })}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
              <Beaker className="text-primary size-6" />
            </div>
            My Homebrew
          </h1>
          <p className="text-muted-foreground text-lg">
            Create and manage your custom Daggerheart content
          </p>
        </div>
        <Button
          size="lg"
          onClick={() =>
            navigate({ to: '/homebrew/new', search: { forkFrom: undefined } })
          }
        >
          <Plus className="mr-2 size-5" /> Create New
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="private" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Package className="size-4" />
            <span className="hidden sm:inline">All</span>
            <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
              {tabCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="public" className="gap-2">
            <Globe className="size-4 text-green-500" />
            <span className="hidden sm:inline">Public</span>
            <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
              {tabCounts.public}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="private" className="gap-2">
            <Lock className="size-4 text-amber-500" />
            <span className="hidden sm:inline">Private</span>
            <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
              {tabCounts.private}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="quicklist" className="gap-2">
            <Star className="size-4 text-amber-500" />
            <span className="hidden sm:inline">Quicklist</span>
            {starredItems.length > 0 && (
              <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
                {starredItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="campaign" className="gap-2">
            <Users className="size-4 text-purple-500" />
            <span className="hidden sm:inline">Linked</span>
            {tabCounts.linked > 0 && (
              <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
                {tabCounts.linked}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-2">
            <Folder className="size-4 text-blue-500" />
            <span className="hidden sm:inline">Collections</span>
            {visibleCollections.length > 0 && (
              <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
                {visibleCollections.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recycle-bin" className="gap-2">
            <Trash2 className="size-4 text-red-500" />
            <span className="hidden sm:inline">Recycle Bin</span>
            {deletedItems.length > 0 && (
              <Badge className="ml-1 hidden bg-red-100 text-red-700 lg:inline-flex dark:bg-red-900 dark:text-red-200">
                {deletedItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="official" className="gap-2">
            <BookOpen className="size-4 text-indigo-500" />
            <span className="hidden sm:inline">Official</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <HomebrewList
            items={myContent}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFork={handleFork}
            onCreate={handleCreate}
            emptyMessage="You haven't created any homebrew content yet. Click 'Create New' to get started!"
          />
        </TabsContent>

        <TabsContent value="public">
          <HomebrewList
            items={myContent.filter(c => c.visibility === 'public')}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFork={handleFork}
            onCreate={handleCreate}
            emptyMessage="No public homebrew content. Share your creations with the community!"
          />
        </TabsContent>

        <TabsContent value="private">
          <HomebrewList
            items={myContent.filter(c => c.visibility === 'private')}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFork={handleFork}
            onCreate={handleCreate}
            emptyMessage="No private homebrew content."
          />
        </TabsContent>

        <TabsContent value="quicklist">
          <HomebrewList
            items={starredItems}
            isLoading={isStarredLoading}
            currentUserId={user.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFork={handleFork}
            onCreate={handleCreate}
            emptyMessage="No items in your quicklist yet."
          />
        </TabsContent>

        <TabsContent value="campaign">
          <HomebrewList
            items={myContent.filter(
              c => c.campaignLinks && c.campaignLinks.length > 0
            )}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFork={handleFork}
            onCreate={handleCreate}
            emptyMessage="No homebrew linked to campaigns yet. Link your content from a campaign's homebrew tab!"
          />
        </TabsContent>

        <TabsContent value="collections">
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
              <Button onClick={() => setIsCreateCollectionOpen(true)}>
                <Plus className="mr-2 size-4" /> Create Collection
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Your Collections
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreateCollectionOpen(true)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Pick a collection to view its items.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {selectedCollection?.name ?? 'Collection'}
                  </CardTitle>
                  {selectedCollection?.description && (
                    <CardDescription>
                      {selectedCollection.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {isCollectionItemsLoading || isCollectionContentLoading ? (
                    <div className="text-muted-foreground flex h-48 items-center justify-center">
                      Loading collection items...
                    </div>
                  ) : orderedCollectionContent.length === 0 ? (
                    <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
                      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                        <Package className="text-muted-foreground size-8" />
                      </div>
                      <p className="text-muted-foreground">
                        This collection doesn&apos;t have any items yet.
                      </p>
                    </div>
                  ) : (
                    <HomebrewList
                      items={orderedCollectionContent}
                      isLoading={false}
                      currentUserId={user.id}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onFork={handleFork}
                      onCreate={handleCreate}
                      showCreateButton={false}
                      emptyMessage="No items in this collection."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recycle-bin">
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Trash2 className="mt-0.5 size-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">
                    Recycle Bin
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Items here can be restored or permanently deleted.
                    Permanently deleted items cannot be recovered.
                  </p>
                </div>
              </div>
              {deletedItems.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEmptyRecycleBin}
                  disabled={emptyRecycleBinMutation.isPending}
                >
                  Empty Recycle Bin
                </Button>
              )}
            </div>
          </div>
          {isDeletedLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="text-muted-foreground animate-pulse">
                Loading...
              </div>
            </div>
          ) : deletedItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                <Trash2 className="text-muted-foreground size-8" />
              </div>
              <p className="text-muted-foreground">
                Your recycle bin is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deletedItems.map(item => {
                const config = CONTENT_TYPE_CONFIG[item.contentType];
                const TypeIcon = config.icon;
                return (
                  <Card
                    key={item.id}
                    className={`border-l-4 ${config.bgColor.replace('/10', '/5')}`}
                    style={{
                      borderLeftColor: `var(--${config.color.replace('text-', '')})`,
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}
                          >
                            <TypeIcon className={`size-5 ${config.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-lg">
                              {item.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Deleted{' '}
                              {item.deletedAt
                                ? new Date(item.deletedAt).toLocaleDateString()
                                : 'recently'}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(item)}
                            disabled={restoreMutation.isPending}
                          >
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handlePermanentDelete(item)}
                            disabled={permanentDeleteMutation.isPending}
                          >
                            Delete Forever
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="official">
          <OfficialContentBrowser />
        </TabsContent>
      </Tabs>

      {/* Infinite Scroll Load More */}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-muted-foreground">Loading more...</span>
          </div>
        )}
        {!hasNextPage && myContent.length > 0 && (
          <p className="text-muted-foreground text-sm">
            You've reached the end of your homebrew content.
          </p>
        )}
      </div>

      {/* View Dialog (Read-only) */}
      <HomebrewViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        content={viewingItem}
        isOwner={viewingItem?.ownerId === user.id}
        onEdit={() => {
          if (viewingItem) handleEdit(viewingItem);
        }}
        onFork={viewingItem ? () => handleFork(viewingItem) : undefined}
      />

      {/* Form Dialog */}
      <HomebrewFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contentType={selectedType}
        initialData={editingItem ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Create Collection Dialog */}
      <Dialog
        open={isCreateCollectionOpen}
        onOpenChange={setIsCreateCollectionOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="size-5" /> Create Collection
            </DialogTitle>
            <DialogDescription>
              Create a new collection to organize your homebrew content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Name</Label>
              <Input
                id="collection-name"
                placeholder="My Collection"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description">
                Description (optional)
              </Label>
              <Input
                id="collection-description"
                placeholder="A brief description..."
                value={newCollectionDescription}
                onChange={e => setNewCollectionDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateCollectionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={
                !newCollectionName.trim() || createCollectionMutation.isPending
              }
            >
              {createCollectionMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Homebrew Dashboard - My Homebrew Content
 *
 * Main page for viewing and managing personal homebrew content.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Beaker,
  BookOpen,
  GitFork,
  Globe,
  Home,
  Layers,
  Loader2,
  Lock,
  Map,
  Package,
  Plus,
  Shield,
  Skull,
  Star,
  Sword,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HomebrewFormDialog, HomebrewList } from '@/components/homebrew';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCreateHomebrewContent,
  useDeleteHomebrewContent,
  useMyHomebrewContentInfinite,
  useMyHomebrewStats,
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
    icon: Map,
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

  const { data: stats } = useMyHomebrewStats();
  const { data: starredData, isLoading: isStarredLoading } =
    useStarredHomebrewContent();
  const starredItems = starredData?.items ?? [];
  const createMutation = useCreateHomebrewContent();
  const updateMutation = useUpdateHomebrewContent();
  const deleteMutation = useDeleteHomebrewContent();

  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleEdit = useCallback((item: HomebrewContent) => {
    setSelectedType(item.contentType);
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (item: HomebrewContent) => {
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        await deleteMutation.mutateAsync(item.id);
      }
    },
    [deleteMutation]
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

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
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
        <Button size="lg" onClick={() => navigate({ to: '/homebrew/new' })}>
          <Plus className="mr-2 size-5" /> Create New
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-500/20 bg-linear-to-br from-blue-500/5 to-blue-500/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium">
                <Package className="size-4 text-blue-500" />
                Total Items
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-green-500/20 bg-linear-to-br from-green-500/5 to-green-500/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium">
                <Globe className="size-4 text-green-500" />
                Public
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-green-600 dark:text-green-400">
                {stats.public}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-amber-500/20 bg-linear-to-br from-amber-500/5 to-amber-500/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium">
                <Lock className="size-4 text-amber-500" />
                Private
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {stats.total - stats.public}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-purple-500/20 bg-linear-to-br from-purple-500/5 to-purple-500/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium">
                <GitFork className="size-4 text-purple-500" />
                Times Forked
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalForks}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Package className="size-4" />
            <span className="hidden sm:inline">All</span>
            <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
              {myContent.length}
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
          <TabsTrigger value="campaign" className="gap-2">
            <Users className="size-4 text-purple-500" />
            <span className="hidden sm:inline">Campaign</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <HomebrewList
            items={myContent}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            emptyMessage="You haven't created any homebrew content yet. Click 'Create New' to get started!"
          />
        </TabsContent>

        <TabsContent value="public">
          <HomebrewList
            items={myContent.filter(c => c.visibility === 'public')}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            showCreateButton={false}
            emptyMessage="No public homebrew content. Share your creations with the community!"
          />
        </TabsContent>

        <TabsContent value="private">
          <HomebrewList
            items={myContent.filter(c => c.visibility === 'private')}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            showCreateButton={false}
            emptyMessage="No private homebrew content."
          />
        </TabsContent>

        <TabsContent value="quicklist">
          <HomebrewList
            items={starredItems}
            isLoading={isStarredLoading}
            currentUserId={user.id}
            onView={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            showCreateButton={false}
            emptyMessage="No items in your quicklist yet."
          />
        </TabsContent>

        <TabsContent value="campaign">
          <HomebrewList
            items={myContent.filter(c => c.visibility === 'campaign_only')}
            isLoading={isLoading}
            currentUserId={user.id}
            onView={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            showCreateButton={false}
            emptyMessage="No campaign-only homebrew content."
          />
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

      {/* Form Dialog */}
      <HomebrewFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contentType={selectedType}
        initialData={editingItem ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

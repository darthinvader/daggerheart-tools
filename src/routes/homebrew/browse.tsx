/**
 * Browse Public Homebrew
 *
 * Page for discovering and browsing publicly shared homebrew content.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BookOpen, Users } from 'lucide-react';

import {
  HomebrewFormDialog,
  HomebrewList,
  HomebrewViewDialog,
} from '@/components/homebrew';
import { OfficialContentBrowser } from '@/components/homebrew/official-content-browser';
import { useAuth } from '@/components/providers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  BrowseHeaderSection,
  ForkInfoCard,
  InfiniteScrollTrigger,
} from './-browse-sections';
import { useBrowseHomebrewState } from './-use-browse-homebrew-state';

export const Route = createFileRoute('/homebrew/browse')({
  component: BrowseHomebrew,
});

function BrowseHomebrew() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    // Filter state
    searchQuery,
    typeFilter,
    // Fork info
    showForkInfo,
    handleDismissForkInfo,
    // Data
    publicContent,
    isLoading,
    // Infinite scroll
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    // View dialog
    isViewOpen,
    handleViewOpenChange,
    viewingItem,
    // Create dialog
    isCreateOpen,
    setIsCreateOpen,
    createType,
    isPending,
    // Handlers
    handleView,
    handleFork,
    handleCreate,
    handleFormSubmit,
  } = useBrowseHomebrewState({
    userId: user?.id,
    onNavigateToLogin: () => navigate({ to: '/login' }),
    onNavigateToFork: sourceId =>
      navigate({ to: '/homebrew/new', search: { forkFrom: sourceId } }),
    onNavigateToHomebrew: () => navigate({ to: '/homebrew' }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BrowseHeaderSection
        isLoggedIn={!!user}
        onCreateClick={() => handleCreate('adversary')}
      />

      {showForkInfo && <ForkInfoCard onDismiss={handleDismissForkInfo} />}

      {/* Content Tabs */}
      <Tabs defaultValue="community" className="space-y-4">
        <TabsList>
          <TabsTrigger value="community" className="gap-2">
            <Users className="size-4 text-green-500" />
            <span>Community</span>
          </TabsTrigger>
          <TabsTrigger value="official" className="gap-2">
            <BookOpen className="size-4 text-indigo-500" />
            <span>Official</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="space-y-4">
          {/* Content List */}
          <HomebrewList
            items={publicContent}
            isLoading={isLoading}
            currentUserId={user?.id}
            onView={handleView}
            onFork={handleFork}
            onCreate={user ? handleCreate : undefined}
            showCreateButton={!!user}
            emptyMessage={
              searchQuery || typeFilter !== 'all'
                ? 'No homebrew content matches your filters.'
                : 'No public homebrew content available yet. Be the first to share!'
            }
          />

          {hasNextPage && (
            <InfiniteScrollTrigger
              loadMoreRef={loadMoreRef}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          )}
        </TabsContent>

        <TabsContent value="official">
          <OfficialContentBrowser />
        </TabsContent>
      </Tabs>

      {/* View Dialog (Read-only) */}
      <HomebrewViewDialog
        open={isViewOpen}
        onOpenChange={handleViewOpenChange}
        content={viewingItem}
        isOwner={viewingItem?.ownerId === user?.id}
        onEdit={undefined}
        onFork={viewingItem ? () => handleFork(viewingItem) : undefined}
      />

      {/* Create Dialog - defaults to public */}
      <HomebrewFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        contentType={createType}
        onSubmit={handleFormSubmit}
        isSubmitting={isPending}
        defaultVisibility="public"
      />
    </div>
  );
}

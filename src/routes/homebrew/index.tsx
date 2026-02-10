/**
 * Homebrew Dashboard - My Homebrew Content
 *
 * Main page for viewing and managing personal homebrew content.
 */
import { createFileRoute } from '@tanstack/react-router';
import {
  Beaker,
  BookOpen,
  Home,
  Layers,
  Map as MapIcon,
  Package,
  Plus,
  Shield,
  Skull,
  Sword,
  Users,
} from 'lucide-react';

import { HomebrewFormDialog, HomebrewViewDialog } from '@/components/homebrew';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import type { HomebrewContentType } from '@/lib/schemas/homebrew';
import {
  CreateCollectionDialog,
  InfiniteScrollLoader,
  SignInRequiredCard,
} from './-homebrew-dashboard-sections';
import {
  AllContentTab,
  CampaignLinkedTab,
  CollectionsTab,
  HomebrewTabsList,
  OfficialContentTab,
  PrivateContentTab,
  PublicContentTab,
  QuicklistTab,
  RecycleBinTab,
} from './-homebrew-tabs';
import type { PendingAction } from './-use-homebrew-content-handlers';
import { useHomebrewDashboardState } from './-use-homebrew-dashboard-state';

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

/** Header section with title and create button. */
function DashboardHeader({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="text-2xl font-bold">
          <Beaker className="text-primary mr-2 inline-block size-6" />
          My Homebrew
        </span>
        <p className="text-muted-foreground mt-2">
          Create and manage your custom Daggerheart content
        </p>
      </div>
      <Button size="lg" onClick={onCreateNew}>
        <Plus className="mr-2 size-5" /> Create New
      </Button>
    </div>
  );
}

/** All modal dialogs rendered by the dashboard. */
function DashboardDialogs({
  user,
  isViewOpen,
  handleViewOpenChange,
  viewingItem,
  onEditFromView,
  onForkFromView,
  isFormOpen,
  handleFormOpenChange,
  selectedType,
  editingItem,
  handleFormSubmit,
  isSubmitting,
  isCreateCollectionOpen,
  setIsCreateCollectionOpen,
  newCollectionName,
  setNewCollectionName,
  newCollectionDescription,
  setNewCollectionDescription,
  handleCreateCollection,
  isCreatingCollection,
  pendingAction,
  confirmPendingAction,
  cancelPendingAction,
}: {
  user: { id: string };
  isViewOpen: boolean;
  handleViewOpenChange: (open: boolean) => void;
  viewingItem: ReturnType<typeof useHomebrewDashboardState>['viewingItem'];
  onEditFromView: () => void;
  onForkFromView: (() => void) | undefined;
  isFormOpen: boolean;
  handleFormOpenChange: (open: boolean) => void;
  selectedType: ReturnType<typeof useHomebrewDashboardState>['selectedType'];
  editingItem: ReturnType<typeof useHomebrewDashboardState>['editingItem'];
  handleFormSubmit: ReturnType<
    typeof useHomebrewDashboardState
  >['handleFormSubmit'];
  isSubmitting: boolean;
  isCreateCollectionOpen: boolean;
  setIsCreateCollectionOpen: (open: boolean) => void;
  newCollectionName: string;
  setNewCollectionName: (name: string) => void;
  newCollectionDescription: string;
  setNewCollectionDescription: (desc: string) => void;
  handleCreateCollection: () => void;
  isCreatingCollection: boolean;
  pendingAction: PendingAction | null;
  confirmPendingAction: () => Promise<void>;
  cancelPendingAction: () => void;
}) {
  return (
    <>
      <HomebrewViewDialog
        open={isViewOpen}
        onOpenChange={handleViewOpenChange}
        content={viewingItem}
        isOwner={viewingItem?.ownerId === user.id}
        onEdit={onEditFromView}
        onFork={onForkFromView}
      />

      <HomebrewFormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        contentType={selectedType}
        initialData={editingItem ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <CreateCollectionDialog
        open={isCreateCollectionOpen}
        onOpenChange={setIsCreateCollectionOpen}
        name={newCollectionName}
        onNameChange={setNewCollectionName}
        description={newCollectionDescription}
        onDescriptionChange={setNewCollectionDescription}
        onSubmit={handleCreateCollection}
        isSubmitting={isCreatingCollection}
      />

      <DestructiveConfirmDialog
        pendingAction={pendingAction}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </>
  );
}

function HomebrewDashboard() {
  // Use consolidated meta-hook for all state
  const {
    user,
    navigate,
    myContent,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    tabCounts,
    starredItems,
    isStarredLoading,
    deletedItems,
    isDeletedLoading,
    loadMoreRef,
    createMutation,
    updateMutation,
    restoreMutation,
    permanentDeleteMutation,
    emptyRecycleBinMutation,
    isCollectionsLoading,
    visibleCollections,
    setSelectedCollectionId,
    effectiveCollectionId,
    selectedCollection,
    orderedCollectionContent,
    isCollectionContentLoading,
    isCreateCollectionOpen,
    setIsCreateCollectionOpen,
    newCollectionName,
    setNewCollectionName,
    newCollectionDescription,
    setNewCollectionDescription,
    handleCreateCollection,
    isCreatingCollection,
    handleDeleteCollection,
    isDeletingCollection,
    isFormOpen,
    isViewOpen,
    viewingItem,
    selectedType,
    editingItem,
    handleCreate,
    handleView,
    handleEdit,
    handleFormSubmit,
    handleFormOpenChange,
    handleViewOpenChange,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    handleEmptyRecycleBin,
    handleFork,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
  } = useHomebrewDashboardState();

  if (!user) {
    return <SignInRequiredCard onSignIn={() => navigate({ to: '/login' })} />;
  }

  // Pre-compute filtered lists to keep JSX clean
  const publicContent = myContent.filter(c => c.visibility === 'public');
  const privateContent = myContent.filter(c => c.visibility === 'private');
  const linkedContent = myContent.filter(
    c => c.campaignLinks && c.campaignLinks.length > 0
  );

  // Named callbacks for inline handlers
  const handleNavigateToNew = () =>
    navigate({ to: '/homebrew/new', search: { forkFrom: undefined } });

  const handleEditFromView = () => {
    if (viewingItem) handleEdit(viewingItem);
  };

  const handleForkFromView = viewingItem
    ? () => handleFork(viewingItem)
    : undefined;

  const handleOpenCreateCollection = () => setIsCreateCollectionOpen(true);

  const contentTabProps = {
    currentUserId: user.id,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onFork: handleFork,
    onCreate: handleCreate,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader onCreateNew={handleNavigateToNew} />

      {/* Content Tabs */}
      <Tabs defaultValue="private" className="space-y-4">
        <HomebrewTabsList
          counts={{
            all: tabCounts.all,
            public: tabCounts.public,
            private: tabCounts.private,
            linked: tabCounts.linked,
            starred: starredItems.length,
            collections: visibleCollections.length,
            deleted: deletedItems.length,
          }}
        />

        <AllContentTab
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

        <PublicContentTab
          items={publicContent}
          isLoading={isLoading}
          currentUserId={user.id}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFork={handleFork}
          onCreate={handleCreate}
          emptyMessage="No public homebrew content. Share your creations with the community!"
        />

        <PrivateContentTab
          items={privateContent}
          isLoading={isLoading}
          currentUserId={user.id}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFork={handleFork}
          onCreate={handleCreate}
          emptyMessage="No private homebrew content."
        />

        <QuicklistTab
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

        <CampaignLinkedTab
          items={linkedContent}
          isLoading={isLoading}
          currentUserId={user.id}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFork={handleFork}
          onCreate={handleCreate}
          emptyMessage="No homebrew linked to campaigns yet. Link your content from a campaign's homebrew tab!"
        />

        <CollectionsTab
          isLoading={isCollectionsLoading}
          collections={visibleCollections}
          selectedCollectionId={effectiveCollectionId}
          selectedCollection={selectedCollection}
          onSelectCollection={setSelectedCollectionId}
          onDeleteCollection={handleDeleteCollection}
          isDeletingCollection={isDeletingCollection}
          onCreateClick={handleOpenCreateCollection}
          isContentLoading={isCollectionContentLoading}
          orderedContent={orderedCollectionContent}
          currentUserId={user.id}
          contentTabProps={contentTabProps}
        />

        <RecycleBinTab
          items={deletedItems}
          isLoading={isDeletedLoading}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onEmptyBin={handleEmptyRecycleBin}
          isRestorePending={restoreMutation.isPending}
          isPermanentDeletePending={permanentDeleteMutation.isPending}
          isEmptyBinPending={emptyRecycleBinMutation.isPending}
        />

        <OfficialContentTab />
      </Tabs>

      <InfiniteScrollLoader
        loadMoreRef={loadMoreRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        hasContent={myContent.length > 0}
      />

      <DashboardDialogs
        user={user}
        isViewOpen={isViewOpen}
        handleViewOpenChange={handleViewOpenChange}
        viewingItem={viewingItem}
        onEditFromView={handleEditFromView}
        onForkFromView={handleForkFromView}
        isFormOpen={isFormOpen}
        handleFormOpenChange={handleFormOpenChange}
        selectedType={selectedType}
        editingItem={editingItem}
        handleFormSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        isCreateCollectionOpen={isCreateCollectionOpen}
        setIsCreateCollectionOpen={setIsCreateCollectionOpen}
        newCollectionName={newCollectionName}
        setNewCollectionName={setNewCollectionName}
        newCollectionDescription={newCollectionDescription}
        setNewCollectionDescription={setNewCollectionDescription}
        handleCreateCollection={handleCreateCollection}
        isCreatingCollection={isCreatingCollection}
        pendingAction={pendingAction}
        confirmPendingAction={confirmPendingAction}
        cancelPendingAction={cancelPendingAction}
      />
    </div>
  );
}

/** Renders an AlertDialog for destructive action confirmation. */
function DestructiveConfirmDialog({
  pendingAction,
  onConfirm,
  onCancel,
}: {
  pendingAction: PendingAction | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}) {
  const { title, description } = getConfirmDialogCopy(pendingAction);

  return (
    <AlertDialog
      open={pendingAction !== null}
      onOpenChange={open => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getConfirmDialogCopy(action: PendingAction | null): {
  title: string;
  description: string;
} {
  if (!action) return { title: '', description: '' };

  switch (action.type) {
    case 'delete':
      return {
        title: `Delete "${action.item.name}"?`,
        description:
          'This item will be moved to the Recycle Bin. You can restore it later.',
      };
    case 'permanentDelete':
      return {
        title: `Permanently delete "${action.item.name}"?`,
        description:
          'This action cannot be undone. The item will be permanently removed.',
      };
    case 'emptyBin':
      return {
        title: 'Empty Recycle Bin?',
        description: `This will permanently delete all ${action.deletedItemsCount} items in the recycle bin. This action cannot be undone.`,
      };
  }
}

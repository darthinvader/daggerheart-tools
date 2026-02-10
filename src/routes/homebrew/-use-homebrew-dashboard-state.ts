/**
 * Meta-hook that consolidates all HomebrewDashboard hooks
 * This reduces the complexity of the dashboard component by combining hook calls
 */
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '@/components/providers';

import { useHomebrewCollectionState } from './-use-homebrew-collection-state';
import { useHomebrewContentHandlers } from './-use-homebrew-content-handlers';
import { useHomebrewDashboardContent } from './-use-homebrew-dashboard-content';
import { useHomebrewDashboardDialogs } from './-use-homebrew-dashboard-dialogs';
import { useHomebrewDashboardMutations } from './-use-homebrew-dashboard-mutations';

export function useHomebrewDashboardState() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Consolidated content data hook
  const contentState = useHomebrewDashboardContent();

  // Mutations (consolidated hook)
  const mutations = useHomebrewDashboardMutations();

  // Collection state (extracted to hook)
  const collectionState = useHomebrewCollectionState();

  // Dialog and form state from extracted hook
  const dialogState = useHomebrewDashboardDialogs({
    createMutation: mutations.createMutation,
    updateMutation: mutations.updateMutation,
  });

  // Content CRUD handlers from extracted hook
  const contentHandlers = useHomebrewContentHandlers({
    deleteMutation: mutations.deleteMutation,
    restoreMutation: mutations.restoreMutation,
    permanentDeleteMutation: mutations.permanentDeleteMutation,
    emptyRecycleBinMutation: mutations.emptyRecycleBinMutation,
    deletedItemsCount: contentState.deletedItems.length,
    navigate,
  });

  return {
    user,
    navigate,
    // Content state
    myContent: contentState.myContent,
    isLoading: contentState.isLoading,
    isFetchingNextPage: contentState.isFetchingNextPage,
    hasNextPage: contentState.hasNextPage,
    tabCounts: contentState.tabCounts,
    starredItems: contentState.starredItems,
    isStarredLoading: contentState.isStarredLoading,
    deletedItems: contentState.deletedItems,
    isDeletedLoading: contentState.isDeletedLoading,
    loadMoreRef: contentState.loadMoreRef,
    // Mutations
    createMutation: mutations.createMutation,
    updateMutation: mutations.updateMutation,
    restoreMutation: mutations.restoreMutation,
    permanentDeleteMutation: mutations.permanentDeleteMutation,
    emptyRecycleBinMutation: mutations.emptyRecycleBinMutation,
    // Collection state
    isCollectionsLoading: collectionState.isCollectionsLoading,
    visibleCollections: collectionState.visibleCollections,
    setSelectedCollectionId: collectionState.setSelectedCollectionId,
    effectiveCollectionId: collectionState.effectiveCollectionId,
    selectedCollection: collectionState.selectedCollection,
    orderedCollectionContent: collectionState.orderedCollectionContent,
    isCollectionContentLoading: collectionState.isCollectionContentLoading,
    isCreateCollectionOpen: collectionState.isCreateCollectionOpen,
    setIsCreateCollectionOpen: collectionState.setIsCreateCollectionOpen,
    newCollectionName: collectionState.newCollectionName,
    setNewCollectionName: collectionState.setNewCollectionName,
    newCollectionDescription: collectionState.newCollectionDescription,
    setNewCollectionDescription: collectionState.setNewCollectionDescription,
    handleCreateCollection: collectionState.handleCreateCollection,
    isCreatingCollection: collectionState.isCreatingCollection,
    handleDeleteCollection: collectionState.handleDeleteCollection,
    isDeletingCollection: collectionState.isDeletingCollection,
    // Dialog state
    isFormOpen: dialogState.isFormOpen,
    isViewOpen: dialogState.isViewOpen,
    viewingItem: dialogState.viewingItem,
    selectedType: dialogState.selectedType,
    editingItem: dialogState.editingItem,
    handleCreate: dialogState.handleCreate,
    handleView: dialogState.handleView,
    handleEdit: dialogState.handleEdit,
    handleFormSubmit: dialogState.handleFormSubmit,
    handleFormOpenChange: dialogState.handleFormOpenChange,
    handleViewOpenChange: dialogState.handleViewOpenChange,
    // Content handlers
    handleDelete: contentHandlers.handleDelete,
    handleRestore: contentHandlers.handleRestore,
    handlePermanentDelete: contentHandlers.handlePermanentDelete,
    handleEmptyRecycleBin: contentHandlers.handleEmptyRecycleBin,
    handleFork: contentHandlers.handleFork,
    // Confirmation dialog state
    pendingAction: contentHandlers.pendingAction,
    confirmPendingAction: contentHandlers.confirmPendingAction,
    cancelPendingAction: contentHandlers.cancelPendingAction,
  };
}

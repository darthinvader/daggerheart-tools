/**
 * Homebrew Tab Content for Campaign Detail
 *
 * Displays and manages homebrew content linked to a campaign.
 * Uses a tabbed interface similar to My Homebrew for browsing all user content.
 */
import { useMemo } from 'react';

import {
  HomebrewFormDialog,
  HomebrewList,
  HomebrewViewDialog,
} from '@/components/homebrew';
import { TabsContent as InnerTabsContent, Tabs } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';

import { CollectionsTabContent } from './collections-tab-content';
import {
  addLinkedTags,
  AllTabInfoText,
  CampaignHomebrewInfoCard,
  createBrowseListHandlers,
  HomebrewInnerTabsList,
  HomebrewTabHeader,
} from './homebrew-tab-content-sections';
import { useHomebrewTabContentState } from './use-homebrew-tab-content-state';

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
  const {
    user,
    campaignHomebrew,
    myHomebrew,
    starredItems,
    linkedIds,
    visibleCollections,
    selectedCollection,
    orderedCollectionContent,
    loadingCampaign,
    loadingMy,
    isStarredLoading,
    isCollectionsLoading,
    isCollectionItemsLoading,
    isCollectionContentLoading,
    isSubmitting,
    isFormOpen,
    isViewOpen,
    viewingItem,
    selectedType,
    editingItem,
    innerTab,
    setInnerTab,
    showCampaignInfo,
    effectiveCollectionId,
    setSelectedCollectionId,
    handleCreate,
    handleView,
    handleEdit,
    handleFormSubmit,
    handleLink,
    handleUnlink,
    handleHideCampaignInfo,
    handleFormOpenChange,
    handleViewOpenChange,
  } = useHomebrewTabContentState(campaignId);

  // Memoized handlers for browse lists
  const myHomebrewHandlers = useMemo(
    () =>
      createBrowseListHandlers(myHomebrew, linkedIds, {
        onView: handleView,
        onEdit: handleEdit,
        onLink: handleLink,
        onUnlink: handleUnlink,
        onCreate: handleCreate,
      }),
    [
      myHomebrew,
      linkedIds,
      handleView,
      handleEdit,
      handleLink,
      handleUnlink,
      handleCreate,
    ]
  );

  const starredHandlers = useMemo(
    () =>
      createBrowseListHandlers(starredItems, linkedIds, {
        onView: handleView,
        onEdit: handleEdit,
        onLink: handleLink,
        onUnlink: handleUnlink,
        onCreate: handleCreate,
      }),
    [
      starredItems,
      linkedIds,
      handleView,
      handleEdit,
      handleLink,
      handleUnlink,
      handleCreate,
    ]
  );

  const collectionHandlers = useMemo(
    () =>
      createBrowseListHandlers(orderedCollectionContent, linkedIds, {
        onView: handleView,
        onEdit: handleEdit,
        onLink: handleLink,
        onUnlink: handleUnlink,
        onCreate: handleCreate,
      }),
    [
      orderedCollectionContent,
      linkedIds,
      handleView,
      handleEdit,
      handleLink,
      handleUnlink,
      handleCreate,
    ]
  );

  return (
    <TabsContent value="homebrew" className="space-y-6">
      <HomebrewTabHeader onCreateClick={() => handleCreate('adversary')} />

      {showCampaignInfo && (
        <CampaignHomebrewInfoCard onDismiss={handleHideCampaignInfo} />
      )}

      {/* Inner Tabs */}
      <Tabs
        value={innerTab}
        onValueChange={v => setInnerTab(v as InnerTab)}
        className="space-y-4"
      >
        <HomebrewInnerTabsList
          linkedCount={campaignHomebrew.length}
          allCount={myHomebrew.length}
        />

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
          <AllTabInfoText />
          <HomebrewList
            items={addLinkedTags(myHomebrew, linkedIds)}
            isLoading={loadingMy}
            currentUserId={user?.id}
            linkedItemIds={linkedIds}
            {...myHomebrewHandlers}
            showCreateButton
            emptyMessage="You haven't created any homebrew content yet."
          />
        </InnerTabsContent>

        {/* Public Tab */}
        <InnerTabsContent value="public">
          <HomebrewList
            items={addLinkedTags(
              myHomebrew.filter(c => c.visibility === 'public'),
              linkedIds
            )}
            isLoading={loadingMy}
            currentUserId={user?.id}
            linkedItemIds={linkedIds}
            {...myHomebrewHandlers}
            showCreateButton
            emptyMessage="No public homebrew content."
          />
        </InnerTabsContent>

        {/* Private Tab */}
        <InnerTabsContent value="private">
          <HomebrewList
            items={addLinkedTags(
              myHomebrew.filter(c => c.visibility === 'private'),
              linkedIds
            )}
            isLoading={loadingMy}
            currentUserId={user?.id}
            linkedItemIds={linkedIds}
            {...myHomebrewHandlers}
            showCreateButton
            emptyMessage="No private homebrew content."
          />
        </InnerTabsContent>

        {/* Quicklist Tab */}
        <InnerTabsContent value="quicklist">
          <HomebrewList
            items={addLinkedTags(starredItems, linkedIds)}
            isLoading={isStarredLoading}
            currentUserId={user?.id}
            linkedItemIds={linkedIds}
            {...starredHandlers}
            showCreateButton
            emptyMessage="No items in your quicklist yet."
          />
        </InnerTabsContent>

        {/* Collections Tab */}
        <InnerTabsContent value="collections">
          <CollectionsTabContent
            isLoading={isCollectionsLoading}
            collections={visibleCollections}
            selectedCollectionId={effectiveCollectionId}
            onSelectCollection={setSelectedCollectionId}
            selectedCollection={selectedCollection}
            isItemsLoading={
              isCollectionItemsLoading || isCollectionContentLoading
            }
            items={orderedCollectionContent}
            linkedIds={linkedIds}
            currentUserId={user?.id}
            onView={collectionHandlers.onView}
            onEdit={collectionHandlers.onEdit}
            onToggleLink={collectionHandlers.onLinkToCampaign}
            onCreate={handleCreate}
          />
        </InnerTabsContent>
      </Tabs>

      {/* View Dialog (Read-only) */}
      <HomebrewViewDialog
        open={isViewOpen}
        onOpenChange={handleViewOpenChange}
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
        onOpenChange={handleFormOpenChange}
        contentType={selectedType}
        initialData={editingItem ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        defaultVisibility="campaign_only"
      />
    </TabsContent>
  );
}

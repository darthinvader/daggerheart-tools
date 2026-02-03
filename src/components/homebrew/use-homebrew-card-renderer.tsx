/**
 * Hook for creating HomebrewCard render callback
 * Extracted to reduce HomebrewList component complexity
 */
import { useCallback, useMemo } from 'react';

import type { HomebrewContent } from '@/lib/schemas/homebrew';

import { HomebrewCard } from './homebrew-card';

interface UseHomebrewCardRendererProps {
  currentUserId?: string;
  starredSet: Set<string>;
  linkedItemIds?: Set<string>;
  onView?: (item: HomebrewContent) => void;
  onEdit?: (item: HomebrewContent) => void;
  onDelete?: (item: HomebrewContent) => void;
  onFork?: (item: HomebrewContent) => void;
  onLinkToCampaign?: (item: HomebrewContent) => void;
  openCampaignDialog: (item: HomebrewContent) => void;
  openCharacterDialog: (item: HomebrewContent) => void;
  handleToggleStar: (item: HomebrewContent) => void;
  openCollectionDialog: (item: HomebrewContent) => void;
}

export function useHomebrewCardRenderer({
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
}: UseHomebrewCardRendererProps) {
  // Pre-compute interaction capability
  const canInteract = useMemo(() => !!currentUserId, [currentUserId]);

  const renderCard = useCallback(
    (item: HomebrewContent) => {
      // Compute link handler based on available callbacks
      const linkHandler = onLinkToCampaign
        ? () => onLinkToCampaign(item)
        : currentUserId
          ? () => openCampaignDialog(item)
          : undefined;

      return (
        <HomebrewCard
          content={item}
          isOwner={item.ownerId === currentUserId}
          isStarred={starredSet.has(item.id)}
          isLinkedToCampaign={linkedItemIds?.has(item.id) ?? false}
          onView={onView ? () => onView(item) : undefined}
          onEdit={onEdit ? () => onEdit(item) : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
          onFork={onFork ? () => onFork(item) : undefined}
          onLinkToCampaign={linkHandler}
          onAddToCharacter={
            currentUserId ? () => openCharacterDialog(item) : undefined
          }
          onToggleStar={
            currentUserId ? () => handleToggleStar(item) : undefined
          }
          onAddToCollection={
            currentUserId ? () => openCollectionDialog(item) : undefined
          }
          canInteract={canInteract}
        />
      );
    },
    [
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
      canInteract,
    ]
  );

  return renderCard;
}

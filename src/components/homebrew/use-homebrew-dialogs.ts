/**
 * Hook for managing homebrew dialog states
 *
 * Consolidates dialog target and open state management
 * to reduce complexity in HomebrewList component.
 */
import { useCallback, useState } from 'react';

import type { HomebrewContent } from '@/lib/schemas/homebrew';

interface DialogState<T> {
  target: T | null;
  open: boolean;
}

interface UseHomebrewDialogsResult {
  // Collection dialog
  collectionDialog: DialogState<HomebrewContent>;
  openCollectionDialog: (item: HomebrewContent) => void;
  closeCollectionDialog: () => void;
  setCollectionDialogOpen: (open: boolean) => void;

  // Campaign dialog
  campaignDialog: DialogState<HomebrewContent>;
  openCampaignDialog: (item: HomebrewContent) => void;
  closeCampaignDialog: () => void;
  setCampaignDialogOpen: (open: boolean) => void;

  // Character dialog
  characterDialog: DialogState<HomebrewContent>;
  openCharacterDialog: (item: HomebrewContent) => void;
  closeCharacterDialog: () => void;
  setCharacterDialogOpen: (open: boolean) => void;
}

/**
 * Hook to manage homebrew dialog states.
 * Reduces boilerplate for dialog target + open state pairs.
 */
export function useHomebrewDialogs(): UseHomebrewDialogsResult {
  // Collection dialog state
  const [collectionTarget, setCollectionTarget] =
    useState<HomebrewContent | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);

  // Campaign dialog state
  const [campaignTarget, setCampaignTarget] = useState<HomebrewContent | null>(
    null
  );
  const [campaignOpen, setCampaignOpen] = useState(false);

  // Character dialog state
  const [characterTarget, setCharacterTarget] =
    useState<HomebrewContent | null>(null);
  const [characterOpen, setCharacterOpen] = useState(false);

  // Collection dialog handlers
  const openCollectionDialog = useCallback((item: HomebrewContent) => {
    setCollectionTarget(item);
    setCollectionOpen(true);
  }, []);

  const closeCollectionDialog = useCallback(() => {
    setCollectionOpen(false);
    setCollectionTarget(null);
  }, []);

  const setCollectionDialogOpen = useCallback((open: boolean) => {
    setCollectionOpen(open);
    if (!open) setCollectionTarget(null);
  }, []);

  // Campaign dialog handlers
  const openCampaignDialog = useCallback((item: HomebrewContent) => {
    setCampaignTarget(item);
    setCampaignOpen(true);
  }, []);

  const closeCampaignDialog = useCallback(() => {
    setCampaignOpen(false);
    setCampaignTarget(null);
  }, []);

  const setCampaignDialogOpen = useCallback((open: boolean) => {
    setCampaignOpen(open);
    if (!open) setCampaignTarget(null);
  }, []);

  // Character dialog handlers
  const openCharacterDialog = useCallback((item: HomebrewContent) => {
    setCharacterTarget(item);
    setCharacterOpen(true);
  }, []);

  const closeCharacterDialog = useCallback(() => {
    setCharacterOpen(false);
    setCharacterTarget(null);
  }, []);

  const setCharacterDialogOpen = useCallback((open: boolean) => {
    setCharacterOpen(open);
    if (!open) setCharacterTarget(null);
  }, []);

  return {
    collectionDialog: { target: collectionTarget, open: collectionOpen },
    openCollectionDialog,
    closeCollectionDialog,
    setCollectionDialogOpen,

    campaignDialog: { target: campaignTarget, open: campaignOpen },
    openCampaignDialog,
    closeCampaignDialog,
    setCampaignDialogOpen,

    characterDialog: { target: characterTarget, open: characterOpen },
    openCharacterDialog,
    closeCharacterDialog,
    setCharacterDialogOpen,
  };
}

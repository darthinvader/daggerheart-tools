/**
 * Hook for managing campaigns list state and handlers
 * Extracted from CampaignsList to reduce complexity
 */
import { useCallback, useEffect, useState } from 'react';

import {
  deleteCampaign,
  emptyTrash,
  listCampaigns,
  listTrashedCampaigns,
  permanentlyDeleteCampaign,
  restoreCampaign,
} from '@/features/campaigns/campaign-storage';
import type { Campaign } from '@/lib/schemas/campaign';

interface TrashedCampaign extends Campaign {
  deletedAt: string;
}

export function useCampaignsListState() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [trashedCampaigns, setTrashedCampaigns] = useState<TrashedCampaign[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] =
    useState<TrashedCampaign | null>(null);
  const [showEmptyTrashConfirm, setShowEmptyTrashConfirm] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);

  const loadData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [campaignsData, trashData] = await Promise.all([
        listCampaigns(),
        listTrashedCampaigns(),
      ]);
      if (signal?.aborted) return;
      setCampaigns(campaignsData);
      setTrashedCampaigns(trashData);
    } catch (error) {
      if (signal?.aborted) return;
      console.error('Failed to load campaigns:', error);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadData(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadData]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteCampaign(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      setDeleteTarget(null);
    }
  }, [deleteTarget, loadData]);

  const handleRestore = useCallback(
    async (id: string) => {
      try {
        await restoreCampaign(id);
        await loadData();
      } catch (error) {
        console.error('Failed to restore campaign:', error);
      }
    },
    [loadData]
  );

  const handlePermanentDelete = useCallback(async () => {
    if (!permanentDeleteTarget) return;
    try {
      await permanentlyDeleteCampaign(permanentDeleteTarget.id);
      setPermanentDeleteTarget(null);
      await loadData();
    } catch (error) {
      console.error('Failed to permanently delete campaign:', error);
      setPermanentDeleteTarget(null);
    }
  }, [permanentDeleteTarget, loadData]);

  const handleEmptyTrash = useCallback(async () => {
    try {
      await emptyTrash();
      setShowEmptyTrashConfirm(false);
      await loadData();
    } catch (error) {
      console.error('Failed to empty trash:', error);
      setShowEmptyTrashConfirm(false);
    }
  }, [loadData]);

  return {
    campaigns,
    trashedCampaigns,
    loading,
    deleteTarget,
    setDeleteTarget,
    permanentDeleteTarget,
    setPermanentDeleteTarget,
    showEmptyTrashConfirm,
    setShowEmptyTrashConfirm,
    trashOpen,
    setTrashOpen,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    handleEmptyTrash,
  };
}

export type { TrashedCampaign };

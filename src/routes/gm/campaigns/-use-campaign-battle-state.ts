// Extracted hook for campaign battle state management

import type { useNavigate } from '@tanstack/react-router';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { useCampaignBattle } from '@/components/battle-tracker/use-campaign-battle';
import {
  createBattle,
  getCampaign,
  updateBattle,
} from '@/features/campaigns/campaign-storage';
import type { BattleState } from '@/lib/schemas/battle';
import type { Campaign } from '@/lib/schemas/campaign';

async function refreshCampaignState(
  campaignId: string,
  setCampaign: (campaign: Campaign) => void
) {
  const updated = await getCampaign(campaignId);
  if (updated) setCampaign(updated);
}

async function saveExistingBattle(campaignId: string, state: BattleState) {
  await updateBattle(campaignId, state.id, state);
}

async function createNewBattleRecord({
  campaignId,
  state,
  savedBattleIdsRef,
  justSavedBattleIdRef,
  navigate,
}: {
  campaignId: string;
  state: BattleState;
  savedBattleIdsRef: MutableRefObject<Set<string>>;
  justSavedBattleIdRef: MutableRefObject<string | null>;
  navigate: ReturnType<typeof useNavigate>;
}): Promise<string> {
  const created = await createBattle(campaignId, state);
  savedBattleIdsRef.current.add(created.id);
  justSavedBattleIdRef.current = created.id;
  void navigate({
    to: '/gm/campaigns/$id/battle',
    params: { id: campaignId },
    search: { battleId: created.id, tab: 'gm-tools' },
    replace: true,
  });
  return created.id;
}

function useSavedBattleIds(campaign: Campaign | null) {
  const savedBattleIdsRef = useRef<Set<string>>(
    new Set(campaign?.battles?.map(b => b.id) ?? [])
  );

  useEffect(() => {
    savedBattleIdsRef.current = new Set(
      campaign?.battles?.map(b => b.id) ?? []
    );
  }, [campaign]);

  return savedBattleIdsRef;
}

interface UseCampaignBattleStateOptions {
  initialCampaign: Campaign | undefined;
  campaignId: string;
  initialBattleId?: string;
  navigate: ReturnType<typeof useNavigate>;
  campaignBattleRef: MutableRefObject<ReturnType<
    typeof useCampaignBattle
  > | null>;
}

export function useCampaignBattleState({
  initialCampaign,
  campaignId,
  initialBattleId,
  navigate,
  campaignBattleRef,
}: UseCampaignBattleStateOptions) {
  const [campaign, setCampaign] = useState<Campaign | null>(
    initialCampaign ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoadedInitialBattle, setHasLoadedInitialBattle] = useState(false);

  // Track when we saved a battle - don't reset state after our own save
  const justSavedBattleIdRef = useRef<string | null>(null);
  const savedBattleIdsRef = useSavedBattleIds(campaign);

  // Reset state when campaign changes from route (different campaign ID)
  useEffect(() => {
    if (justSavedBattleIdRef.current === initialBattleId) {
      justSavedBattleIdRef.current = null;
      return;
    }
    setCampaign(initialCampaign ?? null);
    setHasLoadedInitialBattle(false);
  }, [initialCampaign, initialBattleId]);

  const handleStateChange = useCallback(
    async (state: BattleState) => {
      if (!campaignId) return;
      setIsSaving(true);
      try {
        const battleExists = savedBattleIdsRef.current.has(state.id);
        if (battleExists) {
          await saveExistingBattle(campaignId, state);
        } else {
          const createdId = await createNewBattleRecord({
            campaignId,
            state,
            savedBattleIdsRef,
            justSavedBattleIdRef,
            navigate,
          });
          if (createdId !== state.id) {
            campaignBattleRef.current?.setBattleId(createdId);
          }
        }
        campaignBattleRef.current?.markClean();
        await refreshCampaignState(campaignId, setCampaign);
      } catch (error) {
        console.error('Failed to save battle:', error);
        toast.error('Failed to save battle state');
      } finally {
        setIsSaving(false);
      }
    },
    [campaignId, navigate, savedBattleIdsRef, campaignBattleRef]
  );

  return {
    campaign,
    setCampaign,
    isSaving,
    hasLoadedInitialBattle,
    setHasLoadedInitialBattle,
    handleStateChange,
  };
}

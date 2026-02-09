import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers';
import {
  joinCampaignByInviteCode,
  unlinkCharacterFromCampaign,
} from '@/features/campaigns/campaign-storage';
import {
  campaignKeys,
  useCampaigns,
  useCharacterCampaign,
} from '@/features/campaigns/use-campaign-query';
import type { Campaign } from '@/lib/schemas/campaign';

interface CampaignManagementOptions {
  characterId: string;
  characterName: string | undefined;
}

export function useCampaignManagement({
  characterId,
  characterName,
}: CampaignManagementOptions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteCode, setInviteCode] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>();

  const { data: campaign } = useCharacterCampaign(characterId);
  const { data: campaigns } = useCampaigns();

  const characterCampaigns = useMemo(() => {
    const allCampaigns = campaigns ?? [];
    return allCampaigns
      .filter(current =>
        current.players?.some(player => player.characterId === characterId)
      )
      .map(current => {
        const playerEntry = current.players?.find(
          player => player.characterId === characterId
        );
        return {
          id: current.id,
          name: current.name,
          status: current.status,
          role: playerEntry?.role,
        } satisfies {
          id: string;
          name: string;
          status: Campaign['status'];
          role?: Campaign['players'][number]['role'];
        };
      });
  }, [campaigns, characterId]);

  const activeCampaign = useMemo(() => {
    if (!campaigns) return campaign;
    if (selectedCampaignId) {
      return campaigns.find(c => c.id === selectedCampaignId) ?? campaign;
    }
    return campaign;
  }, [campaigns, campaign, selectedCampaignId]);

  const playerName = useMemo(() => {
    const metadata = user?.user_metadata as {
      full_name?: string;
      name?: string;
    };
    return (
      metadata?.full_name ??
      metadata?.name ??
      user?.email?.split('@')[0] ??
      'Player'
    );
  }, [user]);

  const joinMutation = useMutation<string, Error, void>({
    mutationFn: async () =>
      joinCampaignByInviteCode({
        inviteCode: inviteCode.trim(),
        playerName,
        characterId,
        characterName: characterName?.trim() || null,
      }),
    onSuccess: async () => {
      setInviteCode('');
      await queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });

  const unlinkMutation = useMutation<void, Error, string>({
    mutationFn: async (campaignId: string) =>
      unlinkCharacterFromCampaign({
        campaignId,
        characterId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
    onError: err => {
      console.error('[UnlinkCampaign]', err);
      toast.error('Failed to unlink from campaign');
    },
  });

  const canJoin = inviteCode.trim().length >= 6 && !joinMutation.isPending;

  const handleInviteCodeChange = useCallback((value: string) => {
    setInviteCode(value.toUpperCase());
  }, []);

  const handleJoinCampaign = useCallback(() => {
    joinMutation.mutate();
  }, [joinMutation]);

  const handleUnlinkCampaign = useCallback(
    (campaignId: string) => {
      unlinkMutation.mutate(campaignId);
    },
    [unlinkMutation]
  );

  return {
    activeCampaign,
    campaignId: activeCampaign?.id,
    characterCampaigns,
    inviteCode,
    handleInviteCodeChange,
    handleJoinCampaign,
    canJoin,
    isJoiningCampaign: joinMutation.isPending,
    joinCampaignError: joinMutation.isError ? joinMutation.error : null,
    joinCampaignSuccess: joinMutation.isSuccess,
    handleUnlinkCampaign,
    isUnlinkingCampaign: unlinkMutation.isPending,
    selectedCampaignId: selectedCampaignId ?? activeCampaign?.id,
    onSelectCampaign: setSelectedCampaignId,
  };
}

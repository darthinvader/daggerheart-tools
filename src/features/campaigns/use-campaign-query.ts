/**
 * Campaign React Query Hooks
 *
 * Provides React Query hooks for campaign operations.
 */

import { useQuery } from '@tanstack/react-query';

import {
  getCampaign,
  getCampaignForCharacter,
  listCampaigns,
} from './campaign-storage';

// =====================================================================================
// Query Keys
// =====================================================================================

export const campaignKeys = {
  all: ['campaign'] as const,
  detail: (id: string) => [...campaignKeys.all, 'detail', id] as const,
  forCharacter: (characterId: string) =>
    [...campaignKeys.all, 'forCharacter', characterId] as const,
};

// =====================================================================================
// Query Hooks
// =====================================================================================

/**
 * Get a campaign by ID
 */
export function useCampaign(campaignId: string | undefined) {
  return useQuery({
    queryKey: campaignKeys.detail(campaignId ?? ''),
    queryFn: () => (campaignId ? getCampaign(campaignId) : undefined),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * List campaigns for the current user (GM or player)
 */
export function useCampaigns() {
  return useQuery({
    queryKey: [...campaignKeys.all, 'list'] as const,
    queryFn: listCampaigns,
    staleTime: 1000 * 60,
  });
}

/**
 * Get the campaign that contains a specific character
 * Used to determine if a character has access to campaign homebrew content
 */
export function useCharacterCampaign(characterId: string | undefined) {
  return useQuery({
    queryKey: campaignKeys.forCharacter(characterId ?? ''),
    queryFn: () =>
      characterId ? getCampaignForCharacter(characterId) : undefined,
    enabled: !!characterId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

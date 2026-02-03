/**
 * Extracted hook for location entity CRUD and related entity creation.
 * Reduces complexity in EditableLocations component.
 */
import { useCallback } from 'react';

import {
  addLocation,
  addNPC,
  addOrganization,
  addQuest,
  deleteLocation,
  updateLocation,
} from '@/features/campaigns/campaign-storage';
import type {
  CampaignLocation,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';

interface UseLocationEntityHandlersOptions {
  campaignId: string;
  onSaveStart: () => void;
  onLocationsChange: () => void;
  onNPCsChange?: () => void;
  onQuestsChange?: () => void;
  onOrganizationsChange?: () => void;
}

export function useLocationEntityHandlers({
  campaignId,
  onSaveStart,
  onLocationsChange,
  onNPCsChange,
  onQuestsChange,
  onOrganizationsChange,
}: UseLocationEntityHandlersOptions) {
  const handleAddLocation = useCallback(async () => {
    onSaveStart();
    await addLocation(campaignId, {
      name: 'New Location',
      type: 'other',
      description: '',
      historyLore: '',
      secrets: '',
      currentState: '',
      connectedLocations: [],
      npcIds: [],
      npcsPresentCustom: [],
      organizationIds: [],
      questIds: [],
      questsAvailableCustom: [],
      sessionAppearances: [],
      pointsOfInterest: [],
      tags: [],
      notes: '',
    });
    onLocationsChange();
  }, [campaignId, onSaveStart, onLocationsChange]);

  const handleUpdateLocation = useCallback(
    async (
      locationId: string,
      updates: Partial<Omit<CampaignLocation, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      onSaveStart();
      await updateLocation(campaignId, locationId, updates);
      onLocationsChange();
    },
    [campaignId, onSaveStart, onLocationsChange]
  );

  const handleDeleteLocation = useCallback(
    async (locationId: string) => {
      onSaveStart();
      await deleteLocation(campaignId, locationId);
      onLocationsChange();
    },
    [campaignId, onSaveStart, onLocationsChange]
  );

  const handleCreateNPC = useCallback(
    async (name: string): Promise<string> => {
      const newNpc = await addNPC(campaignId, {
        name,
        titleRole: '',
        description: '',
        personality: '',
        motivation: '',
        backgroundHistory: '',
        secrets: '',
        connections: [],
        locationIds: [],
        organizationIds: [],
        allyNpcIds: [],
        enemyNpcIds: [],
        allyOrganizationIds: [],
        enemyOrganizationIds: [],
        status: 'active',
        faction: '',
        notes: '',
        sessionAppearances: [],
        questAppearances: [],
        tags: [],
      });
      onNPCsChange?.();
      if (!newNpc) throw new Error('Failed to create NPC');
      return newNpc.id;
    },
    [campaignId, onNPCsChange]
  );

  const handleCreateQuest = useCallback(
    async (title: string, type: CampaignQuest['type']): Promise<string> => {
      const newQuest = await addQuest(campaignId, {
        title,
        type,
        status: 'available',
        priority: 'medium',
        description: '',
        objectives: [],
        rewards: [],
        foreshadowing: '',
        consequences: '',
        notes: '',
        npcsInvolved: [],
        charactersInvolved: [],
        locationIds: [],
        organizationIds: [],
        sessionIds: [],
        giver: '',
        location: '',
        relatedNpcs: [],
        relatedNpcsCustom: [],
        relatedLocations: [],
        relatedLocationsCustom: [],
        sessionAppearances: [],
        tags: [],
      });
      onQuestsChange?.();
      if (!newQuest) throw new Error('Failed to create quest');
      return newQuest.id;
    },
    [campaignId, onQuestsChange]
  );

  const handleCreateOrganization = useCallback(
    async (
      name: string,
      type: CampaignOrganization['type']
    ): Promise<string> => {
      const newOrg = await addOrganization(campaignId, {
        name,
        type,
        description: '',
        goalsObjectives: '',
        secrets: '',
        keyMemberIds: [],
        allyNpcIds: [],
        enemyNpcIds: [],
        allyOrganizationIds: [],
        enemyOrganizationIds: [],
        headquartersId: undefined,
        questIds: [],
        locationIds: [],
        sessionIds: [],
        tags: [],
        notes: '',
      });
      onOrganizationsChange?.();
      if (!newOrg) throw new Error('Failed to create organization');
      return newOrg.id;
    },
    [campaignId, onOrganizationsChange]
  );

  return {
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    handleCreateNPC,
    handleCreateQuest,
    handleCreateOrganization,
  };
}

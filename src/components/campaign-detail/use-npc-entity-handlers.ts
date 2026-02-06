/**
 * Extracted hook for NPC entity CRUD and related entity creation.
 * Reduces complexity in EditableNPCs component.
 */
import { useCallback } from 'react';

import {
  addLocation,
  addNPC,
  addOrganization,
  deleteNPC,
  updateNPC,
} from '@/features/campaigns/campaign-storage';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
} from '@/lib/schemas/campaign';

interface UseNPCEntityHandlersOptions {
  campaignId: string;
  onSaveStart: () => void;
  onNPCsChange: () => void;
  onLocationsChange?: () => void;
  onOrganizationsChange?: () => void;
}

export function useNPCEntityHandlers({
  campaignId,
  onSaveStart,
  onNPCsChange,
  onLocationsChange,
  onOrganizationsChange,
}: UseNPCEntityHandlersOptions) {
  const handleAddNPC = useCallback(async () => {
    onSaveStart();
    await addNPC(campaignId, {
      name: 'New Character',
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
      role: 'neutral',
      features: [],
      disposition: 'neutral',
    });
    onNPCsChange();
  }, [campaignId, onSaveStart, onNPCsChange]);

  const handleUpdateNPC = useCallback(
    async (
      npcId: string,
      updates: Partial<Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      onSaveStart();
      await updateNPC(campaignId, npcId, updates);
      onNPCsChange();
    },
    [campaignId, onSaveStart, onNPCsChange]
  );

  const handleDeleteNPC = useCallback(
    async (npcId: string) => {
      onSaveStart();
      await deleteNPC(campaignId, npcId);
      onNPCsChange();
    },
    [campaignId, onSaveStart, onNPCsChange]
  );

  const handleCreateLocation = useCallback(
    async (name: string, type: CampaignLocation['type']): Promise<string> => {
      const newLocation = await addLocation(campaignId, {
        name,
        type,
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
        atmosphere: '',
      });
      onLocationsChange?.();
      if (!newLocation) throw new Error('Failed to create location');
      return newLocation.id;
    },
    [campaignId, onLocationsChange]
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

  const handleCreateNPCWithName = useCallback(
    async (name: string): Promise<string> => {
      onSaveStart();
      const newNPC = await addNPC(campaignId, {
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
        role: 'neutral',
        features: [],
        disposition: 'neutral',
      });
      onNPCsChange();
      if (!newNPC) throw new Error('Failed to create NPC');
      return newNPC.id;
    },
    [campaignId, onSaveStart, onNPCsChange]
  );

  return {
    handleAddNPC,
    handleUpdateNPC,
    handleDeleteNPC,
    handleCreateLocation,
    handleCreateOrganization,
    handleCreateNPCWithName,
  };
}

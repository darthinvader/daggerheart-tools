/**
 * Quest Entity Handlers Hook
 *
 * Consolidates CRUD operations and entity creation callbacks for EditableQuests.
 */
import { useCallback } from 'react';

import {
  addLocation,
  addNPC,
  addOrganization,
  addQuest,
  deleteQuest,
  updateQuest,
} from '@/features/campaigns/campaign-storage';
import type {
  CampaignLocation,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';

interface UseQuestEntityHandlersProps {
  campaignId: string;
  onSaveStart: () => void;
  onQuestsChange: () => void;
  onNPCsChange?: () => void;
  onLocationsChange?: () => void;
  onOrganizationsChange?: () => void;
}

export function useQuestEntityHandlers({
  campaignId,
  onSaveStart,
  onQuestsChange,
  onNPCsChange,
  onLocationsChange,
  onOrganizationsChange,
}: UseQuestEntityHandlersProps) {
  // Quest CRUD
  const handleAddQuest = useCallback(async () => {
    onSaveStart();
    await addQuest(campaignId, {
      title: 'New Quest',
      type: 'side',
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
    onQuestsChange();
  }, [campaignId, onSaveStart, onQuestsChange]);

  const handleUpdateQuest = useCallback(
    async (
      questId: string,
      updates: Partial<Omit<CampaignQuest, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      onSaveStart();
      await updateQuest(campaignId, questId, updates);
      onQuestsChange();
    },
    [campaignId, onSaveStart, onQuestsChange]
  );

  const handleDeleteQuest = useCallback(
    async (questId: string) => {
      onSaveStart();
      await deleteQuest(campaignId, questId);
      onQuestsChange();
    },
    [campaignId, onSaveStart, onQuestsChange]
  );

  // Entity creation callbacks
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
        role: 'neutral',
        features: [],
        disposition: 'neutral',
      });
      onNPCsChange?.();
      if (!newNpc) throw new Error('Failed to create NPC');
      return newNpc.id;
    },
    [campaignId, onNPCsChange]
  );

  const handleCreateLocation = useCallback(
    async (name: string, type: CampaignLocation['type']): Promise<string> => {
      const newLoc = await addLocation(campaignId, {
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
      if (!newLoc) throw new Error('Failed to create location');
      return newLoc.id;
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

  return {
    handleAddQuest,
    handleUpdateQuest,
    handleDeleteQuest,
    handleCreateNPC,
    handleCreateLocation,
    handleCreateOrganization,
  };
}

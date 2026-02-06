/**
 * Organization Entity Handlers Hook
 *
 * Consolidates CRUD operations and entity creation callbacks for EditableOrganizations.
 */
import { useCallback } from 'react';

import {
  addLocation,
  addNPC,
  addOrganization,
  addQuest,
  deleteOrganization,
  updateOrganization,
} from '@/features/campaigns/campaign-storage';
import type {
  CampaignLocation,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';

interface UseOrganizationEntityHandlersProps {
  campaignId: string;
  onSaveStart: () => void;
  onOrganizationsChange: () => void;
  onNPCsChange?: () => void;
  onLocationsChange?: () => void;
  onQuestsChange?: () => void;
}

export function useOrganizationEntityHandlers({
  campaignId,
  onSaveStart,
  onOrganizationsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
}: UseOrganizationEntityHandlersProps) {
  // Organization CRUD
  const handleAddOrganization = useCallback(async () => {
    onSaveStart();
    await addOrganization(campaignId, {
      name: 'New Organization',
      type: 'other',
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
    onOrganizationsChange();
  }, [campaignId, onSaveStart, onOrganizationsChange]);

  const handleUpdateOrganization = useCallback(
    async (
      organizationId: string,
      updates: Partial<
        Omit<CampaignOrganization, 'id' | 'createdAt' | 'updatedAt'>
      >
    ) => {
      onSaveStart();
      await updateOrganization(campaignId, organizationId, updates);
      onOrganizationsChange();
    },
    [campaignId, onSaveStart, onOrganizationsChange]
  );

  const handleDeleteOrganization = useCallback(
    async (organizationId: string) => {
      onSaveStart();
      await deleteOrganization(campaignId, organizationId);
      onOrganizationsChange();
    },
    [campaignId, onSaveStart, onOrganizationsChange]
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
      onOrganizationsChange();
      if (!newOrg) throw new Error('Failed to create organization');
      return newOrg.id;
    },
    [campaignId, onOrganizationsChange]
  );

  return {
    handleAddOrganization,
    handleUpdateOrganization,
    handleDeleteOrganization,
    handleCreateNPC,
    handleCreateLocation,
    handleCreateQuest,
    handleCreateOrganization,
  };
}

/**
 * Session Entity Handlers Hook
 *
 * Consolidates CRUD operations and entity creation callbacks for EditableSessions.
 */
import { useCallback, useState } from 'react';

import {
  addLocation,
  addNPC,
  addOrganization,
  addQuest,
  addSession,
  deleteSession,
  updateSession,
} from '@/features/campaigns/campaign-storage';
import type {
  CampaignLocation,
  CampaignOrganization,
  CampaignQuest,
  SessionNote,
} from '@/lib/schemas/campaign';

interface UseSessionEntityHandlersProps {
  campaignId: string;
  nextSessionNumber: number;
  onSaveStart: () => void;
  onSessionsChange: () => void;
  onNPCsChange?: () => void;
  onLocationsChange?: () => void;
  onQuestsChange?: () => void;
  onOrganizationsChange?: () => void;
}

export function useSessionEntityHandlers({
  campaignId,
  nextSessionNumber,
  onSaveStart,
  onSessionsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
  onOrganizationsChange,
}: UseSessionEntityHandlersProps) {
  const [error, setError] = useState<string | null>(null);

  // Session CRUD
  const handleAddSession = useCallback(async () => {
    try {
      setError(null);
      onSaveStart();
      await addSession(campaignId, {
        sessionNumber: nextSessionNumber,
        title: `Session ${nextSessionNumber}`,
        date: new Date().toISOString().split('T')[0],
        summary: '',
        keyHighlights: [],
        playerNotes: [],
        npcsInvolved: [],
        npcsInvolvedIds: [],
        npcsInvolvedCustom: [],
        locationIds: [],
        locationsCustom: [],
        questIds: [],
        questsInvolvedCustom: [],
        organizationIds: [],
        questProgress: '',
      });
      onSessionsChange();
    } catch (err) {
      console.error('Failed to add session:', err);
      setError(err instanceof Error ? err.message : 'Failed to add session');
    }
  }, [campaignId, nextSessionNumber, onSaveStart, onSessionsChange]);

  const handleUpdateSession = useCallback(
    async (
      sessionId: string,
      updates: Partial<Omit<SessionNote, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      if (Object.keys(updates).length === 0) return;
      try {
        setError(null);
        onSaveStart();
        await updateSession(campaignId, sessionId, updates);
        onSessionsChange();
      } catch (err) {
        console.error('Failed to update session:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to update session'
        );
      }
    },
    [campaignId, onSaveStart, onSessionsChange]
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        setError(null);
        onSaveStart();
        await deleteSession(campaignId, sessionId);
        onSessionsChange();
      } catch (err) {
        console.error('Failed to delete session:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to delete session'
        );
      }
    },
    [campaignId, onSaveStart, onSessionsChange]
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
      });
      onNPCsChange?.();
      if (!newNpc) throw new Error('Failed to create NPC');
      return newNpc.id;
    },
    [campaignId, onNPCsChange]
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
      });
      onLocationsChange?.();
      if (!newLocation) throw new Error('Failed to create location');
      return newLocation.id;
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
      onOrganizationsChange?.();
      if (!newOrg) throw new Error('Failed to create organization');
      return newOrg.id;
    },
    [campaignId, onOrganizationsChange]
  );

  return {
    error,
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession,
    handleCreateNPC,
    handleCreateLocation,
    handleCreateQuest,
    handleCreateOrganization,
  };
}

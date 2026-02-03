/**
 * Hook for managing LocationCard entity relationships and derived data
 * Extracted from LocationCard to reduce complexity
 */
import { useCallback } from 'react';

import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';
import { useEntityIdListHandlers } from './entity-card-utils';
import type { NPCPickerResult } from './entity-modals';

interface UseLocationCardHandlersOptions {
  localLocation: CampaignLocation;
  setLocalLocation: React.Dispatch<React.SetStateAction<CampaignLocation>>;
  scheduleAutoSave: (entity: CampaignLocation) => void;
  npcs: CampaignNPC[];
  quests: CampaignQuest[];
  organizations: CampaignOrganization[];
}

export function useLocationCardHandlers({
  localLocation,
  setLocalLocation,
  scheduleAutoSave,
  npcs,
  quests,
  organizations,
}: UseLocationCardHandlersOptions) {
  // Entity ID list handlers
  const npcHandlers = useEntityIdListHandlers<CampaignLocation>('npcIds', {
    localEntity: localLocation,
    setLocalEntity: setLocalLocation,
    scheduleAutoSave,
  });

  const questHandlers = useEntityIdListHandlers<CampaignLocation>('questIds', {
    localEntity: localLocation,
    setLocalEntity: setLocalLocation,
    scheduleAutoSave,
  });

  const orgHandlers = useEntityIdListHandlers<CampaignLocation>(
    'organizationIds',
    {
      localEntity: localLocation,
      setLocalEntity: setLocalLocation,
      scheduleAutoSave,
    }
  );

  // Type change handler
  const handleTypeChange = useCallback(
    (value: CampaignLocation['type']) => {
      setLocalLocation(current => {
        const updated = { ...current, type: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalLocation, scheduleAutoSave]
  );

  // NPC picker wrapper (NPCPickerResult -> npcId)
  const handleAddNPC = useCallback(
    (result: NPCPickerResult) => {
      npcHandlers.handleAdd(result.npcId);
    },
    [npcHandlers]
  );

  // Entity name getters - memoized for stable references
  const getNpcName = useCallback(
    (id: string) => npcs.find(n => n.id === id)?.name ?? 'Unknown',
    [npcs]
  );

  const getQuestTitle = useCallback(
    (id: string) => quests.find(q => q.id === id)?.title ?? 'Unknown',
    [quests]
  );

  const getOrgName = useCallback(
    (id: string) => organizations.find(o => o.id === id)?.name ?? 'Unknown',
    [organizations]
  );

  return {
    npcHandlers,
    questHandlers,
    orgHandlers,
    handleTypeChange,
    handleAddNPC,
    getNpcName,
    getQuestTitle,
    getOrgName,
  };
}

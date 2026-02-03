/**
 * Organization Card Handlers Hook
 *
 * Consolidates all Organization entity handlers including:
 * - ID list handlers for members, locations, quests, allies, enemies
 * - Picker handlers with modal close
 * - Type and HQ change handlers
 */
import { useCallback, useMemo } from 'react';

import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignQuest,
} from '@/lib/schemas/campaign';

import {
  useEntityIdListHandlers,
  usePickerHandlerWithModal,
} from './entity-card-utils';

type OrganizationType = CampaignOrganization['type'];

type OrgModalKey =
  | 'deleteConfirm'
  | 'keyMembersPicker'
  | 'hqPicker'
  | 'locationsPicker'
  | 'questsPicker'
  | 'allyNpcsPicker'
  | 'enemyNpcsPicker'
  | 'allyOrgsPicker'
  | 'enemyOrgsPicker';

interface UseOrganizationCardHandlersProps {
  localOrg: CampaignOrganization;
  setLocalOrg: React.Dispatch<React.SetStateAction<CampaignOrganization>>;
  scheduleAutoSave: (entity: CampaignOrganization) => void;
  closeModal: (key: OrgModalKey) => void;
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  otherOrganizations: CampaignOrganization[];
}

export function useOrganizationCardHandlers({
  localOrg,
  setLocalOrg,
  scheduleAutoSave,
  closeModal,
  npcs,
  locations,
  quests,
  otherOrganizations,
}: UseOrganizationCardHandlersProps) {
  // Handler context for ID list handlers
  const handlerContext = useMemo(
    () => ({
      localEntity: localOrg,
      setLocalEntity: setLocalOrg,
      scheduleAutoSave,
    }),
    [localOrg, setLocalOrg, scheduleAutoSave]
  );

  // ID list handlers
  const keyMemberHandlers = useEntityIdListHandlers(
    'keyMemberIds',
    handlerContext
  );
  const allyNpcHandlers = useEntityIdListHandlers('allyNpcIds', handlerContext);
  const enemyNpcHandlers = useEntityIdListHandlers(
    'enemyNpcIds',
    handlerContext
  );
  const allyOrgHandlers = useEntityIdListHandlers(
    'allyOrganizationIds',
    handlerContext
  );
  const enemyOrgHandlers = useEntityIdListHandlers(
    'enemyOrganizationIds',
    handlerContext
  );
  const locationHandlers = useEntityIdListHandlers(
    'locationIds',
    handlerContext
  );
  const questHandlers = useEntityIdListHandlers('questIds', handlerContext);

  // Picker result handlers with modal close
  const handleAddKeyMember = usePickerHandlerWithModal(
    keyMemberHandlers.handleAdd,
    closeModal,
    'keyMembersPicker' as const
  );
  const handleAddAllyNpc = usePickerHandlerWithModal(
    allyNpcHandlers.handleAdd,
    closeModal,
    'allyNpcsPicker' as const
  );
  const handleAddEnemyNpc = usePickerHandlerWithModal(
    enemyNpcHandlers.handleAdd,
    closeModal,
    'enemyNpcsPicker' as const
  );
  const handleAddAllyOrg = usePickerHandlerWithModal(
    allyOrgHandlers.handleAdd,
    closeModal,
    'allyOrgsPicker' as const
  );
  const handleAddEnemyOrg = usePickerHandlerWithModal(
    enemyOrgHandlers.handleAdd,
    closeModal,
    'enemyOrgsPicker' as const
  );

  // Type change handler
  const handleTypeChange = useCallback(
    (value: OrganizationType) => {
      setLocalOrg(current => {
        const updated = { ...current, type: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalOrg, scheduleAutoSave]
  );

  // HQ handlers
  const handleSetHQ = useCallback(
    (locationId: string) => {
      setLocalOrg(current => {
        const updated = { ...current, headquartersId: locationId };
        scheduleAutoSave(updated);
        return updated;
      });
      closeModal('hqPicker');
    },
    [setLocalOrg, scheduleAutoSave, closeModal]
  );

  const handleClearHQ = useCallback(() => {
    setLocalOrg(current => {
      const updated = { ...current, headquartersId: undefined };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [setLocalOrg, scheduleAutoSave]);

  // Name lookup helpers
  const getNpcName = useCallback(
    (id: string) => npcs.find(n => n.id === id)?.name ?? 'Unknown',
    [npcs]
  );

  const getLocationName = useCallback(
    (id: string) => locations.find(l => l.id === id)?.name ?? 'Unknown',
    [locations]
  );

  const getQuestTitle = useCallback(
    (id: string) => quests.find(q => q.id === id)?.title ?? 'Unknown',
    [quests]
  );

  const getOrgName = useCallback(
    (id: string) =>
      otherOrganizations.find(o => o.id === id)?.name ?? 'Unknown',
    [otherOrganizations]
  );

  return {
    // ID list handlers
    keyMemberHandlers,
    allyNpcHandlers,
    enemyNpcHandlers,
    allyOrgHandlers,
    enemyOrgHandlers,
    locationHandlers,
    questHandlers,

    // Picker handlers
    handleAddKeyMember,
    handleAddAllyNpc,
    handleAddEnemyNpc,
    handleAddAllyOrg,
    handleAddEnemyOrg,

    // Type and HQ handlers
    handleTypeChange,
    handleSetHQ,
    handleClearHQ,

    // Helpers
    getNpcName,
    getLocationName,
    getQuestTitle,
    getOrgName,
  };
}

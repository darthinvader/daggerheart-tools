/**
 * NPC Card Handlers Hook
 *
 * Consolidates all NPC entity handlers including:
 * - ID list handlers for locations, orgs, allies, enemies
 * - Picker handlers with modal close
 * - Status change handler
 */
import { useCallback, useMemo } from 'react';

import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
} from '@/lib/schemas/campaign';

import { useEntityIdListHandlers } from './entity-card-utils';
import { usePickerHandlerWithModal } from './entity-card-utils';

interface UseNPCCardHandlersProps {
  localNPC: CampaignNPC;
  setLocalNPC: React.Dispatch<React.SetStateAction<CampaignNPC>>;
  scheduleAutoSave: (entity: CampaignNPC) => void;
  closeModal: (key: NPCModalKey) => void;
  allNPCs: CampaignNPC[];
  locations: CampaignLocation[];
  organizations: CampaignOrganization[];
}

type NPCModalKey =
  | 'deleteConfirm'
  | 'locationPicker'
  | 'orgPicker'
  | 'allyNPCPicker'
  | 'enemyNPCPicker'
  | 'allyOrgPicker'
  | 'enemyOrgPicker';

export function useNPCCardHandlers({
  localNPC,
  setLocalNPC,
  scheduleAutoSave,
  closeModal,
  allNPCs,
  locations,
  organizations,
}: UseNPCCardHandlersProps) {
  // Handler context for ID list handlers
  const handlerContext = useMemo(
    () => ({
      localEntity: localNPC,
      setLocalEntity: setLocalNPC,
      scheduleAutoSave,
    }),
    [localNPC, setLocalNPC, scheduleAutoSave]
  );

  // ID list handlers
  const locationHandlers = useEntityIdListHandlers(
    'locationIds',
    handlerContext
  );
  const orgHandlers = useEntityIdListHandlers(
    'organizationIds',
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

  // Picker result handlers with modal close
  const handleAddAllyNPC = usePickerHandlerWithModal(
    allyNpcHandlers.handleAdd,
    closeModal,
    'allyNPCPicker' as const
  );
  const handleAddEnemyNPC = usePickerHandlerWithModal(
    enemyNpcHandlers.handleAdd,
    closeModal,
    'enemyNPCPicker' as const
  );
  const handleAddAllyOrg = usePickerHandlerWithModal(
    allyOrgHandlers.handleAdd,
    closeModal,
    'allyOrgPicker' as const
  );
  const handleAddEnemyOrg = usePickerHandlerWithModal(
    enemyOrgHandlers.handleAdd,
    closeModal,
    'enemyOrgPicker' as const
  );

  // Status change handler
  const handleStatusChange = useCallback(
    (value: CampaignNPC['status']) => {
      setLocalNPC(current => {
        const updated = { ...current, status: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  // Name lookup helpers
  const getLocationName = useCallback(
    (id: string) => locations.find(l => l.id === id)?.name ?? 'Unknown',
    [locations]
  );

  const getOrgName = useCallback(
    (id: string) => organizations.find(o => o.id === id)?.name ?? 'Unknown',
    [organizations]
  );

  // Filter other NPCs
  const otherNPCs = useMemo(
    () => allNPCs.filter(n => n.id !== localNPC.id),
    [allNPCs, localNPC.id]
  );

  return {
    // ID list handlers
    locationHandlers,
    orgHandlers,
    allyNpcHandlers,
    enemyNpcHandlers,
    allyOrgHandlers,
    enemyOrgHandlers,

    // Picker handlers
    handleAddAllyNPC,
    handleAddEnemyNPC,
    handleAddAllyOrg,
    handleAddEnemyOrg,

    // Status handler
    handleStatusChange,

    // Helpers
    getLocationName,
    getOrgName,
    otherNPCs,
  };
}

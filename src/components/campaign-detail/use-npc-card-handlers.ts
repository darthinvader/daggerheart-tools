/**
 * NPC Card Handlers Hook
 *
 * Consolidates all NPC entity handlers including:
 * - ID list handlers for locations, orgs, allies, enemies
 * - Picker handlers with modal close
 * - Status change handler
 * - Role change handler (party relationship)
 * - Feature handlers (add, update, delete, toggle, reset uses)
 */
import { useCallback, useMemo } from 'react';

import type {
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  NPCDisposition,
  NPCFeature,
  NPCRole,
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

  // Role change handler (party relationship)
  const handleRoleChange = useCallback(
    (value: NPCRole) => {
      setLocalNPC(current => {
        const updated = { ...current, role: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  // Disposition change handler (how NPC feels about the party)
  const handleDispositionChange = useCallback(
    (value: NPCDisposition) => {
      setLocalNPC(current => {
        const updated = { ...current, disposition: value };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  // ===================================================================================
  // Feature Handlers - Trigger/Effect mechanics per Chapter 3
  // ===================================================================================

  // Generate unique ID for new features
  const generateFeatureId = useCallback(() => {
    return `feature-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  // Add a new feature
  const handleAddFeature = useCallback(() => {
    const newFeature: NPCFeature = {
      id: generateFeatureId(),
      name: 'New Feature',
      trigger: '',
      effect: '',
      notes: '',
      isActive: true,
      currentUses: 0,
    };
    setLocalNPC(current => {
      const updated = {
        ...current,
        features: [...(current.features ?? []), newFeature],
      };
      scheduleAutoSave(updated);
      return updated;
    });
  }, [generateFeatureId, setLocalNPC, scheduleAutoSave]);

  // Update a feature
  const handleUpdateFeature = useCallback(
    (featureId: string, updates: Partial<NPCFeature>) => {
      setLocalNPC(current => {
        const updatedFeatures = (current.features ?? []).map(feature =>
          feature.id === featureId ? { ...feature, ...updates } : feature
        );
        const updated = { ...current, features: updatedFeatures };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  // Delete a feature
  const handleDeleteFeature = useCallback(
    (featureId: string) => {
      setLocalNPC(current => {
        const updatedFeatures = (current.features ?? []).filter(
          feature => feature.id !== featureId
        );
        const updated = { ...current, features: updatedFeatures };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  // Toggle feature active state
  const handleToggleFeatureActive = useCallback(
    (featureId: string) => {
      setLocalNPC(current => {
        const updatedFeatures = (current.features ?? []).map(feature =>
          feature.id === featureId
            ? { ...feature, isActive: !feature.isActive }
            : feature
        );
        const updated = { ...current, features: updatedFeatures };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  // Reset feature uses (after a rest)
  const handleResetFeatureUses = useCallback(
    (featureId: string) => {
      setLocalNPC(current => {
        const updatedFeatures = (current.features ?? []).map(feature =>
          feature.id === featureId ? { ...feature, currentUses: 0 } : feature
        );
        const updated = { ...current, features: updatedFeatures };
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

    // Role handler (party relationship)
    handleRoleChange,

    // Disposition handler
    handleDispositionChange,

    // Feature handlers
    handleAddFeature,
    handleUpdateFeature,
    handleDeleteFeature,
    handleToggleFeatureActive,
    handleResetFeatureUses,

    // Helpers
    getLocationName,
    getOrgName,
    otherNPCs,
  };
}

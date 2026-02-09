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
  NPCFeature,
} from '@/lib/schemas/campaign';

import {
  useEntityIdListHandlers,
  usePickerHandlerWithModal,
  useSelectChangeHandler,
} from './entity-card-utils';

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

// ===================================================================================
// Pure helper: Generate unique ID for new features (no deps, no hook needed)
// ===================================================================================

function generateFeatureId(): string {
  return `feature-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ===================================================================================
// Pure helper: Create a default new feature
// ===================================================================================

function createDefaultFeature(): NPCFeature {
  return {
    id: generateFeatureId(),
    name: 'New Feature',
    trigger: '',
    effect: '',
    notes: '',
    isActive: true,
    currentUses: 0,
  };
}

// ===================================================================================
// Extracted Hook: NPC Feature Handlers
// ===================================================================================

interface UseNPCFeatureHandlersOptions {
  setLocalNPC: React.Dispatch<React.SetStateAction<CampaignNPC>>;
  scheduleAutoSave: (entity: CampaignNPC) => void;
}

function useNPCFeatureHandlers({
  setLocalNPC,
  scheduleAutoSave,
}: UseNPCFeatureHandlersOptions) {
  // Shared helper: transform the features array and auto-save
  const updateFeatures = useCallback(
    (transformFn: (features: NPCFeature[]) => NPCFeature[]) => {
      setLocalNPC(current => {
        const updated = {
          ...current,
          features: transformFn(current.features ?? []),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [setLocalNPC, scheduleAutoSave]
  );

  const handleAddFeature = useCallback(() => {
    const newFeature = createDefaultFeature();
    updateFeatures(features => [...features, newFeature]);
  }, [updateFeatures]);

  const handleUpdateFeature = useCallback(
    (featureId: string, updates: Partial<NPCFeature>) => {
      updateFeatures(features =>
        features.map(f => (f.id === featureId ? { ...f, ...updates } : f))
      );
    },
    [updateFeatures]
  );

  const handleDeleteFeature = useCallback(
    (featureId: string) => {
      updateFeatures(features => features.filter(f => f.id !== featureId));
    },
    [updateFeatures]
  );

  const handleToggleFeatureActive = useCallback(
    (featureId: string) => {
      updateFeatures(features =>
        features.map(f =>
          f.id === featureId ? { ...f, isActive: !f.isActive } : f
        )
      );
    },
    [updateFeatures]
  );

  const handleResetFeatureUses = useCallback(
    (featureId: string) => {
      updateFeatures(features =>
        features.map(f => (f.id === featureId ? { ...f, currentUses: 0 } : f))
      );
    },
    [updateFeatures]
  );

  return {
    handleAddFeature,
    handleUpdateFeature,
    handleDeleteFeature,
    handleToggleFeatureActive,
    handleResetFeatureUses,
  };
}

// ===================================================================================
// Extracted Hook: NPC Name Lookups and Helpers
// ===================================================================================

interface UseNPCLookupsOptions {
  localNPC: CampaignNPC;
  allNPCs: CampaignNPC[];
  locations: CampaignLocation[];
  organizations: CampaignOrganization[];
}

function useNPCLookups({
  localNPC,
  allNPCs,
  locations,
  organizations,
}: UseNPCLookupsOptions) {
  const getLocationName = useCallback(
    (id: string) => locations.find(l => l.id === id)?.name ?? 'Unknown',
    [locations]
  );

  const getOrgName = useCallback(
    (id: string) => organizations.find(o => o.id === id)?.name ?? 'Unknown',
    [organizations]
  );

  const otherNPCs = useMemo(
    () => allNPCs.filter(n => n.id !== localNPC.id),
    [allNPCs, localNPC.id]
  );

  return { getLocationName, getOrgName, otherNPCs };
}

// ===================================================================================
// Main Hook: useNPCCardHandlers
// ===================================================================================

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

  // Context for select change handlers
  const selectContext = useMemo(
    () => ({
      setLocalEntity: setLocalNPC,
      scheduleAutoSave,
    }),
    [setLocalNPC, scheduleAutoSave]
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

  // Field change handlers - delegated to generic useSelectChangeHandler
  const handleStatusChange = useSelectChangeHandler<CampaignNPC, 'status'>(
    'status',
    selectContext
  );
  const handleRoleChange = useSelectChangeHandler<CampaignNPC, 'role'>(
    'role',
    selectContext
  );
  const handleDispositionChange = useSelectChangeHandler<
    CampaignNPC,
    'disposition'
  >('disposition', selectContext);

  // Feature handlers - delegated to extracted hook
  const {
    handleAddFeature,
    handleUpdateFeature,
    handleDeleteFeature,
    handleToggleFeatureActive,
    handleResetFeatureUses,
  } = useNPCFeatureHandlers({ setLocalNPC, scheduleAutoSave });

  // Name lookup helpers - delegated to extracted hook
  const { getLocationName, getOrgName, otherNPCs } = useNPCLookups({
    localNPC,
    allNPCs,
    locations,
    organizations,
  });

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

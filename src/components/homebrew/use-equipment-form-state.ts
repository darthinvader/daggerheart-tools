/**
 * Hook for managing EquipmentForm state
 * Consolidates all state management, handlers, and side effects
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLatestRef } from '@/hooks/use-latest-ref';
import {
  createDefaultArmorContent,
  createDefaultCustomEquipmentContent,
  createDefaultWeaponContent,
  createDefaultWheelchairContent,
} from '@/lib/schemas/homebrew';

import type { EquipmentFormData } from './equipment-form';
import { useEquipmentFeatureHandlers } from './use-equipment-feature-handlers';
import { useEquipmentFormDataBuilder } from './use-equipment-form-data-builder';

// =====================================================================================
// Hook Types
// =====================================================================================

interface UseEquipmentFormStateProps {
  initialData?: EquipmentFormData;
  onChange?: (data: EquipmentFormData) => void;
  lockedType?: 'weapon' | 'armor' | 'wheelchair' | 'custom';
}

// =====================================================================================
// Helpers
// =====================================================================================

/** Resolves initial data for each equipment type, falling back to defaults */
function resolveInitialData(initialData: EquipmentFormData | undefined) {
  return {
    weapon:
      initialData?.equipmentType === 'weapon'
        ? initialData
        : createDefaultWeaponContent(),
    armor:
      initialData?.equipmentType === 'armor'
        ? initialData
        : createDefaultArmorContent(),
    wheelchair:
      initialData?.equipmentType === 'wheelchair'
        ? initialData
        : createDefaultWheelchairContent(),
    custom:
      initialData?.equipmentType === 'custom'
        ? initialData
        : createDefaultCustomEquipmentContent(),
  };
}

/** Notifies parent when equipment data changes (for inline/controlled mode) */
function useOnChangeNotification(
  currentData: EquipmentFormData,
  onChange?: (data: EquipmentFormData) => void
) {
  const prevDataRef = useRef<string | undefined>(undefined);
  const onChangeRef = useLatestRef(onChange);

  useEffect(() => {
    const serialized = JSON.stringify(currentData);
    if (onChangeRef.current && serialized !== prevDataRef.current) {
      prevDataRef.current = serialized;
      onChangeRef.current(currentData);
    }
  }, [currentData]);
}

// =====================================================================================
// Main Hook
// =====================================================================================

export function useEquipmentFormState({
  initialData,
  onChange,
  lockedType,
}: UseEquipmentFormStateProps) {
  // Equipment type state
  const [equipmentType, setEquipmentType] = useState<
    'weapon' | 'armor' | 'wheelchair' | 'custom'
  >(lockedType ?? initialData?.equipmentType ?? 'weapon');

  // Type-specific data states (resolved via helper)
  const initial = resolveInitialData(initialData);
  const [weaponData, setWeaponData] = useState(initial.weapon);
  const [armorData, setArmorData] = useState(initial.armor);
  const [wheelchairData, setWheelchairData] = useState(initial.wheelchair);
  const [customData, setCustomData] = useState(initial.custom);

  // Features state (extracted hook)
  const { features, addFeature, removeFeature, updateFeature } =
    useEquipmentFeatureHandlers(initialData?.features ?? []);

  // Build current data and computed values (extracted hook)
  const { currentData, currentDescription, isSubmitDisabled } =
    useEquipmentFormDataBuilder({
      equipmentType,
      weaponData,
      armorData,
      wheelchairData,
      customData,
      features,
    });

  // Auto-notify parent on data changes (for inline/controlled mode)
  useOnChangeNotification(currentData, onChange);

  // Description handler - uses switch for proper type narrowing
  const handleDescriptionChange = useCallback(
    (desc: string) => {
      switch (equipmentType) {
        case 'weapon':
          setWeaponData(prev => ({ ...prev, description: desc }));
          break;
        case 'armor':
          setArmorData(prev => ({ ...prev, description: desc }));
          break;
        case 'wheelchair':
          setWheelchairData(prev => ({ ...prev, description: desc }));
          break;
        case 'custom':
          setCustomData(prev => ({ ...prev, description: desc }));
          break;
      }
    },
    [equipmentType]
  );

  // Type change handler (respects lockedType)
  const handleTypeChange = useCallback(
    (newType: 'weapon' | 'armor' | 'wheelchair' | 'custom') => {
      if (!lockedType) {
        setEquipmentType(newType);
      }
    },
    [lockedType]
  );

  return {
    // Equipment type
    equipmentType,
    handleTypeChange,

    // Type-specific data
    weaponData,
    setWeaponData,
    armorData,
    setArmorData,
    wheelchairData,
    setWheelchairData,
    customData,
    setCustomData,

    // Features
    features,
    addFeature,
    removeFeature,
    updateFeature,

    // Handlers
    handleDescriptionChange,

    // Computed values (from extracted hook)
    currentDescription,
    isSubmitDisabled,

    // Current data (from extracted hook)
    currentData,
  };
}

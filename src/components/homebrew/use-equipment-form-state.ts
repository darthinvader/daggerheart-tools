/**
 * Hook for managing EquipmentForm state
 * Consolidates all state management, handlers, and side effects
 */
import { useCallback, useEffect, useState } from 'react';

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

  // Type-specific data states
  const [weaponData, setWeaponData] = useState(
    initialData?.equipmentType === 'weapon'
      ? initialData
      : createDefaultWeaponContent()
  );
  const [armorData, setArmorData] = useState(
    initialData?.equipmentType === 'armor'
      ? initialData
      : createDefaultArmorContent()
  );
  const [wheelchairData, setWheelchairData] = useState(
    initialData?.equipmentType === 'wheelchair'
      ? initialData
      : createDefaultWheelchairContent()
  );
  const [customData, setCustomData] = useState(
    initialData?.equipmentType === 'custom'
      ? initialData
      : createDefaultCustomEquipmentContent()
  );

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

  // Auto-notify on changes (for inline mode)
  useEffect(() => {
    onChange?.(currentData);
  }, [currentData, onChange]);

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

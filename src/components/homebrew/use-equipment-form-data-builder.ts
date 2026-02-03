/**
 * Hook for building EquipmentFormData from component state
 * Extracted to reduce complexity of use-equipment-form-state
 */
import { useMemo } from 'react';

import type { EquipmentFormData } from './equipment-form';
import type { EquipmentFeatureState } from './equipment-form-sections';

interface EquipmentFormDataBuilderInput {
  equipmentType: 'weapon' | 'armor' | 'wheelchair' | 'custom';
  weaponData: EquipmentFormData;
  armorData: EquipmentFormData;
  wheelchairData: EquipmentFormData;
  customData: EquipmentFormData;
  features: EquipmentFeatureState[];
}

interface EquipmentFormDataBuilderResult {
  currentData: EquipmentFormData;
  currentDescription: string;
  isSubmitDisabled: boolean;
}

/**
 * Builds the complete EquipmentFormData from all form state pieces
 */
export function useEquipmentFormDataBuilder(
  input: EquipmentFormDataBuilderInput
): EquipmentFormDataBuilderResult {
  const {
    equipmentType,
    weaponData,
    armorData,
    wheelchairData,
    customData,
    features,
  } = input;

  const currentData = useMemo((): EquipmentFormData => {
    const baseFeatures = features.map(f => ({
      name: f.name,
      description: f.description,
    }));

    // Return the appropriate type-specific data with features
    // We use a switch for proper type narrowing
    switch (equipmentType) {
      case 'weapon':
        return {
          ...weaponData,
          features: baseFeatures,
          equipmentType: 'weapon',
          isHomebrew: true,
        } as EquipmentFormData;
      case 'armor':
        return {
          ...armorData,
          features: baseFeatures,
          equipmentType: 'armor',
          isHomebrew: true,
        } as EquipmentFormData;
      case 'wheelchair':
        return {
          ...wheelchairData,
          features: baseFeatures,
          equipmentType: 'wheelchair',
          isHomebrew: true,
        } as EquipmentFormData;
      case 'custom':
        return {
          ...customData,
          features: baseFeatures,
          equipmentType: 'custom',
          isHomebrew: true,
        } as EquipmentFormData;
    }
  }, [
    equipmentType,
    weaponData,
    armorData,
    wheelchairData,
    customData,
    features,
  ]);

  const currentDescription = useMemo((): string => {
    const descMap: Record<typeof equipmentType, string> = {
      weapon: weaponData.description ?? '',
      armor: armorData.description ?? '',
      wheelchair: wheelchairData.description ?? '',
      custom: customData.description ?? '',
    };
    return descMap[equipmentType];
  }, [
    equipmentType,
    weaponData.description,
    armorData.description,
    wheelchairData.description,
    customData.description,
  ]);

  const isSubmitDisabled = useMemo((): boolean => {
    const nameMap: Record<typeof equipmentType, string> = {
      weapon: weaponData.name,
      armor: armorData.name,
      wheelchair: wheelchairData.name,
      custom: customData.name,
    };
    return !nameMap[equipmentType].trim();
  }, [
    equipmentType,
    weaponData.name,
    armorData.name,
    wheelchairData.name,
    customData.name,
  ]);

  return {
    currentData,
    currentDescription,
    isSubmitDisabled,
  };
}

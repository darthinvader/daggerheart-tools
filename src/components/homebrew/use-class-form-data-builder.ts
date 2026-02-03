/**
 * Hook for building ClassFormData from component state
 * Extracted to reduce complexity of use-class-form-state
 */
import { useMemo } from 'react';

import type { ClassFormData } from './class-form';
import type {
  EquipmentState,
  FeatureState,
  SubclassState,
} from './use-class-form-arrays';

interface ClassFormDataBuilderInput {
  formData: ClassFormData;
  selectedDomains: string[];
  classItems: string[];
  classFeatures: FeatureState[];
  backgroundQuestions: string[];
  connections: string[];
  startingEquipment: EquipmentState[];
  subclasses: SubclassState[];
}

/**
 * Builds the complete ClassFormData from all form state pieces
 */
export function useClassFormDataBuilder(
  input: ClassFormDataBuilderInput
): ClassFormData {
  const {
    formData,
    selectedDomains,
    classItems,
    classFeatures,
    backgroundQuestions,
    connections,
    startingEquipment,
    subclasses,
  } = input;

  return useMemo((): ClassFormData => {
    return {
      ...formData,
      domains: selectedDomains,
      classItems: classItems.filter(c => c.trim()),
      classFeatures: classFeatures.map(f => ({
        name: f.name,
        description: f.description,
        modifiers: f.modifiers,
      })),
      backgroundQuestions: backgroundQuestions.filter(q => q.trim()),
      connections: connections.filter(c => c.trim()),
      startingEquipment: startingEquipment
        .filter(e => e.name.trim())
        .map(e => ({
          name: e.name,
          description: e.description || undefined,
        })),
      subclasses: subclasses.map(s => ({
        name: s.name,
        description: s.description,
        spellcastTrait: s.spellcastTrait,
        features: s.features.map(f => ({
          name: f.name,
          description: f.description,
          type: f.type,
          level: f.level,
          modifiers: f.modifiers,
        })),
      })),
      isHomebrew: true,
    };
  }, [
    formData,
    selectedDomains,
    classItems,
    classFeatures,
    backgroundQuestions,
    connections,
    startingEquipment,
    subclasses,
  ]);
}

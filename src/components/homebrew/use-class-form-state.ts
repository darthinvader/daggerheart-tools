/**
 * Hook for managing ClassForm state
 * Consolidates all state management, handlers, and side effects
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ClassFormData } from './class-form';
import {
  useEquipmentArrayState,
  useFeatureArrayState,
  useStringArrayState,
  useSubclassArrayState,
} from './use-class-form-arrays';
import { useClassFormDataBuilder } from './use-class-form-data-builder';
import { useClassFormFieldHandlers } from './use-class-form-field-handlers';

// =====================================================================================
// Hook Types
// =====================================================================================

interface UseClassFormStateProps {
  initialData?: ClassFormData;
  onChange?: (data: ClassFormData) => void;
}

// =====================================================================================
// Default Data
// =====================================================================================

const DEFAULT_FORM_DATA: ClassFormData = {
  name: '',
  description: '',
  domains: ['Arcana', 'Blade'],
  startingHitPoints: 6,
  startingEvasion: 10,
  classItems: [],
  hopeFeature: { name: '', description: '', hopeCost: 3 },
  classFeatures: [],
  backgroundQuestions: [],
  connections: [],
  startingEquipment: [],
  subclasses: [{ name: '', description: '', features: [] }],
  isHomebrew: true,
};

// =====================================================================================
// Main Hook
// =====================================================================================

export function useClassFormState({
  initialData,
  onChange,
}: UseClassFormStateProps) {
  // Core form data
  const [formData, setFormData] = useState<ClassFormData>(
    initialData ?? { ...DEFAULT_FORM_DATA }
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    initialData?.domains ?? ['Arcana', 'Blade']
  );

  // Array states using extracted hooks
  const { items: classItems, setItems: setClassItems } = useStringArrayState(
    initialData?.classItems ?? []
  );

  const { features: classFeatures, setFeatures: setClassFeatures } =
    useFeatureArrayState(initialData?.classFeatures ?? []);

  const { items: backgroundQuestions, setItems: setBackgroundQuestions } =
    useStringArrayState(initialData?.backgroundQuestions ?? []);

  const { items: connections, setItems: setConnections } = useStringArrayState(
    initialData?.connections ?? []
  );

  const { equipment: startingEquipment, setEquipment: setStartingEquipment } =
    useEquipmentArrayState(initialData?.startingEquipment ?? []);

  const {
    subclasses,
    setSubclasses,
    addSubclass,
    updateSubclass,
    removeSubclass,
    addSubclassFeature,
    updateSubclassFeature,
    removeSubclassFeature,
  } = useSubclassArrayState(
    initialData?.subclasses ?? [{ name: '', description: '', features: [] }]
  );

  // Build current data using extracted hook
  const currentData = useClassFormDataBuilder({
    formData,
    selectedDomains,
    classItems,
    classFeatures,
    backgroundQuestions,
    connections,
    startingEquipment,
    subclasses,
  });

  // Track previous data to avoid notifying on unchanged values
  const prevDataRef = useRef<string | undefined>(undefined);
  // Store onChange in ref to avoid dependency on unstable callback reference
  const onChangeRef = useRef(onChange);

  // Update ref in effect to satisfy react-hooks/refs rule
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Auto-notify on data changes (for inline mode)
  useEffect(() => {
    const serialized = JSON.stringify(currentData);
    if (onChangeRef.current && serialized !== prevDataRef.current) {
      prevDataRef.current = serialized;
      onChangeRef.current(currentData);
    }
  }, [currentData]);

  // Domain toggle handler
  const toggleDomain = useCallback((domain: string) => {
    setSelectedDomains(prev => {
      const newDomains = prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : prev.length < 2
          ? [...prev, domain]
          : [prev[1], domain];
      return newDomains;
    });
  }, []);

  // Field handlers (extracted hook)
  const fieldHandlers = useClassFormFieldHandlers(setFormData);

  const handleRemoveSubclass = useCallback(
    (id: string) => {
      if (subclasses.length <= 1) return;
      removeSubclass(id);
    },
    [subclasses.length, removeSubclass]
  );

  return {
    // Core form state
    formData,
    selectedDomains,

    // Array states
    classItems,
    setClassItems,
    classFeatures,
    setClassFeatures,
    backgroundQuestions,
    setBackgroundQuestions,
    connections,
    setConnections,
    startingEquipment,
    setStartingEquipment,

    // Subclass management
    subclasses,
    setSubclasses,
    addSubclass,
    updateSubclass,
    addSubclassFeature,
    updateSubclassFeature,
    removeSubclassFeature,

    // Handlers
    toggleDomain,
    handleNameChange: fieldHandlers.handleNameChange,
    handleDescriptionChange: fieldHandlers.handleDescriptionChange,
    handleHitPointsChange: fieldHandlers.handleHitPointsChange,
    handleEvasionChange: fieldHandlers.handleEvasionChange,
    handleHopeFeatureChange: fieldHandlers.handleHopeFeatureChange,
    handleRemoveSubclass,

    // Computed data
    currentData,
  };
}

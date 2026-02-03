/**
 * Hooks for managing form array state
 *
 * Provides reusable patterns for managing arrays in forms,
 * including string arrays, feature arrays, and equipment arrays.
 */
import { useCallback, useState } from 'react';

// =====================================================================================
// useStringArrayFormState - For managing simple string arrays (tags, items, etc.)
// =====================================================================================

export function useStringArrayFormState(initialValues: string[] = []) {
  const [items, setItems] = useState<string[]>(initialValues);
  const [inputValue, setInputValue] = useState('');

  const addItem = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems(prev => [...prev, trimmed]);
    setInputValue('');
  }, [inputValue, items]);

  const addItemDirect = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || items.includes(trimmed)) return;
      setItems(prev => [...prev, trimmed]);
    },
    [items]
  );

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItem();
      }
    },
    [addItem]
  );

  const getCleanItems = useCallback(() => items.filter(i => i.trim()), [items]);

  return {
    items,
    setItems,
    inputValue,
    setInputValue,
    addItem,
    addItemDirect,
    removeItem,
    handleKeyDown,
    getCleanItems,
  };
}

// =====================================================================================
// useFeatureArrayFormState - For managing feature arrays with id, name, description
// =====================================================================================

export interface FeatureFormState {
  id: string;
  name: string;
  description: string;
  type?: string;
  level?: number;
  modifiers?: unknown;
}

export interface FeatureInput {
  name: string;
  description: string;
  type?: string;
  level?: number;
  modifiers?: unknown;
}

export function useFeatureArrayFormState(
  initialFeatures: FeatureInput[] = [],
  defaultType = 'Feature'
) {
  const [features, setFeatures] = useState<FeatureFormState[]>(
    initialFeatures.map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
      type: f.type ?? defaultType,
      level: f.level,
      modifiers: f.modifiers,
    }))
  );

  const addFeature = useCallback(() => {
    setFeatures(prev => [
      ...prev,
      {
        id: `feature-${Date.now()}`,
        name: '',
        description: '',
        type: defaultType,
      },
    ]);
  }, [defaultType]);

  const addFeatureWithType = useCallback(
    (type: string, defaultLevel?: number) => {
      setFeatures(prev => [
        ...prev,
        {
          id: `feature-${Date.now()}`,
          name: '',
          description: '',
          type,
          level: defaultLevel,
        },
      ]);
    },
    []
  );

  const removeFeature = useCallback((id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  }, []);

  const updateFeature = useCallback(
    (id: string, updates: Partial<FeatureFormState>) => {
      setFeatures(prev =>
        prev.map(f => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const buildFeaturesContent = useCallback((): FeatureInput[] => {
    return features.map(f => ({
      name: f.name,
      description: f.description,
      type: f.type,
      level: f.level,
      modifiers: f.modifiers,
    }));
  }, [features]);

  return {
    features,
    setFeatures,
    addFeature,
    addFeatureWithType,
    removeFeature,
    updateFeature,
    buildFeaturesContent,
  };
}

// =====================================================================================
// useEquipmentArrayFormState - For managing equipment arrays
// =====================================================================================

export interface EquipmentFormState {
  id: string;
  name: string;
  description: string;
}

export interface EquipmentInput {
  name: string;
  description?: string;
}

export function useEquipmentArrayFormState(
  initialEquipment: EquipmentInput[] = []
) {
  const [equipment, setEquipment] = useState<EquipmentFormState[]>(
    initialEquipment.map((e, i) => ({
      id: `equip-${i}`,
      name: e.name,
      description: e.description ?? '',
    }))
  );

  const addEquipment = useCallback(() => {
    setEquipment(prev => [
      ...prev,
      {
        id: `equip-${Date.now()}`,
        name: '',
        description: '',
      },
    ]);
  }, []);

  const removeEquipment = useCallback((id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateEquipment = useCallback(
    (id: string, updates: Partial<EquipmentFormState>) => {
      setEquipment(prev =>
        prev.map(e => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    []
  );

  const buildEquipmentContent = useCallback((): EquipmentInput[] => {
    return equipment
      .filter(e => e.name.trim())
      .map(e => ({
        name: e.name,
        description: e.description || undefined,
      }));
  }, [equipment]);

  return {
    equipment,
    setEquipment,
    addEquipment,
    removeEquipment,
    updateEquipment,
    buildEquipmentContent,
  };
}

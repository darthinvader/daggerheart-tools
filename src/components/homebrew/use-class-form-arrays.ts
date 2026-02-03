/**
 * Hook for managing ClassForm array states
 * Extracts string array, feature array, equipment array, and subclass management
 */
import { useCallback, useState } from 'react';

import type { FeatureStatModifiers } from '@/lib/schemas/core';

// =====================================================================================
// Types
// =====================================================================================

export interface FeatureState {
  id: string;
  name: string;
  description: string;
  modifiers?: FeatureStatModifiers;
}

export interface EquipmentState {
  id: string;
  name: string;
  description: string;
}

export interface SubclassFeatureState {
  id: string;
  name: string;
  description: string;
  type: string;
  level?: number;
  modifiers?: FeatureStatModifiers;
}

export interface SubclassState {
  id: string;
  name: string;
  description: string;
  spellcastTrait?: string;
  features: SubclassFeatureState[];
}

// =====================================================================================
// String Array Hook
// =====================================================================================

export function useStringArrayState(initial: string[]) {
  const [items, setItems] = useState<string[]>(initial);

  const addItem = useCallback((value: string) => {
    if (!value.trim()) return;
    setItems(prev => [...prev, value.trim()]);
  }, []);

  const updateItem = useCallback((index: number, value: string) => {
    setItems(prev => prev.map((item, i) => (i === index ? value : item)));
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  return { items, setItems, addItem, updateItem, removeItem };
}

// =====================================================================================
// Feature Array Hook
// =====================================================================================

export function useFeatureArrayState(
  initial: Array<{
    name: string;
    description: string;
    modifiers?: FeatureStatModifiers;
  }>
) {
  const [features, setFeatures] = useState<FeatureState[]>(
    initial.map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
      modifiers: f.modifiers,
    }))
  );

  const addFeature = useCallback(() => {
    setFeatures(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: '', description: '' },
    ]);
  }, []);

  const updateFeature = useCallback(
    (id: string, updates: Partial<Omit<FeatureState, 'id'>>) => {
      setFeatures(prev =>
        prev.map(f => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const removeFeature = useCallback((id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  }, []);

  return { features, setFeatures, addFeature, updateFeature, removeFeature };
}

// =====================================================================================
// Equipment Array Hook
// =====================================================================================

export function useEquipmentArrayState(
  initial: Array<{ name: string; description?: string }>
) {
  const [equipment, setEquipment] = useState<EquipmentState[]>(
    initial.map((e, i) => ({
      id: `equip-${i}`,
      name: e.name,
      description: e.description ?? '',
    }))
  );

  const addEquipment = useCallback(() => {
    setEquipment(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: '', description: '' },
    ]);
  }, []);

  const updateEquipment = useCallback(
    (id: string, updates: Partial<Omit<EquipmentState, 'id'>>) => {
      setEquipment(prev =>
        prev.map(e => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    []
  );

  const removeEquipment = useCallback((id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
  }, []);

  return {
    equipment,
    setEquipment,
    addEquipment,
    updateEquipment,
    removeEquipment,
  };
}

// =====================================================================================
// Subclass Array Hook
// =====================================================================================

interface SubclassInitial {
  name: string;
  description: string;
  spellcastTrait?: string;
  features?: Array<{
    name: string;
    description: string;
    type?: string;
    level?: number;
    modifiers?: FeatureStatModifiers;
  }>;
}

export function useSubclassArrayState(initial: SubclassInitial[]) {
  const [subclasses, setSubclasses] = useState<SubclassState[]>(
    initial.map((s, i) => ({
      id: `subclass-${i}`,
      name: s.name,
      description: s.description,
      spellcastTrait: s.spellcastTrait,
      features: (s.features ?? []).map((f, j) => ({
        id: `subclass-${i}-feature-${j}`,
        name: f.name,
        description: f.description,
        type: f.type || 'foundation',
        level: f.level,
        modifiers: f.modifiers,
      })),
    }))
  );

  const addSubclass = useCallback(() => {
    setSubclasses(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        features: [],
      },
    ]);
  }, []);

  const updateSubclass = useCallback(
    (id: string, updates: Partial<Omit<SubclassState, 'id' | 'features'>>) => {
      setSubclasses(prev =>
        prev.map(s => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const removeSubclass = useCallback((id: string) => {
    setSubclasses(prev => prev.filter(s => s.id !== id));
  }, []);

  const addSubclassFeature = useCallback((subclassId: string) => {
    setSubclasses(prev =>
      prev.map(s =>
        s.id === subclassId
          ? {
              ...s,
              features: [
                ...s.features,
                {
                  id: crypto.randomUUID(),
                  name: '',
                  description: '',
                  type: 'foundation',
                },
              ],
            }
          : s
      )
    );
  }, []);

  const updateSubclassFeature = useCallback(
    (
      subclassId: string,
      featureId: string,
      updates: Partial<Omit<SubclassFeatureState, 'id'>>
    ) => {
      setSubclasses(prev =>
        prev.map(s =>
          s.id === subclassId
            ? {
                ...s,
                features: s.features.map(f =>
                  f.id === featureId ? { ...f, ...updates } : f
                ),
              }
            : s
        )
      );
    },
    []
  );

  const removeSubclassFeature = useCallback(
    (subclassId: string, featureId: string) => {
      setSubclasses(prev =>
        prev.map(s =>
          s.id === subclassId
            ? { ...s, features: s.features.filter(f => f.id !== featureId) }
            : s
        )
      );
    },
    []
  );

  return {
    subclasses,
    setSubclasses,
    addSubclass,
    updateSubclass,
    removeSubclass,
    addSubclassFeature,
    updateSubclassFeature,
    removeSubclassFeature,
  };
}

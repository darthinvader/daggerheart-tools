/**
 * Item Form State Hooks
 *
 * Extracted state and handlers for ItemForm to reduce complexity.
 */
import { useCallback, useEffect, useState } from 'react';

import type { FeatureStatModifiers } from '@/lib/schemas/core';
import type { Rarity } from '@/lib/schemas/equipment';
import type { ItemCategory } from '@/lib/schemas/homebrew';

/**
 * Data shape that the ItemForm works with.
 */
export interface ItemFormData {
  name: string;
  description: string;
  tier?: string;
  category: ItemCategory;
  rarity: Rarity;
  features: Array<{ name: string; description: string }>;
  value?: string;
  weight?: string;
  modifiers?: FeatureStatModifiers;
  maxQuantity: number;
  isConsumable: boolean;
  isHomebrew: true;
}

export interface FeatureState {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_ITEM_DATA: ItemFormData = {
  name: '',
  description: '',
  category: 'Utility',
  rarity: 'Common',
  features: [],
  maxQuantity: 1,
  isConsumable: false,
  isHomebrew: true,
};

export function useItemFormState(
  initialData?: ItemFormData,
  onChange?: (data: ItemFormData) => void
) {
  const [formData, setFormData] = useState<ItemFormData>(
    initialData ?? DEFAULT_ITEM_DATA
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
    }))
  );

  const buildCurrentData = useCallback((): ItemFormData => {
    return {
      ...formData,
      features: features.map(f => ({
        name: f.name,
        description: f.description,
      })),
      isHomebrew: true,
    };
  }, [formData, features]);

  // Auto-notify on changes (for inline mode)
  useEffect(() => {
    if (onChange) {
      onChange(buildCurrentData());
    }
  }, [formData, features]); // eslint-disable-line react-hooks/exhaustive-deps

  // Field update helpers
  const updateField = useCallback(
    <K extends keyof ItemFormData>(key: K, value: ItemFormData[K]) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateOptionalString = useCallback(
    (key: 'tier' | 'value' | 'weight', value: string) => {
      setFormData(prev => ({
        ...prev,
        [key]: value || undefined,
      }));
    },
    []
  );

  const updateMaxQuantity = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      maxQuantity: Math.max(1, parseInt(value, 10) || 1),
    }));
  }, []);

  const toggleConsumable = useCallback((checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isConsumable: checked,
    }));
  }, []);

  // Feature management
  const addFeature = useCallback(() => {
    setFeatures(prev => [
      ...prev,
      { id: `feature-${Date.now()}`, name: '', description: '' },
    ]);
  }, []);

  const removeFeature = useCallback((id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  }, []);

  const updateFeature = useCallback(
    (id: string, updates: Partial<FeatureState>) => {
      setFeatures(prev =>
        prev.map(f => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  return {
    formData,
    features,
    buildCurrentData,
    updateField,
    updateOptionalString,
    updateMaxQuantity,
    toggleConsumable,
    addFeature,
    removeFeature,
    updateFeature,
    setFormData,
  };
}

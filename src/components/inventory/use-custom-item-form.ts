import { useCallback, useMemo, useState } from 'react';

import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';

import type { ItemCategory } from './constants';

interface Feature {
  name: string;
  description: string;
}

interface FormState {
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  tier: EquipmentTier;
  description: string;
  features: Feature[];
  maxQuantity: number;
  isConsumable: boolean;
}

const INITIAL_STATE: FormState = {
  name: '',
  category: 'Utility',
  rarity: 'Common',
  tier: '1',
  description: '',
  features: [],
  maxQuantity: 1,
  isConsumable: false,
};

function itemToFormState(item: AnyItem): FormState {
  return {
    name: item.name,
    category:
      ((item as { category?: string }).category as ItemCategory) ?? 'Utility',
    rarity: (item.rarity as Rarity) ?? 'Common',
    tier: (item.tier as EquipmentTier) ?? '1',
    description: (item as { description?: string }).description ?? '',
    features: item.features ?? [],
    maxQuantity: item.maxQuantity ?? 1,
    isConsumable: (item as { isConsumable?: boolean }).isConsumable ?? false,
  };
}

export function useCustomItemForm(initialItem: AnyItem | null | undefined) {
  const derivedInitial = useMemo(
    () => (initialItem ? itemToFormState(initialItem) : INITIAL_STATE),
    [initialItem]
  );

  const [state, setState] = useState<FormState>(derivedInitial);
  const [lastInitialItem, setLastInitialItem] = useState(initialItem);

  if (initialItem !== lastInitialItem) {
    setLastInitialItem(initialItem);
    setState(derivedInitial);
  }

  const setField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setState(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const addFeature = useCallback(() => {
    setState(prev => ({
      ...prev,
      features: [...prev.features, { name: '', description: '' }],
    }));
  }, []);

  const updateFeature = useCallback(
    (idx: number, field: 'name' | 'description', value: string) => {
      setState(prev => ({
        ...prev,
        features: prev.features.map((f, i) =>
          i === idx ? { ...f, [field]: value } : f
        ),
      }));
    },
    []
  );

  const removeFeature = useCallback((idx: number) => {
    setState(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const buildItem = useCallback((): AnyItem => {
    const validFeatures = state.features.filter(
      f => f.name.trim() && f.description.trim()
    );
    return {
      name: state.name.trim(),
      tier: state.tier,
      rarity: state.rarity,
      category: state.category,
      description: state.description.trim() || undefined,
      features: validFeatures,
      isConsumable: state.isConsumable,
      maxQuantity: state.maxQuantity,
    } as AnyItem;
  }, [state]);

  return {
    ...state,
    setField,
    addFeature,
    updateFeature,
    removeFeature,
    reset,
    buildItem,
    isValid: state.name.trim().length > 0,
  };
}

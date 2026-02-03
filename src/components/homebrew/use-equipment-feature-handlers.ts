/**
 * Equipment Feature Handlers Hook
 *
 * Manages feature array state with add/remove/update operations.
 */
import { useCallback, useState } from 'react';

import type { EquipmentFeatureState } from './equipment-form-sections';

interface InitialFeature {
  name: string;
  description: string;
}

export function useEquipmentFeatureHandlers(
  initialFeatures: InitialFeature[] = []
) {
  const [features, setFeatures] = useState<EquipmentFeatureState[]>(
    initialFeatures.map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
    }))
  );

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
    (id: string, updates: Partial<EquipmentFeatureState>) => {
      setFeatures(prev =>
        prev.map(f => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  return {
    features,
    setFeatures,
    addFeature,
    removeFeature,
    updateFeature,
  };
}

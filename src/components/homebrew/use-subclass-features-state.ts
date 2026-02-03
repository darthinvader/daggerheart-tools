/**
 * Hook for managing features state in subclass form
 *
 * Extracts feature-related state and handlers from SubclassForm
 * to reduce component complexity.
 */
import { useCallback, useState } from 'react';

import type { SubclassFeature } from '@/lib/schemas/core';

export interface FeatureState {
  id: string;
  name: string;
  description: string;
  type: string;
  level?: number;
}

function getDefaultLevel(type: string): number {
  switch (type) {
    case 'foundation':
      return 1;
    case 'specialization':
      return 5;
    case 'mastery':
      return 9;
    default:
      return 1;
  }
}

export function useSubclassFeaturesState(initialFeatures?: SubclassFeature[]) {
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialFeatures ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
      type: f.type ?? 'foundation',
      level: f.level,
    }))
  );

  const addFeature = useCallback((type: string) => {
    setFeatures(prev => [
      ...prev,
      {
        id: `feature-${Date.now()}`,
        name: '',
        description: '',
        type,
        level: getDefaultLevel(type),
      },
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

  /**
   * Build the features content for form submission
   */
  const buildFeaturesContent = useCallback((): SubclassFeature[] => {
    return features.map(f => ({
      name: f.name,
      description: f.description,
      type: f.type,
      level: f.level,
    })) as SubclassFeature[];
  }, [features]);

  return {
    features,
    addFeature,
    removeFeature,
    updateFeature,
    buildFeaturesContent,
  };
}

/**
 * Hook for managing adversary form state
 *
 * Extracts features, experiences, and tags state management
 * from AdversaryForm to reduce component complexity.
 */
import { useCallback, useState } from 'react';

export interface AdversaryFeatureState {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface AdversaryFeatureInput {
  name: string;
  type?: string;
  description?: string;
}

function parseStringFeature(str: string): Omit<AdversaryFeatureState, 'id'> {
  // Pattern: "Type: Name - Description" or "Type: Name. Description"
  const colonPattern =
    /^(Passive|Action|Reaction|Feature):\s*(.+?)(?:\s*[-–]\s*(.+)|\.?\s*$)/i;
  const colonMatch = str.match(colonPattern);
  if (colonMatch) {
    return {
      type:
        colonMatch[1].charAt(0).toUpperCase() +
        colonMatch[1].slice(1).toLowerCase(),
      name: colonMatch[2].trim(),
      description: colonMatch[3]?.trim() ?? '',
    };
  }

  // Pattern: "Name - Description" (no type prefix)
  const simpleMatch = str.match(/^(.+?)\s*[-–]\s*(.+)$/);
  if (simpleMatch) {
    return {
      name: simpleMatch[1].trim(),
      type: 'Feature',
      description: simpleMatch[2].trim(),
    };
  }

  // Fallback: entire string is the name
  return { name: str.trim(), type: 'Feature', description: '' };
}

interface UseAdversaryFormStateParams {
  initialFeatures?: (string | AdversaryFeatureInput)[];
  initialExperiences?: (string | { name: string })[];
  initialTags?: string[];
}

function initializeFeatures(
  raw: (string | AdversaryFeatureInput)[] | undefined
): AdversaryFeatureState[] {
  return (raw ?? []).map((f, i) => {
    if (typeof f === 'string') {
      const parsed = parseStringFeature(f);
      return { id: `feature-${i}`, ...parsed };
    }
    return {
      id: `feature-${i}`,
      name: f.name,
      type: f.type ?? 'Feature',
      description: f.description ?? '',
    };
  });
}

function initializeExperiences(
  raw: (string | { name: string })[] | undefined
): string[] {
  return (raw ?? []).map(e => (typeof e === 'string' ? e : e.name));
}

function buildFeaturesFromState(
  features: AdversaryFeatureState[]
): Omit<AdversaryFeatureState, 'id'>[] {
  return features.map(f => ({
    name: f.name,
    type: f.type,
    description: f.description,
  }));
}

function filterNonEmptyExperiences(experiences: string[]): string[] {
  return experiences.filter(e => e.trim());
}

export function useAdversaryFormState({
  initialFeatures,
  initialExperiences,
  initialTags,
}: UseAdversaryFormStateParams = {}) {
  // Features state
  const [features, setFeatures] = useState<AdversaryFeatureState[]>(() =>
    initializeFeatures(initialFeatures)
  );

  // Experiences state
  const [experiences, setExperiences] = useState<string[]>(() =>
    initializeExperiences(initialExperiences)
  );

  // Tags state
  const [tags, setTags] = useState<string[]>(initialTags ?? []);
  const [newTag, setNewTag] = useState('');

  // Custom experience input state
  const [customExperience, setCustomExperience] = useState('');

  // Feature handlers
  const addFeature = useCallback(() => {
    setFeatures(prev => [
      ...prev,
      {
        id: `feature-${Date.now()}`,
        name: '',
        type: 'Feature',
        description: '',
      },
    ]);
  }, []);

  const removeFeature = useCallback((id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  }, []);

  const updateFeature = useCallback(
    (id: string, updates: Partial<AdversaryFeatureState>) => {
      setFeatures(prev =>
        prev.map(f => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  // Experience handlers
  const addExperience = useCallback(
    (name: string) => {
      if (name.trim() && !experiences.includes(name.trim())) {
        setExperiences(prev => [...prev, name.trim()]);
      }
    },
    [experiences]
  );

  const removeExperience = useCallback((index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddCustomExperience = useCallback(() => {
    if (customExperience.trim()) {
      addExperience(customExperience.trim());
      setCustomExperience('');
    }
  }, [customExperience, addExperience]);

  // Tag handlers
  const addTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);

  // Build content for submission
  const buildFeaturesContent = useCallback(
    () => buildFeaturesFromState(features),
    [features]
  );

  const getExperiencesContent = useCallback(
    () => filterNonEmptyExperiences(experiences),
    [experiences]
  );

  return {
    featureState: { features, addFeature, removeFeature, updateFeature },
    experienceState: {
      experiences,
      customExperience,
      setCustomExperience,
      addExperience,
      removeExperience,
    },
    tagState: { tags, newTag, setNewTag, addTag, removeTag },
    handleAddCustomExperience,
    buildFeaturesContent,
    getExperiencesContent,
  };
}

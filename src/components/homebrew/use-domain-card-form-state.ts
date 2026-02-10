/**
 * Domain Card Form State Hooks
 *
 * Extracted state and handlers for DomainCardForm to reduce complexity.
 */
import { useCallback, useState } from 'react';

import type { FeatureStatModifiers } from '@/lib/schemas/core';
import type { HomebrewDomainCard } from '@/lib/schemas/homebrew';
import { createDefaultDomainCardContent } from '@/lib/schemas/homebrew';

type DomainCardContent = HomebrewDomainCard['content'];

// =====================================
// Tag Management Hook
// =====================================
export function useTagManagement(initialTags: string[] = []) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');

  const addTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);

  const addSuggestion = useCallback(
    (tag: string) => {
      if (!tags.includes(tag)) {
        setTags(prev => [...prev, tag]);
      }
    },
    [tags]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  return {
    tags,
    newTag,
    setNewTag,
    addTag,
    removeTag,
    addSuggestion,
    handleKeyDown,
  };
}

// =====================================
// Modifier Management Hook
// =====================================
export function useModifierManagement(
  initialModifiers?: Partial<FeatureStatModifiers>
) {
  const [hasModifiers, setHasModifiers] = useState(!!initialModifiers);
  const [modifiers, setModifiers] = useState<Partial<FeatureStatModifiers>>(
    initialModifiers ?? {}
  );

  const updateModifier = useCallback((key: string, value: string) => {
    setModifiers(prev => ({
      ...prev,
      [key]: parseInt(value, 10) || 0,
    }));
  }, []);

  const getModifierValue = useCallback(
    (key: string): string => {
      return String(modifiers[key as keyof FeatureStatModifiers] ?? 0);
    },
    [modifiers]
  );

  const cleanModifiers = useCallback((): FeatureStatModifiers | undefined => {
    if (!hasModifiers) return undefined;

    const cleaned = Object.fromEntries(
      Object.entries(modifiers).filter(([, v]) => v !== undefined && v !== 0)
    );

    return Object.keys(cleaned).length > 0
      ? (cleaned as FeatureStatModifiers)
      : undefined;
  }, [hasModifiers, modifiers]);

  /** Accepts the FeatureModifiersSection's onChange signature */
  const setFromFeatureModifiers = useCallback(
    (newModifiers: FeatureStatModifiers | undefined) => {
      if (newModifiers) {
        setHasModifiers(true);
        setModifiers(newModifiers);
      } else {
        setHasModifiers(false);
        setModifiers({});
      }
    },
    []
  );

  return {
    hasModifiers,
    setHasModifiers,
    modifiers,
    updateModifier,
    getModifierValue,
    cleanModifiers,
    setFromFeatureModifiers,
  };
}

// =====================================
// Form Data Management Hook
// =====================================
export function useDomainCardFormData(initialData?: DomainCardContent) {
  const [formData, setFormData] = useState<DomainCardContent>(
    initialData ?? createDefaultDomainCardContent()
  );

  const updateField = useCallback((key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateOptionalNumber = useCallback((key: string, value: string) => {
    const validKeys = ['hopeCost', 'stressCost', 'recallCost'] as const;
    if (!validKeys.includes(key as (typeof validKeys)[number])) return;
    setFormData(prev => ({
      ...prev,
      [key]: value ? parseInt(value, 10) : undefined,
    }));
  }, []);

  return {
    formData,
    updateField,
    updateOptionalNumber,
  };
}

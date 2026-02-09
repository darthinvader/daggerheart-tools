/**
 * Hook for managing CustomAdversaryBuilder state
 * Extracted to reduce component complexity
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Adversary } from '@/lib/schemas/adversaries';

import { ROLE_CARD_COLORS, ROLE_POINT_COSTS } from './adversary-card-shared';
import type { CustomAdversaryState } from './custom-adversary-builder-sections';
import {
  getInitialState,
  TIER_DEFAULTS,
} from './custom-adversary-builder-sections';

// --- Pure helpers ---

function buildAdversaryFromState(state: CustomAdversaryState): Adversary {
  return {
    name: state.name || 'Custom Adversary',
    description: state.description || 'A custom adversary.',
    tier: state.tier,
    role: state.role,
    hp: state.hp,
    stress: state.stress,
    difficulty: state.difficulty,
    thresholds: {
      major: state.thresholdMajor,
      severe: state.thresholdSevere,
      massive: state.thresholdMassive ?? undefined,
    },
    attack: {
      name: state.attackName || 'Attack',
      modifier: state.attackModifier || '+0',
      range: state.attackRange || 'Melee',
      damage: state.attackDamage || 'd6 phy',
    },
    motivesAndTactics: state.motivesAndTactics || undefined,
    experiences: state.experiences,
    features: state.features.map(f => ({
      name: f.name,
      type: f.type,
      description: f.description,
    })),
  };
}

function addToList<T>(list: T[], item: T): T[] {
  return [...list, item];
}

function removeAtIndex<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

interface UseCustomAdversaryBuilderStateProps {
  onSave: (adversary: Adversary) => void;
  onOpenChange: (open: boolean) => void;
  open?: boolean;
}

export function useCustomAdversaryBuilderState({
  onSave,
  onOpenChange,
  open,
}: UseCustomAdversaryBuilderStateProps) {
  const [state, setState] = useState<CustomAdversaryState>(getInitialState());
  const [newExperience, setNewExperience] = useState('');
  const [newFeature, setNewFeature] = useState({
    name: '',
    type: 'Action',
    description: '',
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // Defer state updates to avoid synchronous setState in effect warning
      const timer = setTimeout(() => {
        setState(getInitialState());
        setNewExperience('');
        setNewFeature({ name: '', type: 'Action', description: '' });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const updateField = useCallback(
    <K extends keyof CustomAdversaryState>(
      field: K,
      value: CustomAdversaryState[K]
    ) => {
      setState(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleTierChange = useCallback((tier: Adversary['tier']) => {
    const defaults = TIER_DEFAULTS[tier];
    setState(prev => ({
      ...prev,
      tier,
      hp: defaults.hp,
      stress: defaults.stress,
      difficulty: defaults.difficulty,
      thresholdMajor: defaults.major,
      thresholdSevere: defaults.severe,
    }));
  }, []);

  // --- Experience list callbacks ---
  const addExperience = useCallback(() => {
    const trimmed = newExperience.trim();
    if (trimmed) {
      setState(prev => ({
        ...prev,
        experiences: addToList(prev.experiences, trimmed),
      }));
      setNewExperience('');
    }
  }, [newExperience]);

  const removeExperience = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      experiences: removeAtIndex(prev.experiences, index),
    }));
  }, []);

  // --- Feature list callbacks ---
  const addFeature = useCallback(() => {
    if (newFeature.name.trim()) {
      setState(prev => ({
        ...prev,
        features: addToList(prev.features, { ...newFeature }),
      }));
      setNewFeature({ name: '', type: 'Action', description: '' });
    }
  }, [newFeature]);

  const removeFeature = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      features: removeAtIndex(prev.features, index),
    }));
  }, []);

  const updateNewFeature = useCallback(
    (partial: Partial<typeof newFeature>) => {
      setNewFeature(prev => ({ ...prev, ...partial }));
    },
    []
  );

  // --- Save handler ---
  const handleSave = useCallback(() => {
    onSave(buildAdversaryFromState(state));
    setState(getInitialState());
    onOpenChange(false);
  }, [state, onSave, onOpenChange]);

  // Computed values
  const roleColors = useMemo(
    () =>
      ROLE_CARD_COLORS[state.role] ?? {
        border: 'border-gray-500',
        bg: 'bg-gray-500/5',
        badge: 'bg-gray-500/20 text-gray-700',
      },
    [state.role]
  );

  const pointCost = useMemo(
    () => ROLE_POINT_COSTS[state.role] ?? 2,
    [state.role]
  );

  const isValid = useMemo(() => state.name.trim().length > 0, [state.name]);

  return {
    // State
    state,
    newExperience,
    newFeature,

    // State setters
    setNewExperience,
    updateNewFeature,

    // Handlers
    updateField,
    handleTierChange,
    addExperience,
    removeExperience,
    addFeature,
    removeFeature,
    handleSave,

    // Computed values
    roleColors,
    pointCost,
    isValid,
  };
}

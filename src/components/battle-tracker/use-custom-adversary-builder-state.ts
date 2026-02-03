/**
 * Hook for managing CustomAdversaryBuilder state
 * Extracted to reduce component complexity
 */
import { useCallback, useMemo, useState } from 'react';

import type { Adversary } from '@/lib/schemas/adversaries';

import { ROLE_CARD_COLORS, ROLE_POINT_COSTS } from './adversary-card-shared';
import {
  type CustomAdversaryState,
  getInitialState,
  TIER_DEFAULTS,
} from './custom-adversary-builder-sections';

interface UseCustomAdversaryBuilderStateProps {
  onSave: (adversary: Adversary) => void;
  onOpenChange: (open: boolean) => void;
}

export function useCustomAdversaryBuilderState({
  onSave,
  onOpenChange,
}: UseCustomAdversaryBuilderStateProps) {
  const [state, setState] = useState<CustomAdversaryState>(getInitialState());
  const [newExperience, setNewExperience] = useState('');
  const [newFeature, setNewFeature] = useState({
    name: '',
    type: 'Action',
    description: '',
  });

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

  const addExperience = useCallback(() => {
    if (newExperience.trim()) {
      setState(prev => ({
        ...prev,
        experiences: [...prev.experiences, newExperience.trim()],
      }));
      setNewExperience('');
    }
  }, [newExperience]);

  const removeExperience = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  }, []);

  const addFeature = useCallback(() => {
    if (newFeature.name.trim()) {
      setState(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }],
      }));
      setNewFeature({ name: '', type: 'Action', description: '' });
    }
  }, [newFeature]);

  const removeFeature = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }, []);

  const updateNewFeature = useCallback(
    (partial: Partial<typeof newFeature>) => {
      setNewFeature(prev => ({ ...prev, ...partial }));
    },
    []
  );

  const handleSave = useCallback(() => {
    const adversary: Adversary = {
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
    onSave(adversary);
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

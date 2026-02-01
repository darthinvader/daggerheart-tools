import { useEffect, useState } from 'react';

import {
  getAttackState,
  getFeaturesState,
  getSourceAttackState,
  getSourceThresholdState,
  getThresholdState,
  mapAdversaryFeatures,
} from './edit-adversary-dialog-utils';
import type { AdversaryFeatureOverride, AdversaryTracker } from './types';

export type AdversaryEditorState = {
  hp: number;
  hpMax: number;
  stress: number;
  stressMax: number;
  difficulty: number;
  notes: string;
  countdown: number;
  attackName: string;
  attackModifier: string;
  attackRange: string;
  attackDamage: string;
  thresholdMajor: number;
  thresholdSevere: number;
  thresholdMassive: number | null;
  features: AdversaryFeatureOverride[];
  newFeatureName: string;
  newFeatureType: string;
  newFeatureDesc: string;
};

export type AdversaryEditorActions = {
  setHp: (value: number) => void;
  setHpMax: (value: number) => void;
  setStress: (value: number) => void;
  setStressMax: (value: number) => void;
  setDifficulty: (value: number) => void;
  setNotes: (value: string) => void;
  setCountdown: (value: number) => void;
  setAttackName: (value: string) => void;
  setAttackModifier: (value: string) => void;
  setAttackRange: (value: string) => void;
  setAttackDamage: (value: string) => void;
  setThresholdMajor: (value: number) => void;
  setThresholdSevere: (value: number) => void;
  setThresholdMassive: (value: number | null) => void;
  setFeatures: (value: AdversaryFeatureOverride[]) => void;
  setNewFeatureName: (value: string) => void;
  setNewFeatureType: (value: string) => void;
  setNewFeatureDesc: (value: string) => void;
  addFeature: () => void;
  removeFeature: (id: string) => void;
  resetToOriginal: () => void;
};

function getInitialState(
  adversary: AdversaryTracker | null
): AdversaryEditorState {
  const initialAttack = getAttackState(adversary);
  const initialThresholds = getThresholdState(adversary);

  return {
    hp: adversary?.hp.current ?? 0,
    hpMax: adversary?.hp.max ?? 0,
    stress: adversary?.stress.current ?? 0,
    stressMax: adversary?.stress.max ?? 0,
    difficulty:
      adversary?.difficultyOverride ?? adversary?.source.difficulty ?? 0,
    notes: adversary?.notes ?? '',
    countdown: adversary?.countdown ?? 0,
    attackName: initialAttack.name,
    attackModifier: initialAttack.modifier,
    attackRange: initialAttack.range,
    attackDamage: initialAttack.damage,
    thresholdMajor: initialThresholds.major,
    thresholdSevere: initialThresholds.severe,
    thresholdMassive: initialThresholds.massive,
    features: getFeaturesState(adversary),
    newFeatureName: '',
    newFeatureType: 'Passive',
    newFeatureDesc: '',
  };
}

export function useAdversaryEditorState(
  adversary: AdversaryTracker | null,
  isOpen: boolean
): { state: AdversaryEditorState; actions: AdversaryEditorActions } {
  const [state, setState] = useState(() => getInitialState(adversary));

  const setField = <K extends keyof AdversaryEditorState>(
    key: K,
    value: AdversaryEditorState[K]
  ) => setState(prev => ({ ...prev, [key]: value }));

  /* eslint-disable react-hooks/set-state-in-effect -- Syncing local state from props when dialog opens is a valid pattern */
  useEffect(() => {
    if (!adversary || !isOpen) return;
    setState(getInitialState(adversary));
  }, [adversary, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const addFeature = () => {
    if (!state.newFeatureName.trim()) return;
    const nextFeature: AdversaryFeatureOverride = {
      id: `custom-${Date.now()}`,
      name: state.newFeatureName.trim(),
      type: state.newFeatureType,
      description: state.newFeatureDesc.trim(),
      isCustom: true,
    };
    setState(prev => ({
      ...prev,
      features: [...prev.features, nextFeature],
      newFeatureName: '',
      newFeatureDesc: '',
    }));
  };

  const removeFeature = (id: string) => {
    setState(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== id),
    }));
  };

  const resetToOriginal = () => {
    if (!adversary) return;
    const attackState = getSourceAttackState(adversary);
    const thresholdState = getSourceThresholdState(adversary);
    setState(prev => ({
      ...prev,
      difficulty: adversary.source.difficulty,
      attackName: attackState.name,
      attackModifier: attackState.modifier,
      attackRange: attackState.range,
      attackDamage: attackState.damage,
      thresholdMajor: thresholdState.major,
      thresholdSevere: thresholdState.severe,
      thresholdMassive: thresholdState.massive,
      features: mapAdversaryFeatures(adversary.source.features),
    }));
  };

  return {
    state,
    actions: {
      setHp: value => setField('hp', value),
      setHpMax: value => setField('hpMax', value),
      setStress: value => setField('stress', value),
      setStressMax: value => setField('stressMax', value),
      setDifficulty: value => setField('difficulty', value),
      setNotes: value => setField('notes', value),
      setCountdown: value => setField('countdown', value),
      setAttackName: value => setField('attackName', value),
      setAttackModifier: value => setField('attackModifier', value),
      setAttackRange: value => setField('attackRange', value),
      setAttackDamage: value => setField('attackDamage', value),
      setThresholdMajor: value => setField('thresholdMajor', value),
      setThresholdSevere: value => setField('thresholdSevere', value),
      setThresholdMassive: value => setField('thresholdMassive', value),
      setFeatures: value => setField('features', value),
      setNewFeatureName: value => setField('newFeatureName', value),
      setNewFeatureType: value => setField('newFeatureType', value),
      setNewFeatureDesc: value => setField('newFeatureDesc', value),
      addFeature,
      removeFeature,
      resetToOriginal,
    },
  };
}

import { useId, useMemo, useState } from 'react';

import { useThresholdHandlers } from './use-threshold-handlers';

function computeAutoThresholds(baseHp: number) {
  const major = Math.max(1, Math.floor(baseHp / 6));
  const severe = Math.max(major + 1, Math.floor(baseHp / 3));
  const massiveDamage = severe * 2;
  return { major, severe, massiveDamage };
}

export interface ThresholdsEditorState {
  major: number;
  severe: number;
  massiveDamage?: number;
  autoCalculate?: boolean;
  autoCalculateMassiveDamage?: boolean;
  showMassiveDamage?: boolean;
  baseHp?: number;
}

export interface ThresholdsEditorCallbacks {
  onMajorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMassiveDamageChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onAutoCalculateMassiveDamageChange?: (value: boolean) => void;
  onShowMassiveDamageChange?: (value: boolean) => void;
}

export function useThresholdsEditorState(
  state: ThresholdsEditorState,
  callbacks: ThresholdsEditorCallbacks
) {
  const {
    major,
    severe,
    massiveDamage,
    autoCalculate = true,
    autoCalculateMassiveDamage = true,
    showMassiveDamage = false,
    baseHp = 6,
  } = state;
  const {
    onMajorChange,
    onSevereChange,
    onMassiveDamageChange,
    onAutoCalculateChange,
    onAutoCalculateMassiveDamageChange,
    onShowMassiveDamageChange,
  } = callbacks;

  const baseId = useId();
  const ids = useMemo(
    () => ({
      auto: `${baseId}-auto`,
      autoMassiveDamage: `${baseId}-auto-massive-damage`,
      massiveDamage: `${baseId}-massive-damage`,
      majorInput: `${baseId}-major`,
      severeInput: `${baseId}-severe`,
      massiveDamageInput: `${baseId}-massive-damage-input`,
      error: `${baseId}-error`,
    }),
    [baseId]
  );

  const [localMajor, setLocalMajor] = useState(String(major));
  const [localSevere, setLocalSevere] = useState(String(severe));
  const [localMassiveDamage, setLocalMassiveDamage] = useState(
    String(massiveDamage ?? severe * 2)
  );

  const autoThresholds = useMemo(() => computeAutoThresholds(baseHp), [baseHp]);
  const effectiveMajor = autoCalculate ? autoThresholds.major : major;
  const effectiveSevere = autoCalculate ? autoThresholds.severe : severe;
  const effectiveMassiveDamage =
    autoCalculate || autoCalculateMassiveDamage
      ? effectiveSevere * 2
      : (massiveDamage ?? severe * 2);

  const validationError = useMemo(() => {
    if (autoCalculate) return null;
    if (effectiveSevere < effectiveMajor) return 'Severe must be ≥ Major';
    if (showMassiveDamage && effectiveMassiveDamage < effectiveSevere)
      return 'Massive Damage must be ≥ Severe';
    return null;
  }, [
    autoCalculate,
    effectiveMajor,
    effectiveSevere,
    effectiveMassiveDamage,
    showMassiveDamage,
  ]);

  const handlers = useThresholdHandlers({
    autoThresholds,
    effectiveSevere,
    setLocalMajor,
    setLocalSevere,
    setLocalMassiveDamage,
    onMajorChange,
    onSevereChange,
    onMassiveDamageChange,
    onAutoCalculateChange,
    onAutoCalculateMassiveDamageChange,
    onShowMassiveDamageChange,
  });

  return {
    ids,
    localMajor,
    localSevere,
    localMassiveDamage,
    effectiveMajor,
    effectiveSevere,
    effectiveMassiveDamage,
    validationError,
    autoCalculate,
    autoCalculateMassiveDamage,
    showMassiveDamage,
    ...handlers,
  };
}

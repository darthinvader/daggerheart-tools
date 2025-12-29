import { useId, useMemo, useState } from 'react';

import { useThresholdHandlers } from './use-threshold-handlers';

function computeAutoThresholds(baseHp: number) {
  const minor = Math.max(1, Math.floor(baseHp / 6));
  const severe = Math.max(minor + 1, Math.floor(baseHp / 3));
  const major = severe * 2;
  return { minor, severe, major };
}

export interface ThresholdsEditorState {
  minor: number;
  severe: number;
  major?: number;
  autoCalculate?: boolean;
  autoCalculateMajor?: boolean;
  showMajor?: boolean;
  baseHp?: number;
}

export interface ThresholdsEditorCallbacks {
  onMinorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMajorChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onAutoCalculateMajorChange?: (value: boolean) => void;
  onShowMajorChange?: (value: boolean) => void;
}

export function useThresholdsEditorState(
  state: ThresholdsEditorState,
  callbacks: ThresholdsEditorCallbacks
) {
  const {
    minor,
    severe,
    major,
    autoCalculate = true,
    autoCalculateMajor = true,
    showMajor = false,
    baseHp = 6,
  } = state;
  const {
    onMinorChange,
    onSevereChange,
    onMajorChange,
    onAutoCalculateChange,
    onAutoCalculateMajorChange,
    onShowMajorChange,
  } = callbacks;

  const baseId = useId();
  const ids = useMemo(
    () => ({
      auto: `${baseId}-auto`,
      autoMajor: `${baseId}-auto-major`,
      major: `${baseId}-major`,
      minorInput: `${baseId}-minor`,
      severeInput: `${baseId}-severe`,
      majorInput: `${baseId}-major-input`,
      error: `${baseId}-error`,
    }),
    [baseId]
  );

  const [localMinor, setLocalMinor] = useState(String(minor));
  const [localSevere, setLocalSevere] = useState(String(severe));
  const [localMajor, setLocalMajor] = useState(String(major ?? severe * 2));

  const autoThresholds = useMemo(() => computeAutoThresholds(baseHp), [baseHp]);
  const effectiveMinor = autoCalculate ? autoThresholds.minor : minor;
  const effectiveSevere = autoCalculate ? autoThresholds.severe : severe;
  const effectiveMajor =
    autoCalculate || autoCalculateMajor
      ? effectiveSevere * 2
      : (major ?? severe * 2);

  const validationError = useMemo(() => {
    if (autoCalculate) return null;
    if (effectiveSevere < effectiveMinor) return 'Severe must be ≥ Minor';
    if (showMajor && effectiveMajor < effectiveSevere)
      return 'Major must be ≥ Severe';
    return null;
  }, [
    autoCalculate,
    effectiveMinor,
    effectiveSevere,
    effectiveMajor,
    showMajor,
  ]);

  const handlers = useThresholdHandlers({
    autoThresholds,
    effectiveSevere,
    setLocalMinor,
    setLocalSevere,
    setLocalMajor,
    onMinorChange,
    onSevereChange,
    onMajorChange,
    onAutoCalculateChange,
    onAutoCalculateMajorChange,
    onShowMajorChange,
  });

  return {
    ids,
    localMinor,
    localSevere,
    localMajor,
    effectiveMinor,
    effectiveSevere,
    effectiveMajor,
    validationError,
    autoCalculate,
    autoCalculateMajor,
    showMajor,
    ...handlers,
  };
}

import { useCallback, useId, useMemo, useState } from 'react';

interface AutoThresholds {
  minor: number;
  severe: number;
  major: number;
}

function computeAutoThresholds(baseHp: number): AutoThresholds {
  const minor = Math.max(1, Math.floor(baseHp / 6));
  const severe = Math.max(minor + 1, Math.floor(baseHp / 3));
  const major = severe * 2;
  return { minor, severe, major };
}

function validateThresholdInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const num = parseInt(trimmed, 10);
  if (!Number.isFinite(num) || num < 0) return null;
  return num;
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
    if (effectiveSevere < effectiveMinor) {
      return 'Severe must be ≥ Minor';
    }
    if (showMajor && effectiveMajor < effectiveSevere) {
      return 'Major must be ≥ Severe';
    }
    return null;
  }, [
    autoCalculate,
    effectiveMinor,
    effectiveSevere,
    effectiveMajor,
    showMajor,
  ]);

  const handleMinorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMinor(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onMinorChange?.(parsed);
    },
    [onMinorChange]
  );

  const handleSevereChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalSevere(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onSevereChange?.(parsed);
    },
    [onSevereChange]
  );

  const handleMajorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMajor(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onMajorChange?.(parsed);
    },
    [onMajorChange]
  );

  const handleAutoToggle = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      onAutoCalculateChange?.(checked);
      if (checked) {
        setLocalMinor(String(autoThresholds.minor));
        setLocalSevere(String(autoThresholds.severe));
        setLocalMajor(String(autoThresholds.major));
        onMinorChange?.(autoThresholds.minor);
        onSevereChange?.(autoThresholds.severe);
        onMajorChange?.(autoThresholds.major);
      }
    },
    [
      onAutoCalculateChange,
      onMinorChange,
      onSevereChange,
      onMajorChange,
      autoThresholds,
    ]
  );

  const handleShowMajorToggle = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      onShowMajorChange?.(checked);
    },
    [onShowMajorChange]
  );

  const handleAutoMajorToggle = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      onAutoCalculateMajorChange?.(checked);
      if (checked) {
        const newMajor = effectiveSevere * 2;
        setLocalMajor(String(newMajor));
        onMajorChange?.(newMajor);
      }
    },
    [onAutoCalculateMajorChange, onMajorChange, effectiveSevere]
  );

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
    handleMinorChange,
    handleSevereChange,
    handleMajorInputChange,
    handleAutoToggle,
    handleShowMajorToggle,
    handleAutoMajorToggle,
  };
}

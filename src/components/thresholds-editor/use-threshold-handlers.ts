import { useCallback } from 'react';

interface AutoThresholds {
  minor: number;
  severe: number;
  major: number;
}

function validateThresholdInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const num = parseInt(trimmed, 10);
  if (!Number.isFinite(num) || num < 0) return null;
  return num;
}

interface UseThresholdHandlersProps {
  autoThresholds: AutoThresholds;
  effectiveSevere: number;
  setLocalMinor: (v: string) => void;
  setLocalSevere: (v: string) => void;
  setLocalMajor: (v: string) => void;
  onMinorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMajorChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onAutoCalculateMajorChange?: (value: boolean) => void;
  onShowMajorChange?: (value: boolean) => void;
}

export function useThresholdHandlers(props: UseThresholdHandlersProps) {
  const {
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
  } = props;

  const handleMinorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMinor(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onMinorChange?.(parsed);
    },
    [onMinorChange, setLocalMinor]
  );

  const handleSevereChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalSevere(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onSevereChange?.(parsed);
    },
    [onSevereChange, setLocalSevere]
  );

  const handleMajorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMajor(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onMajorChange?.(parsed);
    },
    [onMajorChange, setLocalMajor]
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
      setLocalMinor,
      setLocalSevere,
      setLocalMajor,
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
    [onAutoCalculateMajorChange, onMajorChange, effectiveSevere, setLocalMajor]
  );

  return {
    handleMinorChange,
    handleSevereChange,
    handleMajorInputChange,
    handleAutoToggle,
    handleShowMajorToggle,
    handleAutoMajorToggle,
  };
}

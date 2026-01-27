import { useCallback } from 'react';

interface AutoThresholds {
  major: number;
  severe: number;
  massiveDamage: number;
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
  setLocalMajor: (v: string) => void;
  setLocalSevere: (v: string) => void;
  setLocalMassiveDamage: (v: string) => void;
  onMajorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMassiveDamageChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onAutoCalculateMassiveDamageChange?: (value: boolean) => void;
  onShowMassiveDamageChange?: (value: boolean) => void;
}

export function useThresholdHandlers(props: UseThresholdHandlersProps) {
  const {
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
  } = props;

  const handleMajorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMajor(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onMajorChange?.(parsed);
    },
    [onMajorChange, setLocalMajor]
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

  const handleMassiveDamageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMassiveDamage(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) onMassiveDamageChange?.(parsed);
    },
    [onMassiveDamageChange, setLocalMassiveDamage]
  );

  const handleAutoToggle = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      onAutoCalculateChange?.(checked);
      if (checked) {
        setLocalMajor(String(autoThresholds.major));
        setLocalSevere(String(autoThresholds.severe));
        setLocalMassiveDamage(String(autoThresholds.massiveDamage));
        onMajorChange?.(autoThresholds.major);
        onSevereChange?.(autoThresholds.severe);
        onMassiveDamageChange?.(autoThresholds.massiveDamage);
      }
    },
    [
      onAutoCalculateChange,
      onMajorChange,
      onSevereChange,
      onMassiveDamageChange,
      autoThresholds,
      setLocalMajor,
      setLocalSevere,
      setLocalMassiveDamage,
    ]
  );

  const handleShowMassiveDamageToggle = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      onShowMassiveDamageChange?.(checked);
    },
    [onShowMassiveDamageChange]
  );

  const handleAutoMassiveDamageToggle = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked === 'indeterminate') return;
      onAutoCalculateMassiveDamageChange?.(checked);
      if (checked) {
        const newMassiveDamage = effectiveSevere * 2;
        setLocalMassiveDamage(String(newMassiveDamage));
        onMassiveDamageChange?.(newMassiveDamage);
      }
    },
    [
      onAutoCalculateMassiveDamageChange,
      onMassiveDamageChange,
      effectiveSevere,
      setLocalMassiveDamage,
    ]
  );

  return {
    handleMajorChange,
    handleSevereChange,
    handleMassiveDamageInputChange,
    handleAutoToggle,
    handleShowMassiveDamageToggle,
    handleAutoMassiveDamageToggle,
  };
}

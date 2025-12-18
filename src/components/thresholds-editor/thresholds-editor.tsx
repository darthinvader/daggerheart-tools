import { useCallback, useId, useMemo, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { ThresholdsDisplay } from './thresholds-display';

interface ThresholdsEditorProps {
  minor: number;
  severe: number;
  major?: number;
  autoCalculate?: boolean;
  showMajor?: boolean;
  onMinorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMajorChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onShowMajorChange?: (value: boolean) => void;
  baseHp?: number;
  className?: string;
}

function computeAutoThresholds(baseHp: number) {
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

export function ThresholdsEditor({
  minor,
  severe,
  major,
  autoCalculate = true,
  showMajor = false,
  onMinorChange,
  onSevereChange,
  onMajorChange,
  onAutoCalculateChange,
  onShowMajorChange,
  baseHp = 6,
  className,
}: ThresholdsEditorProps) {
  const baseId = useId();
  const autoId = `${baseId}-auto`;
  const majorId = `${baseId}-major`;
  const minorInputId = `${baseId}-minor`;
  const severeInputId = `${baseId}-severe`;
  const majorInputId = `${baseId}-major-input`;

  const [localMinor, setLocalMinor] = useState(String(minor));
  const [localSevere, setLocalSevere] = useState(String(severe));
  const [localMajor, setLocalMajor] = useState(String(major ?? severe * 2));

  const autoThresholds = useMemo(() => computeAutoThresholds(baseHp), [baseHp]);

  const effectiveMinor = autoCalculate ? autoThresholds.minor : minor;
  const effectiveSevere = autoCalculate ? autoThresholds.severe : severe;
  const effectiveMajor = autoCalculate
    ? autoThresholds.major
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
      if (parsed !== null) {
        onMinorChange?.(parsed);
      }
    },
    [onMinorChange]
  );

  const handleSevereChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalSevere(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) {
        onSevereChange?.(parsed);
      }
    },
    [onSevereChange]
  );

  const handleMajorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalMajor(raw);
      const parsed = validateThresholdInput(raw);
      if (parsed !== null) {
        onMajorChange?.(parsed);
      }
    },
    [onMajorChange]
  );

  const handleAutoToggle = useCallback(
    (checked: boolean) => {
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
    (checked: boolean) => {
      onShowMajorChange?.(checked);
    },
    [onShowMajorChange]
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <ThresholdsDisplay
        minor={effectiveMinor}
        severe={effectiveSevere}
        major={effectiveMajor}
        showMajor={showMajor}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id={autoId}
            checked={autoCalculate}
            onCheckedChange={handleAutoToggle}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor={autoId} className="cursor-pointer">
                Auto-calculate
              </Label>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Automatically calculate thresholds based on your base HP. Minor
                = HP ÷ 6, Severe = HP ÷ 3, Major = Severe × 2.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={majorId}
            checked={showMajor}
            onCheckedChange={handleShowMajorToggle}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor={majorId} className="cursor-pointer">
                Enable Major Damage
              </Label>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Toggle the Major Damage threshold (optional 4th tier). When
                enabled, extremely high damage deals even more HP loss.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {!autoCalculate && (
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            Custom Thresholds
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={minorInputId}
                className="text-amber-700 dark:text-amber-400"
              >
                Minor
              </Label>
              <Input
                id={minorInputId}
                type="number"
                min={1}
                value={localMinor}
                onChange={handleMinorChange}
                className="font-mono"
                aria-describedby={
                  validationError ? `${baseId}-error` : undefined
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor={severeInputId}
                className="text-orange-700 dark:text-orange-400"
              >
                Severe
              </Label>
              <Input
                id={severeInputId}
                type="number"
                min={1}
                value={localSevere}
                onChange={handleSevereChange}
                className="font-mono"
                aria-describedby={
                  validationError ? `${baseId}-error` : undefined
                }
              />
            </div>

            {showMajor && (
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor={majorInputId}
                  className="text-red-700 dark:text-red-400"
                >
                  Major
                </Label>
                <Input
                  id={majorInputId}
                  type="number"
                  min={1}
                  value={localMajor}
                  onChange={handleMajorInputChange}
                  className="font-mono"
                  aria-describedby={
                    validationError ? `${baseId}-error` : undefined
                  }
                />
              </div>
            )}
          </div>

          {validationError && (
            <p
              id={`${baseId}-error`}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {validationError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

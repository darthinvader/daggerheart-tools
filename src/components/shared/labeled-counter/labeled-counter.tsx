import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { CheckboxOption } from './checkbox-option';
import { NumberControl } from './number-control';

export interface LabeledCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  orientation?: 'horizontal' | 'vertical';
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  maxValue?: number;
  onMaxChange?: (value: number) => void;
  maxLabel?: string;
  className?: string;
}

export function LabeledCounter({
  label,
  value,
  onChange,
  min = 0,
  orientation = 'horizontal',
  checkboxLabel,
  checkboxChecked = false,
  onCheckboxChange,
  maxValue,
  onMaxChange,
  maxLabel = 'max',
  className,
}: LabeledCounterProps) {
  const checkboxId = `${label.toLowerCase().replace(/\s+/g, '-')}-checkbox`;
  const hasCheckbox = checkboxLabel && onCheckboxChange;
  const hasMax = maxValue !== undefined && onMaxChange;

  const handleMaxChange = (newMax: number) => {
    if (!onMaxChange) return;
    onMaxChange(newMax);
    if (value > newMax) {
      onChange(newMax);
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <Label className="text-base font-medium">{label}</Label>
        <NumberControl
          value={value}
          onChange={onChange}
          min={min}
          max={hasMax ? maxValue : undefined}
        />
        {hasMax && (
          <NumberControl
            value={maxValue}
            onChange={handleMaxChange}
            min={min}
            size="sm"
            variant="secondary"
            label={maxLabel}
          />
        )}
        {hasCheckbox && (
          <CheckboxOption
            id={checkboxId}
            label={checkboxLabel}
            checked={checkboxChecked}
            onCheckedChange={onCheckboxChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <div className="flex items-center gap-4">
        <div className="flex min-w-24 flex-col gap-1">
          <Label className="text-base font-medium">{label}</Label>
          {hasMax && (
            <span className="text-muted-foreground text-xs">
              {maxLabel}:{maxValue}
            </span>
          )}
          {hasCheckbox && (
            <CheckboxOption
              id={checkboxId}
              label={checkboxLabel}
              checked={checkboxChecked}
              onCheckedChange={onCheckboxChange}
            />
          )}
        </div>
        <NumberControl
          value={value}
          onChange={onChange}
          min={min}
          max={hasMax ? maxValue : undefined}
        />
        {hasMax && (
          <NumberControl
            value={maxValue}
            onChange={handleMaxChange}
            min={min}
            variant="secondary"
          />
        )}
      </div>
    </div>
  );
}

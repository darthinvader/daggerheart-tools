import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface NumberControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'default';
  variant?: 'primary' | 'secondary';
  label?: string;
}

function NumberControl({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  size = 'default',
  variant = 'primary',
  label,
}: NumberControlProps) {
  const buttonSize = size === 'sm' ? 'icon-sm' : 'icon';
  const numberSize = size === 'sm' ? 'w-12 text-sm' : 'w-10 text-base';
  const buttonVariant = variant === 'primary' ? 'outline' : 'ghost';

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrement"
      >
        <Minus className="size-4" />
      </Button>
      <span
        className={cn(
          'text-center font-mono font-semibold tabular-nums',
          numberSize
        )}
      >
        {label ? `${label}:${value}` : value}
      </span>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increment"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}

interface CheckboxOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function CheckboxOption({
  id,
  label,
  checked,
  onCheckedChange,
}: CheckboxOptionProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={val => onCheckedChange(val === true)}
      />
      <Label
        htmlFor={id}
        className="text-muted-foreground cursor-pointer text-sm"
      >
        {label}
      </Label>
    </div>
  );
}

interface LabeledCounterProps {
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

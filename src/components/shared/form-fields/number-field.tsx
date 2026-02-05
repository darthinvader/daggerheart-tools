import { useId } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  /**
   * Shows a red asterisk after the label to indicate required fields.
   */
  required?: boolean;
  error?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  className,
  required,
  error,
}: NumberFieldProps) {
  const generatedId = useId();
  const fieldId = generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <Input
        id={fieldId}
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min}
        max={max}
        required={required}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
      />
      {error && (
        <p id={errorId} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

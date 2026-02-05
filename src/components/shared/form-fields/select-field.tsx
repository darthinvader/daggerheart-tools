import { useId } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
  /**
   * Shows a red asterisk after the label to indicate required fields.
   */
  required?: boolean;
  error?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  required,
  error,
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger
          id={fieldId}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={errorId} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

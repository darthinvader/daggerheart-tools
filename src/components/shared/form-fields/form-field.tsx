import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
  /**
   * Shows a red asterisk after the label to indicate required fields.
   */
  required?: boolean;
}

export function FormField({
  label,
  htmlFor,
  error,
  className,
  children,
  required,
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;

  // Clone the child input element to add aria-describedby and aria-invalid
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: fieldId,
        'aria-describedby': errorId,
        'aria-invalid': error ? true : undefined,
      })
    : children;

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {enhancedChildren}
      {error && (
        <p id={errorId} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

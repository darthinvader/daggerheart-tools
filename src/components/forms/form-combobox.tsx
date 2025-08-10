import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import * as React from 'react';

import { Combobox, type ComboboxItem } from '@/components/ui/combobox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export type FormComboboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label: React.ReactNode;
  items: ComboboxItem[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  emptyMessage?: string;
  /**
   * When true, write null to the form state when the selection is cleared.
   * When false (default), write an empty string '' to keep string-only schemas happy.
   */
  storeNull?: boolean;
  onValueChange?: (next: string | null, prev: string | null) => void;
};

export function FormCombobox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  items,
  disabled,
  className,
  placeholder,
  emptyMessage,
  storeNull = false,
  onValueChange,
}: FormComboboxProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Combobox
              items={items}
              // Normalize form value to UI value. If storing '' for empty, turn it into null for the UI.
              value={(() => {
                const v = field.value as unknown as string | null | undefined;
                if (storeNull) return v ?? null;
                return v === '' || v == null ? null : v;
              })()}
              onChange={v => {
                // v is the UI value (string | null). Translate to form value per storeNull.
                const prevUi = (() => {
                  const pv = field.value as unknown as
                    | string
                    | null
                    | undefined;
                  return pv == null || pv === '' ? null : pv;
                })();
                const nextFormValue = (storeNull ? v : (v ?? '')) as PathValue<
                  TFieldValues,
                  TName
                >;
                field.onChange(nextFormValue);
                field.onBlur();
                onValueChange?.(v, prevUi);
              }}
              disabled={disabled}
              className={className}
              placeholder={placeholder}
              emptyMessage={emptyMessage}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

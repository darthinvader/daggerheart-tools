import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import * as React from 'react';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export type FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label: React.ReactNode;
  placeholder?: string;
  inputMode?: React.ComponentProps<typeof Input>['inputMode'];
  autoComplete?: string;
  disabled?: boolean;
};

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  placeholder,
  inputMode,
  autoComplete,
  disabled,
}: FormInputProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...(field as unknown as React.ComponentProps<typeof Input>)}
              placeholder={placeholder}
              inputMode={inputMode}
              autoComplete={autoComplete}
              disabled={disabled}
              onChange={e =>
                field.onChange(e.target.value as PathValue<TFieldValues, TName>)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

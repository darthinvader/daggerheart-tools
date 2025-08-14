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
  enterKeyHint?: React.ComponentProps<typeof Input>['enterKeyHint'];
  autoComplete?: string;
  disabled?: boolean;
  deferValidation?: boolean; // when true, do not validate on each keystroke
};

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  placeholder,
  inputMode,
  enterKeyHint,
  autoComplete,
  disabled,
  deferValidation,
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
              enterKeyHint={enterKeyHint}
              autoComplete={autoComplete}
              disabled={disabled}
              onChange={e => {
                // Avoid kicking validation on every keystroke when deferred
                const v = e.target.value as PathValue<TFieldValues, TName>;
                if (deferValidation) {
                  // Update value silently; RHF will mark dirty but skip resolver
                  field.onChange(v);
                } else {
                  field.onChange(v);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

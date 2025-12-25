import type { AnyFieldApi } from '@tanstack/react-form';

import { FormField } from '@/components/shared';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
  name: string;
  label: string;
  htmlFor: string;
  placeholder: string;
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
}

export function TextField({
  name,
  label,
  htmlFor,
  placeholder,
  form,
}: TextFieldProps) {
  return (
    <form.Field name={name}>
      {(field: AnyFieldApi) => (
        <FormField
          label={label}
          htmlFor={htmlFor}
          error={field.state.meta.errors.join(', ')}
        >
          <Input
            id={htmlFor}
            placeholder={placeholder}
            value={(field.state.value as string) ?? ''}
            onChange={e => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        </FormField>
      )}
    </form.Field>
  );
}

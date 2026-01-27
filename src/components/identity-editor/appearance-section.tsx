import type { AnyFieldApi } from '@tanstack/react-form';

import { FormField } from '@/components/shared';
import { Input } from '@/components/ui/input';

import { SelectableTraitField } from './selectable-trait-field';
import {
  BODY_SUGGESTIONS,
  CLOTHING_SUGGESTIONS,
  EYE_SUGGESTIONS,
  HAIR_SUGGESTIONS,
  MANNERISM_SUGGESTIONS,
  SKIN_SUGGESTIONS,
} from './trait-suggestions';

interface FormProps {
  Field: React.ComponentType<{
    name: string;
    children: (field: AnyFieldApi) => React.ReactNode;
  }>;
}

interface TextFieldProps {
  name: string;
  label: string;
  htmlFor: string;
  placeholder: string;
  form: FormProps;
}

function TextField({
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

interface AppearanceSectionProps {
  form: FormProps;
}

export function AppearanceSection({ form }: AppearanceSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Physical Appearance</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectableTraitField
          form={form}
          name="descriptionDetails.eyes"
          label="Eyes"
          htmlFor="eyes"
          placeholder="Eye color and appearance"
          suggestions={EYE_SUGGESTIONS}
        />
        <SelectableTraitField
          form={form}
          name="descriptionDetails.hair"
          label="Hair"
          htmlFor="hair"
          placeholder="Hair style and color"
          suggestions={HAIR_SUGGESTIONS}
        />
        <SelectableTraitField
          form={form}
          name="descriptionDetails.skin"
          label="Skin"
          htmlFor="skin"
          placeholder="Skin tone and features"
          suggestions={SKIN_SUGGESTIONS}
        />
        <SelectableTraitField
          form={form}
          name="descriptionDetails.body"
          label="Body"
          htmlFor="body"
          placeholder="Build and stature"
          suggestions={BODY_SUGGESTIONS}
        />
      </div>

      <SelectableTraitField
        form={form}
        name="descriptionDetails.clothing"
        label="Clothing"
        htmlFor="clothing"
        placeholder="Typical attire and style"
        suggestions={CLOTHING_SUGGESTIONS}
      />
      <SelectableTraitField
        form={form}
        name="descriptionDetails.mannerisms"
        label="Mannerisms"
        htmlFor="mannerisms"
        placeholder="Distinctive habits or behaviors"
        suggestions={MANNERISM_SUGGESTIONS}
      />
      <TextField
        form={form}
        name="descriptionDetails.other"
        label="Other"
        htmlFor="other"
        placeholder="Any other notable features"
      />
    </section>
  );
}

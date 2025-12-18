import type { AnyFieldApi } from '@tanstack/react-form';

import { TextField } from './text-field';

interface AppearanceSectionProps {
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
}

export function AppearanceSection({ form }: AppearanceSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Physical Appearance</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="descriptionDetails.eyes"
          label="Eyes"
          htmlFor="eyes"
          placeholder="Eye color and appearance"
        />
        <TextField
          form={form}
          name="descriptionDetails.hair"
          label="Hair"
          htmlFor="hair"
          placeholder="Hair style and color"
        />
        <TextField
          form={form}
          name="descriptionDetails.skin"
          label="Skin"
          htmlFor="skin"
          placeholder="Skin tone and features"
        />
        <TextField
          form={form}
          name="descriptionDetails.body"
          label="Body"
          htmlFor="body"
          placeholder="Build and stature"
        />
      </div>

      <TextField
        form={form}
        name="descriptionDetails.clothing"
        label="Clothing"
        htmlFor="clothing"
        placeholder="Typical attire and style"
      />
      <TextField
        form={form}
        name="descriptionDetails.mannerisms"
        label="Mannerisms"
        htmlFor="mannerisms"
        placeholder="Distinctive habits or behaviors"
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

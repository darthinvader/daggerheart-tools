import type { AnyFieldApi } from '@tanstack/react-form';

import { FormField } from '@/components/shared/form-fields';
import { Textarea } from '@/components/ui/textarea';

interface BackgroundSectionProps {
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
}

export function BackgroundSection({ form }: BackgroundSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Background</h2>

      <form.Field name="background">
        {(field: AnyFieldApi) => (
          <FormField
            label="Background Story"
            htmlFor="background"
            error={field.state.meta.errors.join(', ')}
          >
            <Textarea
              id="background"
              placeholder="Your character's history and backstory..."
              value={field.state.value as string}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={5}
            />
          </FormField>
        )}
      </form.Field>
    </section>
  );
}

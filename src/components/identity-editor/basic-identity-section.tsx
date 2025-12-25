import type { AnyFieldApi } from '@tanstack/react-form';

import { FormField } from '@/components/shared/form-fields';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicIdentitySectionProps {
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
}

export function BasicIdentitySection({ form }: BasicIdentitySectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Basic Identity</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field: AnyFieldApi) => (
            <FormField
              label="Name"
              htmlFor="name"
              error={field.state.meta.errors.join(', ')}
            >
              <Input
                id="name"
                placeholder="Character name"
                value={field.state.value as string}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="pronouns">
          {(field: AnyFieldApi) => (
            <FormField
              label="Pronouns"
              htmlFor="pronouns"
              error={field.state.meta.errors.join(', ')}
            >
              <Input
                id="pronouns"
                placeholder="e.g., they/them, she/her, he/him"
                value={field.state.value as string}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <form.Field name="calling">
        {(field: AnyFieldApi) => (
          <FormField
            label="Calling"
            htmlFor="calling"
            error={field.state.meta.errors.join(', ')}
          >
            <Input
              id="calling"
              placeholder="Your character's calling or title"
              value={field.state.value as string}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="description">
        {(field: AnyFieldApi) => (
          <FormField
            label="Description"
            htmlFor="description"
            error={field.state.meta.errors.join(', ')}
          >
            <Textarea
              id="description"
              placeholder="A brief description of your character"
              value={field.state.value as string}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={3}
            />
          </FormField>
        )}
      </form.Field>
    </section>
  );
}

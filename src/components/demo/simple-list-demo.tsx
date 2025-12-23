import { useState } from 'react';

import { useForm } from '@tanstack/react-form';

import { SimpleList } from '@/components/identity-editor/simple-list';
import { Button } from '@/components/ui/button';

interface SimpleListFormValues {
  skills: string[];
}

const SAMPLE_SKILLS = ['Stealth', 'Swordsmanship', 'Lockpicking', 'Persuasion'];

export function SimpleListDemo() {
  const [mode, setMode] = useState<'empty' | 'prefilled'>('empty');
  const [lastSubmitted, setLastSubmitted] =
    useState<SimpleListFormValues | null>(null);

  const defaultValues: SimpleListFormValues =
    mode === 'prefilled' ? { skills: [...SAMPLE_SKILLS] } : { skills: [] };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setLastSubmitted(value);
    },
  });

  const handleAdd = () => {
    const current = form.getFieldValue('skills') ?? [];
    form.setFieldValue('skills', [...current, '']);
  };

  const handleRemove = (index: number) => {
    const current = form.getFieldValue('skills') ?? [];
    form.setFieldValue(
      'skills',
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Simple List</h2>
        <p className="text-muted-foreground mb-4">
          A reusable component for managing a list of text fields. Useful for
          skills, traits, notes, or any simple list of strings.
        </p>

        <div className="mb-4 flex gap-2">
          <Button
            variant={mode === 'empty' ? 'default' : 'outline'}
            onClick={() => setMode('empty')}
          >
            Empty List
          </Button>
          <Button
            variant={mode === 'prefilled' ? 'default' : 'outline'}
            onClick={() => setMode('prefilled')}
          >
            Pre-filled Example
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-lg border p-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Subscribe selector={state => state.values.skills}>
            {skills => (
              <SimpleList
                title="Skills"
                items={skills}
                fieldName="skills"
                placeholder="Enter a skill..."
                emptyMessage="No skills yet. Add one to get started."
                addButtonLabel="Add Skill"
                form={form}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            )}
          </form.Subscribe>

          <div className="mt-6">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </section>

      {lastSubmitted && (
        <section>
          <h3 className="mb-2 text-lg font-semibold">Last Submitted Values</h3>
          <pre className="bg-muted max-h-75 overflow-auto rounded-lg p-4 text-sm">
            {JSON.stringify(lastSubmitted, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}

import { useState } from 'react';

import { useForm } from '@tanstack/react-form';

import {
  type NumberedItem,
  NumberedList,
  SimpleList,
} from '@/components/identity-editor/simple-list';
import { Button } from '@/components/ui/button';

interface SimpleListFormValues {
  experiences: string[];
  numberedExperiences: NumberedItem[];
}

const SAMPLE_EXPERIENCES = [
  'Stealth',
  'Swordsmanship',
  'Lockpicking',
  'Persuasion',
];
const SAMPLE_NUMBERED: NumberedItem[] = [
  { name: 'Acrobatics', value: 3 },
  { name: 'Herbalism', value: 2 },
];

type DemoMode = 'empty' | 'prefilled';

function ModeToggle({
  mode,
  setMode,
}: {
  mode: DemoMode;
  setMode: (m: DemoMode) => void;
}) {
  return (
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
  );
}

export function SimpleListDemo() {
  const [mode, setMode] = useState<'empty' | 'prefilled'>('empty');
  const [lastSubmitted, setLastSubmitted] =
    useState<SimpleListFormValues | null>(null);

  const defaultValues: SimpleListFormValues =
    mode === 'prefilled'
      ? {
          experiences: [...SAMPLE_EXPERIENCES],
          numberedExperiences: [...SAMPLE_NUMBERED],
        }
      : { experiences: [], numberedExperiences: [] };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setLastSubmitted(value);
    },
  });

  const handleAdd = () => {
    const current = form.getFieldValue('experiences') ?? [];
    form.setFieldValue('experiences', [...current, '']);
  };

  const handleRemove = (index: number) => {
    const current = form.getFieldValue('experiences') ?? [];
    form.setFieldValue(
      'experiences',
      current.filter((_, i) => i !== index)
    );
  };

  const handleAddNumbered = () => {
    const current = form.getFieldValue('numberedExperiences') ?? [];
    form.setFieldValue('numberedExperiences', [
      ...current,
      { name: '', value: 2 },
    ]);
  };

  const handleRemoveNumbered = (index: number) => {
    const current = form.getFieldValue('numberedExperiences') ?? [];
    form.setFieldValue(
      'numberedExperiences',
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Simple List</h2>
        <p className="text-muted-foreground mb-4">
          A reusable component for managing a list of text fields. Useful for
          experiences, traits, notes, or any simple list of strings.
        </p>
        <ModeToggle mode={mode} setMode={setMode} />
      </section>

      <section className="bg-card rounded-lg border p-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Subscribe selector={state => state.values.experiences}>
            {experiences => (
              <SimpleList
                title="Experiences"
                items={experiences}
                fieldName="experiences"
                placeholder="Enter an experience..."
                emptyMessage="No experiences yet. Add one to get started."
                addButtonLabel="Add Experience"
                form={form}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            )}
          </form.Subscribe>

          <div className="mt-8">
            <form.Subscribe
              selector={state => state.values.numberedExperiences}
            >
              {numberedExperiences => (
                <NumberedList
                  title="Numbered Experiences"
                  items={numberedExperiences}
                  fieldName="numberedExperiences"
                  placeholder="Enter experience name..."
                  emptyMessage="No numbered experiences yet. Add one to get started."
                  addButtonLabel="Add Experience"
                  minValue={2}
                  form={form}
                  onAdd={handleAddNumbered}
                  onRemove={handleRemoveNumbered}
                />
              )}
            </form.Subscribe>
          </div>

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

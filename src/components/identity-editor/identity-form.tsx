import { useState } from 'react';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  type Connection,
  DEFAULT_IDENTITY_FORM_VALUES,
  type IdentityFormValues,
} from '@/lib/schemas/character-state';

import { AppearanceSection } from './appearance-section';
import { BackgroundSection } from './background-section';
import { BasicIdentitySection } from './basic-identity-section';
import { ConnectionsList } from './connections-list';

interface IdentityFormProps {
  defaultValues?: Partial<IdentityFormValues>;
  onSubmit: (values: IdentityFormValues) => void;
  onCancel?: () => void;
}

export function IdentityForm({
  defaultValues,
  onSubmit,
  onCancel,
}: IdentityFormProps) {
  const mergedDefaults = { ...DEFAULT_IDENTITY_FORM_VALUES, ...defaultValues };
  const [connections, setConnections] = useState<Connection[]>(
    mergedDefaults.connections
  );

  const form = useForm({
    defaultValues: mergedDefaults,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  const handleAddConnection = () => {
    const newConnections = [...connections, { prompt: '', answer: '' }];
    setConnections(newConnections);
    form.setFieldValue('connections', newConnections);
  };

  const handleRemoveConnection = (index: number) => {
    const newConnections = connections.filter((_, i) => i !== index);
    setConnections(newConnections);
    form.setFieldValue('connections', newConnections);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <BasicIdentitySection form={form} />

      <Separator />

      <AppearanceSection form={form} />

      <Separator />

      <BackgroundSection form={form} />

      <Separator />

      <ConnectionsList
        connections={connections}
        form={form}
        onAdd={handleAddConnection}
        onRemove={handleRemoveConnection}
      />

      <Separator />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save Identity'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

import { Plus, Trash2 } from 'lucide-react';

import type { AnyFieldApi } from '@tanstack/react-form';

import { FormField } from '@/components/shared/form-fields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Connection } from '@/lib/schemas/character-state';

interface ConnectionItemProps {
  index: number;
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
  onRemove: () => void;
}

function ConnectionItem({ index, form, onRemove }: ConnectionItemProps) {
  return (
    <div className="bg-muted/50 relative rounded-lg border p-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
        aria-label="Remove connection"
      >
        <Trash2 className="size-4" />
      </Button>

      <div className="space-y-3 pr-8">
        <form.Field name={`connections[${index}].prompt`}>
          {(subField: AnyFieldApi) => (
            <FormField label="Prompt" htmlFor={`connection-prompt-${index}`}>
              <Input
                id={`connection-prompt-${index}`}
                placeholder="e.g., Who saved your life?"
                value={subField.state.value as string}
                onChange={e => subField.handleChange(e.target.value)}
                onBlur={subField.handleBlur}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name={`connections[${index}].answer`}>
          {(subField: AnyFieldApi) => (
            <FormField label="Answer" htmlFor={`connection-answer-${index}`}>
              <Textarea
                id={`connection-answer-${index}`}
                placeholder="Describe the connection..."
                value={subField.state.value as string}
                onChange={e => subField.handleChange(e.target.value)}
                onBlur={subField.handleBlur}
                rows={2}
              />
            </FormField>
          )}
        </form.Field>
      </div>
    </div>
  );
}

interface ConnectionsListProps {
  connections: Connection[];
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ConnectionsList({
  connections,
  form,
  onAdd,
  onRemove,
}: ConnectionsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connections</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 size-4" />
          Add Connection
        </Button>
      </div>

      {connections.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No connections yet. Add a connection to describe relationships with
          other characters.
        </p>
      )}

      <div className="space-y-4">
        {connections.map((_, index) => (
          <ConnectionItem
            key={index}
            index={index}
            form={form}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}

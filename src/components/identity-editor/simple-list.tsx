import { Plus, Trash2 } from 'lucide-react';

import type { AnyFieldApi } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FormField } from './form-field';

interface SimpleListItemProps {
  index: number;
  fieldName: string;
  placeholder?: string;
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
  onRemove: () => void;
}

function SimpleListItem({
  index,
  fieldName,
  placeholder,
  form,
  onRemove,
}: SimpleListItemProps) {
  return (
    <div className="flex items-center gap-2">
      <form.Field name={`${fieldName}[${index}]`}>
        {(subField: AnyFieldApi) => (
          <FormField
            label=""
            htmlFor={`${fieldName}-${index}`}
            className="flex-1"
          >
            <Input
              id={`${fieldName}-${index}`}
              placeholder={placeholder}
              value={subField.state.value as string}
              onChange={e => subField.handleChange(e.target.value)}
              onBlur={subField.handleBlur}
            />
          </FormField>
        )}
      </form.Field>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label="Remove item"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

interface SimpleListProps {
  title: string;
  items: string[];
  fieldName: string;
  placeholder?: string;
  emptyMessage?: string;
  addButtonLabel?: string;
  form: {
    Field: React.ComponentType<{
      name: string;
      children: (field: AnyFieldApi) => React.ReactNode;
    }>;
  };
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function SimpleList({
  title,
  items,
  fieldName,
  placeholder = 'Enter value...',
  emptyMessage = 'No items yet. Add one to get started.',
  addButtonLabel = 'Add Item',
  form,
  onAdd,
  onRemove,
}: SimpleListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 size-4" />
          {addButtonLabel}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      )}

      <div className="space-y-2">
        {items.map((_, index) => (
          <SimpleListItem
            key={index}
            index={index}
            fieldName={fieldName}
            placeholder={placeholder}
            form={form}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}

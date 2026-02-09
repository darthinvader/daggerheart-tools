import { Minus, Plus, Trash2 } from 'lucide-react';

import { FormField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MinimalFieldApi {
  state: { value: unknown };
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormWithField = { Field: React.ComponentType<any> };

interface SimpleListItemProps {
  index: number;
  fieldName: string;
  placeholder?: string;
  form: FormWithField;
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
        {(subField: MinimalFieldApi) => (
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

export interface NumberedItem {
  name: string;
  value: number;
}

interface NumberedListItemProps {
  index: number;
  fieldName: string;
  placeholder?: string;
  minValue?: number;
  form: FormWithField;
  onRemove: () => void;
}

function NumberedListItem({
  index,
  fieldName,
  placeholder,
  minValue = 2,
  form,
  onRemove,
}: NumberedListItemProps) {
  return (
    <div className="flex items-center gap-2">
      <form.Field name={`${fieldName}[${index}].name`}>
        {(subField: MinimalFieldApi) => (
          <FormField
            label=""
            htmlFor={`${fieldName}-${index}-name`}
            className="flex-1"
          >
            <Input
              id={`${fieldName}-${index}-name`}
              placeholder={placeholder}
              value={subField.state.value as string}
              onChange={e => subField.handleChange(e.target.value)}
              onBlur={subField.handleBlur}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name={`${fieldName}[${index}].value`}>
        {(subField: MinimalFieldApi) => {
          const value = (subField.state.value as number) ?? minValue;
          return (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  subField.handleChange(Math.max(minValue, value - 1))
                }
                disabled={value <= minValue}
                aria-label="Decrement"
              >
                <Minus className="size-3" />
              </Button>
              <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums">
                {value}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => subField.handleChange(value + 1)}
                aria-label="Increment"
              >
                <Plus className="size-3" />
              </Button>
            </div>
          );
        }}
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
  form: FormWithField;
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
        {items.map((item, index) => (
          <SimpleListItem
            key={`${item}-${index}`}
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

interface NumberedListProps {
  title: string;
  items: NumberedItem[];
  fieldName: string;
  placeholder?: string;
  emptyMessage?: string;
  addButtonLabel?: string;
  defaultValue?: number;
  minValue?: number;
  form: FormWithField;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function NumberedList({
  title,
  items,
  fieldName,
  placeholder = 'Enter name...',
  emptyMessage = 'No items yet. Add one to get started.',
  addButtonLabel = 'Add Item',
  minValue = 2,
  form,
  onAdd,
  onRemove,
}: NumberedListProps) {
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
        {items.map((item, index) => (
          <NumberedListItem
            key={`${item.name}-${item.value}-${index}`}
            index={index}
            fieldName={fieldName}
            placeholder={placeholder}
            minValue={minValue}
            form={form}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}

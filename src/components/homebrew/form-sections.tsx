/**
 * Reusable form sections for homebrew forms
 * Consolidates common patterns like string list editors
 */
import { Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// =====================================================================================
// StringListSection - For editing arrays of strings (tags, questions, connections, etc.)
// =====================================================================================

interface StringListSectionProps {
  /** Section title */
  title: string;
  /** Icon to display next to title */
  icon: ReactNode;
  /** Color class for the icon */
  iconColor: string;
  /** Description text */
  description?: string;
  /** Current list of items */
  items: string[];
  /** Called when items change */
  onChange: (items: string[]) => void;
  /** Placeholder for the input field */
  placeholder: string;
  /** Border/bg color class (e.g., 'orange-500') */
  colorClass: string;
  /** Display mode: 'badges' for inline badges, 'list' for stacked items */
  displayMode?: 'badges' | 'list';
}

/**
 * A reusable section for editing a list of strings.
 * Used for class items, background questions, connections, etc.
 */
export function StringListSection({
  title,
  icon,
  iconColor,
  description,
  items,
  onChange,
  placeholder,
  colorClass,
  displayMode = 'badges',
}: StringListSectionProps) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInputValue('');
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <section
      className={`space-y-4 rounded-lg border border-${colorClass}/30 bg-${colorClass}/10 p-4`}
    >
      <h3 className="flex items-center gap-2 font-semibold">
        <span className={iconColor}>{icon}</span> {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}

      {displayMode === 'badges' ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`gap-1 border-${colorClass}/50 bg-${colorClass}/20`}
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`bg-background/50 flex-1 rounded border border-${colorClass}/20 p-2 text-sm`}
              >
                {item}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="outline" size="icon" onClick={addItem}>
          <Plus className="size-4" />
        </Button>
      </div>
    </section>
  );
}

// =====================================================================================
// NameDescriptionListSection - For editing arrays of {id, name, description} items
// =====================================================================================

interface NameDescriptionItem {
  id: string;
  name: string;
  description: string;
}

interface NameDescriptionListSectionProps<T extends NameDescriptionItem> {
  /** Section title */
  title: string;
  /** Icon to display next to title */
  icon: ReactNode;
  /** Color class for the icon (e.g., 'text-emerald-500') */
  iconColor: string;
  /** Description text */
  description?: string;
  /** Current list of items */
  items: T[];
  /** Called when items change */
  onChange: (items: T[]) => void;
  /** Placeholder for the name input */
  namePlaceholder: string;
  /** Placeholder for the description textarea */
  descriptionPlaceholder: string;
  /** Border/bg color class (e.g., 'emerald-500') */
  colorClass: string;
  /** Empty state message */
  emptyMessage: string;
  /** Add button label */
  addButtonLabel: string;
  /** Optional render function for additional content per item */
  renderExtra?: (
    item: T,
    updateItem: (updates: Partial<T>) => void
  ) => ReactNode;
}

/**
 * A reusable section for editing a list of name+description items.
 * Used for class features, starting equipment, etc.
 */
export function NameDescriptionListSection<T extends NameDescriptionItem>({
  title,
  icon,
  iconColor,
  description,
  items,
  onChange,
  namePlaceholder,
  descriptionPlaceholder,
  colorClass,
  emptyMessage,
  addButtonLabel,
  renderExtra,
}: NameDescriptionListSectionProps<T>) {
  const addItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: '',
      description: '',
    } as T;
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<T>) => {
    onChange(
      items.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <section
      className={`space-y-4 rounded-lg border border-${colorClass}/30 bg-${colorClass}/10 p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <span className={iconColor}>{icon}</span> {title}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1 size-4" /> {addButtonLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className={`bg-background/50 space-y-2 rounded-lg border border-${colorClass}/20 p-3`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    value={item.name}
                    onChange={e =>
                      updateItem(item.id, {
                        name: e.target.value,
                      } as Partial<T>)
                    }
                    placeholder={namePlaceholder}
                  />
                  <Textarea
                    value={item.description}
                    onChange={e =>
                      updateItem(item.id, {
                        description: e.target.value,
                      } as Partial<T>)
                    }
                    placeholder={descriptionPlaceholder}
                    rows={2}
                  />
                  {renderExtra?.(item, updates => updateItem(item.id, updates))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

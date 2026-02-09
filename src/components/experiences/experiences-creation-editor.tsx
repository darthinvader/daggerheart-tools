import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { EXPERIENCE_SUGGESTIONS } from '@/components/identity-editor/trait-suggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, generateId } from '@/lib/utils';

import type { ExperiencesState } from './experiences-display';

type ExperienceItem = ExperiencesState['items'][number];

interface SuggestionsDropdownProps {
  suggestions: string[];
  onSelect: (name: string) => void;
}

function SuggestionsDropdown({
  suggestions,
  onSelect,
}: SuggestionsDropdownProps) {
  if (suggestions.length === 0) return null;
  return (
    <div className="bg-popover absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md border shadow-md">
      {suggestions.map(suggestion => (
        <button
          key={suggestion}
          type="button"
          className="hover:bg-muted w-full px-3 py-1 text-left text-sm"
          onMouseDown={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

interface ExperienceItemRowProps {
  item: ExperienceItem;
  onUpdate: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

function ExperienceItemRow({
  item,
  onUpdate,
  onRemove,
}: ExperienceItemRowProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate(item.id, e.target.value),
    [item.id, onUpdate]
  );
  const handleRemove = useCallback(
    () => onRemove(item.id),
    [item.id, onRemove]
  );

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Input value={item.name} onChange={handleChange} className="flex-1" />
      <span className="text-muted-foreground bg-primary/10 rounded-md px-2 py-1 text-sm font-semibold">
        +2
      </span>
      <Button variant="ghost" size="icon" onClick={handleRemove}>
        <Trash2 className="text-destructive size-4" />
      </Button>
    </div>
  );
}

interface ExperiencesCreationEditorProps {
  experiences: ExperiencesState;
  onChange: (experiences: ExperiencesState) => void;
  className?: string;
}

export function ExperiencesCreationEditor({
  experiences,
  onChange,
  className,
}: ExperiencesCreationEditorProps) {
  const [newName, setNewName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const items = experiences?.items ?? [];

  const filteredSuggestions = EXPERIENCE_SUGGESTIONS.filter(
    s =>
      s.toLowerCase().includes(newName.toLowerCase()) &&
      !items.some(item => item.name.toLowerCase() === s.toLowerCase())
  );

  const addExperience = useCallback(
    (name?: string) => {
      const experienceName = name ?? newName;
      if (!experienceName.trim()) return;
      if (items.length >= 2) return;
      onChange({
        items: [
          ...items,
          { id: generateId(), name: experienceName.trim(), value: 2 },
        ],
      });
      setNewName('');
      setShowSuggestions(false);
    },
    [newName, items, onChange]
  );

  const updateExperience = useCallback(
    (id: string, name: string) => {
      onChange({
        items: items.map(exp => (exp.id === id ? { ...exp, name } : exp)),
      });
    },
    [items, onChange]
  );

  const removeExperience = useCallback(
    (id: string) => {
      onChange({
        items: items.filter(exp => exp.id !== id),
      });
    },
    [items, onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewName(e.target.value);
      setShowSuggestions(true);
    },
    []
  );

  const handleInputFocus = useCallback(() => setShowSuggestions(true), []);
  const handleInputBlur = useCallback(
    () => setTimeout(() => setShowSuggestions(false), 200),
    []
  );
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') addExperience();
    },
    [addExperience]
  );
  const handleAddClick = useCallback(() => addExperience(), [addExperience]);

  return (
    <div className={cn('min-h-[400px] space-y-4', className)}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Experience name..."
            value={newName}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
          />
          {showSuggestions && (
            <SuggestionsDropdown
              suggestions={filteredSuggestions}
              onSelect={addExperience}
            />
          )}
        </div>
        <Button
          onClick={handleAddClick}
          disabled={!newName.trim() || items.length >= 2}
        >
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Add two experiences that start at +2.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map(exp => (
            <ExperienceItemRow
              key={exp.id}
              item={exp}
              onUpdate={updateExperience}
              onRemove={removeExperience}
            />
          ))}
        </div>
      )}
    </div>
  );
}

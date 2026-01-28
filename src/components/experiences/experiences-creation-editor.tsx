import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { EXPERIENCE_SUGGESTIONS } from '@/components/identity-editor/trait-suggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, generateId } from '@/lib/utils';

import type { ExperiencesState } from './experiences-display';

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

  const addExperience = (name?: string) => {
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
  };

  const updateExperience = (id: string, name: string) => {
    onChange({
      items: items.map(exp =>
        exp.id === id ? { ...exp, name, value: 2 } : { ...exp, value: 2 }
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      items: items
        .filter(exp => exp.id !== id)
        .map(exp => ({ ...exp, value: 2 })),
    });
  };

  return (
    <div className={cn('min-h-[400px] space-y-4', className)}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Experience name..."
            value={newName}
            onChange={e => {
              setNewName(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={e => e.key === 'Enter' && addExperience()}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="bg-popover absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md border shadow-md">
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  className="hover:bg-muted w-full px-3 py-1 text-left text-sm"
                  onMouseDown={() => addExperience(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={() => addExperience()}
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
            <div
              key={exp.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <Input
                value={exp.name}
                onChange={e => updateExperience(exp.id, e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground bg-primary/10 rounded-md px-2 py-1 text-sm font-semibold">
                +2
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  const items = experiences?.items ?? [];

  const addExperience = () => {
    if (!newName.trim()) return;
    if (items.length >= 2) return;
    onChange({
      items: [...items, { id: generateId(), name: newName.trim(), value: 2 }],
    });
    setNewName('');
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
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-2">
        <Input
          placeholder="Experience name..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addExperience()}
        />
        <Button
          onClick={addExperience}
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

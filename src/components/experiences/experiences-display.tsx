import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { EXPERIENCE_SUGGESTIONS } from '@/components/identity-editor/trait-suggestions';
import { EditableSection } from '@/components/shared/editable-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, generateId } from '@/lib/utils';

import { NumberControl } from '../shared/labeled-counter/number-control';

export interface ExperienceItem {
  id: string;
  name: string;
  value: number;
}

export interface ExperiencesState {
  items: ExperienceItem[];
}

interface ExperiencesDisplayProps {
  experiences: ExperiencesState;
  onChange?: (experiences: ExperiencesState) => void;
  className?: string;
  readOnly?: boolean;
  bonusByExperience?: Record<string, number>;
}

function ExperiencesDetailedDisplay({
  experiences,
  onEdit,
  bonusByExperience,
}: {
  experiences: ExperiencesState;
  onEdit?: () => void;
  bonusByExperience?: Record<string, number>;
}) {
  const items = experiences?.items ?? [];
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <BookOpen className="size-10 opacity-50" />
        <p className="text-muted-foreground mt-2">No experiences</p>
        <p className="text-muted-foreground mb-4 text-sm">
          Track your character's knowledge and skills
        </p>
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Plus className="mr-1 size-4" />
            Add Experience
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(exp => {
        const bonus = bonusByExperience?.[exp.name] ?? 0;
        const total = exp.value + bonus;
        return (
          <div
            key={exp.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span className="font-medium">{exp.name}</span>
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground bg-primary/10 rounded-md px-2 py-1 text-sm font-semibold">
                +{total}
              </span>
              {bonus > 0 && (
                <span className="text-muted-foreground text-xs">
                  (+{bonus} bonus)
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface ExperiencesEditorProps {
  experiences: ExperiencesState;
  onChange: (experiences: ExperiencesState) => void;
}

export function ExperiencesEditor({
  experiences,
  onChange,
}: ExperiencesEditorProps) {
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
    onChange({
      items: [
        ...items,
        { id: generateId(), name: experienceName.trim(), value: 2 },
      ],
    });
    setNewName('');
    setShowSuggestions(false);
  };

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    onChange({
      items: items.map(exp => (exp.id === id ? { ...exp, ...updates } : exp)),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      items: items.filter(exp => exp.id !== id),
    });
  };

  return (
    <div className="min-h-100 space-y-4">
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
        <Button onClick={() => addExperience()} disabled={!newName.trim()}>
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No experiences yet. Add one above.
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
                onChange={e =>
                  updateExperience(exp.id, { name: e.target.value })
                }
                className="flex-1"
              />
              <NumberControl
                value={exp.value}
                onChange={val => updateExperience(exp.id, { value: val })}
                min={1}
              />
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

export function ExperiencesDisplay({
  experiences,
  onChange,
  className,
  readOnly = false,
  bonusByExperience,
}: ExperiencesDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ExperiencesState>(experiences);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleCancel = useCallback(() => {
    setDraft(experiences);
  }, [experiences]);

  const handleOpen = useCallback(() => {
    setDraft(experiences);
    setIsEditing(true);
  }, [experiences]);

  return (
    <EditableSection
      title="Experiences"
      icon={BookOpen}
      isEditing={isEditing}
      onEditToggle={isEditing ? handleEditToggle : handleOpen}
      showEditButton={!readOnly}
      modalSize="lg"
      className={cn(className)}
      editTitle="Manage Experiences"
      editDescription="Add and track your character's experiences with their bonuses."
      onSave={handleSave}
      onCancel={handleCancel}
      editContent={
        <ExperiencesEditor experiences={draft} onChange={setDraft} />
      }
    >
      <ExperiencesDetailedDisplay
        experiences={experiences}
        onEdit={!readOnly ? handleOpen : undefined}
        bonusByExperience={bonusByExperience}
      />
    </EditableSection>
  );
}

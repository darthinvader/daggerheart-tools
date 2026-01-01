import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

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
}

function ExperiencesDetailedDisplay({
  experiences,
  onEdit,
}: {
  experiences: ExperiencesState;
  onEdit?: () => void;
}) {
  const items = experiences?.items ?? [];
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-4xl opacity-50">📚</span>
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
      {items.map(exp => (
        <div
          key={exp.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <span className="font-medium">{exp.name}</span>
          <span className="text-muted-foreground bg-primary/10 rounded-md px-2 py-1 text-sm font-semibold">
            +{exp.value}
          </span>
        </div>
      ))}
    </div>
  );
}

interface ExperiencesEditorProps {
  experiences: ExperiencesState;
  onChange: (experiences: ExperiencesState) => void;
}

function ExperiencesEditor({ experiences, onChange }: ExperiencesEditorProps) {
  const [newName, setNewName] = useState('');
  const items = experiences?.items ?? [];

  const addExperience = () => {
    if (!newName.trim()) return;
    onChange({
      items: [...items, { id: generateId(), name: newName.trim(), value: 2 }],
    });
    setNewName('');
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Experience name..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addExperience()}
        />
        <Button onClick={addExperience} disabled={!newName.trim()}>
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
      emoji="📚"
      isEditing={isEditing}
      onEditToggle={isEditing ? handleEditToggle : handleOpen}
      showEditButton={!readOnly}
      modalSize="md"
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
      />
    </EditableSection>
  );
}

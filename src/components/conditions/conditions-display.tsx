import { Plus, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ConditionsState {
  items: string[];
}

interface ConditionsDisplayProps {
  conditions: ConditionsState;
  onChange?: (conditions: ConditionsState) => void;
  className?: string;
  readOnly?: boolean;
}

function ConditionsDetailedDisplay({
  conditions,
}: {
  conditions: ConditionsState;
}) {
  if (conditions.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-4xl opacity-50">✨</span>
        <p className="text-muted-foreground mt-2">No conditions</p>
        <p className="text-muted-foreground text-sm">
          Your character is in good shape!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {conditions.items.map((condition, idx) => (
        <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm">
          {condition}
        </Badge>
      ))}
    </div>
  );
}

interface ConditionsEditorProps {
  conditions: ConditionsState;
  onChange: (conditions: ConditionsState) => void;
}

function ConditionsEditor({ conditions, onChange }: ConditionsEditorProps) {
  const [newCondition, setNewCondition] = useState('');

  const addCondition = () => {
    if (!newCondition.trim()) return;
    const trimmed = newCondition.trim();
    if (conditions.items.includes(trimmed)) return;
    onChange({ items: [...conditions.items, trimmed] });
    setNewCondition('');
  };

  const removeCondition = (idx: number) => {
    onChange({ items: conditions.items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Condition name..."
          value={newCondition}
          onChange={e => setNewCondition(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCondition()}
        />
        <Button onClick={addCondition} disabled={!newCondition.trim()}>
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>

      {conditions.items.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No conditions. Add one above if needed.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {conditions.items.map((condition, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="gap-1 px-3 py-1.5 text-sm"
            >
              {condition}
              <button
                onClick={() => removeCondition(idx)}
                className="hover:bg-destructive/20 ml-1 rounded-full"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConditionsDisplay({
  conditions,
  onChange,
  className,
  readOnly = false,
}: ConditionsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ConditionsState>(conditions);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleCancel = useCallback(() => {
    setDraft(conditions);
  }, [conditions]);

  const handleOpen = useCallback(() => {
    setDraft(conditions);
    setIsEditing(true);
  }, [conditions]);

  return (
    <EditableSection
      title="Conditions"
      emoji="⚡"
      isEditing={isEditing}
      onEditToggle={isEditing ? handleEditToggle : handleOpen}
      showEditButton={!readOnly}
      modalSize="md"
      className={cn(className)}
      editTitle="Manage Conditions"
      editDescription="Track status effects and conditions affecting your character."
      onSave={handleSave}
      onCancel={handleCancel}
      editContent={<ConditionsEditor conditions={draft} onChange={setDraft} />}
    >
      <ConditionsDetailedDisplay conditions={conditions} />
    </EditableSection>
  );
}

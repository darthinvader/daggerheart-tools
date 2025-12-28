import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { LabeledCounter } from '@/components/shared/labeled-counter';
import { cn } from '@/lib/utils';

export interface TraitValue {
  value: number;
  bonus: number;
  marked: boolean;
}

export interface TraitsState {
  Agility: TraitValue;
  Strength: TraitValue;
  Finesse: TraitValue;
  Instinct: TraitValue;
  Presence: TraitValue;
  Knowledge: TraitValue;
}

const TRAIT_NAMES = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

interface TraitsDisplayProps {
  traits: TraitsState;
  onChange?: (traits: TraitsState) => void;
  className?: string;
  readOnly?: boolean;
}

function TraitsDetailedDisplay({ traits }: { traits: TraitsState }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {TRAIT_NAMES.map(name => {
        const trait = traits[name];
        const total = trait.value + trait.bonus;
        const sign = total >= 0 ? '+' : '';

        return (
          <div
            key={name}
            className={cn(
              'flex flex-col items-center rounded-lg border p-3 transition-colors',
              trait.marked && 'border-primary bg-primary/10'
            )}
          >
            <span className="text-muted-foreground text-sm">{name}</span>
            <span className="text-2xl font-bold">
              {sign}
              {total}
            </span>
            {trait.marked && (
              <span className="text-primary mt-1 text-xs font-medium">
                Marked
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface TraitsEditorProps {
  traits: TraitsState;
  onChange: (traits: TraitsState) => void;
}

function TraitsEditor({ traits, onChange }: TraitsEditorProps) {
  const updateTrait = (
    name: keyof TraitsState,
    updates: Partial<TraitValue>
  ) => {
    onChange({ ...traits, [name]: { ...traits[name], ...updates } });
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {TRAIT_NAMES.map(name => (
        <LabeledCounter
          key={name}
          label={name}
          value={traits[name].value}
          onChange={val => updateTrait(name, { value: val })}
          min={-5}
          checkboxLabel="Marked"
          checkboxChecked={traits[name].marked}
          onCheckboxChange={checked => updateTrait(name, { marked: checked })}
        />
      ))}
    </div>
  );
}

export function TraitsDisplay({
  traits,
  onChange,
  className,
  readOnly = false,
}: TraitsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TraitsState>(traits);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleCancel = useCallback(() => {
    setDraft(traits);
  }, [traits]);

  const handleOpen = useCallback(() => {
    setDraft(traits);
    setIsEditing(true);
  }, [traits]);

  return (
    <EditableSection
      title="Traits"
      emoji="🎲"
      isEditing={isEditing}
      onEditToggle={isEditing ? handleEditToggle : handleOpen}
      showEditButton={!readOnly}
      modalSize="md"
      className={cn(className)}
      editTitle="Manage Traits"
      editDescription="Adjust your character's trait scores and mark them when used."
      onSave={handleSave}
      onCancel={handleCancel}
      editContent={<TraitsEditor traits={draft} onChange={setDraft} />}
    >
      <TraitsDetailedDisplay traits={traits} />
    </EditableSection>
  );
}

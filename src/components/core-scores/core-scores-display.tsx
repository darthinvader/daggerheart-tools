import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { LabeledCounter } from '@/components/shared/labeled-counter';
import { cn } from '@/lib/utils';

export interface CoreScoresState {
  evasion: number;
  proficiency: number;
}

export const DEFAULT_CORE_SCORES: CoreScoresState = {
  evasion: 10,
  proficiency: 1,
};

interface CoreScoresDisplayProps {
  scores: CoreScoresState;
  onChange?: (scores: CoreScoresState) => void;
  className?: string;
  readOnly?: boolean;
}

function CoreScoresDetailedDisplay({ scores }: { scores: CoreScoresState }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center rounded-lg border p-4">
        <span className="text-muted-foreground text-sm">Evasion</span>
        <span className="text-3xl font-bold">{scores.evasion}</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border p-4">
        <span className="text-muted-foreground text-sm">Proficiency</span>
        <span className="text-3xl font-bold">+{scores.proficiency}</span>
      </div>
    </div>
  );
}

interface CoreScoresEditorProps {
  scores: CoreScoresState;
  onChange: (scores: CoreScoresState) => void;
}

function CoreScoresEditor({ scores, onChange }: CoreScoresEditorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <LabeledCounter
        label="Evasion"
        value={scores.evasion}
        onChange={val => onChange({ ...scores, evasion: val })}
        min={0}
        orientation="vertical"
      />
      <LabeledCounter
        label="Proficiency"
        value={scores.proficiency}
        onChange={val => onChange({ ...scores, proficiency: val })}
        min={0}
        orientation="vertical"
      />
    </div>
  );
}

export function CoreScoresDisplay({
  scores,
  onChange,
  className,
  readOnly = false,
}: CoreScoresDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CoreScoresState>(scores);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleCancel = useCallback(() => {
    setDraft(scores);
  }, [scores]);

  const handleOpen = useCallback(() => {
    setDraft(scores);
    setIsEditing(true);
  }, [scores]);

  return (
    <EditableSection
      title="Core Scores"
      emoji="🛡️"
      isEditing={isEditing}
      onEditToggle={isEditing ? handleEditToggle : handleOpen}
      showEditButton={!readOnly}
      modalSize="sm"
      className={cn(className)}
      editTitle="Manage Core Scores"
      editDescription="Adjust your character's Evasion and Proficiency."
      onSave={handleSave}
      onCancel={handleCancel}
      editContent={<CoreScoresEditor scores={draft} onChange={setDraft} />}
    >
      <CoreScoresDetailedDisplay scores={scores} />
    </EditableSection>
  );
}

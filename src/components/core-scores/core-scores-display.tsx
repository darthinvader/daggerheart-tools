import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { LabeledCounter } from '@/components/shared/labeled-counter';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

export interface CoreScoresState {
  evasion: number;
  proficiency: number;
  autoCalculateEvasion?: boolean;
}

export interface CoreScoresAutoContext {
  classEvasion?: number;
  armorEvasionModifier?: number;
}

interface CoreScoresDisplayProps {
  scores: CoreScoresState;
  onChange?: (scores: CoreScoresState) => void;
  autoContext?: CoreScoresAutoContext;
  className?: string;
  readOnly?: boolean;
}

function computeAutoEvasion(ctx: CoreScoresAutoContext): number {
  return (ctx.classEvasion ?? 10) + (ctx.armorEvasionModifier ?? 0);
}

function CoreScoresDetailedDisplay({
  scores,
  isAutoEvasion,
}: {
  scores: CoreScoresState;
  isAutoEvasion?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center rounded-lg border p-4">
        <span className="text-muted-foreground text-sm">
          Evasion{isAutoEvasion && ' (auto)'}
        </span>
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
  autoContext?: CoreScoresAutoContext;
  autoEvasion: number;
}

function CoreScoresEditor({
  scores,
  onChange,
  autoContext,
  autoEvasion,
}: CoreScoresEditorProps) {
  const hasAutoContext = Boolean(autoContext);
  const isAutoEvasion = hasAutoContext && (scores.autoCalculateEvasion ?? true);

  const handleAutoToggle = () => {
    const newAutoValue = !scores.autoCalculateEvasion;
    onChange({
      ...scores,
      autoCalculateEvasion: newAutoValue,
      evasion: newAutoValue ? autoEvasion : scores.evasion,
    });
  };

  return (
    <div className="space-y-6">
      {hasAutoContext && (
        <div className="bg-muted/50 flex flex-wrap gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="auto-evasion"
              checked={scores.autoCalculateEvasion ?? true}
              onCheckedChange={handleAutoToggle}
            />
            <SmartTooltip
              content={`Auto Evasion: ${autoEvasion} (class base + armor modifier)`}
            >
              <Label htmlFor="auto-evasion" className="cursor-pointer">
                Auto Evasion
              </Label>
            </SmartTooltip>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-8">
        <LabeledCounter
          label={`Evasion${isAutoEvasion ? ' (auto)' : ''}`}
          value={isAutoEvasion ? autoEvasion : scores.evasion}
          onChange={
            isAutoEvasion
              ? () => {}
              : val => onChange({ ...scores, evasion: val })
          }
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
    </div>
  );
}

export function CoreScoresDisplay({
  scores,
  onChange,
  autoContext,
  className,
  readOnly = false,
}: CoreScoresDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CoreScoresState>(scores);

  const autoEvasion = useMemo(
    () => computeAutoEvasion(autoContext ?? {}),
    [autoContext]
  );

  const hasAutoContext = Boolean(autoContext);
  const isAutoEvasion = hasAutoContext && (scores.autoCalculateEvasion ?? true);

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
      editContent={
        <CoreScoresEditor
          scores={draft}
          onChange={setDraft}
          autoContext={autoContext}
          autoEvasion={autoEvasion}
        />
      }
    >
      <CoreScoresDetailedDisplay
        scores={scores}
        isAutoEvasion={isAutoEvasion}
      />
    </EditableSection>
  );
}

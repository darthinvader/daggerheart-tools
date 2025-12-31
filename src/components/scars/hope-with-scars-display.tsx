import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { Scar } from '@/lib/schemas/session-state';

import { HopeEditor } from './hope-editor';
import { buildSlots } from './hope-slot-utils';
import { HopeSlot } from './hope-slots';

export interface HopeWithScarsState {
  current: number;
  max: number;
  scars: Scar[];
}

interface HopeWithScarsDisplayProps {
  state: HopeWithScarsState;
  onChange?: (state: HopeWithScarsState) => void;
  className?: string;
  readOnly?: boolean;
  /** Extra Hope slots from companion's Light in the Dark training */
  bonusHopeSlots?: number;
}

function HopeStatus({
  current,
  effectiveMax,
  bonusHopeSlots,
  scarsCount,
}: {
  current: number;
  effectiveMax: number;
  bonusHopeSlots: number;
  scarsCount: number;
}) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="text-muted-foreground">
        <span className="font-medium text-blue-500">{current}</span> /{' '}
        <span className="font-medium">{effectiveMax}</span> Hope
        {bonusHopeSlots > 0 && (
          <span className="ml-1 text-xs text-emerald-500">
            (+{bonusHopeSlots} from companion)
          </span>
        )}
      </div>
      {scarsCount > 0 && (
        <div className="text-destructive">
          {scarsCount} Scar{scarsCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

function ScarsList({ scars }: { scars: Scar[] }) {
  if (scars.length === 0) return null;
  return (
    <div className="space-y-1">
      {scars.map(scar => (
        <div key={scar.id} className="text-muted-foreground text-xs italic">
          💀 {scar.description}
        </div>
      ))}
    </div>
  );
}

export function HopeWithScarsDisplay({
  state,
  onChange,
  className,
  readOnly,
  bonusHopeSlots = 0,
}: HopeWithScarsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(state);

  const totalSlots = 6 + bonusHopeSlots;
  const effectiveMax = state.max + bonusHopeSlots;

  const handleEditToggle = useCallback(() => {
    if (!isEditing) setDraft(state);
    setIsEditing(prev => !prev);
  }, [isEditing, state]);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleSlotClick = useCallback(
    (index: number) => {
      if (readOnly || !onChange) return;
      if (state.scars.some(s => s.hopeSlotIndex === index)) return;

      const isCurrentlyFilled = index < state.current;
      const newCurrent = isCurrentlyFilled
        ? Math.max(0, state.current - 1)
        : Math.min(effectiveMax, state.current + 1);

      onChange({ ...state, current: newCurrent });
    },
    [readOnly, onChange, state, effectiveMax]
  );

  const slots = buildSlots(state.current, state.scars, totalSlots);

  return (
    <EditableSection
      title="Hope & Scars"
      emoji="✨"
      description="Your Hope fuels special abilities. Scars permanently reduce your maximum Hope."
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      editContent={
        <HopeEditor
          state={draft}
          onChange={setDraft}
          bonusHopeSlots={bonusHopeSlots}
        />
      }
      editTitle="Edit Hope & Scars"
      editDescription="Manage your Hope and track permanent scars from near-death experiences."
      onSave={handleSave}
      showEditButton={!readOnly && !!onChange}
      className={className}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {slots.map(slot => (
            <HopeSlot
              key={slot.index}
              slot={slot}
              onClick={() => handleSlotClick(slot.index)}
              readOnly={readOnly}
            />
          ))}
        </div>
        <HopeStatus
          current={state.current}
          effectiveMax={effectiveMax}
          bonusHopeSlots={bonusHopeSlots}
          scarsCount={state.scars.length}
        />
        <ScarsList scars={state.scars} />
      </div>
    </EditableSection>
  );
}

import { Check, PawPrint, Skull, Sparkles } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { Scar } from '@/lib/schemas/session-state';

import { HopeEditor } from './hope-editor';
import { buildSlots } from './hope-slot-utils';
import { HopeSlot } from './hope-slots';

export interface HopeWithScarsState {
  current: number;
  max: number;
  scars: Scar[];
  /** Extra hope slots beyond the primary 6 (user-added) */
  extraSlots?: number;
  /** Whether the companion's bonus hope slot is filled (independent toggle) */
  companionHopeFilled?: boolean;
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
  companionHopeFilled,
  scarsCount,
}: {
  current: number;
  effectiveMax: number;
  bonusHopeSlots: number;
  companionHopeFilled: boolean;
  scarsCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="text-muted-foreground">
        <span className="font-medium text-blue-500">{current}</span> /{' '}
        <span className="font-medium">{effectiveMax}</span> Hope
      </div>
      {bonusHopeSlots > 0 && (
        <div className="flex items-center gap-1 text-xs">
          <PawPrint className="size-3" />
          <span
            className={
              companionHopeFilled ? 'text-emerald-500' : 'text-muted-foreground'
            }
          >
            Companion:{' '}
            {companionHopeFilled ? <Check className="inline size-3" /> : '○'}
          </span>
        </div>
      )}
      {scarsCount > 0 && (
        <div className="text-destructive">
          {scarsCount} Scar{scarsCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

function getHopeDerivedValues(state: HopeWithScarsState) {
  const extraSlots = state.extraSlots ?? 0;
  const totalSlots = 6 + extraSlots;
  const effectiveMax = state.max + extraSlots;
  const companionHopeFilled = state.companionHopeFilled ?? false;
  return { extraSlots, totalSlots, effectiveMax, companionHopeFilled };
}

function ScarsList({ scars }: { scars: Scar[] }) {
  if (scars.length === 0) return null;
  return (
    <div className="space-y-1">
      {scars.map(scar => (
        <div
          key={scar.id}
          className="text-muted-foreground flex items-center gap-1 text-xs italic"
        >
          <Skull className="size-3" /> {scar.description}
        </div>
      ))}
    </div>
  );
}
function useHopeWithScarsController({
  state,
  onChange,
  readOnly,
  bonusHopeSlots,
}: {
  state: HopeWithScarsState;
  onChange?: (state: HopeWithScarsState) => void;
  readOnly?: boolean;
  bonusHopeSlots: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(state);
  const scars = useMemo(() => state?.scars ?? [], [state.scars]);
  const { totalSlots, effectiveMax, companionHopeFilled } =
    getHopeDerivedValues(state);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) setDraft(state);
    setIsEditing(prev => !prev);
  }, [isEditing, state]);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleSlotClick = (index: number) => {
    if (readOnly || !onChange) return;
    if (scars.some(s => s.hopeSlotIndex === index)) return;

    const isCurrentlyFilled = index < state.current;
    const newCurrent = isCurrentlyFilled
      ? Math.max(0, state.current - 1)
      : Math.min(effectiveMax, state.current + 1);

    onChange({ ...state, current: newCurrent });
  };

  const handleCompanionHopeToggle = () => {
    if (readOnly || !onChange || bonusHopeSlots === 0) return;
    onChange({
      ...state,
      companionHopeFilled: !companionHopeFilled,
    });
  };

  const slots = buildSlots(
    state?.current ?? 0,
    scars,
    totalSlots,
    0 // No bonus slots in main array - companion is separate
  );

  return {
    isEditing,
    draft,
    setDraft,
    scars,
    effectiveMax,
    companionHopeFilled,
    slots,
    handleEditToggle,
    handleSave,
    handleSlotClick,
    handleCompanionHopeToggle,
  };
}

export function HopeWithScarsDisplay({
  state,
  onChange,
  className,
  readOnly,
  bonusHopeSlots = 0,
}: HopeWithScarsDisplayProps) {
  const {
    isEditing,
    draft,
    setDraft,
    scars,
    effectiveMax,
    companionHopeFilled,
    slots,
    handleEditToggle,
    handleSave,
    handleSlotClick,
    handleCompanionHopeToggle,
  } = useHopeWithScarsController({
    state,
    onChange,
    readOnly,
    bonusHopeSlots,
  });

  return (
    <EditableSection
      title="Hope & Scars"
      icon={Sparkles}
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
        <div className="flex flex-wrap items-center gap-3">
          {/* Main hope slots */}
          <div className="grid grid-cols-6 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
            {slots.map(slot => (
              <HopeSlot
                key={slot.index}
                slot={slot}
                onClick={() => handleSlotClick(slot.index)}
                readOnly={readOnly}
              />
            ))}
          </div>

          {/* Companion hope slot - separate and distinct */}
          {bonusHopeSlots > 0 && (
            <div className="flex items-center gap-2">
              <div className="bg-border h-8 w-px sm:h-10" />
              <button
                type="button"
                onClick={handleCompanionHopeToggle}
                disabled={readOnly}
                className={`flex size-10 items-center justify-center rounded-xl border-2 transition-all duration-200 sm:size-12 ${
                  companionHopeFilled
                    ? 'border-emerald-500 bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30'
                    : 'border-dashed border-emerald-400 bg-emerald-50 hover:border-emerald-500 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40'
                }`}
                aria-label={`Companion hope slot ${companionHopeFilled ? '(filled)' : '(empty)'}`}
                title="Companion Hope (Light in the Dark)"
              >
                <PawPrint
                  className={`size-5 sm:size-6 ${companionHopeFilled ? 'text-white' : 'opacity-50'}`}
                />
              </button>
            </div>
          )}
        </div>
        <HopeStatus
          current={state?.current ?? 0}
          effectiveMax={effectiveMax}
          bonusHopeSlots={bonusHopeSlots}
          companionHopeFilled={companionHopeFilled}
          scarsCount={scars.length}
        />
        <ScarsList scars={scars} />
      </div>
    </EditableSection>
  );
}

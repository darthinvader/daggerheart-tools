import { X } from 'lucide-react';

import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { Scar } from '@/lib/schemas/session-state';
import { cn } from '@/lib/utils';

import { HopeEditor } from './hope-editor';

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

interface HopeSlotProps {
  index: number;
  isFilled: boolean;
  isScarred: boolean;
  scar?: Scar;
  onClick?: () => void;
  readOnly?: boolean;
  isBonus?: boolean;
}

function getHopeSlotClassName(
  isScarred: boolean,
  isFilled: boolean,
  isBonus: boolean,
  readOnly?: boolean
): string {
  const base =
    'flex size-8 items-center justify-center rounded-lg border-2 transition-all duration-200 sm:size-10';

  if (isScarred) {
    return cn(base, 'bg-destructive/20 border-destructive cursor-not-allowed');
  }

  if (isFilled && isBonus) {
    return cn(base, 'border-emerald-600 bg-emerald-500 hover:bg-emerald-600');
  }

  if (isFilled) {
    return cn(base, 'border-blue-600 bg-blue-500 hover:bg-blue-600');
  }

  if (isBonus) {
    return cn(
      base,
      'border-dashed border-emerald-300 bg-emerald-50 hover:border-emerald-500 dark:bg-emerald-950/30'
    );
  }

  return cn(
    base,
    'bg-muted border-border hover:border-blue-400',
    readOnly && 'cursor-default'
  );
}

function getHopeSlotIcon(
  isScarred: boolean,
  isFilled: boolean,
  isBonus: boolean
): ReactNode {
  if (isScarred) {
    return <X className="text-destructive size-4 sm:size-5" strokeWidth={3} />;
  }
  if (isFilled) {
    return (
      <span className="text-base sm:text-lg">{isBonus ? '🐾' : '✨'}</span>
    );
  }
  if (isBonus) {
    return <span className="text-xs text-emerald-500">🐾</span>;
  }
  return null;
}

function HopeSlot({
  index,
  isFilled,
  isScarred,
  scar,
  onClick,
  readOnly,
  isBonus = false,
}: HopeSlotProps) {
  const slotContent = (
    <button
      type="button"
      onClick={onClick}
      disabled={readOnly || isScarred}
      className={getHopeSlotClassName(isScarred, isFilled, isBonus, readOnly)}
      aria-label={`Hope slot ${index + 1}${isBonus ? ' (companion bonus)' : ''}${isScarred ? ' (scarred)' : isFilled ? ' (filled)' : ' (empty)'}`}
    >
      {getHopeSlotIcon(isScarred, isFilled, isBonus)}
    </button>
  );

  if (!isScarred || !scar) {
    return slotContent;
  }

  return (
    <SmartTooltip
      key={index}
      content={
        <div className="space-y-1">
          <div className="font-semibold">
            Scar: {scar.description || 'Unmarked Scar'}
          </div>
          {scar.narrativeImpact && (
            <div className="text-muted-foreground text-xs">
              {scar.narrativeImpact}
            </div>
          )}
        </div>
      }
    >
      {slotContent}
    </SmartTooltip>
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

  // Total slots: base 6 + bonus from Light in the Dark
  const totalSlots = 6 + bonusHopeSlots;
  const effectiveMax = state.max + bonusHopeSlots;

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraft(state);
    }
    setIsEditing(!isEditing);
  }, [isEditing, state]);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleSlotClick = (index: number) => {
    if (readOnly || !onChange) return;
    const isScarred = state.scars.some(s => s.hopeSlotIndex === index);
    if (isScarred) return;

    // Count filled slots up to this index
    const filledCount = state.current;
    const isCurrentlyFilled = index < filledCount;

    if (isCurrentlyFilled) {
      // Unfill this slot (reduce current)
      onChange({ ...state, current: Math.max(0, state.current - 1) });
    } else {
      // Fill this slot (increase current, capped at effective max)
      onChange({
        ...state,
        current: Math.min(effectiveMax, state.current + 1),
      });
    }
  };

  // Build slot array considering scars and bonus slots
  const slots = Array.from({ length: totalSlots }, (_, i) => {
    const scar = state.scars.find(s => s.hopeSlotIndex === i);
    const isScarred = !!scar;
    const isBonus = i >= 6; // Bonus slots from Light in the Dark
    // For filled calculation, count non-scarred slots from left
    const nonScarredBefore = Array.from({ length: i + 1 }).filter(
      (_, idx) => !state.scars.some(s => s.hopeSlotIndex === idx)
    ).length;
    const isFilled = !isScarred && nonScarredBefore <= state.current;

    return { index: i, isFilled, isScarred, scar, isBonus };
  });

  return (
    <EditableSection
      title="Hope & Scars"
      emoji="✨"
      description="Your Hope fuels special abilities. Scars permanently reduce your maximum Hope."
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      editContent={<HopeEditor state={draft} onChange={setDraft} />}
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
              index={slot.index}
              isFilled={slot.isFilled}
              isScarred={slot.isScarred}
              scar={slot.scar}
              onClick={() => handleSlotClick(slot.index)}
              readOnly={readOnly}
              isBonus={slot.isBonus}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-muted-foreground">
            <span className="font-medium text-blue-500">{state.current}</span> /{' '}
            <span className="font-medium">{effectiveMax}</span> Hope
            {bonusHopeSlots > 0 && (
              <span className="ml-1 text-xs text-emerald-500">
                (+{bonusHopeSlots} from companion)
              </span>
            )}
          </div>
          {state.scars.length > 0 && (
            <div className="text-destructive">
              {state.scars.length} Scar{state.scars.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {state.scars.length > 0 && (
          <div className="space-y-1">
            {state.scars.map(scar => (
              <div
                key={scar.id}
                className="text-muted-foreground text-xs italic"
              >
                💀 {scar.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </EditableSection>
  );
}

import { Dice5 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { DualityRollDialog } from '@/components/dice-roller';
import type { RollExperience } from '@/components/dice-roller';
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

export type TraitName = keyof TraitsState;

/** Equipment modifiers for traits */
export type TraitEquipmentModifiers = Partial<Record<TraitName, number>>;

const TRAIT_NAMES: TraitName[] = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
];

interface TraitsDisplayProps {
  traits: TraitsState;
  onChange?: (traits: TraitsState) => void;
  className?: string;
  readOnly?: boolean;
  /** Equipment modifiers from parsed weapon features (e.g., "Cumbersome: −1 to Finesse") */
  equipmentModifiers?: TraitEquipmentModifiers;
  /** Callback when Hope pool changes from a roll */
  onHopeChange?: (delta: number) => void;
  /** Callback when Fear pool changes from a roll */
  onFearChange?: (delta: number) => void;
  /** Callback when stress is cleared from a critical success */
  onStressClear?: () => void;
  /** Current Hope tokens available for pre-roll spending */
  currentHope?: number;
  /** Available experiences that can be burned for bonus */
  experiences?: RollExperience[];
  /** Callback when Hope is spent pre-roll */
  onSpendHope?: (amount: number) => void;
}

function TraitsDetailedDisplay({
  traits,
  equipmentModifiers,
  onTraitClick,
}: {
  traits: TraitsState;
  equipmentModifiers?: TraitEquipmentModifiers;
  onTraitClick?: (name: TraitName, modifier: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
      {TRAIT_NAMES.map(name => {
        const trait = traits[name];
        const equipMod = equipmentModifiers?.[name] ?? 0;
        const total = trait.value + trait.bonus + equipMod;
        const sign = total >= 0 ? '+' : '';
        const isClickable = !!onTraitClick;

        return (
          <div
            key={name}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={
              isClickable ? `Roll ${name} (${sign}${total})` : undefined
            }
            onClick={isClickable ? () => onTraitClick(name, total) : undefined}
            onKeyDown={
              isClickable
                ? e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onTraitClick(name, total);
                    }
                  }
                : undefined
            }
            className={cn(
              'flex flex-col items-center rounded-lg border p-2 transition-colors sm:p-3',
              trait.marked && 'border-primary bg-primary/10',
              isClickable &&
                'cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 active:scale-95'
            )}
          >
            <span className="text-muted-foreground text-xs sm:text-sm">
              {name}
            </span>
            <span className="text-xl font-bold sm:text-2xl">
              {sign}
              {total}
            </span>
            {equipMod !== 0 && (
              <span
                className={cn(
                  'mt-0.5 text-[10px] font-medium sm:mt-1 sm:text-xs',
                  equipMod > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                ({equipMod > 0 ? '+' : ''}
                {equipMod} equip)
              </span>
            )}
            {trait.marked && (
              <span className="text-primary mt-0.5 text-[10px] font-medium sm:mt-1 sm:text-xs">
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

export function TraitsEditor({ traits, onChange }: TraitsEditorProps) {
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
  equipmentModifiers,
  onHopeChange,
  onFearChange,
  onStressClear,
  currentHope,
  experiences,
  onSpendHope,
}: TraitsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TraitsState>(traits);
  const [rollDialogOpen, setRollDialogOpen] = useState(false);
  const [rollTrait, setRollTrait] = useState<{
    name: TraitName;
    modifier: number;
  } | null>(null);

  const handleTraitClick = useCallback((name: TraitName, modifier: number) => {
    setRollTrait({ name, modifier });
    setRollDialogOpen(true);
  }, []);

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
      icon={Dice5}
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
      <TraitsDetailedDisplay
        traits={traits}
        equipmentModifiers={equipmentModifiers}
        onTraitClick={!readOnly ? handleTraitClick : undefined}
      />
      {rollTrait && (
        <DualityRollDialog
          open={rollDialogOpen}
          onOpenChange={setRollDialogOpen}
          defaultModifier={rollTrait.modifier}
          rollLabel={`${rollTrait.name} Check`}
          onHopeChange={onHopeChange}
          onFearChange={onFearChange}
          onStressClear={onStressClear}
          currentHope={currentHope}
          experiences={experiences}
          onSpendHope={onSpendHope}
        />
      )}
    </EditableSection>
  );
}

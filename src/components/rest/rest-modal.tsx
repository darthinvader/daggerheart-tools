/**
 * Rest modal component for taking short or long rests.
 * Follows the SRD rest system: 2 downtime moves per rest.
 */
import { ArrowLeft, Moon, Sun } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { REST_MOVE_CATEGORY_ICONS } from './constants';
import { getRestMoveResultSummary } from './rest-utils';
import type { RestModalProps, RestMove, RestMoveResult } from './types';
import { useRest } from './use-rest';

/** Max short rests before a long rest is required per SRD */
const MAX_SHORT_RESTS = 3;

export function RestModal({
  isOpen,
  onClose,
  tier,
  currentHp,
  maxHp,
  currentStress,
  maxStress,
  currentArmorMarked,
  totalArmorSlots,
  onRestComplete,
  shortRestsToday = 0,
}: RestModalProps) {
  const rest = useRest({
    tier,
    currentHp,
    maxHp,
    currentStress,
    maxStress,
    currentArmorMarked,
    totalArmorSlots,
    onComplete: onRestComplete,
  });

  const shortRestDisabled = shortRestsToday >= MAX_SHORT_RESTS;

  const handleClose = () => {
    rest.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        {rest.phase === 'select-type' && (
          <RestTypeSelection
            onSelect={rest.selectRestType}
            shortRestDisabled={shortRestDisabled}
            shortRestsToday={shortRestsToday}
          />
        )}
        {rest.phase === 'select-moves' && rest.restType && (
          <MoveSelection
            restType={rest.restType}
            availableMoves={rest.availableMoves}
            selection={rest.selection}
            preparingWithParty={rest.preparingWithParty}
            tier={tier}
            onSelectMove={rest.selectMove}
            onToggleParty={rest.togglePreparingWithParty}
            onBack={rest.goBack}
            onExecute={rest.executeRest}
            canExecute={rest.canExecute}
          />
        )}
        {rest.phase === 'results' && rest.restType && (
          <RestResults
            restType={rest.restType}
            results={rest.results}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface RestTypeSelectionProps {
  onSelect: (type: 'short' | 'long') => void;
  shortRestDisabled: boolean;
  shortRestsToday: number;
}

function RestTypeSelection({
  onSelect,
  shortRestDisabled,
  shortRestsToday,
}: RestTypeSelectionProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Take a Rest
        </DialogTitle>
        <DialogDescription>
          Choose the type of rest. Each rest allows 2 downtime moves.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <button
          type="button"
          onClick={() => !shortRestDisabled && onSelect('short')}
          disabled={shortRestDisabled}
          className={cn(
            'flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 text-left transition-colors',
            shortRestDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'hover:border-primary hover:bg-accent'
          )}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Sun className="h-5 w-5 text-amber-500" />
            Short Rest
            {shortRestsToday > 0 && (
              <span className="text-muted-foreground text-xs font-normal">
                ({shortRestsToday}/3 today)
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {shortRestDisabled ? (
              <span className="text-destructive">
                You must take a long rest after 3 short rests.
              </span>
            ) : (
              <>
                About 1 hour. Recovery moves restore{' '}
                <span className="font-medium">1d4 + Tier</span>.
              </>
            )}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelect('long')}
          className="hover:border-primary hover:bg-accent flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 text-left transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Moon className="h-5 w-5 text-indigo-500" />
            Long Rest
          </div>
          <p className="text-muted-foreground text-sm">
            Several hours of rest or sleep. Recovery moves restore{' '}
            <span className="font-medium">all</span> of a resource.
          </p>
        </button>
      </div>
    </>
  );
}

interface MoveSelectionProps {
  restType: 'short' | 'long';
  availableMoves: RestMove[];
  selection: {
    move1: RestMove | null;
    move2: RestMove | null;
  };
  preparingWithParty: boolean;
  tier: number;
  onSelectMove: (slot: 1 | 2, move: RestMove | null) => void;
  onToggleParty: () => void;
  onBack: () => void;
  onExecute: () => void;
  canExecute: boolean;
}

/** Individual move button */
interface MoveButtonProps {
  move: RestMove;
  isSelected1: boolean;
  isSelected2: boolean;
  onClick: () => void;
}

function MoveButton({
  move,
  isSelected1,
  isSelected2,
  onClick,
}: MoveButtonProps) {
  const isSelected = isSelected1 || isSelected2;
  const icon = REST_MOVE_CATEGORY_ICONS[move.category] || '📋';
  const selectionLabel =
    isSelected1 && isSelected2 ? '×2' : isSelected1 ? '#1' : '#2';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
        isSelected
          ? 'border-primary bg-primary/10'
          : 'hover:border-primary/50 hover:bg-accent'
      )}
    >
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{move.name}</span>
          {isSelected && (
            <Badge variant="secondary" className="text-xs">
              {selectionLabel}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{move.description}</p>
      </div>
    </button>
  );
}

/** Party toggle for Prepare move */
interface PartyToggleProps {
  checked: boolean;
  onChange: () => void;
}

function PartyToggle({ checked, onChange }: PartyToggleProps) {
  return (
    <label className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <div>
        <span className="font-medium">Preparing with party members</span>
        <p className="text-muted-foreground text-sm">
          Gain 2 Hope instead of 1 for each Prepare move
        </p>
      </div>
    </label>
  );
}

/** Helper to handle move toggle logic */
function handleMoveToggle(
  move: RestMove,
  selection: { move1: RestMove | null; move2: RestMove | null },
  onSelectMove: (slot: 1 | 2, move: RestMove | null) => void
) {
  const isInSlot1 = selection.move1?.id === move.id;
  const isInSlot2 = selection.move2?.id === move.id;
  const isInBoth = isInSlot1 && isInSlot2;

  // If in both slots, deselect slot2
  if (isInBoth) {
    onSelectMove(2, null);
    return;
  }

  // If only in slot1 and slot2 is empty, add to slot2 (same move twice)
  if (isInSlot1 && selection.move2 === null) {
    onSelectMove(2, move);
    return;
  }

  // If only in slot1 and slot2 is full, deselect slot1
  if (isInSlot1) {
    onSelectMove(1, null);
    return;
  }

  // If only in slot2, deselect slot2
  if (isInSlot2) {
    onSelectMove(2, null);
    return;
  }

  // Not selected - select into next available slot
  if (selection.move1 === null) {
    onSelectMove(1, move);
  } else if (selection.move2 === null) {
    onSelectMove(2, move);
  }
}

/** Get rest label and icon color */
function getRestStyle(restType: 'short' | 'long') {
  return {
    label: restType === 'short' ? 'Short Rest' : 'Long Rest',
    iconColor: restType === 'short' ? 'text-amber-500' : 'text-indigo-500',
    Icon: restType === 'short' ? Sun : Moon,
  };
}

function MoveSelection({
  restType,
  availableMoves,
  selection,
  preparingWithParty,
  tier,
  onSelectMove,
  onToggleParty,
  onBack,
  onExecute,
  canExecute,
}: MoveSelectionProps) {
  const { label, iconColor, Icon } = getRestStyle(restType);

  const hasPrepareMove = availableMoves.some(m => m.id === 'prepare');
  const isPrepareSelected =
    selection.move1?.id === 'prepare' || selection.move2?.id === 'prepare';

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Icon className={cn('h-5 w-5', iconColor)} />
          {label}
        </DialogTitle>
        <DialogDescription>
          Select 2 downtime moves. You can select the same move twice.
          {restType === 'short' && ` Recovery: 1d4+${tier}`}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Selected moves display */}
        <div className="flex gap-2">
          <Badge
            variant={selection.move1 ? 'default' : 'outline'}
            className="flex-1 justify-center py-2"
          >
            {selection.move1?.name ?? 'Move 1: Not selected'}
          </Badge>
          <Badge
            variant={selection.move2 ? 'default' : 'outline'}
            className="flex-1 justify-center py-2"
          >
            {selection.move2?.name ?? 'Move 2: Not selected'}
          </Badge>
        </div>

        {/* Move buttons */}
        <div className="grid gap-2">
          {availableMoves.map(move => (
            <MoveButton
              key={move.id}
              move={move}
              isSelected1={selection.move1?.id === move.id}
              isSelected2={selection.move2?.id === move.id}
              onClick={() => handleMoveToggle(move, selection, onSelectMove)}
            />
          ))}
        </div>

        {/* Prepare with party toggle */}
        {hasPrepareMove && isPrepareSelected && (
          <PartyToggle checked={preparingWithParty} onChange={onToggleParty} />
        )}
      </div>

      <DialogFooter className="flex-row justify-between sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onExecute} disabled={!canExecute}>
          Take Rest
        </Button>
      </DialogFooter>
    </>
  );
}

interface RestResultsProps {
  restType: 'short' | 'long';
  results: RestMoveResult[];
  onClose: () => void;
}

function RestResults({ restType, results, onClose }: RestResultsProps) {
  const restLabel = restType === 'short' ? 'Short Rest' : 'Long Rest';

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          ✨ {restLabel} Complete
        </DialogTitle>
        <DialogDescription>
          Here's what happened during your rest.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 py-4">
        {results.map((result, index) => {
          const icon =
            REST_MOVE_CATEGORY_ICONS[
              result.moveId.includes('wound')
                ? 'healing'
                : result.moveId.includes('stress')
                  ? 'stress'
                  : result.moveId.includes('armor')
                    ? 'armor'
                    : result.moveId === 'prepare'
                      ? 'hope'
                      : 'project'
            ] || '📋';

          return (
            <div
              key={`${result.moveId}-${index}`}
              className="bg-muted/50 flex items-center gap-3 rounded-lg p-4"
            >
              <span className="text-2xl">{icon}</span>
              <div className="flex-1">
                <div className="font-medium">{result.moveName}</div>
                <div className="text-primary text-lg font-semibold">
                  {getRestMoveResultSummary(result)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DialogFooter>
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </DialogFooter>
    </>
  );
}

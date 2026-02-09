import { Skull } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Flame } from '@/lib/icons';

import { DEATH_MOVE_OPTIONS } from './constants';
import { DeathMoveOptionCard } from './death-move-option-card';
import { DeathMoveResultDisplay } from './death-move-result-display';
import type { DeathMoveResult, DeathMoveType } from './types';

interface DeathMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterLevel: number;
  characterName?: string;
  onExecuteMove: (moveType: DeathMoveType) => DeathMoveResult;
  /** Callback when player allocates clearing value between HP and Stress */
  onAllocateClearing?: (hpAmount: number, stressAmount: number) => void;
}

/** Move selection UI */
function MoveSelectionContent({
  characterLevel,
  selectedMove,
  onSelect,
}: {
  characterLevel: number;
  selectedMove: DeathMoveType | null;
  onSelect: (type: DeathMoveType) => void;
}) {
  return (
    <>
      <p className="text-muted-foreground text-sm">
        Choose how to face death. Your current level is{' '}
        <span className="font-bold">{characterLevel}</span>.
      </p>
      <div className="space-y-3">
        {DEATH_MOVE_OPTIONS.map(option => (
          <DeathMoveOptionCard
            key={option.type}
            type={option.type}
            isSelected={selectedMove === option.type}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}

/** Blaze of Glory confirmation UI */
function BlazeConfirmContent({ characterName }: { characterName: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-destructive/10 border-destructive rounded-lg border-2 p-4">
        <h4 className="text-destructive mb-2 font-bold">⚠️ Final Warning</h4>
        <p className="text-sm">
          Choosing <strong>Blaze of Glory</strong> means your character will
          die. This cannot be undone. Your next action will critically succeed,
          and then {characterName} will cross through the veil of death.
        </p>
      </div>
      <p className="text-muted-foreground text-sm">
        Are you sure you want to proceed?
      </p>
    </div>
  );
}

/**
 * Allocation UI for Risk It All non-critical success.
 * Per SRD: "divide the Hope Die value between Hit Points and Stress however you'd prefer"
 */
function ClearingAllocationContent({
  clearingValue,
  hpAllocation,
  onHpAllocationChange,
}: {
  clearingValue: number;
  hpAllocation: number;
  onHpAllocationChange: (hp: number) => void;
}) {
  const stressAllocation = clearingValue - hpAllocation;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-green-500 bg-green-500/20 p-4">
        <h4 className="mb-2 font-bold text-green-700 dark:text-green-300">
          🎲 Hope Wins!
        </h4>
        <p className="text-sm">
          Divide your <strong>{clearingValue}</strong> clearing points between
          HP and Stress however you prefer.
        </p>
      </div>

      <div className="space-y-3">
        <Label>
          HP to clear: <strong>{hpAllocation}</strong> | Stress to clear:{' '}
          <strong>{stressAllocation}</strong>
        </Label>
        <Slider
          value={[hpAllocation]}
          onValueChange={(values: number[]) => onHpAllocationChange(values[0])}
          min={0}
          max={clearingValue}
          step={1}
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>All to Stress</span>
          <span>All to HP</span>
        </div>
      </div>
    </div>
  );
}

/** Discriminated phase for modal state */
type FooterPhase = 'selecting' | 'confirming' | 'allocating' | 'result';

interface DeathMoveFooterProps {
  phase: FooterPhase;
  selectedMove: DeathMoveType | null;
  survived?: boolean;
  onClose: () => void;
  onConfirmSelection: () => void;
  onConfirmAllocation: () => void;
  onGoBack: () => void;
  onConfirmBlaze: () => void;
}

/** Footer actions for each modal phase */
function DeathMoveFooter({
  phase,
  selectedMove,
  survived,
  onClose,
  onConfirmSelection,
  onConfirmAllocation,
  onGoBack,
  onConfirmBlaze,
}: DeathMoveFooterProps) {
  switch (phase) {
    case 'selecting':
      return (
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirmSelection}
            disabled={!selectedMove}
            variant="destructive"
          >
            Make Death Move
          </Button>
        </>
      );
    case 'confirming':
      return (
        <>
          <Button variant="outline" onClick={onGoBack}>
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmBlaze}
            className="gap-1.5"
          >
            <Flame className="size-4" /> Embrace Death
          </Button>
        </>
      );
    case 'allocating':
      return <Button onClick={onConfirmAllocation}>Confirm Allocation</Button>;
    case 'result':
      return (
        <Button onClick={onClose}>
          {survived ? 'Continue' : 'Acknowledge'}
        </Button>
      );
  }
}

export function DeathMoveModal({
  isOpen,
  onClose,
  characterLevel,
  characterName = 'Your character',
  onExecuteMove,
  onAllocateClearing,
}: DeathMoveModalProps) {
  const [selectedMove, setSelectedMove] = useState<DeathMoveType | null>(null);
  const [result, setResult] = useState<DeathMoveResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  // Allocation state for Risk It All non-critical success
  const [hpAllocation, setHpAllocation] = useState(0);
  const [allocationConfirmed, setAllocationConfirmed] = useState(false);

  const handleExecute = () => {
    if (!selectedMove) return;
    const moveResult = onExecuteMove(selectedMove);
    setResult(moveResult);
    // Pre-set HP allocation to the clearing value (default all to HP)
    if (moveResult.needsAllocation && moveResult.clearingValue) {
      setHpAllocation(moveResult.clearingValue);
    }
  };

  const handleConfirmAllocation = () => {
    if (!result?.clearingValue) return;
    const stressAmount = result.clearingValue - hpAllocation;
    onAllocateClearing?.(hpAllocation, stressAmount);
    // Update result with final allocation
    setResult({
      ...result,
      hpCleared: hpAllocation,
      stressCleared: stressAmount,
      needsAllocation: false,
    });
    setAllocationConfirmed(true);
  };

  const handleClose = () => {
    setSelectedMove(null);
    setResult(null);
    setIsConfirming(false);
    setHpAllocation(0);
    setAllocationConfirmed(false);
    onClose();
  };

  const handleConfirmSelection = () => {
    if (selectedMove === 'blaze_of_glory') setIsConfirming(true);
    else handleExecute();
  };

  const handleGoBack = () => setIsConfirming(false);

  const handleConfirmBlaze = () => {
    setIsConfirming(false);
    handleExecute();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  // Determine modal phase from state
  const needsAllocation =
    result?.needsAllocation && result.clearingValue && !allocationConfirmed;
  const phase: FooterPhase = result
    ? needsAllocation
      ? 'allocating'
      : 'result'
    : isConfirming
      ? 'confirming'
      : 'selecting';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[98vw] max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Skull className="size-5" />
            Death Move Required
          </DialogTitle>
          <DialogDescription>
            {characterName} has marked their last Hit Point and must make a
            death move.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!result && !isConfirming && (
            <MoveSelectionContent
              characterLevel={characterLevel}
              selectedMove={selectedMove}
              onSelect={setSelectedMove}
            />
          )}
          {isConfirming && (
            <BlazeConfirmContent characterName={characterName} />
          )}
          {result && needsAllocation && (
            <ClearingAllocationContent
              clearingValue={result.clearingValue!}
              hpAllocation={hpAllocation}
              onHpAllocationChange={setHpAllocation}
            />
          )}
          {result && !needsAllocation && (
            <DeathMoveResultDisplay result={result} />
          )}
        </div>

        <DialogFooter>
          <DeathMoveFooter
            phase={phase}
            selectedMove={selectedMove}
            survived={result?.survived}
            onClose={handleClose}
            onConfirmSelection={handleConfirmSelection}
            onConfirmAllocation={handleConfirmAllocation}
            onGoBack={handleGoBack}
            onConfirmBlaze={handleConfirmBlaze}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

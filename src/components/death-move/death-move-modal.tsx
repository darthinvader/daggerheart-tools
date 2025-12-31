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
}

export function DeathMoveModal({
  isOpen,
  onClose,
  characterLevel,
  characterName = 'Your character',
  onExecuteMove,
}: DeathMoveModalProps) {
  const [selectedMove, setSelectedMove] = useState<DeathMoveType | null>(null);
  const [result, setResult] = useState<DeathMoveResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleExecute = () => {
    if (!selectedMove) return;
    const moveResult = onExecuteMove(selectedMove);
    setResult(moveResult);
  };

  const handleClose = () => {
    setSelectedMove(null);
    setResult(null);
    setIsConfirming(false);
    onClose();
  };

  const handleConfirmSelection = () => {
    if (selectedMove === 'blaze_of_glory') {
      setIsConfirming(true);
    } else {
      handleExecute();
    }
  };

  const handleConfirmBlazeOfGlory = () => {
    setIsConfirming(false);
    handleExecute();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
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
                    onSelect={setSelectedMove}
                  />
                ))}
              </div>
            </>
          )}

          {isConfirming && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border-destructive rounded-lg border-2 p-4">
                <h4 className="text-destructive mb-2 font-bold">
                  ⚠️ Final Warning
                </h4>
                <p className="text-sm">
                  Choosing <strong>Blaze of Glory</strong> means your character
                  will die. This cannot be undone. Your next action will
                  critically succeed, and then {characterName} will cross
                  through the veil of death.
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to proceed?
              </p>
            </div>
          )}

          {result && <DeathMoveResultDisplay result={result} />}
        </div>

        <DialogFooter>
          {!result && !isConfirming && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={!selectedMove}
                variant="destructive"
              >
                Make Death Move
              </Button>
            </>
          )}

          {isConfirming && (
            <>
              <Button variant="outline" onClick={() => setIsConfirming(false)}>
                Go Back
              </Button>
              <Button variant="destructive" onClick={handleConfirmBlazeOfGlory}>
                🔥 Embrace Death
              </Button>
            </>
          )}

          {result && (
            <Button onClick={handleClose}>
              {result.survived ? 'Continue' : 'Acknowledge'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { ArrowRight, ChevronUp, Dog } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CharacterTier } from '@/lib/schemas/core';

import type { LevelUpStep } from './types';

const TIER_NUMBERS: Record<string, number> = {
  '1': 1,
  '2-4': 2,
  '5-7': 3,
  '8-10': 4,
};

interface ModalHeaderProps {
  targetLevel: number;
  targetTier: CharacterTier;
  currentStep: LevelUpStep;
  hasCompanion: boolean;
}

export function ModalHeader({
  targetLevel,
  targetTier,
  currentStep,
  hasCompanion,
}: ModalHeaderProps) {
  const getDescription = () => {
    switch (currentStep) {
      case 'automatic-benefits':
        return 'Complete your automatic level-up benefits';
      case 'companion-benefits':
        return 'Choose a training upgrade for your companion';
      case 'advancement-options':
        return `Choose your advancements for Tier ${TIER_NUMBERS[targetTier] ?? targetTier}`;
    }
  };

  const getStepIndicator = () => {
    if (!hasCompanion) return null;
    const steps = [
      'automatic-benefits',
      'companion-benefits',
      'advancement-options',
    ];
    const currentIndex = steps.indexOf(currentStep) + 1;
    return `Step ${currentIndex} of 3`;
  };

  return (
    <DialogHeader className="shrink-0 border-b p-6 pb-4">
      <DialogTitle className="flex items-center gap-2">
        {currentStep === 'companion-benefits' ? (
          <Dog className="size-5" />
        ) : (
          <ChevronUp className="size-5" />
        )}
        Level Up to {targetLevel}
        {hasCompanion && (
          <span className="text-muted-foreground ml-auto text-sm font-normal">
            {getStepIndicator()}
          </span>
        )}
      </DialogTitle>
      <DialogDescription>{getDescription()}</DialogDescription>
    </DialogHeader>
  );
}

interface ModalFooterProps {
  currentStep: LevelUpStep;
  canProceedFromAutomatic: boolean;
  pointsRemaining: number;
  onClose: () => void;
  onConfirm: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function ModalFooter({
  currentStep,
  canProceedFromAutomatic,
  pointsRemaining,
  onClose,
  onConfirm,
  onNext,
  onBack,
}: ModalFooterProps) {
  if (currentStep === 'automatic-benefits') {
    return (
      <DialogFooter className="shrink-0 border-t p-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceedFromAutomatic}
          className="gap-2"
        >
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </DialogFooter>
    );
  }

  if (currentStep === 'companion-benefits') {
    return (
      <DialogFooter className="shrink-0 border-t p-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="gap-2">
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </DialogFooter>
    );
  }

  return (
    <DialogFooter className="shrink-0 border-t p-4">
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button
        onClick={onConfirm}
        disabled={pointsRemaining !== 0}
        className="gap-2"
      >
        <ChevronUp className="size-4" />
        Confirm Level Up
      </Button>
    </DialogFooter>
  );
}

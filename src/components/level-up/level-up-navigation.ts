import { useCallback } from 'react';

import type { LevelUpStep } from './types';
import type { useLevelUpState } from './use-level-up-state';

type LevelUpStateReturn = ReturnType<typeof useLevelUpState>;

interface NavigationHandlersParams {
  state: LevelUpStateReturn;
  hasCompanion: boolean;
  onClose: () => void;
  onConfirmResult: () => void;
  resetCompanionTraining: () => void;
}

export function useLevelUpNavigation({
  state,
  hasCompanion,
  onClose,
  onConfirmResult,
  resetCompanionTraining,
}: NavigationHandlersParams) {
  const handleConfirm = useCallback(() => {
    onConfirmResult();
    resetCompanionTraining();
    state.resetState();
  }, [state, onConfirmResult, resetCompanionTraining]);

  const handleClose = useCallback(() => {
    resetCompanionTraining();
    state.resetState();
    onClose();
  }, [onClose, state, resetCompanionTraining]);

  const handleNext = useCallback(() => {
    if (state.currentStep === 'automatic-benefits') {
      state.setCurrentStep(
        hasCompanion ? 'companion-benefits' : 'advancement-options'
      );
    } else if (state.currentStep === 'companion-benefits') {
      state.setCurrentStep('advancement-options');
    }
  }, [state, hasCompanion]);

  const handleBack = useCallback(() => {
    if (state.currentStep === 'advancement-options') {
      state.setCurrentStep(
        hasCompanion ? 'companion-benefits' : 'automatic-benefits'
      );
    } else if (state.currentStep === 'companion-benefits') {
      state.setCurrentStep('automatic-benefits');
    }
  }, [state, hasCompanion]);

  return { handleConfirm, handleClose, handleNext, handleBack };
}

export function getMainDialogStep(
  currentStep: LevelUpStep
): 'automatic' | 'companion' | 'advancement' {
  switch (currentStep) {
    case 'automatic-benefits':
      return 'automatic';
    case 'companion-benefits':
      return 'companion';
    case 'advancement-options':
      return 'advancement';
  }
}

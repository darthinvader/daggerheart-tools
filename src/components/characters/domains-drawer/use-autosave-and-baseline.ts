import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { useBaselineSnapshot } from '@/components/characters/hooks/use-baseline-snapshot';
import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';

import type { DomainsFormValues } from '../domains-drawer';

type Params = {
  open: boolean;
  form: UseFormReturn<DomainsFormValues>;
  submit: () => void | Promise<void>;
};

export function useAutosaveAndBaseline({ open, form, submit }: Params) {
  // Track baseline form values when the drawer opens so we can Reset to it.
  const baselineRef = useBaselineSnapshot(open, () => form.getValues());
  // When Cancel/Save is pressed, we skip auto-save on close to avoid double-save.
  const skipAutoSaveRef = React.useRef(false);

  // Auto-save on any close path, guarded by validation & limits.
  useDrawerAutosaveOnClose({
    open,
    trigger: () => form.trigger(),
    submit: () => submit(),
    skipRef: skipAutoSaveRef,
  });

  const creationComplete = form.watch('creationComplete') ?? false;

  const handleCancel = React.useCallback((onCancel: () => void) => {
    skipAutoSaveRef.current = true;
    onCancel();
  }, []);

  const markSkip = React.useCallback(() => {
    skipAutoSaveRef.current = true;
  }, []);

  const resetToBaseline = React.useCallback(() => {
    if (baselineRef.current) form.reset(baselineRef.current);
  }, [form, baselineRef]);

  return {
    skipAutoSaveRef,
    baselineRef,
    creationComplete,
    handleCancel,
    markSkip,
    resetToBaseline,
  } as const;
}

import { useMemo } from 'react';

import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { useMeasureReady } from '@/hooks/use-measure-ready';

import { useAfterOpenFlag } from './use-after-open';
import { useClosingFreeze } from './use-closing-freeze';

export function useDrawerStage(open: boolean) {
  const { closing, startClosing, clearClosing } = useClosingFreeze();
  const afterOpen = useAfterOpenFlag(open);
  const measureReady = useMeasureReady(open);
  const coarse = useCoarsePointer();
  const virtualOverscan = useMemo(() => (coarse ? 1 : 3), [coarse]);

  return {
    closing,
    startClosing,
    clearClosing,
    afterOpen,
    measureReady,
    virtualOverscan,
  } as const;
}

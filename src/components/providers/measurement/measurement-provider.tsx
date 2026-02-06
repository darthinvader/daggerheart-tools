import { type ReactNode, useCallback, useMemo, useState } from 'react';

import type { MeasurementUnit } from '@/lib/types/measurement';

import {
  MeasurementProviderContext,
  type MeasurementProviderState,
} from './measurement-context';

const STORAGE_KEY = 'daggerheart-measurement-unit';
const DEFAULT_UNIT: MeasurementUnit = 'feet';

interface MeasurementProviderProps {
  children: ReactNode;
}

export function MeasurementProvider({ children }: MeasurementProviderProps) {
  const [unit, setUnitState] = useState<MeasurementUnit>(
    () =>
      (localStorage.getItem(STORAGE_KEY) as MeasurementUnit | null) ??
      DEFAULT_UNIT
  );

  const setUnit = useCallback((u: MeasurementUnit) => {
    localStorage.setItem(STORAGE_KEY, u);
    setUnitState(u);
  }, []);

  const value: MeasurementProviderState = useMemo(
    () => ({ unit, setUnit }),
    [unit, setUnit]
  );

  return (
    <MeasurementProviderContext.Provider value={value}>
      {children}
    </MeasurementProviderContext.Provider>
  );
}

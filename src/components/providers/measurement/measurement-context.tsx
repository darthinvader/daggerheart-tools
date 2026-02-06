import { createContext, useContext } from 'react';

import type { MeasurementUnit } from '@/lib/types/measurement';

export interface MeasurementProviderState {
  unit: MeasurementUnit;
  setUnit: (unit: MeasurementUnit) => void;
}

export const MeasurementProviderContext = createContext<
  MeasurementProviderState | undefined
>(undefined);

export function useMeasurement() {
  const context = useContext(MeasurementProviderContext);

  if (context === undefined) {
    throw new Error('useMeasurement must be used within a MeasurementProvider');
  }

  return context;
}

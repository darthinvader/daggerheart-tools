/**
 * Hook for managing adversary threshold state
 */
import { useCallback } from 'react';

interface Thresholds {
  major: number | null;
  severe: number | null;
}

interface UseThresholdHandlersOptions<T> {
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  getThresholds: (data: T) => Thresholds | string | undefined;
}

export function useThresholdHandlers<T>({
  setFormData,
  getThresholds,
}: UseThresholdHandlersOptions<T>) {
  const updateThreshold = useCallback(
    (field: 'major' | 'severe', value: string) => {
      const numValue = value === '' ? null : parseInt(value, 10);
      setFormData(prev => {
        const currentThresholds = getThresholds(prev);
        if (typeof currentThresholds === 'object') {
          return {
            ...prev,
            thresholds: {
              ...currentThresholds,
              [field]: numValue,
            },
          };
        }
        return prev;
      });
    },
    [setFormData, getThresholds]
  );

  const getThresholdValue = useCallback(
    (data: T, field: 'major' | 'severe'): string => {
      const thresholds = getThresholds(data);
      if (typeof thresholds === 'object') {
        const val = thresholds[field];
        return val === null || val === undefined ? '' : String(val);
      }
      return '';
    },
    [getThresholds]
  );

  const getMassiveThreshold = useCallback(
    (data: T): string => {
      const thresholds = getThresholds(data);
      if (typeof thresholds === 'object') {
        const severe = thresholds.severe;
        if (severe !== null && severe !== undefined) {
          return String(severe * 2);
        }
      }
      return '—';
    },
    [getThresholds]
  );

  return { updateThreshold, getThresholdValue, getMassiveThreshold };
}

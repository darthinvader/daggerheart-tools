/**
 * Hook for managing Points of Interest in LocationCard
 */
import { useCallback, useState } from 'react';

import { generateId } from '@/lib/utils';

interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  significance: string;
}

interface UsePOIHandlersOptions<T> {
  setLocalEntity: React.Dispatch<React.SetStateAction<T>>;
  scheduleAutoSave: (data: T) => void;
  poiField: keyof T;
}

export function usePOIHandlers<T>({
  setLocalEntity,
  scheduleAutoSave,
  poiField,
}: UsePOIHandlersOptions<T>) {
  const [poiName, setPoiName] = useState('');
  const [poiDesc, setPoiDesc] = useState('');
  const [poiSignificance, setPoiSignificance] = useState('');

  const addPOI = useCallback(() => {
    const trimmedName = poiName.trim();
    if (!trimmedName) return;
    const newPOI: PointOfInterest = {
      id: generateId(),
      name: trimmedName,
      description: poiDesc.trim(),
      significance: poiSignificance.trim(),
    };
    setLocalEntity(current => {
      const currentPOIs =
        (current[poiField] as PointOfInterest[] | undefined) ?? [];
      const updated = {
        ...current,
        [poiField]: [...currentPOIs, newPOI],
      };
      scheduleAutoSave(updated);
      return updated;
    });
    setPoiName('');
    setPoiDesc('');
    setPoiSignificance('');
  }, [
    poiName,
    poiDesc,
    poiSignificance,
    poiField,
    setLocalEntity,
    scheduleAutoSave,
  ]);

  const removePOI = useCallback(
    (poiId: string) => {
      setLocalEntity(current => {
        const currentPOIs =
          (current[poiField] as PointOfInterest[] | undefined) ?? [];
        const updated = {
          ...current,
          [poiField]: currentPOIs.filter(poi => poi.id !== poiId),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [poiField, setLocalEntity, scheduleAutoSave]
  );

  return {
    poiName,
    setPoiName,
    poiDesc,
    setPoiDesc,
    poiSignificance,
    setPoiSignificance,
    addPOI,
    removePOI,
  };
}

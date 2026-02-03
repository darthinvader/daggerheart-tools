/**
 * Class Form Field Handlers Hook
 *
 * Memoized handlers for simple field updates in ClassForm.
 */
import { useCallback } from 'react';

import type { ClassFormData } from './class-form';

type SetFormData = React.Dispatch<React.SetStateAction<ClassFormData>>;

export function useClassFormFieldHandlers(setFormData: SetFormData) {
  const handleNameChange = useCallback(
    (value: string) => setFormData(prev => ({ ...prev, name: value })),
    [setFormData]
  );

  const handleDescriptionChange = useCallback(
    (value: string) => setFormData(prev => ({ ...prev, description: value })),
    [setFormData]
  );

  const handleHitPointsChange = useCallback(
    (value: number) =>
      setFormData(prev => ({ ...prev, startingHitPoints: value })),
    [setFormData]
  );

  const handleEvasionChange = useCallback(
    (value: number) =>
      setFormData(prev => ({ ...prev, startingEvasion: value })),
    [setFormData]
  );

  const handleHopeFeatureChange = useCallback(
    (updates: { name?: string; description?: string; hopeCost?: number }) =>
      setFormData(prev => ({
        ...prev,
        hopeFeature: {
          name: updates.name ?? prev.hopeFeature?.name ?? '',
          description:
            updates.description ?? prev.hopeFeature?.description ?? '',
          hopeCost: updates.hopeCost ?? prev.hopeFeature?.hopeCost ?? 3,
        },
      })),
    [setFormData]
  );

  return {
    handleNameChange,
    handleDescriptionChange,
    handleHitPointsChange,
    handleEvasionChange,
    handleHopeFeatureChange,
  };
}

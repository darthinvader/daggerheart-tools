/**
 * Homebrew Ancestry Form
 *
 * Form for creating and editing homebrew ancestries.
 * Uses singular primaryFeature/secondaryFeature objects per schema.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLatestRef } from '@/hooks/use-latest-ref';
import type { FeatureStatModifiers } from '@/lib/schemas/core';

import {
  AncestryBasicInfoSection,
  AncestryFeatureSection,
  AncestryPhysicalCharacteristicsSection,
} from './ancestry-form-sections';

/**
 * Data shape that the AncestryForm works with.
 * Compatible with both HomebrewAncestry['content'] (homebrew page)
 * and the character page inline ancestry type.
 */
export interface AncestryFormData {
  name: string;
  description: string;
  heightRange: string;
  lifespan: string;
  physicalCharacteristics: string[];
  primaryFeature: {
    name: string;
    description: string;
    type: 'primary' | 'secondary';
    modifiers?: FeatureStatModifiers;
  };
  secondaryFeature: {
    name: string;
    description: string;
    type: 'primary' | 'secondary';
    modifiers?: FeatureStatModifiers;
  };
  isHomebrew: true;
}

interface AncestryFormProps {
  initialData?: AncestryFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: AncestryFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: AncestryFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
}

const DEFAULT_ANCESTRY_DATA: AncestryFormData = {
  name: '',
  description: '',
  heightRange: '',
  lifespan: '',
  physicalCharacteristics: [],
  primaryFeature: { name: '', description: '', type: 'primary' },
  secondaryFeature: { name: '', description: '', type: 'secondary' },
  isHomebrew: true,
};

export function AncestryForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
}: AncestryFormProps) {
  const [formData, setFormData] = useState<AncestryFormData>(
    initialData ?? DEFAULT_ANCESTRY_DATA
  );
  const [characteristics, setCharacteristics] = useState<string[]>(
    initialData?.physicalCharacteristics ?? []
  );
  const [newCharacteristic, setNewCharacteristic] = useState('');

  // Track previous data to avoid notifying on unchanged values
  const prevDataRef = useRef<string | undefined>(undefined);
  // Store onChange in ref to avoid dependency on unstable callback reference
  const onChangeRef = useLatestRef(onChange);

  // Build current data for callbacks
  const buildCurrentData = useCallback((): AncestryFormData => {
    return {
      ...formData,
      physicalCharacteristics: characteristics.filter(c => c.trim()),
      isHomebrew: true,
    };
  }, [formData, characteristics]);

  // Auto-notify on changes (for inline mode)
  useEffect(() => {
    const currentData = buildCurrentData();
    const serialized = JSON.stringify(currentData);
    if (onChangeRef.current && serialized !== prevDataRef.current) {
      prevDataRef.current = serialized;
      onChangeRef.current(currentData);
    }
  }, [buildCurrentData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(buildCurrentData());
      }
    },
    [onSubmit, buildCurrentData]
  );

  const updateField = useCallback(
    <K extends keyof AncestryFormData>(key: K, value: AncestryFormData[K]) =>
      setFormData(prev => ({ ...prev, [key]: value })),
    []
  );

  const handleNameChange = useCallback(
    (name: string) => updateField('name', name),
    [updateField]
  );
  const handleDescriptionChange = useCallback(
    (description: string) => updateField('description', description),
    [updateField]
  );
  const handleHeightRangeChange = useCallback(
    (heightRange: string) => updateField('heightRange', heightRange),
    [updateField]
  );
  const handleLifespanChange = useCallback(
    (lifespan: string) => updateField('lifespan', lifespan),
    [updateField]
  );
  const handlePrimaryFeatureChange = useCallback(
    (primaryFeature: AncestryFormData['primaryFeature']) =>
      updateField('primaryFeature', primaryFeature),
    [updateField]
  );
  const handleSecondaryFeatureChange = useCallback(
    (secondaryFeature: AncestryFormData['secondaryFeature']) =>
      updateField('secondaryFeature', secondaryFeature),
    [updateField]
  );

  const addCharacteristic = useCallback(
    (value: string) => {
      if (value.trim() && !characteristics.includes(value.trim())) {
        setCharacteristics(prev => [...prev, value.trim()]);
      }
    },
    [characteristics]
  );

  const addCustomCharacteristic = useCallback(() => {
    if (
      newCharacteristic.trim() &&
      !characteristics.includes(newCharacteristic.trim())
    ) {
      setCharacteristics(prev => [...prev, newCharacteristic.trim()]);
      setNewCharacteristic('');
    }
  }, [newCharacteristic, characteristics]);

  const removeCharacteristic = useCallback((index: number) => {
    setCharacteristics(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          <AncestryBasicInfoSection
            name={formData.name}
            description={formData.description ?? ''}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
          />

          <Separator />

          <AncestryPhysicalCharacteristicsSection
            heightRange={formData.heightRange ?? ''}
            lifespan={formData.lifespan ?? ''}
            characteristics={characteristics}
            newCharacteristic={newCharacteristic}
            onHeightRangeChange={handleHeightRangeChange}
            onLifespanChange={handleLifespanChange}
            onAddCharacteristic={addCharacteristic}
            onRemoveCharacteristic={removeCharacteristic}
            onNewCharacteristicChange={setNewCharacteristic}
            onAddCustomCharacteristic={addCustomCharacteristic}
          />

          <Separator />

          <AncestryFeatureSection
            feature={formData.primaryFeature}
            onChange={handlePrimaryFeatureChange}
            variant="primary"
          />

          <Separator />

          <AncestryFeatureSection
            feature={formData.secondaryFeature}
            onChange={handleSecondaryFeatureChange}
            variant="secondary"
          />
        </div>
      </ScrollArea>

      {showActions && (
        <>
          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save Ancestry'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

/**
 * Homebrew Ancestry Form
 *
 * Form for creating and editing homebrew ancestries.
 * Uses singular primaryFeature/secondaryFeature objects per schema.
 */
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
    if (onChange) {
      onChange(buildCurrentData());
    }
  }, [formData, characteristics]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(buildCurrentData());
      }
    },
    [onSubmit, buildCurrentData]
  );

  const addCharacteristic = (value: string) => {
    if (value.trim() && !characteristics.includes(value.trim())) {
      setCharacteristics(prev => [...prev, value.trim()]);
    }
  };

  const addCustomCharacteristic = () => {
    if (
      newCharacteristic.trim() &&
      !characteristics.includes(newCharacteristic.trim())
    ) {
      setCharacteristics(prev => [...prev, newCharacteristic.trim()]);
      setNewCharacteristic('');
    }
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          <AncestryBasicInfoSection
            name={formData.name}
            description={formData.description ?? ''}
            onNameChange={name => setFormData(prev => ({ ...prev, name }))}
            onDescriptionChange={description =>
              setFormData(prev => ({ ...prev, description }))
            }
          />

          <Separator />

          <AncestryPhysicalCharacteristicsSection
            heightRange={formData.heightRange ?? ''}
            lifespan={formData.lifespan ?? ''}
            characteristics={characteristics}
            newCharacteristic={newCharacteristic}
            onHeightRangeChange={heightRange =>
              setFormData(prev => ({ ...prev, heightRange }))
            }
            onLifespanChange={lifespan =>
              setFormData(prev => ({ ...prev, lifespan }))
            }
            onAddCharacteristic={addCharacteristic}
            onRemoveCharacteristic={removeCharacteristic}
            onNewCharacteristicChange={setNewCharacteristic}
            onAddCustomCharacteristic={addCustomCharacteristic}
          />

          <Separator />

          <AncestryFeatureSection
            feature={formData.primaryFeature}
            onChange={primaryFeature =>
              setFormData(prev => ({ ...prev, primaryFeature }))
            }
            variant="primary"
          />

          <Separator />

          <AncestryFeatureSection
            feature={formData.secondaryFeature}
            onChange={secondaryFeature =>
              setFormData(prev => ({ ...prev, secondaryFeature }))
            }
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

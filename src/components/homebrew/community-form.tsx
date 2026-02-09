/**
 * Homebrew Community Form
 *
 * Form for creating and editing homebrew communities.
 * Uses singular feature object per schema.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLatestRef } from '@/hooks/use-latest-ref';
import type { FeatureStatModifiers } from '@/lib/schemas/core';

import {
  CommonTraitsSection,
  CommunityFeatureSection,
  CommunityInfoSection,
} from './community-form-sections';

/**
 * Data shape that the CommunityForm works with.
 * Compatible with both HomebrewCommunity['content'] (homebrew page)
 * and the character page inline community type.
 */
export interface CommunityFormData {
  name: string;
  description: string;
  commonTraits: string[];
  feature: {
    name: string;
    description: string;
    modifiers?: FeatureStatModifiers;
  };
  isHomebrew: true;
}

interface CommunityFormProps {
  initialData?: CommunityFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: CommunityFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: CommunityFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
}

const DEFAULT_COMMUNITY_DATA: CommunityFormData = {
  name: '',
  description: '',
  commonTraits: [],
  feature: { name: '', description: '' },
  isHomebrew: true,
};

export function CommunityForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
}: CommunityFormProps) {
  const [formData, setFormData] = useState<CommunityFormData>(
    initialData ?? DEFAULT_COMMUNITY_DATA
  );
  const [commonTraits, setCommonTraits] = useState<string[]>(
    initialData?.commonTraits ?? []
  );
  const [newTrait, setNewTrait] = useState('');

  // Track previous data to avoid notifying on unchanged values
  const prevDataRef = useRef<string | undefined>(undefined);
  // Store onChange in ref to avoid dependency on unstable callback reference
  const onChangeRef = useLatestRef(onChange);

  // Build current data for callbacks
  const buildCurrentData = useCallback((): CommunityFormData => {
    return {
      ...formData,
      commonTraits: commonTraits.filter(t => t.trim()),
      isHomebrew: true,
    };
  }, [formData, commonTraits]);

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

  const addTrait = (trait: string) => {
    if (trait.trim() && !commonTraits.includes(trait.trim())) {
      setCommonTraits(prev => [...prev, trait.trim()]);
    }
  };

  const addCustomTrait = () => {
    if (newTrait.trim() && !commonTraits.includes(newTrait.trim())) {
      setCommonTraits(prev => [...prev, newTrait.trim()]);
      setNewTrait('');
    }
  };

  const removeTrait = (trait: string) => {
    setCommonTraits(prev => prev.filter(t => t !== trait));
  };

  const handleNameChange = useCallback((name: string) => {
    setFormData(prev => ({ ...prev, name }));
  }, []);

  const handleDescriptionChange = useCallback((description: string) => {
    setFormData(prev => ({ ...prev, description }));
  }, []);

  const updateFeatureField = useCallback(
    (updates: Partial<CommunityFormData['feature']>) => {
      setFormData(prev => ({
        ...prev,
        feature: { ...prev.feature, ...updates },
      }));
    },
    []
  );

  const handleFeatureNameChange = useCallback(
    (name: string) => updateFeatureField({ name }),
    [updateFeatureField]
  );

  const handleFeatureDescriptionChange = useCallback(
    (description: string) => updateFeatureField({ description }),
    [updateFeatureField]
  );

  const handleModifiersChange = useCallback(
    (modifiers: FeatureStatModifiers | undefined) =>
      updateFeatureField({ modifiers }),
    [updateFeatureField]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          <CommunityInfoSection
            name={formData.name}
            description={formData.description ?? ''}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
          />

          <Separator />

          <CommonTraitsSection
            commonTraits={commonTraits}
            newTrait={newTrait}
            setNewTrait={setNewTrait}
            addTrait={addTrait}
            addCustomTrait={addCustomTrait}
            removeTrait={removeTrait}
          />

          <Separator />

          <CommunityFeatureSection
            featureName={formData.feature.name}
            featureDescription={formData.feature.description}
            featureModifiers={formData.feature.modifiers}
            onFeatureNameChange={handleFeatureNameChange}
            onFeatureDescriptionChange={handleFeatureDescriptionChange}
            onModifiersChange={handleModifiersChange}
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
              {isSubmitting ? 'Saving...' : 'Save Community'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

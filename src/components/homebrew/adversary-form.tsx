/**
 * Homebrew Adversary Form
 *
 * Form for creating and editing homebrew adversaries.
 */
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HomebrewAdversary } from '@/lib/schemas/homebrew';
import { createDefaultAdversaryContent } from '@/lib/schemas/homebrew';

import {
  AdversaryAttackSection,
  AdversaryBasicInfoSection,
  AdversaryCombatStatsSection,
  AdversaryExperiencesSection,
  AdversaryFeaturesSection,
  AdversaryTagsSection,
  ATTACK_NAMES,
  ROLE_COLORS,
} from './adversary-form-sections';
import { useAdversaryFormState } from './use-adversary-form-state';
import { useThresholdHandlers } from './use-threshold-handlers';

function getInitialAttackNameMode(attackName?: string): 'preset' | 'custom' {
  if (
    attackName &&
    !ATTACK_NAMES.includes(attackName as (typeof ATTACK_NAMES)[number])
  ) {
    return 'custom';
  }
  return 'preset';
}

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

function FormActions({ onCancel, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Adversary'}
      </Button>
    </div>
  );
}

interface AdversaryFormProps {
  initialData?: HomebrewAdversary['content'];
  onSubmit: (data: HomebrewAdversary['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AdversaryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdversaryFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultAdversaryContent()
  );

  const {
    featureState,
    experienceState,
    tagState,
    buildFeaturesContent,
    getExperiencesContent,
  } = useAdversaryFormState({
    initialFeatures: initialData?.features,
    initialExperiences: initialData?.experiences,
    initialTags: initialData?.tags,
  });

  const [attackNameMode, setAttackNameMode] = useState<'preset' | 'custom'>(
    () => getInitialAttackNameMode(initialData?.attack.name)
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewAdversary['content'] = {
        ...formData,
        features: buildFeaturesContent(),
        experiences: getExperiencesContent(),
        tags: tagState.tags,
      };

      onSubmit(content);
    },
    [
      formData,
      buildFeaturesContent,
      getExperiencesContent,
      tagState.tags,
      onSubmit,
    ]
  );

  // Threshold handlers using extracted hook
  const { updateThreshold, getThresholdValue, getMassiveThreshold } =
    useThresholdHandlers({
      setFormData,
      getThresholds: data => data.thresholds,
    });

  const roleColor =
    ROLE_COLORS[formData.role] ?? 'border-red-500/30 bg-red-500/5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-4">
          <AdversaryBasicInfoSection
            formData={formData}
            setFormData={setFormData}
            roleColor={roleColor}
          />

          <AdversaryCombatStatsSection
            formData={formData}
            setFormData={setFormData}
            updateThreshold={updateThreshold}
            getThresholdValue={getThresholdValue}
            getMassiveThreshold={getMassiveThreshold}
          />

          <AdversaryAttackSection
            formData={formData}
            setFormData={setFormData}
            attackNameMode={attackNameMode}
            setAttackNameMode={setAttackNameMode}
          />

          <AdversaryFeaturesSection {...featureState} />

          <AdversaryExperiencesSection {...experienceState} />

          <AdversaryTagsSection {...tagState} />
        </div>
      </ScrollArea>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}

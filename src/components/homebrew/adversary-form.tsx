/**
 * Homebrew Adversary Form
 *
 * Form for creating and editing homebrew adversaries.
 */
import { useCallback, useMemo, useState } from 'react';

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
import {
  validateDamageFormat,
  validateModifierFormat,
  validateThresholds,
} from './adversary-validation';
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
  hasErrors: boolean;
}

function FormActions({ onCancel, isSubmitting, hasErrors }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || hasErrors}>
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

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const thresholdError = validateThresholds(formData.thresholds);
    if (thresholdError) errors.majorThreshold = thresholdError;
    const modifierError = validateModifierFormat(
      String(formData.attack.modifier)
    );
    if (modifierError) errors.modifier = modifierError;
    const damageError = validateDamageFormat(formData.attack.damage);
    if (damageError) errors.damage = damageError;
    return errors;
  }, [formData.thresholds, formData.attack.modifier, formData.attack.damage]);

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (hasValidationErrors) return;

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
      hasValidationErrors,
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
            thresholdError={validationErrors.majorThreshold}
          />

          <AdversaryAttackSection
            formData={formData}
            setFormData={setFormData}
            attackNameMode={attackNameMode}
            setAttackNameMode={setAttackNameMode}
            modifierError={validationErrors.modifier}
            damageError={validationErrors.damage}
          />

          <AdversaryFeaturesSection {...featureState} />

          <AdversaryExperiencesSection {...experienceState} />

          <AdversaryTagsSection {...tagState} />
        </div>
      </ScrollArea>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        hasErrors={hasValidationErrors}
      />
    </form>
  );
}

/**
 * Homebrew Domain Card Form
 *
 * Form for creating and editing homebrew domain cards.
 */
import { useCallback } from 'react';

import { FeatureModifiersSection } from '@/components/shared/feature-modifiers-section';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { HomebrewDomainCard } from '@/lib/schemas/homebrew';
import {
  BasicInfoSection,
  CostsSection,
  DescriptionSection,
  DOMAIN_COLORS,
  TagsSection,
} from './domain-card-form-sections';
import {
  useDomainCardFormData,
  useModifierManagement,
  useTagManagement,
} from './use-domain-card-form-state';

interface DomainCardFormProps {
  initialData?: HomebrewDomainCard['content'];
  onSubmit: (data: HomebrewDomainCard['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function DomainCardForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DomainCardFormProps) {
  const { formData, updateField, updateOptionalNumber } =
    useDomainCardFormData(initialData);
  const {
    tags,
    newTag,
    setNewTag,
    addTag,
    removeTag,
    addSuggestion,
    handleKeyDown,
  } = useTagManagement(initialData?.tags);
  const { modifiers, cleanModifiers, setFromFeatureModifiers } =
    useModifierManagement(initialData?.modifiers);

  const buildContent = useCallback(
    (): HomebrewDomainCard['content'] => ({
      ...formData,
      tags: tags.filter(t => t.trim()),
      modifiers: cleanModifiers(),
    }),
    [formData, tags, cleanModifiers]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(buildContent());
    },
    [buildContent, onSubmit]
  );

  const domainStyle = DOMAIN_COLORS[formData.domain] ?? DOMAIN_COLORS.Arcana;
  const isSubmitDisabled = isSubmitting || !formData.name.trim();
  const submitLabel = isSubmitting ? 'Saving...' : 'Save Domain Card';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          <BasicInfoSection
            name={formData.name}
            domain={formData.domain}
            type={formData.type}
            level={formData.level}
            domainStyle={domainStyle}
            updateField={updateField}
          />

          <CostsSection
            hopeCost={formData.hopeCost}
            stressCost={formData.stressCost}
            recallCost={formData.recallCost}
            updateOptionalNumber={updateOptionalNumber}
          />

          <DescriptionSection
            description={formData.description}
            updateField={updateField}
          />

          <TagsSection
            tags={tags}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
            removeTag={removeTag}
            addSuggestion={addSuggestion}
            handleKeyDown={handleKeyDown}
            domainStyle={domainStyle}
          />

          <Separator />

          <FeatureModifiersSection
            modifiers={
              modifiers as
                | import('@/lib/schemas/core').FeatureStatModifiers
                | undefined
            }
            onChange={setFromFeatureModifiers}
            title="Stat Modifiers"
            showTraits
          />
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

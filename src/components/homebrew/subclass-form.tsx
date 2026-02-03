/**
 * Homebrew Subclass Form
 *
 * Form for creating and editing homebrew subclasses.
 * Uses features array with SubclassFeatureSchema structure.
 */
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useMyHomebrewContent } from '@/features/homebrew/use-homebrew-query';
import type { HomebrewSubclass } from '@/lib/schemas/homebrew';
import { createDefaultSubclassContent } from '@/lib/schemas/homebrew';

import {
  SubclassBasicInfoSection,
  SubclassCompanionSection,
} from './subclass-form-sections';
import { useSubclassCompanionState } from './use-subclass-companion-state';
import {
  type FeatureState,
  useSubclassFeaturesState,
} from './use-subclass-features-state';

const FEATURE_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface SubclassFormProps {
  initialData?: HomebrewSubclass['content'];
  onSubmit: (data: HomebrewSubclass['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FeatureSectionProps {
  title: string;
  description: string;
  type: string;
  levelHint: string;
  features: FeatureState[];
  onAdd: (type: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FeatureState>) => void;
}

function FeatureSection({
  title,
  description,
  type,
  levelHint,
  features,
  onAdd,
  onRemove,
  onUpdate,
}: FeatureSectionProps) {
  const typeFeatures = features.filter(feature => feature.type === type);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Sparkles className="size-4" /> {title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {description} {levelHint}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAdd(type)}
        >
          <Plus className="mr-1 size-4" /> Add
        </Button>
      </div>

      {typeFeatures.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          No {type} features added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {typeFeatures.map(feature => (
            <div
              key={feature.id}
              className="bg-muted/50 space-y-2 rounded-lg border p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={feature.name}
                      onChange={e =>
                        onUpdate(feature.id, { name: e.target.value })
                      }
                      placeholder="Feature name"
                      className="flex-1"
                    />
                    <Select
                      value={String(feature.level ?? '')}
                      onValueChange={v =>
                        onUpdate(feature.id, {
                          level: v ? parseInt(v, 10) : undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {FEATURE_LEVELS.map(level => (
                          <SelectItem key={level} value={String(level)}>
                            Lvl {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={feature.description}
                    onChange={e =>
                      onUpdate(feature.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Feature description..."
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(feature.id)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function SubclassForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SubclassFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultSubclassContent()
  );

  // Use extracted hooks for features and companion state
  const {
    features,
    addFeature,
    removeFeature,
    updateFeature,
    buildFeaturesContent,
  } = useSubclassFeaturesState(initialData?.features);

  const {
    hasCompanion,
    companion,
    newExperience,
    setHasCompanion,
    setNewExperience,
    updateCompanionField,
    addExperience,
    removeExperience,
    handleExperienceKeyDown,
    buildCompanionContent,
  } = useSubclassCompanionState(initialData?.companion);

  // Fetch homebrew classes to allow creating subclasses for them
  const { data: homebrewClassesResult } = useMyHomebrewContent({
    contentType: 'class',
  });
  const homebrewClasses = homebrewClassesResult?.items ?? [];

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewSubclass['content'] = {
        ...formData,
        features: buildFeaturesContent(),
        companion: buildCompanionContent(),
        isHomebrew: true,
      };

      onSubmit(content);
    },
    [formData, buildFeaturesContent, buildCompanionContent, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <SubclassBasicInfoSection
            name={formData.name}
            parentClassName={formData.parentClassName}
            description={formData.description ?? ''}
            spellcastTrait={formData.spellcastTrait}
            homebrewClasses={homebrewClasses}
            onNameChange={value =>
              setFormData(prev => ({ ...prev, name: value }))
            }
            onParentClassChange={value =>
              setFormData(prev => ({ ...prev, parentClassName: value }))
            }
            onDescriptionChange={value =>
              setFormData(prev => ({ ...prev, description: value }))
            }
            onSpellcastTraitChange={value =>
              setFormData(prev => ({ ...prev, spellcastTrait: value }))
            }
          />

          <Separator />

          {/* Foundation Features (Tier 1) */}
          <FeatureSection
            title="Foundation Features"
            description="Core features available early in character progression."
            type="foundation"
            levelHint="(Typically levels 1-4)"
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />

          <Separator />

          {/* Specialization Features (Tier 2-3) */}
          <FeatureSection
            title="Specialization Features"
            description="Features that deepen the subclass identity."
            type="specialization"
            levelHint="(Typically levels 5-7)"
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />

          <Separator />

          {/* Mastery Features (Tier 4) */}
          <FeatureSection
            title="Mastery Features"
            description="Capstone features that define the subclass at its peak."
            type="mastery"
            levelHint="(Typically levels 8-10)"
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />

          <Separator />

          {/* Companion Section (for Ranger-like subclasses) */}
          <SubclassCompanionSection
            hasCompanion={hasCompanion}
            companion={companion}
            newExperience={newExperience}
            onHasCompanionChange={setHasCompanion}
            onCompanionFieldChange={updateCompanionField}
            onNewExperienceChange={setNewExperience}
            onAddExperience={addExperience}
            onRemoveExperience={removeExperience}
            onExperienceKeyDown={handleExperienceKeyDown}
          />
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting || !formData.name.trim() || !formData.parentClassName
          }
        >
          {isSubmitting ? 'Saving...' : 'Save Subclass'}
        </Button>
      </div>
    </form>
  );
}

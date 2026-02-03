/**
 * Homebrew Class Form
 *
 * Form for creating and editing homebrew classes.
 * Matches BaseClassSchema + HomebrewClassContentSchema properties.
 */
import { Sparkles, Sword, Users } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { useCallback } from 'react';

import { FeatureModifiersSection } from '@/components/shared/feature-modifiers-section';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { type FeatureStatModifiers } from '@/lib/schemas/core';

import {
  ClassBaseStatsSection,
  ClassBasicInfoSection,
  ClassDomainsSection,
  ClassFormActions,
  ClassHopeFeatureSection,
  SubclassesSection,
} from './class-form-sections';
import { NameDescriptionListSection, StringListSection } from './form-sections';
import { useClassFormState } from './use-class-form-state';

/**
 * Data shape that the ClassForm works with.
 * Compatible with both HomebrewClass['content'] (homebrew page)
 * and the character page inline class type.
 */
export interface ClassFormData {
  name: string;
  description: string;
  domains: string[];
  startingHitPoints: number;
  startingEvasion: number;
  classItems: string[];
  hopeFeature: { name: string; description: string; hopeCost: number };
  classFeatures: Array<{
    name: string;
    description: string;
    modifiers?: FeatureStatModifiers;
  }>;
  backgroundQuestions: string[];
  connections: string[];
  startingEquipment: Array<{ name: string; description?: string }>;
  subclasses?: Array<{
    name: string;
    description: string;
    spellcastTrait?: string;
    features: Array<{
      name: string;
      description: string;
      type: string;
      level?: number;
      modifiers?: FeatureStatModifiers;
    }>;
  }>;
  isHomebrew: true;
}

interface ClassFormProps {
  initialData?: ClassFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: ClassFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: ClassFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
  /** Include subclass section (default: false, set true for character page) */
  includeSubclasses?: boolean;
}

export function ClassForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
  includeSubclasses = false,
}: ClassFormProps) {
  // Use consolidated hook for all state management
  const {
    formData,
    selectedDomains,
    classItems,
    setClassItems,
    classFeatures,
    setClassFeatures,
    backgroundQuestions,
    setBackgroundQuestions,
    connections,
    setConnections,
    startingEquipment,
    setStartingEquipment,
    subclasses,
    addSubclass,
    updateSubclass,
    addSubclassFeature,
    updateSubclassFeature,
    removeSubclassFeature,
    toggleDomain,
    handleNameChange,
    handleDescriptionChange,
    handleHitPointsChange,
    handleEvasionChange,
    handleHopeFeatureChange,
    handleRemoveSubclass,
    currentData,
  } = useClassFormState({ initialData, onChange });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(currentData);
      }
    },
    [onSubmit, currentData]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <ClassBasicInfoSection
            name={formData.name}
            description={formData.description ?? ''}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
          />

          <Separator />

          {/* Domains */}
          <ClassDomainsSection
            selectedDomains={selectedDomains}
            onToggleDomain={toggleDomain}
          />

          <Separator />

          {/* Base Statistics */}
          <ClassBaseStatsSection
            startingHitPoints={formData.startingHitPoints}
            startingEvasion={formData.startingEvasion}
            onHitPointsChange={handleHitPointsChange}
            onEvasionChange={handleEvasionChange}
          />

          <Separator />

          {/* Hope Feature */}
          <ClassHopeFeatureSection
            hopeFeature={formData.hopeFeature}
            onHopeFeatureChange={handleHopeFeatureChange}
          />

          <Separator />

          {/* Class Items */}
          <StringListSection
            title="Class Items"
            icon={<Sword className="size-4" />}
            iconColor="text-orange-500"
            description="Starting equipment options for this class."
            items={classItems}
            onChange={setClassItems}
            placeholder="e.g., Longsword"
            colorClass="orange-500"
            displayMode="badges"
          />

          <Separator />

          {/* Class Features */}
          <NameDescriptionListSection
            title="Class Features"
            icon={<Sparkles className="size-4" />}
            iconColor="text-emerald-500"
            items={classFeatures}
            onChange={setClassFeatures}
            namePlaceholder="Feature name"
            descriptionPlaceholder="Feature description..."
            colorClass="emerald-500"
            emptyMessage="No features added yet."
            addButtonLabel="Add Feature"
            renderExtra={(feature, updateItem) => (
              <FeatureModifiersSection
                modifiers={feature.modifiers}
                onChange={modifiers => updateItem({ modifiers })}
                title="Feature Modifiers"
                colorClass="text-emerald-500"
                showTraits
              />
            )}
          />

          {/* Subclasses Section (only when includeSubclasses is true) */}
          {includeSubclasses && (
            <>
              <Separator />
              <SubclassesSection
                subclasses={subclasses}
                onAddSubclass={addSubclass}
                onUpdateSubclass={updateSubclass}
                onRemoveSubclass={handleRemoveSubclass}
                onAddFeature={addSubclassFeature}
                onUpdateFeature={updateSubclassFeature}
                onRemoveFeature={removeSubclassFeature}
              />
            </>
          )}

          <Separator />

          {/* Background Questions */}
          <StringListSection
            title="Background Questions"
            icon={<BookOpen className="size-4" />}
            iconColor="text-indigo-500"
            description="Questions to help players flesh out their character's backstory."
            items={backgroundQuestions}
            onChange={setBackgroundQuestions}
            placeholder="e.g., What drove you to become a guardian?"
            colorClass="indigo-500"
            displayMode="list"
          />

          <Separator />

          {/* Connections */}
          <StringListSection
            title="Connection Options"
            icon={<Users className="size-4" />}
            iconColor="text-cyan-500"
            description="Suggested connections between party members."
            items={connections}
            onChange={setConnections}
            placeholder="e.g., This PC saved my life once"
            colorClass="cyan-500"
            displayMode="list"
          />

          <Separator />

          {/* Starting Equipment */}
          <NameDescriptionListSection
            title="Starting Equipment"
            icon={<Sword className="size-4" />}
            iconColor="text-emerald-500"
            description="Equipment that new characters of this class start with."
            items={startingEquipment}
            onChange={setStartingEquipment}
            namePlaceholder="Item name (e.g., Longsword)"
            descriptionPlaceholder="Optional description..."
            colorClass="emerald-500"
            emptyMessage="No starting equipment defined. Click 'Add Item' to begin."
            addButtonLabel="Add Item"
          />
        </div>
      </ScrollArea>

      {showActions && (
        <ClassFormActions
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isNameEmpty={!formData.name.trim()}
          hasInvalidDomains={selectedDomains.length !== 2}
        />
      )}
    </form>
  );
}

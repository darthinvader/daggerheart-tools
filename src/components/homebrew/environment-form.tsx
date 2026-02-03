/**
 * Homebrew Environment Form
 *
 * Form for creating and editing homebrew environments.
 */
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { HomebrewEnvironment } from '@/lib/schemas/homebrew';
import { createDefaultEnvironmentContent } from '@/lib/schemas/homebrew';

import {
  EnvironmentAdversariesSection,
  EnvironmentBasicInfoSection,
  EnvironmentFeaturesSection,
  EnvironmentImpulsesSection,
  type FeatureState,
  TYPE_COLORS,
} from './environment-form-sections';

interface EnvironmentFormProps {
  initialData?: HomebrewEnvironment['content'];
  onSubmit: (data: HomebrewEnvironment['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Parse a string-format feature into name, type, and description.
 * Handles formats like:
 * - "Feature Name - Type: Description text"
 * - "Feature Name - Description text"
 * - "Feature Name (param) - Type: Description text"
 */
function parseStringFeature(str: string): {
  name: string;
  type: string;
  description: string;
} {
  // Try to match "Name - Type: Description" pattern
  const typeMatch = str.match(
    /^([^-]+)\s*-\s*(Passive|Action|Reaction|Feature):\s*(.*)$/i
  );
  if (typeMatch) {
    return {
      name: typeMatch[1].trim(),
      type:
        typeMatch[2].charAt(0).toUpperCase() +
        typeMatch[2].slice(1).toLowerCase(),
      description: typeMatch[3].trim(),
    };
  }

  // Try to match "Name - Description" pattern (no type)
  const simpleMatch = str.match(/^([^-]+)\s*-\s*(.+)$/s);
  if (simpleMatch) {
    return {
      name: simpleMatch[1].trim(),
      type: 'Feature',
      description: simpleMatch[2].trim(),
    };
  }

  // Fallback: entire string is the name
  return { name: str.trim(), type: 'Feature', description: '' };
}

export function EnvironmentForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EnvironmentFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultEnvironmentContent()
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => {
      if (typeof f === 'string') {
        const parsed = parseStringFeature(f);
        return { id: `feature-${i}`, ...parsed };
      }
      return {
        id: `feature-${i}`,
        name: f.name,
        type: f.type ?? 'Feature',
        description: f.description,
      };
    })
  );
  const [impulses, setImpulses] = useState<string[]>(
    initialData?.impulses ?? []
  );
  const [adversaries, setAdversaries] = useState<string[]>(
    initialData?.potentialAdversaries ?? []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewEnvironment['content'] = {
        ...formData,
        features: features.map(f => ({
          name: f.name,
          type: f.type,
          description: f.description,
        })),
        impulses: impulses.filter(i => i.trim()),
        potentialAdversaries: adversaries.filter(a => a.trim()),
      };

      onSubmit(content);
    },
    [formData, features, impulses, adversaries, onSubmit]
  );

  const addFeature = () => {
    setFeatures(prev => [
      ...prev,
      {
        id: `feature-${Date.now()}`,
        name: '',
        type: 'Feature',
        description: '',
      },
    ]);
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<FeatureState>) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const addImpulse = () => setImpulses(prev => [...prev, '']);
  const removeImpulse = (index: number) =>
    setImpulses(prev => prev.filter((_, i) => i !== index));
  const updateImpulse = (index: number, value: string) =>
    setImpulses(prev => prev.map((imp, i) => (i === index ? value : imp)));

  const addAdversary = () => setAdversaries(prev => [...prev, '']);
  const removeAdversary = (index: number) =>
    setAdversaries(prev => prev.filter((_, i) => i !== index));
  const updateAdversary = (index: number, value: string) =>
    setAdversaries(prev => prev.map((adv, i) => (i === index ? value : adv)));

  // Get style based on current type
  const typeStyle = TYPE_COLORS[formData.type] ?? TYPE_COLORS.Exploration;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          <EnvironmentBasicInfoSection
            formData={formData}
            typeStyle={typeStyle}
            onFormDataChange={setFormData}
          />

          <Separator />

          <EnvironmentImpulsesSection
            impulses={impulses}
            onAdd={addImpulse}
            onRemove={removeImpulse}
            onUpdate={updateImpulse}
          />

          <Separator />

          <EnvironmentFeaturesSection
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />

          <Separator />

          <EnvironmentAdversariesSection
            adversaries={adversaries}
            onAdd={addAdversary}
            onRemove={removeAdversary}
            onUpdate={updateAdversary}
          />
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Environment'}
        </Button>
      </div>
    </form>
  );
}

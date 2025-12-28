import { useCallback, useState } from 'react';

import { HomebrewIcon } from '@/components/shared';
import { Button } from '@/components/ui/button';
import type { HomebrewAncestry } from '@/lib/schemas/identity';

import { HomebrewBasicFields } from './homebrew-basic-fields';
import { HomebrewCharacteristicsField } from './homebrew-characteristics-field';
import { HomebrewFeatureFields } from './homebrew-feature-fields';

interface HomebrewAncestryFormProps {
  homebrew: HomebrewAncestry | null;
  onChange: (homebrew: HomebrewAncestry) => void;
  onSave?: (homebrew: HomebrewAncestry) => void;
  hideSaveButton?: boolean;
}

const EMPTY_HOMEBREW: HomebrewAncestry = {
  name: '',
  description: '',
  heightRange: '',
  lifespan: '',
  physicalCharacteristics: [],
  primaryFeature: { name: '', description: '', type: 'primary' },
  secondaryFeature: { name: '', description: '', type: 'secondary' },
};

export function HomebrewAncestryForm({
  homebrew,
  onChange,
  onSave,
  hideSaveButton = false,
}: HomebrewAncestryFormProps) {
  const [formState, setFormState] = useState<HomebrewAncestry>(
    homebrew ?? EMPTY_HOMEBREW
  );
  const [characteristicsText, setCharacteristicsText] = useState(
    homebrew?.physicalCharacteristics.join('\n') ?? ''
  );

  const updateForm = useCallback(
    (updates: Partial<HomebrewAncestry>) => {
      const updated = { ...formState, ...updates };
      setFormState(updated);
      onChange(updated);
    },
    [formState, onChange]
  );

  const handleCharacteristicsChange = useCallback(
    (value: string) => {
      setCharacteristicsText(value);
      const characteristics = value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      updateForm({ physicalCharacteristics: characteristics });
    },
    [updateForm]
  );

  const handleSave = useCallback(() => {
    onChange(formState);
    onSave?.(formState);
  }, [formState, onChange, onSave]);

  const isValid =
    formState.name.trim() &&
    formState.primaryFeature.name.trim() &&
    formState.secondaryFeature.name.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <HomebrewIcon />
        Create Homebrew Ancestry
      </div>

      <HomebrewBasicFields
        name={formState.name}
        heightRange={formState.heightRange}
        lifespan={formState.lifespan}
        description={formState.description}
        onNameChange={v => updateForm({ name: v })}
        onHeightChange={v => updateForm({ heightRange: v })}
        onLifespanChange={v => updateForm({ lifespan: v })}
        onDescriptionChange={v => updateForm({ description: v })}
      />

      <HomebrewFeatureFields
        primaryFeature={formState.primaryFeature}
        secondaryFeature={formState.secondaryFeature}
        onPrimaryNameChange={v =>
          updateForm({
            primaryFeature: { ...formState.primaryFeature, name: v },
          })
        }
        onPrimaryDescChange={v =>
          updateForm({
            primaryFeature: { ...formState.primaryFeature, description: v },
          })
        }
        onSecondaryNameChange={v =>
          updateForm({
            secondaryFeature: { ...formState.secondaryFeature, name: v },
          })
        }
        onSecondaryDescChange={v =>
          updateForm({
            secondaryFeature: { ...formState.secondaryFeature, description: v },
          })
        }
      />

      <HomebrewCharacteristicsField
        value={characteristicsText}
        characteristicsCount={formState.physicalCharacteristics.length}
        onChange={handleCharacteristicsChange}
      />

      {!hideSaveButton && (
        <div className="flex justify-end border-t pt-4">
          <Button onClick={handleSave} disabled={!isValid} size="lg">
            ✅ Save Homebrew Ancestry
          </Button>
        </div>
      )}
    </div>
  );
}

import { AncestryForm, type AncestryFormData } from '@/components/homebrew';
import type { HomebrewAncestry } from '@/lib/schemas/identity';

interface HomebrewAncestryFormProps {
  homebrew: HomebrewAncestry | null;
  onChange: (homebrew: HomebrewAncestry) => void;
  onSave?: (homebrew: HomebrewAncestry) => void;
  hideSaveButton?: boolean;
}

/**
 * Converts AncestryFormData to the character page HomebrewAncestry type.
 */
function formDataToHomebrewAncestry(data: AncestryFormData): HomebrewAncestry {
  return {
    name: data.name,
    description: data.description,
    heightRange: data.heightRange,
    lifespan: data.lifespan,
    physicalCharacteristics: data.physicalCharacteristics,
    primaryFeature: {
      name: data.primaryFeature.name,
      description: data.primaryFeature.description,
      type: 'primary',
      modifiers: data.primaryFeature.modifiers,
    },
    secondaryFeature: {
      name: data.secondaryFeature.name,
      description: data.secondaryFeature.description,
      type: 'secondary',
      modifiers: data.secondaryFeature.modifiers,
    },
  };
}

/**
 * Converts HomebrewAncestry to AncestryFormData for the form.
 */
function homebrewAncestryToFormData(
  ancestry: HomebrewAncestry
): AncestryFormData {
  return {
    name: ancestry.name,
    description: ancestry.description,
    heightRange: ancestry.heightRange,
    lifespan: ancestry.lifespan,
    physicalCharacteristics: ancestry.physicalCharacteristics,
    primaryFeature: {
      name: ancestry.primaryFeature.name,
      description: ancestry.primaryFeature.description,
      type: 'primary',
      modifiers: ancestry.primaryFeature.modifiers,
    },
    secondaryFeature: {
      name: ancestry.secondaryFeature.name,
      description: ancestry.secondaryFeature.description,
      type: 'secondary',
      modifiers: ancestry.secondaryFeature.modifiers,
    },
    isHomebrew: true,
  };
}

export function HomebrewAncestryForm({
  homebrew,
  onChange,
}: HomebrewAncestryFormProps) {
  const handleChange = (data: AncestryFormData) => {
    onChange(formDataToHomebrewAncestry(data));
  };

  return (
    <AncestryForm
      initialData={homebrew ? homebrewAncestryToFormData(homebrew) : undefined}
      onChange={handleChange}
      showActions={false}
    />
  );
}

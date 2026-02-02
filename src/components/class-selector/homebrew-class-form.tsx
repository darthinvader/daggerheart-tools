import { ClassForm, type ClassFormData } from '@/components/homebrew';
import type { HomebrewClass } from '@/lib/schemas/class-selection';

interface HomebrewClassFormProps {
  homebrewClass: HomebrewClass | null;
  onChange: (homebrewClass: HomebrewClass) => void;
}

/**
 * Converts ClassFormData to the character page HomebrewClass type.
 */
function formDataToHomebrewClass(data: ClassFormData): HomebrewClass {
  return {
    isHomebrew: true,
    name: data.name,
    description: data.description,
    domains: (data.domains.length >= 2
      ? data.domains.slice(0, 2)
      : [...data.domains, 'Arcana', 'Blade'].slice(0, 2)) as [string, string],
    startingHitPoints: data.startingHitPoints,
    startingEvasion: data.startingEvasion,
    classItems: data.classItems,
    hopeFeature: data.hopeFeature,
    classFeatures: data.classFeatures.map(f => ({
      name: f.name,
      description: f.description,
      modifiers: f.modifiers,
      metadata: { source: 'homebrew' as const },
    })),
    backgroundQuestions: data.backgroundQuestions,
    connections: data.connections,
    subclasses: (data.subclasses ?? []).map(s => ({
      isHomebrew: true as const,
      name: s.name,
      description: s.description,
      spellcastTrait: s.spellcastTrait,
      features: s.features.map(f => ({
        name: f.name,
        description: f.description,
        type: f.type as 'foundation' | 'specialization' | 'mastery',
        level: f.level,
        modifiers: f.modifiers,
        metadata: { source: 'homebrew' as const },
      })),
    })),
  };
}

/**
 * Converts HomebrewClass to ClassFormData for the form.
 */
function homebrewClassToFormData(cls: HomebrewClass): ClassFormData {
  return {
    name: cls.name,
    description: cls.description,
    domains: cls.domains,
    startingHitPoints: cls.startingHitPoints,
    startingEvasion: cls.startingEvasion,
    classItems: cls.classItems,
    hopeFeature: cls.hopeFeature,
    classFeatures: cls.classFeatures.map(f => ({
      name: f.name,
      description: f.description,
      modifiers: f.modifiers,
    })),
    backgroundQuestions: cls.backgroundQuestions,
    connections: cls.connections,
    startingEquipment: [],
    subclasses: cls.subclasses.map(s => ({
      name: s.name,
      description: s.description,
      spellcastTrait: s.spellcastTrait,
      features: s.features.map(f => ({
        name: f.name,
        description: f.description,
        type: f.type,
        level: f.level,
        modifiers: f.modifiers,
      })),
    })),
    isHomebrew: true,
  };
}

export function HomebrewClassForm({
  homebrewClass,
  onChange,
}: HomebrewClassFormProps) {
  const handleChange = (data: ClassFormData) => {
    onChange(formDataToHomebrewClass(data));
  };

  return (
    <ClassForm
      initialData={
        homebrewClass ? homebrewClassToFormData(homebrewClass) : undefined
      }
      onChange={handleChange}
      showActions={false}
      includeSubclasses={true}
    />
  );
}

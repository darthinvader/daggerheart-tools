import { ExperiencesSection } from '@/components/characters/character-page/experiences-section';

export function ExperiencesBlock({
  experiences,
  addExperience,
  updateExperienceAt,
  removeExperienceAt,
}: {
  experiences: Array<{
    name: string;
    trait?: string;
    bonus: number;
    notes?: string;
  }>;
  addExperience: (e: {
    name: string;
    trait?: string;
    bonus: number;
    notes?: string;
  }) => void;
  updateExperienceAt: (
    i: number,
    e: { name: string; trait?: string; bonus: number; notes?: string }
  ) => void;
  removeExperienceAt: (i: number) => void;
}) {
  return (
    <ExperiencesSection
      experiences={experiences as never}
      addExperience={addExperience as never}
      updateExperienceAt={updateExperienceAt as never}
      removeExperienceAt={removeExperienceAt}
    />
  );
}

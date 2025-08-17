import { ExperiencesCard } from '@/components/characters/experiences-card';

export type Experience = {
  name: string;
  trait?: string;
  bonus: number;
  notes?: string;
};

type Props = {
  experiences: Experience[];
  addExperience: (item: Experience) => void;
  updateExperienceAt: (index: number, item: Experience) => void;
  removeExperienceAt: (index: number) => void;
};

export function ExperiencesSection({
  experiences,
  addExperience,
  updateExperienceAt,
  removeExperienceAt,
}: Props) {
  return (
    <section
      id="experiences"
      aria-label="Experiences"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <ExperiencesCard
        experiences={experiences as never}
        addExperience={addExperience as never}
        updateExperienceAt={updateExperienceAt as never}
        removeExperienceAt={removeExperienceAt}
      />
    </section>
  );
}

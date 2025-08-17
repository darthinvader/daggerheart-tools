import { ResourcesCard } from '@/components/characters/resources-card';

type Score = { current: number; max: number };

type Props = {
  resources: {
    hp: Score;
    stress: Score;
    hope: Score;
    armorScore?: Score;
  };
  updateHp: (delta: number) => void;
  updateHpMax: (delta: number) => void;
  updateStress: (delta: number) => void;
  updateStressMax: (delta: number) => void;
  updateHope: (delta: number) => void;
  updateHopeMax: (delta: number) => void;
  updateArmorScore: (delta: number) => void;
  updateArmorScoreMax: (delta: number) => void;
};

export function ResourcesSection({
  resources,
  updateHp,
  updateHpMax,
  updateStress,
  updateStressMax,
  updateHope,
  updateHopeMax,
  updateArmorScore,
  updateArmorScoreMax,
}: Props) {
  return (
    <section
      id="resources"
      aria-label="Resources"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <ResourcesCard
        id="resources"
        resources={resources as never}
        updateHp={updateHp}
        updateHpMax={updateHpMax}
        updateStress={updateStress}
        updateStressMax={updateStressMax}
        updateHope={updateHope}
        updateHopeMax={updateHopeMax}
        updateArmorScore={updateArmorScore}
        updateArmorScoreMax={updateArmorScoreMax}
      />
    </section>
  );
}

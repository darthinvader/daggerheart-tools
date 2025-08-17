import { CoreScoresCard } from '@/components/characters/core-scores-card';

type Props = {
  evasion: number;
  proficiency: number;
  id: string;
  updateNumber: (
    key: 'evasion' | 'proficiency',
    delta: number,
    min: number
  ) => void;
  updateHp: (delta: number) => void;
};

export function CoreScoresSection({
  evasion,
  proficiency,
  id,
  updateNumber,
  updateHp,
}: Props) {
  return (
    <section
      id="core"
      aria-label="Core scores"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <CoreScoresCard
        scores={{ evasion, proficiency }}
        updateEvasion={delta => updateNumber('evasion', delta, 0)}
        updateProficiency={delta => updateNumber('proficiency', delta, 1)}
        id={id}
        updateHp={updateHp}
      />
    </section>
  );
}

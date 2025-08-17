import { CoreScoresSection } from '@/components/characters/character-page/core-scores-section';
import { GoldSection } from '@/components/characters/character-page/gold-section';
import { ResourcesSection } from '@/components/characters/character-page/resources-section';

export function ResourcesBlock({
  id,
  resources,
  updateNumber,
  updateHp,
  updateHpMax,
  updateStress,
  updateStressMax,
  updateHope,
  updateHopeMax,
  updateArmorScore,
  updateArmorScoreMax,
  setGold,
}: {
  id: string;
  resources: {
    hp: any;
    stress: any;
    hope: any;
    armorScore: any;
    evasion: number;
    proficiency: number;
    gold: any;
  };
  updateNumber: (
    key: 'evasion' | 'proficiency',
    delta: number,
    min: number
  ) => void;
  updateHp: (n: number) => void;
  updateHpMax: (n: number) => void;
  updateStress: (n: number) => void;
  updateStressMax: (n: number) => void;
  updateHope: (n: number) => void;
  updateHopeMax: (n: number) => void;
  updateArmorScore: (n: number) => void;
  updateArmorScoreMax: (n: number) => void;
  setGold: (g: unknown) => void;
}) {
  return (
    <>
      <CoreScoresSection
        evasion={resources.evasion}
        proficiency={resources.proficiency}
        id={id}
        updateNumber={updateNumber}
        updateHp={updateHp}
      />

      <ResourcesSection
        resources={{
          hp: resources.hp as never,
          stress: resources.stress as never,
          hope: resources.hope as never,
          armorScore: resources.armorScore as never,
        }}
        updateHp={updateHp}
        updateHpMax={updateHpMax}
        updateStress={updateStress}
        updateStressMax={updateStressMax}
        updateHope={updateHope}
        updateHopeMax={updateHopeMax}
        updateArmorScore={updateArmorScore}
        updateArmorScoreMax={updateArmorScoreMax}
      />

      <GoldSection gold={resources.gold as never} setGold={setGold as never} />
    </>
  );
}

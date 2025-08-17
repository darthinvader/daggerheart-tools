import { type Gold, GoldCard } from '@/components/characters/gold-card';

type Props = {
  gold: Gold;
  setGold: (kind: 'handfuls' | 'bags' | 'chests', value: number) => void;
};

export function GoldSection({ gold, setGold }: Props) {
  return (
    <section
      id="gold"
      aria-label="Gold"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <GoldCard gold={gold} set={setGold} />
    </section>
  );
}

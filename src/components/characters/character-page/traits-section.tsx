import { TraitsCard } from '@/components/characters/traits-card';

type Props = {
  traits: Record<string, { value: number; marked: boolean }>;
  canIncrement: (key: string) => boolean;
  incTrait: (key: string, delta: 1 | -1) => void;
  toggleMarked: (key: string) => void;
};

export function TraitsSection({
  traits,
  canIncrement,
  incTrait,
  toggleMarked,
}: Props) {
  return (
    <section
      id="traits"
      aria-label="Traits"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <TraitsCard
        traits={traits}
        canIncrement={canIncrement}
        incTrait={incTrait}
        toggleMarked={toggleMarked}
      />
    </section>
  );
}

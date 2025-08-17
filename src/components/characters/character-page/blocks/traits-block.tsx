import { TraitsSection } from '@/components/characters/character-page/traits-section';

export function TraitsBlock({
  traits,
  canIncrement,
  incTrait,
  toggleMarked,
}: {
  traits: Record<string, { value?: number; bonus?: number; marked?: boolean }>;
  canIncrement: (name: string) => boolean;
  incTrait: (key: string, delta: 1 | -1) => void;
  toggleMarked: (name: string) => void;
}) {
  return (
    <TraitsSection
      traits={traits as never}
      canIncrement={canIncrement}
      incTrait={incTrait}
      toggleMarked={toggleMarked}
    />
  );
}

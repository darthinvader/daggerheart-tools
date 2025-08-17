import { ConditionsCard } from '@/components/characters/conditions-card';

export type Condition = { name: string; notes?: string };

type Props = {
  conditions: Condition[];
  addCondition: (c: Condition) => void;
  removeCondition: (index: number) => void;
};

export function ConditionsSection({
  conditions,
  addCondition,
  removeCondition,
}: Props) {
  const addByLabel = (label: string, description?: string) =>
    addCondition({ name: label, notes: description });
  const removeByLabel = (label: string) => {
    const index = conditions.findIndex(c => c.name === label);
    if (index >= 0) removeCondition(index);
  };
  return (
    <section
      id="conditions"
      aria-label="Conditions"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <ConditionsCard
        conditions={conditions as never}
        addCondition={addByLabel}
        removeCondition={removeByLabel}
      />
    </section>
  );
}

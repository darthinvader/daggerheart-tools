import { ConditionsSection } from '@/components/characters/character-page/conditions-section';

export function ConditionsBlock({
  conditions,
  addCondition,
  removeCondition,
}: {
  conditions: Array<{ name: string; description?: string }>;
  addCondition: (label: string, description?: string) => void;
  removeCondition: (i: number) => void;
}) {
  return (
    <ConditionsSection
      conditions={conditions as never}
      addCondition={addCondition as never}
      removeCondition={removeCondition as never}
    />
  );
}

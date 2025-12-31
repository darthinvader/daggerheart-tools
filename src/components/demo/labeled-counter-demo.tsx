import { useState } from 'react';

import { LabeledCounter } from '@/components/shared';

interface CounterState {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  max?: number;
  setMax?: React.Dispatch<React.SetStateAction<number>>;
  checked?: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<boolean>>;
}

function useDemoCounters() {
  const [basicValue, setBasicValue] = useState(5);
  const [checkboxValue, setCheckboxValue] = useState(3);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [maxValue, setMaxValue] = useState(5);
  const [maxMax, setMaxMax] = useState(10);
  const [fullValue, setFullValue] = useState(2);
  const [fullMax, setFullMax] = useState(8);
  const [fullChecked, setFullChecked] = useState(true);
  const [verticalBasic, setVerticalBasic] = useState(7);
  const [verticalCheckbox, setVerticalCheckbox] = useState(4);
  const [verticalCheckboxChecked, setVerticalCheckboxChecked] = useState(false);
  const [verticalMax, setVerticalMax] = useState(3);
  const [verticalMaxMax, setVerticalMaxMax] = useState(6);
  const [verticalFull, setVerticalFull] = useState(1);
  const [verticalFullMax, setVerticalFullMax] = useState(5);
  const [verticalFullChecked, setVerticalFullChecked] = useState(true);

  return {
    basic: { value: basicValue, setValue: setBasicValue },
    checkbox: {
      value: checkboxValue,
      setValue: setCheckboxValue,
      checked: checkboxChecked,
      setChecked: setCheckboxChecked,
    },
    max: {
      value: maxValue,
      setValue: setMaxValue,
      max: maxMax,
      setMax: setMaxMax,
    },
    full: {
      value: fullValue,
      setValue: setFullValue,
      max: fullMax,
      setMax: setFullMax,
      checked: fullChecked,
      setChecked: setFullChecked,
    },
    verticalBasic: { value: verticalBasic, setValue: setVerticalBasic },
    verticalCheckbox: {
      value: verticalCheckbox,
      setValue: setVerticalCheckbox,
      checked: verticalCheckboxChecked,
      setChecked: setVerticalCheckboxChecked,
    },
    verticalMax: {
      value: verticalMax,
      setValue: setVerticalMax,
      max: verticalMaxMax,
      setMax: setVerticalMaxMax,
    },
    verticalFull: {
      value: verticalFull,
      setValue: setVerticalFull,
      max: verticalFullMax,
      setMax: setVerticalFullMax,
      checked: verticalFullChecked,
      setChecked: setVerticalFullChecked,
    },
  } satisfies Record<string, CounterState>;
}

function HorizontalVariants({
  counters,
}: {
  counters: ReturnType<typeof useDemoCounters>;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Horizontal Variants</h2>
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div>
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            Basic Counter
          </h3>
          <LabeledCounter
            label="Strength"
            value={counters.basic.value}
            onChange={counters.basic.setValue}
          />
        </div>
        <div>
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            With Checkbox
          </h3>
          <LabeledCounter
            label="Agility"
            value={counters.checkbox.value}
            onChange={counters.checkbox.setValue}
            checkboxLabel="Proficient"
            checkboxChecked={counters.checkbox.checked}
            onCheckboxChange={counters.checkbox.setChecked}
          />
        </div>
        <div>
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            With Max Value
          </h3>
          <LabeledCounter
            label="Health"
            value={counters.max.value}
            onChange={counters.max.setValue}
            maxValue={counters.max.max}
            onMaxChange={counters.max.setMax}
            maxLabel="max"
          />
        </div>
        <div>
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            Full Featured
          </h3>
          <LabeledCounter
            label="Armor"
            value={counters.full.value}
            onChange={counters.full.setValue}
            maxValue={counters.full.max}
            onMaxChange={counters.full.setMax}
            maxLabel="max"
            checkboxLabel="Equipped"
            checkboxChecked={counters.full.checked}
            onCheckboxChange={counters.full.setChecked}
          />
        </div>
      </div>
    </section>
  );
}

function VerticalVariants({
  counters,
}: {
  counters: ReturnType<typeof useDemoCounters>;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Vertical Variants</h2>
      <div className="bg-card flex flex-wrap gap-8 rounded-lg border p-6">
        <div className="flex flex-col items-center">
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            Basic
          </h3>
          <LabeledCounter
            label="Power"
            value={counters.verticalBasic.value}
            onChange={counters.verticalBasic.setValue}
            orientation="vertical"
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            With Checkbox
          </h3>
          <LabeledCounter
            label="Speed"
            value={counters.verticalCheckbox.value}
            onChange={counters.verticalCheckbox.setValue}
            orientation="vertical"
            checkboxLabel="Boosted"
            checkboxChecked={counters.verticalCheckbox.checked}
            onCheckboxChange={counters.verticalCheckbox.setChecked}
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            With Max
          </h3>
          <LabeledCounter
            label="Mana"
            value={counters.verticalMax.value}
            onChange={counters.verticalMax.setValue}
            orientation="vertical"
            maxValue={counters.verticalMax.max}
            onMaxChange={counters.verticalMax.setMax}
            maxLabel="max"
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-muted-foreground mb-2 text-sm font-medium">
            Full Featured
          </h3>
          <LabeledCounter
            label="Focus"
            value={counters.verticalFull.value}
            onChange={counters.verticalFull.setValue}
            orientation="vertical"
            maxValue={counters.verticalFull.max}
            onMaxChange={counters.verticalFull.setMax}
            maxLabel="max"
            checkboxLabel="Active"
            checkboxChecked={counters.verticalFull.checked}
            onCheckboxChange={counters.verticalFull.setChecked}
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonSection({
  counters,
}: {
  counters: ReturnType<typeof useDemoCounters>;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Side by Side Comparison</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card min-w-0 overflow-x-auto rounded-lg border p-6">
          <h3 className="mb-4 text-center font-medium">Horizontal Layout</h3>
          <div className="space-y-4">
            <LabeledCounter
              label="HP"
              value={counters.full.value}
              onChange={counters.full.setValue}
              maxValue={counters.full.max}
              onMaxChange={counters.full.setMax}
              checkboxLabel="Temporary"
              checkboxChecked={counters.full.checked}
              onCheckboxChange={counters.full.setChecked}
            />
          </div>
        </div>
        <div className="bg-card flex min-w-0 justify-center overflow-x-auto rounded-lg border p-6">
          <div>
            <h3 className="mb-4 text-center font-medium">Vertical Layout</h3>
            <LabeledCounter
              label="HP"
              value={counters.verticalFull.value}
              onChange={counters.verticalFull.setValue}
              orientation="vertical"
              maxValue={counters.verticalFull.max}
              onMaxChange={counters.verticalFull.setMax}
              checkboxLabel="Temporary"
              checkboxChecked={counters.verticalFull.checked}
              onCheckboxChange={counters.verticalFull.setChecked}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LabeledCounterDemo() {
  const counters = useDemoCounters();

  return (
    <div className="space-y-8">
      <HorizontalVariants counters={counters} />
      <VerticalVariants counters={counters} />
      <ComparisonSection counters={counters} />
    </div>
  );
}

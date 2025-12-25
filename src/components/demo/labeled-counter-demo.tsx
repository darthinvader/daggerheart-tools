/* eslint-disable max-lines-per-function */
import { useState } from 'react';

import { LabeledCounter } from '@/components/labeled-counter';

export function LabeledCounterDemo() {
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

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Horizontal Variants</h2>
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Basic Counter
            </h3>
            <LabeledCounter
              label="Strength"
              value={basicValue}
              onChange={setBasicValue}
            />
          </div>

          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              With Checkbox
            </h3>
            <LabeledCounter
              label="Agility"
              value={checkboxValue}
              onChange={setCheckboxValue}
              checkboxLabel="Proficient"
              checkboxChecked={checkboxChecked}
              onCheckboxChange={setCheckboxChecked}
            />
          </div>

          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              With Max Value
            </h3>
            <LabeledCounter
              label="Health"
              value={maxValue}
              onChange={setMaxValue}
              maxValue={maxMax}
              onMaxChange={setMaxMax}
              maxLabel="max"
            />
          </div>

          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Full Featured
            </h3>
            <LabeledCounter
              label="Armor"
              value={fullValue}
              onChange={setFullValue}
              maxValue={fullMax}
              onMaxChange={setFullMax}
              maxLabel="max"
              checkboxLabel="Equipped"
              checkboxChecked={fullChecked}
              onCheckboxChange={setFullChecked}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Vertical Variants</h2>
        <div className="bg-card flex flex-wrap gap-8 rounded-lg border p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Basic
            </h3>
            <LabeledCounter
              label="Power"
              value={verticalBasic}
              onChange={setVerticalBasic}
              orientation="vertical"
            />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              With Checkbox
            </h3>
            <LabeledCounter
              label="Speed"
              value={verticalCheckbox}
              onChange={setVerticalCheckbox}
              orientation="vertical"
              checkboxLabel="Boosted"
              checkboxChecked={verticalCheckboxChecked}
              onCheckboxChange={setVerticalCheckboxChecked}
            />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              With Max
            </h3>
            <LabeledCounter
              label="Mana"
              value={verticalMax}
              onChange={setVerticalMax}
              orientation="vertical"
              maxValue={verticalMaxMax}
              onMaxChange={setVerticalMaxMax}
              maxLabel="max"
            />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Full Featured
            </h3>
            <LabeledCounter
              label="Focus"
              value={verticalFull}
              onChange={setVerticalFull}
              orientation="vertical"
              maxValue={verticalFullMax}
              onMaxChange={setVerticalFullMax}
              maxLabel="max"
              checkboxLabel="Active"
              checkboxChecked={verticalFullChecked}
              onCheckboxChange={setVerticalFullChecked}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Side by Side Comparison</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card min-w-0 overflow-x-auto rounded-lg border p-6">
            <h3 className="mb-4 text-center font-medium">Horizontal Layout</h3>
            <div className="space-y-4">
              <LabeledCounter
                label="HP"
                value={fullValue}
                onChange={setFullValue}
                maxValue={fullMax}
                onMaxChange={setFullMax}
                checkboxLabel="Temporary"
                checkboxChecked={fullChecked}
                onCheckboxChange={setFullChecked}
              />
            </div>
          </div>
          <div className="bg-card flex min-w-0 justify-center overflow-x-auto rounded-lg border p-6">
            <div>
              <h3 className="mb-4 text-center font-medium">Vertical Layout</h3>
              <LabeledCounter
                label="HP"
                value={verticalFull}
                onChange={setVerticalFull}
                orientation="vertical"
                maxValue={verticalFullMax}
                onMaxChange={setVerticalFullMax}
                checkboxLabel="Temporary"
                checkboxChecked={verticalFullChecked}
                onCheckboxChange={setVerticalFullChecked}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

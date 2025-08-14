import { FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type { DraftMode } from './useAncestryDraft';

export function AncestryModeSwitch({
  value,
  onChange,
}: {
  value: DraftMode;
  onChange: (val: DraftMode) => void;
}) {
  return (
    <div>
      <FormLabel>Mode</FormLabel>
      <RadioGroup
        value={value}
        onValueChange={v => onChange(v as DraftMode)}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem id="anc-mode-standard" value="standard" />
          <label htmlFor="anc-mode-standard" className="text-sm">
            Standard
          </label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="anc-mode-mixed" value="mixed" />
          <label htmlFor="anc-mode-mixed" className="text-sm">
            Mixed
          </label>
        </div>
      </RadioGroup>
    </div>
  );
}

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';

interface ThresholdCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean | 'indeterminate') => void;
  label: string;
  tooltip: string;
}

export function ThresholdCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  tooltip,
}: ThresholdCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <SmartTooltip className="max-w-xs" content={<p>{tooltip}</p>}>
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      </SmartTooltip>
    </div>
  );
}
